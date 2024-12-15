import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { useState, useCallback } from 'react';
import { Link, useFocusEffect } from 'expo-router';
import TaskList from '../components/TaskList';
import api, { Task } from '../services/api';
import { getCategoryColor } from '../utils/taskUtils';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Load tasks for a specific date
  const loadTasksForDate = async (date: string) => {
    try {
      setLoading(true);
      const tasks = await api.getTasks({ date });
      setSelectedTasks(tasks.filter(task => {
        // Adjust for timezone when comparing dates
        const taskDate = new Date(task.date);
        const compareDate = new Date(date);
        return taskDate.getFullYear() === compareDate.getFullYear() &&
               taskDate.getMonth() === compareDate.getMonth() &&
               taskDate.getDate() === compareDate.getDate();
      }));
    } catch (error) {
      console.error('Error loading tasks for date:', error);
      setSelectedTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks for the current month
  const loadMonthTasks = async (month: string) => {
    try {
      const tasks = await api.getTasks({ month });
      
      // Group tasks by date
      const tasksByDate = tasks.reduce((acc: Record<string, Task[]>, task: Task) => {
        // Adjust for timezone when grouping tasks
        const taskDate = new Date(task.date);
        const dateKey = taskDate.toISOString().split('T')[0];
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(task);
        return acc;
      }, {});

      // Create marked dates object for calendar
      const marked = Object.keys(tasksByDate).reduce((acc, date) => {
        acc[date] = {
          marked: true,
          dots: tasksByDate[date].map(task => ({
            color: getCategoryColor(task.category)
          })),
          selected: date === selectedDate,
          selectedColor: date === selectedDate ? '#007AFF' : undefined,
          selectedTextColor: date === selectedDate ? '#ffffff' : undefined,
        };
        return acc;
      }, {} as any);

      setMarkedDates(marked);
    } catch (error) {
      console.error('Error loading month tasks:', error);
    }
  };

  // Refresh calendar data
  const refreshCalendarData = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    const currentDate = selectedDate || today;
    
    setSelectedDate(currentDate);
    await Promise.all([
      loadTasksForDate(currentDate),
      loadMonthTasks(currentDate.substring(0, 7))
    ]);
  }, [selectedDate]);

  // Load initial data and refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshCalendarData();
    }, [refreshCalendarData])
  );

  // Load tasks when month changes
  const handleMonthChange = (month: any) => {
    loadMonthTasks(month.dateString.substring(0, 7));
  };

  // Load tasks for selected date
  const handleDayPress = async (day: any) => {
    const newDate = day.dateString;
    setSelectedDate(newDate);
    loadTasksForDate(newDate);
    
    // Update marked dates to show selection
    setMarkedDates(prev => ({
      ...prev,
      [newDate]: {
        ...(prev[newDate] || {}),
        selected: true,
        selectedColor: '#007AFF',
        selectedTextColor: '#ffffff',
      }
    }));
  };

  const handleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      await api.updateTask(taskId, { completed });
      // Update local state
      const updatedTasks = selectedTasks.map(t => 
        t.id === taskId ? { ...t, completed } : t
      );
      setSelectedTasks(updatedTasks);
      // Refresh calendar data to update dots
      await loadMonthTasks(selectedDate.substring(0, 7));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      // Update local state
      setSelectedTasks(tasks => tasks.filter(t => t.id !== taskId));
      // Refresh calendar data to update dots
      await loadMonthTasks(selectedDate.substring(0, 7));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Calendar
          style={styles.calendar}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#666666',
            selectedDayBackgroundColor: '#007AFF',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#007AFF',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#007AFF',
            selectedDotColor: '#007AFF',
            arrowColor: '#007AFF',
            monthTextColor: '#2d4150',
            indicatorColor: '#007AFF',
            dotStyle: {
              width: 4,
              height: 4,
              borderRadius: 2,
              marginTop: 1,
              marginBottom: 1,
            },
            'stylesheet.calendar.main': {
              week: {
                marginTop: 2,
                marginBottom: 2,
                flexDirection: 'row',
                justifyContent: 'space-around',
              },
            },
            'stylesheet.day.basic': {
              selected: {
                backgroundColor: '#007AFF',
                borderRadius: 16,
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
              },
              today: {
                backgroundColor: '#007AFF15',
                borderRadius: 16,
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
              },
              base: {
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
              },
              text: {
                marginTop: 0,
                fontSize: 14,
              },
              dots: {
                marginBottom: -2,
              }
            },
          }}
          markingType={'multi-dot'}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          initialDate={selectedDate}
        />

        <View style={styles.selectedDay}>
          <Text variant="titleLarge" style={styles.selectedDayTitle}>
            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            }) : new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        <View style={styles.taskList}>
          {loading ? (
            <Text style={styles.noTasksText}>Loading tasks...</Text>
          ) : selectedTasks.length > 0 ? (
            <TaskList
              tasks={selectedTasks}
              onTaskComplete={handleTaskComplete}
              onTaskDelete={handleDeleteTask}
            />
          ) : (
            <Text style={styles.noTasksText}>No tasks scheduled for this day</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  calendar: {
    marginBottom: 10,
  },
  selectedDay: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedDayTitle: {
    color: '#000',
  },
  taskList: {
    flex: 1,
    paddingBottom: 16,
  },
  noTasksText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
}); 