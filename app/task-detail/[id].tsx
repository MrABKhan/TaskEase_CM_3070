import { View, ScrollView } from 'react-native';
import { Text, Surface, List, Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock data - in real app this would come from a database
  const task = {
    title: "Review Project Proposal",
    priority: "High",
    dueTime: "2:00 PM",
    description: "Review and provide feedback on the new project proposal document.",
    status: "In Progress",
    tags: ["Work", "Project"],
    subtasks: [
      { title: "Read document", completed: true },
      { title: "Write feedback", completed: false },
      { title: "Share with team", completed: false },
    ],
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Surface style={styles.surface} elevation={0}>
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.title}>{task.title}</Text>
            <Text style={styles.metadata}>{task.priority} Priority • Due {task.dueTime}</Text>
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Status</Text>
            <Text style={styles.status}>{task.status}</Text>
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tags}>
              {task.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Subtasks</Text>
            <List.Section>
              {task.subtasks.map((subtask, index) => (
                <List.Item
                  key={index}
                  title={subtask.title}
                  left={props => (
                    <List.Icon
                      {...props}
                      icon={subtask.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                    />
                  )}
                />
              ))}
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
  surface: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  metadata: {
    color: '#666',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    color: '#333',
    lineHeight: 20,
  },
  status: {
    color: '#333',
    fontWeight: '500',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#666',
    fontSize: 14,
  },
}); 