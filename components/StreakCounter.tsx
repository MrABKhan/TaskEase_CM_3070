import { View } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default function StreakCounter() {
  return (
    <Surface style={styles.container} elevation={2}>
      <Text variant="headlineLarge" style={styles.streakNumber}>7</Text>
      <Text variant="labelLarge">Day Streak 🔥</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  streakNumber: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
}); 