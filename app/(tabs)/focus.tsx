import { View } from 'react-native';
import { Text, Surface, Button, ProgressBar } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';

export default function FocusScreen() {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => {
          const newTime = time - 1;
          setProgress(newTime / (25 * 60));
          return newTime;
        });
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(25 * 60);
    setProgress(1);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Focus Mode 🎯</Text>

      <Surface style={styles.timerContainer} elevation={1}>
        <Text variant="displayLarge" style={styles.timer}>
          {formatTime(time)}
        </Text>
        <ProgressBar progress={progress} style={styles.progress} />
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={handleStartStop}
            style={styles.button}
          >
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button 
            mode="outlined" 
            onPress={handleReset}
            style={styles.button}
          >
            Reset
          </Button>
        </View>

        <Text variant="bodyMedium" style={styles.tip}>
          Stay focused for 25 minutes, then take a 5-minute break
        </Text>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginVertical: 20,
    textAlign: 'center',
  },
  timerContainer: {
    padding: 32,
    borderRadius: 10,
    alignItems: 'center',
  },
  timer: {
    fontSize: 72,
    marginBottom: 24,
  },
  progress: {
    height: 8,
    width: '100%',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  button: {
    minWidth: 120,
  },
  tip: {
    textAlign: 'center',
    opacity: 0.7,
  },
}); 