import { ScrollView, View } from 'react-native';
import { Text, Card, FAB, Portal, Chip, IconButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useState } from 'react';

interface Template {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export default function TemplatesScreen() {
  const [visible, setVisible] = useState(false);

  const templates: Template[] = [
    {
      id: '1',
      title: 'Daily Workout',
      description: 'Complete 30 minutes of exercise',
      tags: ['Health', 'Routine'],
    },
    {
      id: '2',
      title: 'Weekly Review',
      description: 'Review tasks and plan next week',
      tags: ['Work', 'Planning'],
    },
    {
      id: '3',
      title: 'Study Session',
      description: '2 hours of focused study',
      tags: ['Study', 'Focus'],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text variant="headlineMedium" style={styles.title}>Task Templates 📋</Text>

        {templates.map((template) => (
          <Card key={template.id} style={styles.card}>
            <Card.Content>
              <View style={styles.headerContainer}>
                <Text variant="titleLarge">{template.title}</Text>
                <IconButton icon="dots-vertical" onPress={() => {}} />
              </View>
              <Text variant="bodyMedium">{template.description}</Text>
              <View style={styles.tagsContainer}>
                {template.tags.map((tag) => (
                  <Chip key={tag} style={styles.chip}>{tag}</Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setVisible(!visible)}
          label="New Template"
        />
      </Portal>
    </View>
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
  card: {
    margin: 16,
    marginTop: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    marginBottom: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 