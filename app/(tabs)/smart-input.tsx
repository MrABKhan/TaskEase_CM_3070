import { View, StyleSheet, Animated, Easing, ScrollView, SafeAreaView } from 'react-native';
import { Text, Surface, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export default function SmartInputScreen() {
  const theme = useTheme();
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<{
    status?: string;
    canAskAgain?: boolean;
    expires?: string | number;
  }>({});
  const [silentTime, setSilentTime] = useState(0);

  // Add timeout handling
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechRef = useRef<boolean>(false);
  const MAX_SILENT_TIME = 5; // Maximum seconds of silence

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If we already have speech, stop after short silence
    if (lastSpeechRef.current && transcript.trim() !== '') {
      timeoutRef.current = setTimeout(() => {
        if (recognizing) {
          ExpoSpeechRecognitionModule.stop();
        }
      }, 1500); // 1.5 second silence after speech
      return;
    }

    // For initial silence, increment counter
    timeoutRef.current = setTimeout(() => {
      if (recognizing && !lastSpeechRef.current) {
        const newSilentTime = silentTime + 1;
        setSilentTime(newSilentTime);
        
        if (newSilentTime >= MAX_SILENT_TIME) {
          ExpoSpeechRecognitionModule.stop();
          setTranscript('No speech detected. Please try again.');
          setSilentTime(0);
        } else {
          resetTimeout();
        }
      }
    }, 1000); // Check every second
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Animation values
  const buttonScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const transcriptSlideUp = useRef(new Animated.Value(50)).current;
  const transcriptOpacity = useRef(new Animated.Value(0)).current;

  // Animation for button pulse
  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation;
    
    if (recognizing) {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    } else {
      Animated.spring(pulseAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
    };
  }, [recognizing]);

  // Animation for progress indicator
  useEffect(() => {
    if (recognizing && !lastSpeechRef.current) {
      Animated.timing(progressAnim, {
        toValue: silentTime / MAX_SILENT_TIME,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else if (!recognizing) {
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [silentTime, recognizing, lastSpeechRef.current]);

  // Animation for button
  useEffect(() => {
    let buttonAnimation: Animated.CompositeAnimation;

    if (recognizing) {
      buttonAnimation = Animated.spring(buttonScale, {
        toValue: 1.1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      });
    } else {
      buttonAnimation = Animated.spring(buttonScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      });
    }
    
    buttonAnimation.start();

    return () => {
      buttonAnimation.stop();
    };
  }, [recognizing]);

  // Animation for transcript
  useEffect(() => {
    if (transcript) {
      Animated.parallel([
        Animated.timing(transcriptSlideUp, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(transcriptOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      transcriptSlideUp.setValue(50);
      transcriptOpacity.setValue(0);
    }
  }, [transcript]);

  useSpeechRecognitionEvent("start", () => {
    setRecognizing(true);
    lastSpeechRef.current = false;
    setSilentTime(0);
    setTranscript("I'm listening...");
    resetTimeout();
  });

  useSpeechRecognitionEvent("end", () => {
    setRecognizing(false);
    setSilentTime(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  });

  useSpeechRecognitionEvent("result", (event) => {
    const newTranscript = event.results[0]?.transcript || '';
    if (newTranscript.trim() !== '') {
      lastSpeechRef.current = true;
      setSilentTime(0);
    }
    setTranscript(newTranscript);
    resetTimeout();
  });

  useSpeechRecognitionEvent("error", (event) => {
    // Handle known error cases more gracefully
    switch (event.error) {
      case 'no-speech':
        console.log('No speech detected');
        // Don't override transcript if we already have speech
        if (!lastSpeechRef.current) {
          setTranscript(`Listening... (${MAX_SILENT_TIME - silentTime}s remaining)`);
        }
        resetTimeout();
        break;
      case 'network':
        console.error('Network error during speech recognition:', event.message);
        setTranscript('Network error occurred. Please check your connection and try again.');
        setRecognizing(false);
        setSilentTime(0);
        break;
      case 'not-allowed':
        console.error('Speech recognition not allowed:', event.message);
        setTranscript('Speech recognition is not allowed. Please check your permissions.');
        setRecognizing(false);
        setSilentTime(0);
        break;
      case 'aborted':
        console.log('Speech recognition was aborted');
        if (!lastSpeechRef.current) {
          setTranscript('');
        }
        setRecognizing(false);
        setSilentTime(0);
        break;
      default:
        console.error("Speech recognition error:", event.error, "Message:", event.message);
        setTranscript('Sorry, I didn\'t catch that. Please try again.');
        setRecognizing(false);
        setSilentTime(0);
    }
  });

  useEffect(() => {
    (async () => {
      try {
        // First check existing permissions
        const currentPermission = await ExpoSpeechRecognitionModule.getPermissionsAsync();
        console.log("Current permission status:", {
          status: currentPermission.status,
          granted: currentPermission.granted,
          canAskAgain: currentPermission.canAskAgain,
          expires: currentPermission.expires,
        });

        if (currentPermission.granted) {
          setHasPermission(true);
          setPermissionStatus({
            status: currentPermission.status,
            canAskAgain: currentPermission.canAskAgain,
            expires: currentPermission.expires,
          });
          return;
        }

        // If not granted, request permissions
        if (currentPermission.canAskAgain) {
          const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
          console.log("Permission request result:", {
            status: result.status,
            granted: result.granted,
            canAskAgain: result.canAskAgain,
            expires: result.expires,
          });

          setHasPermission(result.granted);
          setPermissionStatus({
            status: result.status,
            canAskAgain: result.canAskAgain,
            expires: result.expires,
          });
        }
      } catch (err) {
        console.error('Failed to get permission:', err);
        setPermissionStatus({
          status: 'error',
          canAskAgain: false,
        });
      }
    })();
  }, []);

  const handleVoiceInput = async () => {
    try {
      if (!hasPermission) {
        const message = permissionStatus.canAskAgain 
          ? 'Please grant microphone permission to use voice input.'
          : 'Microphone permission is required but cannot be requested again. Please enable it in your device settings.';
        setTranscript(message);
        return;
      }

      if (recognizing) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        await ExpoSpeechRecognitionModule.stop();
        return;
      }

      setTranscript('');
      await ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
        maxAlternatives: 1,
        continuous: true, // Enable continuous recognition
        requiresOnDeviceRecognition: false,
        addsPunctuation: true,
      });
    } catch (err) {
      console.error('Voice input error:', err);
      setTranscript('An error occurred. Please try again.');
      setRecognizing(false);
    }
  };

  const getStatusColor = () => {
    if (!recognizing) return theme.colors.primary;
    if (lastSpeechRef.current) return '#4CD964'; // Green when actively speaking
    return '#FF9500'; // Orange when waiting for speech
  };

  const getStatusText = () => {
    if (!recognizing) return 'Tap to speak';
    if (lastSpeechRef.current) return 'Listening...';
    return `Waiting for speech (${MAX_SILENT_TIME - silentTime}s)`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Surface style={styles.surface} elevation={0}>
          <View style={styles.header}>
            <Text style={styles.title}>Smart Task Input</Text>
            <Text style={styles.subtitle}>Use voice to create tasks naturally</Text>
          </View>

          <View style={styles.voiceContainer}>
            {/* Progress ring */}
            <View style={styles.progressContainer}>
              <Animated.View 
                style={[
                  styles.progressRing, 
                  { opacity: recognizing && !lastSpeechRef.current ? 1 : 0 }
                ]}
              >
                <Animated.View 
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      })
                    }
                  ]}
                />
              </Animated.View>
            </View>

            {/* Center aligned button with pulse effect */}
            <View style={styles.buttonContainer}>
              {/* Pulse effect */}
              <Animated.View 
                style={[
                  styles.pulseCircle,
                  {
                    transform: [{ scale: pulseAnim }],
                    opacity: recognizing ? 0.3 : 0,
                    backgroundColor: getStatusColor(),
                  }
                ]}
              />

              {/* Main button */}
              <Animated.View 
                style={[
                  styles.voiceButton,
                  {
                    transform: [{ scale: buttonScale }],
                    backgroundColor: getStatusColor(),
                  }
                ]}
              >
                <IconButton
                  icon={recognizing ? "stop" : "microphone"}
                  size={36}
                  iconColor="#fff"
                  onPress={handleVoiceInput}
                  style={styles.micButton}
                />
              </Animated.View>
            </View>

            {/* Status text */}
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>

          {/* Transcript container with animation */}
          {transcript && (
            <Animated.View 
              style={[
                styles.transcriptContainer,
                {
                  transform: [{ translateY: transcriptSlideUp }],
                  opacity: transcriptOpacity,
                }
              ]}
            >
              <MaterialCommunityIcons 
                name={lastSpeechRef.current ? "text-to-speech" : "robot-outline"} 
                size={24} 
                color={lastSpeechRef.current ? "#4CD964" : "#666"} 
              />
              <Text style={styles.transcriptText}>{transcript}</Text>
            </Animated.View>
          )}

          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Try saying:</Text>
            <View style={styles.suggestions}>
              <View style={styles.suggestionItem}>
                <MaterialCommunityIcons name="calendar-clock" size={20} color={theme.colors.primary} />
                <Text style={styles.suggestion}>"Add a work meeting tomorrow at 2 PM"</Text>
              </View>
              <View style={styles.suggestionItem}>
                <MaterialCommunityIcons name="dumbbell" size={20} color="#FF9500" />
                <Text style={styles.suggestion}>"Remind me to go to the gym at 6 PM"</Text>
              </View>
              <View style={styles.suggestionItem}>
                <MaterialCommunityIcons name="flag-variant" size={20} color="#FF3B30" />
                <Text style={styles.suggestion}>"Schedule a high priority task for today"</Text>
              </View>
            </View>
          </View>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  surface: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  voiceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    height: 180,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  progressRing: {
    width: 160,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E5EA',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF9500',
  },
  buttonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  voiceButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  micButton: {
    margin: 0,
  },
  statusText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  transcriptContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  transcriptText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  suggestionsContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  suggestionsTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  suggestions: {
    gap: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestion: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
  },
});