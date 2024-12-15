import { ScrollView, View } from 'react-native';
import { Text, Surface, Button, List, IconButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TaskDetailScreen() {
  const router = useRouter();

  // Mock task data
  const task = {
    title: "Review Project Proposal",
    priority: "high",
    category: "work",
    startTime: "10:00 AM",
    endTime: "2:00 PM",
    description: "Review and provide feedback on the Q4 project proposal. Focus on budget allocation, timeline feasibility, and resource requirements.",
    subtasks: [
      { title: "Review budget section", completed: false },
      { title: "Check timeline", completed: false },
      { title: "Assess resources", completed: false },
    ]
  };

  const getPriorityIcon = (priority) => {
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'work':
        return 'briefcase-outline';
      case 'personal':
        return 'account-outline';
      case 'study':
        return 'book-outline';
      case 'health':
        return 'heart-outline';
      default:
        return 'tag-outline';
    }
  };

  const getPriorityColor = (priority) => {
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
            <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(task.priority)}15` }]}>
              <MaterialCommunityIcons 
                name={getPriorityIcon(task.priority)} 
                size={16} 
                color={getPriorityColor(task.priority)}
                style={styles.priorityIcon}
              />
              <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </Text>
            </View>
          </View>

          {/* Task Title */}
          <Text style={styles.title}>{task.title}</Text>
          
          {/* Task Info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name={getCategoryIcon(task.category)} size={20} color="#666" />
                <Text style={styles.infoText}>
                  {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                </Text>
              </View>
              <View style={styles.timeContainer}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#FF9F0A" />
                <Text style={[styles.infoText, styles.timeText]}>
                  {task.startTime} - {task.endTime}
                </Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '45%' }]} />
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>

          {/* Subtasks */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subtasks</Text>
            <List.Section style={styles.subtaskList}>
              {task.subtasks.map((subtask, index) => (
                <List.Item
                  key={index}
                  title={subtask.title}
                  left={props => (
                    <List.Icon 
                      {...props} 
                      icon={subtask.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                      color={subtask.completed ? "#30D158" : "#666"}
                    />
                  )}
                />
              ))}
            </List.Section>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              mode="outlined"
              icon="pencil-outline"
              onPress={() => {}}
              style={styles.button}
              textColor="#000"
            >
              Edit
            </Button>
            <Button
              mode="contained"
              icon="check"
              onPress={() => {}}
              style={[styles.button, styles.primaryButton]}
              buttonColor="#000"
            >
              Complete
            </Button>
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priorityIcon: {
    marginRight: 4,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF5E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  infoText: {
    color: '#666',
    fontSize: 14,
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
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#30D158',
    borderRadius: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  subtaskList: {
    marginTop: -8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
  primaryButton: {
    borderColor: '#000',
  },
});

