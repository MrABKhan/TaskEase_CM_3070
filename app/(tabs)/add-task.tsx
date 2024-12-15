import { View, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface, SegmentedButtons, Chip } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useState } from 'react';

export default function AddTaskScreen() {
  const [priority, setPriority] = useState('medium');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = ['Work', 'Personal', 'Study', 'Health', 'Shopping'];

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Create New Task ✍️</Text>
      
      <Surface style={styles.formContainer} elevation={1}>
        <TextInput
          label="Task Name"
          mode="outlined"
          style={styles.input}
          placeholder="Enter task name"
        />
        
        <TextInput
          label="Description"
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          placeholder="Enter task description"
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>Priority</Text>
        <SegmentedButtons
          value={priority}
          onValueChange={setPriority}
          buttons={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
          style={styles.segmentedButton}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>Tags</Text>
        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              selected={selectedTags.includes(tag)}
              onPress={() => {
                if (selectedTags.includes(tag)) {
                  setSelectedTags(selectedTags.filter(t => t !== tag));
                } else {
                  setSelectedTags([...selectedTags, tag]);
                }
              }}
              style={styles.chip}
            >
              {tag}
            </Chip>
          ))}
        </View>

        <Button 
          mode="contained"
          style={styles.button}
          onPress={() => {}}
        >
          Create Task
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginVertical: 20,
    textAlign: 'center',
  },
  formContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  segmentedButton: {
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginBottom: 4,
  },
  button: {
    marginTop: 8,
  },
});

