import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text, List } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

type Category = 'work' | 'health' | 'study' | 'leisure';
type Priority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  startTime: string;
  endTime: string;
  completed: boolean;
}

// Helper functions from index.tsx
const getCategoryColor = (category: Category): string => {
  switch (category) {
    case 'work':
      return '#007AFF';
    case 'health':
      return '#30D158';
    case 'study':
      return '#5856D6';
    case 'leisure':
      return '#FF9F0A';
    default:
      return '#666';
  }
};

const getCategoryIcon = (category: Category): string => {
  switch (category) {
    case 'work':
      return 'briefcase-outline';
    case 'health':
      return 'heart-outline';
    case 'study':
      return 'book-outline';
    case 'leisure':
      return 'gamepad-variant-outline';
    default:
      return 'tag-outline';
  }
};

const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'high':
      return '#FF453A';
    case 'medium':
      return '#FF9F0A';
    case 'low':
      return '#30D158';
    default:
      return '#666';
  }
};

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);

  // Dummy detailed tasks data
  const detailedTasks = {
    '2024-12-02': [
      {
        id: '1',
        title: 'Project Review',
        category: 'work',
        priority: 'high',
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        completed: false
      },
      {
        id: '2',
        title: 'Team Meeting',
        category: 'work',
        priority: 'medium',
        startTime: '2:00 PM',
        endTime: '3:00 PM',
        completed: false
      }
    ],
    '2024-12-05': [
      {
        id: '3',
        title: 'Gym Session',
        category: 'health',
        priority: 'medium',
        startTime: '7:00 AM',
        endTime: '8:30 AM',
        completed: false
      }
    ],
    '2024-12-10': [
      {
        id: '4',
        title: 'Study React Native',
        category: 'study',
        priority: 'high',
        startTime: '9:00 AM',
        endTime: '11:00 AM',
        completed: false
      },
      {
        id: '5',
        title: 'Lunch with Team',
        category: 'leisure',
        priority: 'low',
        startTime: '12:00 PM',
        endTime: '1:30 PM',
        completed: false
      },
      {
        id: '6',
        title: 'Client Meeting',
        category: 'work',
        priority: 'high',
        startTime: '2:00 PM',
        endTime: '3:30 PM',
        completed: false
      }
    ]
  };

  // Calendar marker data
  const tasks = Object.keys(detailedTasks).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: '#007AFF',
      dots: detailedTasks[date].length
    };
    return acc;
  }, {} as Record<string, { marked: boolean; dotColor: string; dots: number }>);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Merge today's styling with any existing tasks
  const markedDates = Object.keys(tasks).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dots: Array(tasks[date].dots).fill({ color: '#007AFF' }),
      selected: date === selectedDate,
      selectedColor: date === selectedDate ? '#007AFF' : undefined,
      selectedTextColor: date === selectedDate ? '#ffffff' : undefined,
    };
    return acc;
  }, {} as any);

  // Add today's styling
  markedDates[today] = {
    ...markedDates[today],
    selected: selectedDate !== today,
    selectedColor: '#007AFF15',
    selectedTextColor: '#007AFF',
    marked: true,
    dots: markedDates[today]?.dots || []
  };

  // Ensure selected date styling takes precedence
  if (selectedDate && selectedDate !== today) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#007AFF',
      selectedTextColor: '#ffffff',
      marked: true,
      dots: markedDates[selectedDate]?.dots || []
    };
  }

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setSelectedTasks(detailedTasks[day.dateString] || []);
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
                position: 'absolute',
                top: -5,
              },
              today: {
                backgroundColor: '#007AFF15',
                borderRadius: 16,
                width: 32,
                height: 32,
                position: 'absolute',
                top: -5,
              },
              base: {
                width: 32,
                height: 32,
                alignItems: 'center',
                paddingTop: 5,
              },
              text: {
                marginTop: 0,
                fontSize: 14,
              },
              dots: {
                marginTop: 20,
              }
            },
          }}
          markingType={'multi-dot'}
          markedDates={markedDates}
          onDayPress={handleDayPress}
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
          {selectedTasks.length > 0 ? (
            <List.Section style={styles.taskSection}>
              {selectedTasks.map((task) => (
                <View key={task.id} style={styles.taskItemContainer}>
                  <Pressable
                    style={styles.checkboxContainer}
                    onPress={() => {
                      const updatedTasks = selectedTasks.map(t => 
                        t.id === task.id ? { ...t, completed: !t.completed } : t
                      );
                      setSelectedTasks(updatedTasks);
                    }}
                  >
                    <List.Icon 
                      icon={task.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                      color={task.completed ? "#30D158" : "#666"}
                    />
                  </Pressable>
                  <Link 
                    href={`/task-detail/${task.id}`} 
                    asChild 
                    style={styles.taskContent}
                  >
                    <Pressable>
                      <List.Item
                        title={task.title}
                        titleStyle={[
                          styles.taskTitle,
                          task.completed && styles.taskTitleCompleted
                        ]}
                        description={() => (
                          <View style={[
                            styles.taskMeta,
                            task.completed && styles.taskMetaCompleted
                          ]}>
                            <View style={styles.tagContainer}>
                              <View style={[styles.tag, { backgroundColor: `${getCategoryColor(task.category)}15` }]}>
                                <MaterialCommunityIcons 
                                  name={getCategoryIcon(task.category)} 
                                  size={14} 
                                  color={task.completed ? '#999' : getCategoryColor(task.category)} 
                                  style={styles.tagIcon}
                                />
                                <Text style={[
                                  styles.tagText, 
                                  { color: task.completed ? '#999' : getCategoryColor(task.category) }
                                ]}>
                                  {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                                </Text>
                              </View>
                              <View style={[
                                styles.tag, 
                                { backgroundColor: task.completed ? '#f0f0f0' : `${getPriorityColor(task.priority)}15` }
                              ]}>
                                <Text style={[
                                  styles.tagText,
                                  { color: task.completed ? '#999' : getPriorityColor(task.priority) }
                                ]}>
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.timeContainer}>
                              <MaterialCommunityIcons 
                                name="clock-outline" 
                                size={14} 
                                color={task.completed ? '#999' : '#666'} 
                              />
                              <Text style={[
                                styles.timeText,
                                task.completed && styles.timeTextCompleted
                              ]}>
                                {task.startTime} - {task.endTime}
                              </Text>
                            </View>
                          </View>
                        )}
                        style={styles.taskItem}
                      />
                    </Pressable>
                  </Link>
                </View>
              ))}
            </List.Section>
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
  taskSection: {
    paddingHorizontal: 16,
  },
  noTasksText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
  taskItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    paddingLeft: 0,
    paddingRight: 8,
  },
  taskContent: {
    flex: 1,
  },
  taskItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskMeta: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 4,
  },
  taskMetaCompleted: {
    opacity: 0.7,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  timeTextCompleted: {
    color: '#999',
  },
}); 