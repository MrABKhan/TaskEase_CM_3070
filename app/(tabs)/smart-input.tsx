import { View, StyleSheet, Animated } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export default function SmartInputScreen() {
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
  const wave1Scale = useRef(new Animated.Value(1)).current;
  const wave2Scale = useRef(new Animated.Value(1)).current;
  const wave3Scale = useRef(new Animated.Value(1)).current;
  const waveOpacity = useRef(new Animated.Value(0)).current;

  // Animation for waves
  useEffect(() => {
    let waveAnimation: Animated.CompositeAnimation;

    if (recognizing) {
      // Native driven animations
      waveAnimation = Animated.parallel([
        // Button animation
        Animated.spring(buttonScale, {
          toValue: 1.1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        // Waves animation
        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.sequence([
                Animated.timing(wave1Scale, {
                  toValue: 1.2,
                  duration: 600,
                  useNativeDriver: true,
                }),
                Animated.timing(wave1Scale, {
                  toValue: 1,
                  duration: 600,
                  useNativeDriver: true,
                }),
              ]),
              Animated.sequence([
                Animated.delay(200),
                Animated.timing(wave2Scale, {
                  toValue: 1.3,
                  duration: 600,
                  useNativeDriver: true,
                }),
                Animated.timing(wave2Scale, {
                  toValue: 1,
                  duration: 600,
                  useNativeDriver: true,
                }),
              ]),
              Animated.sequence([
                Animated.delay(400),
                Animated.timing(wave3Scale, {
                  toValue: 1.4,
                  duration: 600,
                  useNativeDriver: true,
                }),
                Animated.timing(wave3Scale, {
                  toValue: 1,
                  duration: 600,
                  useNativeDriver: true,
                }),
              ]),
            ]),
          ])
        ),
        Animated.timing(waveOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]);
      waveAnimation.start();
    } else {
      // Native driven animations
      waveAnimation = Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(waveOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]);
      waveAnimation.start();
    }

    // Cleanup function
    return () => {
      waveAnimation?.stop();
    };
  }, [recognizing]);

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

  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={0}>
        <View style={styles.header}>
          <Text style={styles.title}>Smart Task Input</Text>
          <Text style={styles.subtitle}>Use voice or type naturally</Text>
        </View>

        <View style={styles.voiceContainer}>
          <Animated.View 
            style={[
              styles.voiceButton,
              {
                transform: [{ scale: buttonScale }],
                backgroundColor: recognizing ? '#FF453A' : '#007AFF',
              }
            ]}
          >
            <IconButton
              icon="microphone"
              size={40}
              iconColor="#fff"
              onPress={handleVoiceInput}
              style={styles.micButton}
            />
          </Animated.View>
          <Animated.View 
            style={[
              styles.listeningIndicator,
              { opacity: waveOpacity }
            ]}
          >
            <Animated.View style={[
              styles.wave,
              { transform: [{ scale: wave1Scale }] }
            ]} />
            <Animated.View style={[
              styles.wave,
              styles.wave2,
              { transform: [{ scale: wave2Scale }] }
            ]} />
            <Animated.View style={[
              styles.wave,
              styles.wave3,
              { transform: [{ scale: wave3Scale }] }
            ]} />
          </Animated.View>
        </View>

        {transcript && (
          <View style={styles.transcriptContainer}>
            <MaterialCommunityIcons name="robot-outline" size={24} color="#666" />
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        )}

        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Try saying:</Text>
          <View style={styles.suggestions}>
            <Text style={styles.suggestion}>"Add a work meeting tomorrow at 2 PM"</Text>
            <Text style={styles.suggestion}>"Remind me to go to the gym at 6 PM"</Text>
            <Text style={styles.suggestion}>"Schedule a high priority task for today"</Text>
          </View>
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
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  voiceContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  voiceButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  micButton: {
    margin: 0,
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  wave: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: '#000',
    marginHorizontal: 2,
    opacity: 0.3,
  },
  wave2: {
    height: 30,
    opacity: 0.6,
  },
  wave3: {
    height: 40,
    opacity: 0.9,
  },
  transcriptContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  transcriptText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  suggestionsContainer: {
    marginTop: 'auto',
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  suggestions: {
    gap: 12,
  },
  suggestion: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
}); 