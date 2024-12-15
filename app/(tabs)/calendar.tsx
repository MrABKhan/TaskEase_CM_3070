import { View, ScrollView, Pressable } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { useState } from 'react';

export default function CalendarScreen() {
  const router = useRouter();

  // Mock data for calendar tasks
  const tasks = {
    '2023-12-15': [
      { id: 1, title: 'Project Review', time: '10:00 - 11:30', priority: 'high' },
      { id: 2, title: 'Team Meeting', time: '14:00 - 15:00', priority: 'medium' },
    ],
    '2023-12-16': [
      { id: 3, title: 'Client Call', time: '09:00 - 10:00', priority: 'high' },
    ],
    '2023-12-18': [
      { id: 4, title: 'Weekly Planning', time: '11:00 - 12:00', priority: 'medium' },
      { id: 5, title: 'Team Sync', time: '15:00 - 16:00', priority: 'low' },
    ],
  };

  // Generate marked dates for calendar
  const markedDates = Object.keys(tasks).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      selected: selectedDate === date,
      selectedColor: '#000',
      dotColor: tasks[date].some(task => task.priority === 'high') ? '#FF453A' : '#000',
      customStyles: {
        container: {
          backgroundColor: selectedDate === date ? '#000' : tasks[date] ? '#f8f8f8' : 'transparent',
          borderRadius: 8,
        },
        text: {
          color: selectedDate === date ? '#fff' : '#000',
        },
        dots: tasks[date].map(task => ({
          color: getPriorityColor(task.priority),
        })),
      },
    };
    return acc;
  }, {});

  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#666',
          selectedDayBackgroundColor: '#000',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#000',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#000',
          selectedDotColor: '#ffffff',
          arrowColor: '#000',
          monthTextColor: '#000',
          indicatorColor: '#000',
          textDayFontWeight: '400',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '500',
        }}
        markingType={'custom'}
        markedDates={markedDates}
        onDayPress={day => setSelectedDate(day.dateString)}
      />

      <Surface style={styles.tasksSurface} elevation={0}>
        {selectedDate ? (
          <>
            <View style={styles.dateHeader}>
              <Text style={styles.dateTitle}>
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
              <Button
                mode="outlined"
                icon="plus"
                onPress={() => {}}
                style={styles.addButton}
                textColor="#000"
              >
                Add Task
              </Button>
            </View>
            
            {tasks[selectedDate]?.map(task => (
              <Pressable 
                key={task.id}
                style={styles.taskItem}
                onPress={() => router.push(`/task-detail/${task.id}`)}
              >
                <View style={styles.taskContent}>
                  <View style={styles.taskHeader}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                      <Text style={styles.priorityText}>{task.priority}</Text>
                    </View>
                  </View>
                  <View style={styles.taskTime}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                    <Text style={styles.timeText}>{task.time}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
            
            {!tasks[selectedDate] && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No tasks scheduled for this day</Text>
                <Button
                  mode="outlined"
                  icon="plus"
                  onPress={() => {}}
                  style={styles.emptyStateButton}
                  textColor="#000"
                >
                  Add Task
                </Button>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Select a date to view tasks</Text>
          </View>
        )}
      </Surface>
    </View>
  );
}

const getPriorityColor = (priority) => {
  const colors = {
    high: '#FF453A',
    medium: '#FF9F0A',
    low: '#30D158',
  };
  return colors[priority] || '#007AFF';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tasksSurface: {
    flex: 1,
    padding: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    borderRadius: 8,
  },
  taskItem: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9ff',
  },
  taskContent: {
    padding: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  taskTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: '#666',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
  },
  emptyStateButton: {
    borderRadius: 8,
  },
}); 