import { View, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useState, useEffect, useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { scheduleNotification, initializeNotifications, cancelNotification } from '../services/notificationService';

const { width, height } = Dimensions.get('window');

export default function FocusScreen() {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [endNotificationId, setEndNotificationId] = useState<string | null>(null);
  
  // Animation values for waves (focus mode)
  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  
  // Animation values for blobs (break mode)
  const blob1Scale = useRef(new Animated.Value(1)).current;
  const blob2Scale = useRef(new Animated.Value(1)).current;
  const blob1Position = useRef(new Animated.Value(0)).current;
  const blob2Position = useRef(new Animated.Value(0)).current;

  // Initialize notifications when component mounts
  useEffect(() => {
    initializeNotifications();
  }, []);

  useEffect(() => {
    if (!isBreak) {
      // Wave animation for focus mode
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation1, {
            toValue: 1,
            duration: 20000, // Slower waves
            useNativeDriver: true
          }),
          Animated.timing(animation1, {
            toValue: 0,
            duration: 20000,
            useNativeDriver: true
          })
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(animation2, {
            toValue: 1,
            duration: 25000,
            useNativeDriver: true
          }),
          Animated.timing(animation2, {
            toValue: 0,
            duration: 25000,
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      // Blob animation for break mode
      const createBlobAnimation = () => {
        return Animated.parallel([
          Animated.sequence([
            Animated.timing(blob1Scale, {
              toValue: 1.2,
              duration: 8000,
              useNativeDriver: true
            }),
            Animated.timing(blob1Scale, {
              toValue: 1,
              duration: 8000,
              useNativeDriver: true
            })
          ]),
          Animated.sequence([
            Animated.timing(blob2Scale, {
              toValue: 0.8,
              duration: 8000,
              useNativeDriver: true
            }),
            Animated.timing(blob2Scale, {
              toValue: 1,
              duration: 8000,
              useNativeDriver: true
            })
          ]),
          Animated.sequence([
            Animated.timing(blob1Position, {
              toValue: 1,
              duration: 16000,
              useNativeDriver: true
            }),
            Animated.timing(blob1Position, {
              toValue: 0,
              duration: 16000,
              useNativeDriver: true
            })
          ]),
          Animated.sequence([
            Animated.timing(blob2Position, {
              toValue: -1,
              duration: 16000,
              useNativeDriver: true
            }),
            Animated.timing(blob2Position, {
              toValue: 0,
              duration: 16000,
              useNativeDriver: true
            })
          ])
        ]);
      };

      Animated.loop(createBlobAnimation()).start();
    }

    return () => {
      // Clean up animations
      animation1.setValue(0);
      animation2.setValue(0);
      blob1Scale.setValue(1);
      blob2Scale.setValue(1);
      blob1Position.setValue(0);
      blob2Position.setValue(0);
    };
  }, [isBreak]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggleTimer = async () => {
    const newIsActive = !isActive;
    setIsActive(newIsActive);
    
    if (newIsActive) {
      // Starting timer
      const sessionType = isBreak ? 'break' : 'focus';
      await scheduleNotification(
        `${sessionType.charAt(0).toUpperCase() + sessionType.slice(1)} Session Started`,
        `Your ${sessionType} session has started. Stay focused!`
      );
      
      // Schedule end notification
      const notificationId = await scheduleNotification(
        `${sessionType.charAt(0).toUpperCase() + sessionType.slice(1)} Session Complete`,
        `Great job! Your ${time / 60} minute ${sessionType} session is complete.`,
        time
      );
      
      if (notificationId) {
        setEndNotificationId(notificationId);
      }
    } else if (endNotificationId) {
      // If stopping timer early, cancel the end notification
      cancelNotification(endNotificationId);
      setEndNotificationId(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustTime = (minutes: number) => {
    if (!isActive) {
      const newTime = Math.max(60, Math.min(60 * 60, time + minutes * 60));
      setTime(newTime);
    }
  };

  const setMode = async (mode: 'focus' | 'break') => {
    if (!isActive) {
      setIsBreak(mode === 'break');
      setTime(mode === 'break' ? 5 * 60 : 25 * 60);
      if (endNotificationId) {
        cancelNotification(endNotificationId);
        setEndNotificationId(null);
      }
    }
  };

  const translateX1 = animation1.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, 0]
  });

  const translateX2 = animation2.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, 0]
  });

  const blob1Transform = {
    transform: [
      { scale: blob1Scale },
      { translateX: blob1Position.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [-50, 0, 50]
      })},
      { translateY: blob1Position.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [30, 0, -30]
      })}
    ]
  };

  const blob2Transform = {
    transform: [
      { scale: blob2Scale },
      { translateX: blob2Position.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [50, 0, -50]
      })},
      { translateY: blob2Position.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [-30, 0, 30]
      })}
    ]
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: isBreak ? '#9CAF88' : '#1E4D8C' }
    ]}>
      {!isBreak ? (
        // Focus mode waves
        <View style={styles.wavesContainer}>
          <Animated.View
            style={[
              styles.wave,
              {
                transform: [{ translateX: translateX1 }],
                opacity: 0.15
              }
            ]}
          >
            <Svg height="100%" width={width * 2} style={{ backgroundColor: 'transparent' }}>
              <Path
                d={`M0 50 Q${width/4} 0 ${width/2} 50 T${width} 50 T${width*1.5} 50 T${width*2} 50 V100 H0 Z`}
                fill="white"
              />
            </Svg>
          </Animated.View>
          <Animated.View
            style={[
              styles.wave,
              {
                transform: [{ translateX: translateX2 }],
                opacity: 0.1,
                top: 20
              }
            ]}
          >
            <Svg height="100%" width={width * 2} style={{ backgroundColor: 'transparent' }}>
              <Path
                d={`M0 50 Q${width/4} 100 ${width/2} 50 T${width} 50 T${width*1.5} 50 T${width*2} 50 V100 H0 Z`}
                fill="white"
              />
            </Svg>
          </Animated.View>
        </View>
      ) : (
        // Break mode blobs
        <View style={styles.blobsContainer}>
          <Animated.View style={[styles.blob, blob1Transform]}>
            <Svg width="200" height="200" viewBox="0 0 200 200">
              <Circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.15)" />
            </Svg>
          </Animated.View>
          <Animated.View style={[styles.blob, blob2Transform]}>
            <Svg width="240" height="240" viewBox="0 0 240 240">
              <Circle cx="120" cy="120" r="100" fill="rgba(255,255,255,0.1)" />
            </Svg>
          </Animated.View>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.timerContainer}>
          <View style={styles.timeAdjust}>
            <IconButton
              icon="chevron-up"
              iconColor="#fff"
              size={24}
              onPress={() => adjustTime(1)}
              disabled={isActive}
            />
          </View>
          
          <Text style={styles.timer}>
            {formatTime(time)}
          </Text>

          <View style={styles.timeAdjust}>
            <IconButton
              icon="chevron-down"
              iconColor="#fff"
              size={24}
              onPress={() => adjustTime(-1)}
              disabled={isActive}
            />
          </View>
        </View>

        <View style={styles.controls}>
          <Pressable
            style={[
              styles.playButton,
              { backgroundColor: 'rgba(255,255,255,0.2)' }
            ]}
            onPress={toggleTimer}
          >
            <MaterialCommunityIcons
              name={isActive ? 'pause' : 'play'}
              size={32}
              color="#fff"
            />
          </Pressable>
        </View>

        <View style={styles.modeButtons}>
          <Pressable
            style={[
              styles.modeButton,
              !isBreak && styles.modeButtonActive,
              { backgroundColor: 'rgba(255,255,255,0.2)' }
            ]}
            onPress={() => setMode('focus')}
          >
            <MaterialCommunityIcons
              name="brain"
              size={20}
              color="#fff"
              style={styles.modeIcon}
            />
            <Text style={styles.modeButtonText}>
              Focus
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.modeButton,
              isBreak && styles.modeButtonActive,
              { backgroundColor: 'rgba(255,255,255,0.2)' }
            ]}
            onPress={() => setMode('break')}
          >
            <MaterialCommunityIcons
              name="coffee"
              size={20}
              color="#fff"
              style={styles.modeIcon}
            />
            <Text style={styles.modeButtonText}>
              Break
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wavesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    width: width * 2,
    height: 100,
  },
  blobsContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blob: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timeAdjust: {
    marginVertical: -8,
  },
  timer: {
    fontSize: 72,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
    color: '#fff',
  },
  controls: {
    marginBottom: 40,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modeIcon: {
    marginRight: 8,
  },
  modeButtonActive: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
}); 