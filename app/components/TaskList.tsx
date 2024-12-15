import { View, Pressable, StyleSheet } from 'react-native';
import { Text, List, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Task } from '../services/api';

type Props = {
  tasks: Task[];
  onTaskComplete: (taskId: string, completed: boolean) => void;
  onTaskDelete: (taskId: string) => void;
};

const getCategoryColor = (category: Task['category']): string => {
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

const getCategoryIcon = (category: Task['category']): string => {
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

const getPriorityColor = (priority: Task['priority']): string => {
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

export default function TaskList({ tasks, onTaskComplete, onTaskDelete }: Props) {
  return (
    <List.Section>
      {tasks.map((task) => (
        <View key={task.id} style={styles.taskItemContainer}>
          <Pressable
            style={styles.checkboxContainer}
            onPress={() => onTaskComplete(task.id, !task.completed)}
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
          <IconButton
            icon="trash-can-outline"
            iconColor={task.completed ? '#CCCCCC' : '#666666'}
            size={20}
            onPress={() => onTaskDelete(task.id)}
            style={[
              styles.deleteButton,
              task.completed && { opacity: 0.5 }
            ]}
          />
        </View>
      ))}
    </List.Section>
  );
}

const styles = StyleSheet.create({
  // ... Copy all the task-related styles from index.tsx
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
  deleteButton: {
    margin: 0,
    padding: 0,
  },
}); 