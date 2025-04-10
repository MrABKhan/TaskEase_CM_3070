import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { IconButton, TextInput, Menu, Text, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import api from './services/api';

type Category = 'work' | 'health' | 'study' | 'leisure' | 'shopping' | 'family';
type Priority = 'high' | 'medium' | 'low';

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

const CATEGORIES: Category[] = ['work', 'health', 'study', 'leisure', 'shopping', 'family'];
const PRIORITIES: Priority[] = ['high', 'medium', 'low'];

export default function NewTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setHours(new Date().getHours() + 1)));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getCategoryColor = (cat: Category): string => {
    switch (cat) {
      case 'work':
        return '#007AFF';
      case 'health':
        return '#30D158';
      case 'study':
        return '#5856D6';
      case 'leisure':
        return '#FF9F0A';
      case 'shopping':
        return '#FF3B30';
      case 'family':
        return '#FF2D55';
      default:
        return '#666';
    }
  };

  const getCategoryIcon = (cat: Category): string => {
    switch (cat) {
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

  const getPriorityColor = (pri: Priority): string => {
    switch (pri) {
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

  const getPriorityIcon = (pri: Priority): string => {
    switch (pri) {
      case 'high':
        return 'flag';
      case 'medium':
        return 'flag-outline';
      case 'low':
        return 'flag-variant-outline';
      default:
        return 'flag-outline';
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date && event.type === 'set') {
      // Keep the selected date but maintain current time selections
      const newSelectedDate = new Date(date);
      const currentStartDate = new Date(startDate);
      const currentEndDate = new Date(endDate);

      // Update selected date
      setSelectedDate(newSelectedDate);

      // Update start date with new date but keep current time
      const newStartDate = new Date(newSelectedDate);
      newStartDate.setHours(currentStartDate.getHours(), currentStartDate.getMinutes(), 0, 0);
      setStartDate(newStartDate);

      // Update end date with new date but keep current time
      const newEndDate = new Date(newSelectedDate);
      newEndDate.setHours(currentEndDate.getHours(), currentEndDate.getMinutes(), 0, 0);
      setEndDate(newEndDate);
    }
  };

  const handleStartTimeChange = (event: any, date?: Date) => {
    setShowStartPicker(false);
    if (date && event.type === 'set') {
      // Create new date with selected date and new time
      const newStartDate = new Date(selectedDate);
      newStartDate.setHours(date.getHours(), date.getMinutes(), 0, 0);
      setStartDate(newStartDate);

      // If start time is later than end time, adjust end time
      if (newStartDate > endDate) {
        const newEndDate = new Date(newStartDate);
        newEndDate.setHours(newStartDate.getHours() + 1, newStartDate.getMinutes(), 0, 0);
        setEndDate(newEndDate);
      }
    }
  };

  const handleEndTimeChange = (event: any, date?: Date) => {
    setShowEndPicker(false);
    if (date && event.type === 'set') {
      // Create new date with selected date and new time
      const newEndDate = new Date(selectedDate);
      newEndDate.setHours(date.getHours(), date.getMinutes(), 0, 0);
      setEndDate(newEndDate);
    }
  };

  const handleCreateTask = async () => {
    try {
      setIsLoading(true);

      // Create a new date object for the selected date at midnight UTC
      const taskDate = new Date(selectedDate);
      taskDate.setUTCHours(0, 0, 0, 0);

      // Create start and end times on the selected date
      const taskStartTime = new Date(selectedDate);
      taskStartTime.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0);

      const taskEndTime = new Date(selectedDate);
      taskEndTime.setHours(endDate.getHours(), endDate.getMinutes(), 0, 0);

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        date: taskDate.toISOString(),
        startTime: format(taskStartTime, 'HH:mm'),
        endTime: format(taskEndTime, 'HH:mm'),
        completed: false,
        subtasks: subtasks.map(subtask => ({
          id: subtask.id,
          title: subtask.title,
          completed: subtask.completed
        })),
      };

      console.log('Creating task with data:', {
        ...taskData,
        dateFormatted: new Date(taskData.date).toLocaleString(),
        startTimeFormatted: taskData.startTime,
        endTimeFormatted: taskData.endTime,
        rawSelectedDate: selectedDate,
        rawStartDate: startDate,
        rawEndDate: endDate,
      });

      await api.createTask(taskData);
      router.back();
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert(
        'Error',
        'Failed to create task. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([
        ...subtasks,
        {
          id: Date.now().toString(),
          title: newSubtask.trim(),
          completed: false,
        },
      ]);
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(subtask =>
      subtask.id === id
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          {/* Header with back button and save */}
          <View style={styles.header}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => router.back()}
            />
            <IconButton
              icon="check"
              size={24}
              onPress={handleCreateTask}
              disabled={!title.trim() || isLoading}
              loading={isLoading}
            />
          </View>

          {/* Task Title */}
          <View style={styles.titleContainer}>
            <TextInput
              mode="flat"
              value={title}
              onChangeText={setTitle}
              style={styles.titleInput}
              placeholder="Task Title"
              underlineColor="transparent"
              theme={{ colors: { primary: '#000' } }}
            />
          </View>

          {/* Task Description */}
          <View style={styles.descriptionContainer}>
            <TextInput
              mode="outlined"
              value={description}
              onChangeText={setDescription}
              style={styles.descriptionInput}
              placeholder="Add description"
              multiline
              textAlignVertical="top"
              numberOfLines={4}
              outlineStyle={{ borderRadius: 12 }}
              theme={{ 
                colors: { 
                  primary: '#000',
                  background: '#f8f8f8',
                } 
              }}
            />
          </View>

          {/* Category and Priority */}
          <View style={styles.tagsContainer}>
            <Menu
              visible={showCategoryMenu}
              onDismiss={() => setShowCategoryMenu(false)}
              anchor={
                <Pressable 
                  onPress={() => setShowCategoryMenu(true)}
                  style={[
                    styles.tagButton,
                    { backgroundColor: `${getCategoryColor(category)}15` }
                  ]}
                >
                  <MaterialCommunityIcons
                    name={getCategoryIcon(category)}
                    size={16}
                    color={getCategoryColor(category)}
                  />
                  <Text style={[styles.tagButtonText, { color: getCategoryColor(category) }]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={16}
                    color={getCategoryColor(category)}
                  />
                </Pressable>
              }
              contentStyle={styles.menuContent}
            >
              {CATEGORIES.map((cat) => (
                <Menu.Item
                  key={cat}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryMenu(false);
                  }}
                  title={cat.charAt(0).toUpperCase() + cat.slice(1)}
                  leadingIcon={() => (
                    <MaterialCommunityIcons
                      name={getCategoryIcon(cat)}
                      size={16}
                      color={getCategoryColor(cat)}
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
                    { backgroundColor: `${getPriorityColor(priority)}15` }
                  ]}
                >
                  <MaterialCommunityIcons
                    name={getPriorityIcon(priority)}
                    size={16}
                    color={getPriorityColor(priority)}
                  />
                  <Text style={[styles.tagButtonText, { color: getPriorityColor(priority) }]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={16}
                    color={getPriorityColor(priority)}
                  />
                </Pressable>
              }
              contentStyle={styles.menuContent}
            >
              {PRIORITIES.map((pri) => (
                <Menu.Item
                  key={pri}
                  onPress={() => {
                    setPriority(pri);
                    setShowPriorityMenu(false);
                  }}
                  title={pri.charAt(0).toUpperCase() + pri.slice(1)}
                  leadingIcon={() => (
                    <MaterialCommunityIcons
                      name={getPriorityIcon(pri)}
                      size={16}
                      color={getPriorityColor(pri)}
                    />
                  )}
                  style={styles.menuItem}
                />
              ))}
            </Menu>
          </View>

          {/* Date and Time Selection */}
          <View style={styles.timeContainer}>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={styles.timeButton}
            >
              <MaterialCommunityIcons name="calendar" size={20} color="#666" />
              <Text style={styles.timeButtonText}>
                {formatDate(selectedDate)}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={16} color="#666" />
            </Pressable>

            <Pressable
              onPress={() => setShowStartPicker(true)}
              style={[styles.timeButton, { backgroundColor: '#FFF5E6' }]}
            >
              <MaterialCommunityIcons name="clock-outline" size={20} color="#FF9F0A" />
              <View style={styles.timeWrapper}>
                <Text style={[styles.timeButtonText, { color: '#FF9F0A' }]}>
                  {format(startDate, 'HH:mm')}
                </Text>
                <Text style={[styles.timeButtonText, { color: '#FF9F0A' }]}> - </Text>
                <Text 
                  style={[styles.timeButtonText, { color: '#FF9F0A' }]}
                  onPress={(e) => {
                    e.stopPropagation();
                    setShowEndPicker(true);
                  }}
                >
                  {format(endDate, 'HH:mm')}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-down" size={16} color="#FF9F0A" />
            </Pressable>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              onChange={handleDateChange}
            />
          )}

          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="time"
              is24Hour={true}
              onChange={handleStartTimeChange}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="time"
              is24Hour={true}
              onChange={handleEndTimeChange}
            />
          )}

          {/* Subtasks Section */}
          <View style={styles.subtasksContainer}>
            <Text style={styles.sectionTitle}>Subtasks</Text>
            <List.Section style={styles.subtasksList}>
              {subtasks.map((subtask) => (
                <List.Item
                  key={subtask.id}
                  title={subtask.title}
                  titleStyle={[
                    styles.subtaskText,
                    subtask.completed && styles.subtaskCompleted
                  ]}
                  onPress={() => handleToggleSubtask(subtask.id)}
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
                    value={newSubtask}
                    onChangeText={setNewSubtask}
                    onSubmitEditing={handleAddSubtask}
                    style={styles.subtaskInput}
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
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  titleContainer: {
    marginBottom: 24,
  },
  titleInput: {
    fontSize: 24,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionInput: {
    fontSize: 16,
    backgroundColor: 'transparent',
    minHeight: 120,
    maxHeight: 200,
    padding: 0,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  timeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtasksContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  subtasksList: {
    marginTop: -8,
  },
  subtaskText: {
    fontSize: 14,
  },
  subtaskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  subtaskInput: {
    backgroundColor: 'transparent',
    fontSize: 14,
    height: 20,
    padding: 0,
    color: '#666',
  },
  addSubtaskItem: {
    opacity: 0.6,
  },
}); 