import { View, StyleSheet } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';

export default function SmartInputScreen() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleVoiceInput = () => {
    setIsListening(true);
    // TODO: Implement voice recognition
    setTimeout(() => {
      setTranscript("I'll help you create a task. What would you like to add?");
      setIsListening(false);
    }, 1000);
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