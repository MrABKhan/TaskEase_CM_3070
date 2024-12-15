import { View, ScrollView } from 'react-native';
import { Text, Card, Button, Surface, List, FAB, Portal } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import StreakCounter from '../../components/StreakCounter';
import { useState } from 'react';

export default function HomeScreen() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text variant="headlineMedium" style={styles.title}>Welcome Back! 👋</Text>
        
        <Surface style={styles.surface} elevation={1}>
          <StreakCounter />
          
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge">Today's Tasks</Text>
              <List.Section>
                <List.Item
                  title="Review Project Proposal"
                  description="High Priority • Due 2:00 PM"
                  left={props => <List.Icon {...props} icon="checkbox-blank-circle-outline" />}
                />
                <List.Item
                  title="Team Meeting"
                  description="Medium Priority • Due 3:30 PM"
                  left={props => <List.Icon {...props} icon="checkbox-blank-circle-outline" />}
                />
                <List.Item
                  title="Exercise"
                  description="Low Priority • Due 6:00 PM"
                  left={props => <List.Icon {...props} icon="checkbox-blank-circle-outline" />}
                />
              </List.Section>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge">Quick Stats</Text>
              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Text variant="headlineMedium">5</Text>
                  <Text variant="bodySmall">Tasks Today</Text>
                </View>
                <View style={styles.stat}>
                  <Text variant="headlineMedium">3</Text>
                  <Text variant="bodySmall">Completed</Text>
                </View>
                <View style={styles.stat}>
                  <Text variant="headlineMedium">2</Text>
                  <Text variant="bodySmall">Pending</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Surface>
      </ScrollView>

      <Portal>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setVisible(!visible)}
          label="Add Task"
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
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
  },
  card: {
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  stat: {
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

