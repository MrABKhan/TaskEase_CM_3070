import { View, StyleSheet } from 'react-native';
import { Text, Surface, Button, IconButton, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';

export default function FocusScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const totalTime = 25 * 60;

  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={0}>
        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </Text>
          <Text style={styles.sessionText}>Focus Session</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={1 - (timeLeft / totalTime)}
            style={styles.progressBar}
            color="#000"
          />
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <IconButton
            icon="skip-previous"
            size={32}
            onPress={() => {}}
            style={styles.controlButton}
          />
          <IconButton
            icon={isRunning ? "pause" : "play"}
            size={48}
            onPress={() => setIsRunning(!isRunning)}
            style={[styles.controlButton, styles.mainButton]}
          />
          <IconButton
            icon="skip-next"
            size={32}
            onPress={() => {}}
            style={styles.controlButton}
          />
        </View>

        {/* Session Info */}
        <View style={styles.sessionInfo}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="timer-outline" size={24} color="#000" />
            <Text style={styles.infoLabel}>25 min focus</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="coffee-outline" size={24} color="#000" />
            <Text style={styles.infoLabel}>5 min break</Text>
          </View>
        </View>

        {/* Task Being Focused */}
        <View style={styles.currentTask}>
          <Text style={styles.currentTaskLabel}>CURRENT TASK</Text>
          <Surface style={styles.taskCard} elevation={0}>
            <Text style={styles.taskTitle}>Review Project Proposal</Text>
            <Text style={styles.taskTime}>Started 10 minutes ago</Text>
          </Surface>
        </View>
      </Surface>
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
    padding: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  timerText: {
    fontSize: 72,
    fontWeight: '300',
    letterSpacing: 2,
  },
  sessionText: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
  progressContainer: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f0f0f0',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    gap: 20,
  },
  controlButton: {
    backgroundColor: '#f8f8f8',
  },
  mainButton: {
    backgroundColor: '#000',
    borderRadius: 40,
  },
  sessionInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    gap: 30,
  },
  infoItem: {
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    color: '#666',
    fontSize: 14,
  },
  currentTask: {
    marginTop: 60,
  },
  currentTaskLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    letterSpacing: 1,
  },
  taskCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  taskTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
}); 