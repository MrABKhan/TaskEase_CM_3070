import { View, StyleSheet } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import * as SpeechRecognition from 'expo-speech-recognition';

export default function SmartInputScreen() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { granted } = await SpeechRecognition.requestPermissionsAsync();
        setHasPermission(granted);
        if (!granted) {
          setTranscript('Please grant microphone permission to use voice input.');
        }
      } catch (err) {
        console.error('Failed to get permission:', err);
        setTranscript('Error requesting microphone permission.');
      }
    })();
  }, []);

  const handleVoiceInput = async () => {
    try {
      if (!hasPermission) {
        setTranscript('Please grant microphone permission to use voice input.');
        return;
      }

      if (isListening) {
        await SpeechRecognition.stopListeningAsync();
        setIsListening(false);
        return;
      }

      setIsListening(true);
      setTranscript('');

      await SpeechRecognition.startListeningAsync({
        partialResults: true,
        onResult: (result) => {
          if (result.value && result.value.length > 0) {
            setTranscript(result.value[0]);
          }
        },
        onError: (error) => {
          console.error('Speech recognition error:', error);
          setTranscript('Sorry, I didn\'t catch that. Please try again.');
          setIsListening(false);
        },
      });
    } catch (err) {
      console.error('Voice input error:', err);
      setTranscript('An error occurred. Please try again.');
      setIsListening(false);
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
          <View style={[styles.voiceButton, isListening && styles.voiceButtonActive]}>
            <IconButton
              icon="microphone"
              size={40}
              iconColor="#fff"
              onPress={handleVoiceInput}
              style={styles.micButton}
            />
          </View>
          {isListening && (
            <View style={styles.listeningIndicator}>
              <View style={styles.wave} />
              <View style={[styles.wave, styles.wave2]} />
              <View style={[styles.wave, styles.wave3]} />
            </View>
          )}
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
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  voiceButtonActive: {
    backgroundColor: '#FF453A',
    transform: [{ scale: 1.1 }],
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
    transform: [{ scaleY: 0.6 }],
  },
  wave2: {
    height: 30,
    opacity: 0.6,
    transform: [{ scaleY: 0.9 }],
  },
  wave3: {
    height: 40,
    opacity: 0.9,
    transform: [{ scaleY: 1.2 }],
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