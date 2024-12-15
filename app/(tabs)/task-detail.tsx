import { ScrollView, View } from 'react-native';
import { Text, Surface, Chip, Button, List, Divider } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default function TaskDetailScreen() {
  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface} elevation={1}>
        <Text variant="headlineMedium">Review Project Proposal</Text>
        
        <View style={styles.tagsContainer}>
          <Chip icon="flag" style={styles.priorityChip}>High Priority</Chip>
          <Chip>Work</Chip>
          <Chip>Project</Chip>
        </View>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Subheader>Details</List.Subheader>
          <List.Item
            title="Due Date"
            description="Today at 2:00 PM"
            left={props => <List.Icon {...props} icon="calendar" />}
          />
          <List.Item
            title="Duration"
            description="45 minutes"
            left={props => <List.Icon {...props} icon="clock" />}
          />
          <List.Item
            title="Status"
            description="In Progress"
            left={props => <List.Icon {...props} icon="progress-check" />}
          />
        </List.Section>

        <Divider style={styles.divider} />

        <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
        <Text variant="bodyMedium" style={styles.description}>
          Review and provide feedback on the Q4 project proposal. Focus on budget allocation, timeline feasibility, and resource requirements.
        </Text>

        <View style={styles.buttonContainer}>
          <Button 
            mode="contained"
            style={styles.button}
            icon="check"
          >
            Mark as Complete
          </Button>
          <Button 
            mode="outlined"
            style={styles.button}
            icon="pencil"
          >
            Edit Task
          </Button>
        </View>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  priorityChip: {
    backgroundColor: '#FFE0E0',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  description: {
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
});

