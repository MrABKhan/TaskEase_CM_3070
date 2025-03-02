import { ScrollView, View, TextInput as RNTextInput, Pressable } from 'react-native';
import { Text, Surface, Button, List, IconButton, TextInput, SegmentedButtons, Portal, Dialog, Menu } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import api from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

const PRIORITIES = ['high', 'medium', 'low'] as const;
const CATEGORIES = ['work', 'health', 'study', 'leisure', 'shopping', 'family'] as const;

export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadTask();
  }, [id]);

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description);
    }
  }, [task]);

  const loadTask = async () => {
    try {
      const response = await api.getTasks();
      const foundTask = response.find((t: any) => t.id === id);
      if (foundTask) {
        setTask(foundTask);
      } else {
        console.error('Task not found');
        router.back();
      }
    } catch (error) {
      console.error('Error loading task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (updates: any) => {
    try {
      await api.updateTask(task.id, updates);
      setTask({ ...task, ...updates });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleSubtaskToggle = async (subtaskId: string) => {
    if (!task) return;
    
    try {
      const updatedSubtasks = task.subtasks.map((st: any) => 
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      
      setTask({
        ...task,
        subtasks: updatedSubtasks
      });

      await api.updateTask(task.id, {
        subtasks: updatedSubtasks
      });
    } catch (error) {
      console.error('Error updating subtask:', error);
      loadTask();
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;

    try {
      const newSubtask = {
        id: Date.now().toString(), // Generate temporary ID
        title: newSubtaskTitle.trim(),
        completed: false
      };

      const updatedSubtasks = [...task.subtasks, newSubtask];
      
      await api.updateTask(task.id, {
        subtasks: updatedSubtasks
      });

      setTask({
        ...task,
        subtasks: updatedSubtasks
      });

      setNewSubtaskTitle('');
      setShowAddSubtask(false);
    } catch (error) {
      console.error('Error adding subtask:', error);
    }
  };

  const handleRemoveSubtask = async (subtaskId: string) => {
    try {
      const updatedSubtasks = task.subtasks.filter((st: any) => st.id !== subtaskId);
      
      await api.updateTask(task.id, {
        subtasks: updatedSubtasks
      });

      setTask({
        ...task,
        subtasks: updatedSubtasks
      });
    } catch (error) {
      console.error('Error removing subtask:', error);
    }
  };

  const handleTaskComplete = async () => {
    if (!task) return;

    try {
      const completed = !task.completed;
      await api.updateTask(task.id, { completed });
      setTask({ ...task, completed });
    } catch (error) {
      console.error('Error updating task completion:', error);
    }
  };

  const handleTimeChange = async (event: any, selectedDate: Date | undefined, isStartTime: boolean) => {
    if (event.type === 'dismissed') {
      setShowStartTimePicker(false);
      setShowEndTimePicker(false);
      return;
    }

    if (selectedDate) {
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      const formattedTime = formatTime(timeString);

      const updates = isStartTime 
        ? { startTime: formattedTime }
        : { endTime: formattedTime };

      await handleUpdateTask(updates);
    }

    setShowStartTimePicker(false);
    setShowEndTimePicker(false);
  };

  const formatTime = (time24: string): string => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const parseTime = (timeString: string): Date => {
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const handleDateChange = async (event: any, selectedDate: Date | undefined) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    if (selectedDate) {
      await handleUpdateTask({ 
        date: selectedDate.toISOString()
      });
    }
    setShowDatePicker(false);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  if (loading || !task) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'arrow-up-bold-circle';
      case 'medium':
        return 'equal-circle';
      case 'low':
        return 'arrow-down-bold-circle';
      default:
        return 'minus-circle';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work':
        return 'briefcase-outline';
      case 'health':
        return 'heart-outline';
      case 'study':
        return 'book-outline';
      case 'leisure':
        return 'gamepad-variant-outline';
      case 'shopping':
        return 'cart-outline';
      case 'family':
        return 'account-group-outline';
      default:
        return 'tag-outline';
    }
  };

  const getPriorityColor = (priority: string) => {
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

  // Calculate progress
  const completedSubtasks = task.subtasks.filter((st: any) => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Surface style={styles.surface} elevation={0}>
          {/* Header with back button */}
          <View style={styles.header}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => router.back()}
            />
          </View>

          {/* Task Title with Complete Button */}
          <View style={styles.titleContainer}>
            <View style={styles.titleWrapper}>
              <TextInput
                mode="flat"
                value={editedTitle}
                onChangeText={setEditedTitle}
                onBlur={() => {
                  if (editedTitle !== task.title) {
                    handleUpdateTask({ title: editedTitle });
                  }
                }}
                style={[styles.titleInput, task.completed && styles.completedTitle]}
                placeholder="Task Title"
                underlineColor="transparent"
                theme={{ colors: { primary: '#000' } }}
                multiline
              />
              
              {/* AI Generated Indicator */}
              {task.isAiGenerated && (
                <View style={styles.aiIndicator}>
                  <MaterialCommunityIcons name="robot" size={16} color="#007AFF" />
                  <MaterialCommunityIcons name="star" size={14} color="#FFD700" style={styles.starIcon} />
                  <Text style={styles.aiIndicatorText}>AI Generated</Text>
                </View>
              )}
            </View>
            <IconButton
              icon={task.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
              iconColor={task.completed ? "#30D158" : "#666"}
              size={24}
              onPress={handleTaskComplete}
              style={styles.completeButton}
            />
          </View>

          {/* Category and Priority Selection */}
          <View style={[styles.selectionContainer, task.completed && styles.completedContent]}>
            <Menu
              visible={showCategoryMenu}
              onDismiss={() => setShowCategoryMenu(false)}
              anchor={
                <Pressable 
                  onPress={() => setShowCategoryMenu(true)}
                  style={styles.tagButton}
                >
                  <MaterialCommunityIcons
                    name={getCategoryIcon(task.category)}
                    size={16}
                    color="#666"
                  />
                  <Text style={styles.tagButtonText}>
                    {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={16}
                    color="#666"
                  />
                </Pressable>
              }
              contentStyle={styles.menuContent}
            >
              {CATEGORIES.map((category) => (
                <Menu.Item
                  key={category}
                  onPress={() => {
                    handleUpdateTask({ category });
                    setShowCategoryMenu(false);
                  }}
                  title={category.charAt(0).toUpperCase() + category.slice(1)}
                  leadingIcon={() => (
                    <MaterialCommunityIcons
                      name={getCategoryIcon(category)}
                      size={16}
                      color="#666"
                    />
                  )}
                  style={styles.menuItem}
                />
              ))}
            </Menu>

            <Menu
              visible={showPriorityMenu}
              onDismiss={() => setShowPriorityMenu(false)}
              anchor={
                <Pressable 
                  onPress={() => setShowPriorityMenu(true)}
                  style={[
                    styles.tagButton,
                    { backgroundColor: `${getPriorityColor(task.priority)}15` }
                  ]}
                >
                  <MaterialCommunityIcons
                    name={getPriorityIcon(task.priority)}
                    size={16}
                    color={getPriorityColor(task.priority)}
                  />
                  <Text style={[styles.tagButtonText, { color: getPriorityColor(task.priority) }]}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={16}
                    color={getPriorityColor(task.priority)}
                  />
                </Pressable>
              }
              contentStyle={styles.menuContent}
            >
              {PRIORITIES.map((priority) => (
                <Menu.Item
                  key={priority}
                  onPress={() => {
                    handleUpdateTask({ priority });
                    setShowPriorityMenu(false);
                  }}
                  title={priority.charAt(0).toUpperCase() + priority.slice(1)}
                  leadingIcon={() => (
                    <MaterialCommunityIcons
                      name={getPriorityIcon(priority)}
                      size={16}
                      color={getPriorityColor(priority)}
                    />
                  )}
                  style={styles.menuItem}
                />
              ))}
            </Menu>
          </View>

          {/* Task Info */}
          <View style={[styles.infoContainer, task.completed && styles.completedContent]}>
            <View style={styles.dateTimeContainer}>
              <Pressable 
                style={styles.tagButton}
                onPress={() => setShowDatePicker(true)}
              >
                <MaterialCommunityIcons name="calendar" size={16} color="#666" />
                <Text style={styles.tagButtonText}>
                  {formatDate(task.date)}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={16} color="#666" />
              </Pressable>

              <Pressable 
                style={[styles.tagButton, { backgroundColor: '#FFF5E6' }]}
                onPress={() => setShowStartTimePicker(true)}
              >
                <MaterialCommunityIcons name="clock-outline" size={16} color="#FF9F0A" />
                <View style={styles.timeWrapper}>
                  <Text style={[styles.tagButtonText, styles.timeText]}>
                    {task.startTime}
                  </Text>
                  <Text style={[styles.tagButtonText, styles.timeText]}> - </Text>
                  <Text 
                    style={[styles.tagButtonText, styles.timeText]}
                    onPress={(e) => {
                      e.stopPropagation();
                      setShowEndTimePicker(true);
                    }}
                  >
                    {task.endTime}
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-down" size={16} color="#FF9F0A" />
              </Pressable>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={new Date(task.date)}
                mode="date"
                onChange={handleDateChange}
              />
            )}

            {showStartTimePicker && (
              <DateTimePicker
                value={parseTime(task.startTime)}
                mode="time"
                is24Hour={false}
                onChange={(event, date) => handleTimeChange(event, date, true)}
              />
            )}

            {showEndTimePicker && (
              <DateTimePicker
                value={parseTime(task.endTime)}
                mode="time"
                is24Hour={false}
                onChange={(event, date) => handleTimeChange(event, date, false)}
              />
            )}

            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {completedSubtasks} of {totalSubtasks} subtasks completed
            </Text>
          </View>

          {/* Description */}
          <View style={[styles.section, task.completed && styles.completedContent]}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TextInput
              mode="outlined"
              value={editedDescription}
              onChangeText={setEditedDescription}
              onBlur={() => {
                if (editedDescription !== task.description) {
                  handleUpdateTask({ description: editedDescription });
                }
              }}
              multiline
              numberOfLines={3}
              style={styles.descriptionInput}
              placeholder="Task Description"
              theme={{ colors: { primary: '#000' } }}
            />
          </View>

          {/* Subtasks */}
          <View style={[styles.section, task.completed && styles.completedContent]}>
            <Text style={styles.sectionTitle}>Subtasks</Text>
            <List.Section style={styles.subtaskList}>
              {task.subtasks.map((subtask: any) => (
                <List.Item
                  key={subtask.id}
                  title={subtask.title}
                  titleStyle={[
                    styles.subtaskTitle,
                    subtask.completed && styles.completedSubtaskTitle
                  ]}
                  onPress={() => handleSubtaskToggle(subtask.id)}
                  left={props => (
                    <List.Icon 
                      {...props} 
                      icon={subtask.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                      color={subtask.completed ? "#30D158" : "#666"}
                    />
                  )}
                  right={props => (
                    <IconButton
                      {...props}
                      icon="close"
                      size={20}
                      onPress={() => handleRemoveSubtask(subtask.id)}
                    />
                  )}
                />
              ))}
              <List.Item
                title={
                  <TextInput
                    placeholder="Add subtask"
                    value={newSubtaskTitle}
                    onChangeText={setNewSubtaskTitle}
                    onSubmitEditing={handleAddSubtask}
                    style={styles.addSubtaskInput}
                    placeholderTextColor="#999"
                    theme={{ colors: { primary: '#000' } }}
                  />
                }
                left={props => (
                  <List.Icon 
                    {...props} 
                    icon="checkbox-blank-circle-outline"
                    color="#999"
                  />
                )}
                style={styles.addSubtaskItem}
              />
            </List.Section>
          </View>
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  surface: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  titleWrapper: {
    flex: 1,
    marginRight: 8,
  },
  titleInput: {
    fontSize: 24,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    minHeight: 40,
  },
  completeButton: {
    margin: 0,
    marginTop: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  completedContent: {
    opacity: 0.5,
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  tagButtonText: {
    fontSize: 14,
    color: '#666',
  },
  menuContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
  },
  menuItem: {
    height: 40,
  },
  infoContainer: {
    marginBottom: 24,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#FF9F0A',
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#30D158',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionInput: {
    backgroundColor: 'transparent',
    fontSize: 14,
  },
  subtaskList: {
    marginTop: -8,
  },
  subtaskTitle: {
    fontSize: 14,
  },
  completedSubtaskTitle: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  addSubtaskInput: {
    backgroundColor: 'transparent',
    fontSize: 14,
    height: 20,
    padding: 0,
    color: '#666',
  },
  addSubtaskItem: {
    opacity: 0.6,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aiIndicatorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007AFF',
    marginLeft: 4,
  },
  starIcon: {
    marginLeft: 3,
    marginRight: 1,
  },
});

