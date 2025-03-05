import { View, ScrollView, Alert, Linking } from 'react-native';
import { Text, List, Switch, Divider } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG, initializeConfig } from '../services/smartContext';

export default function SettingsScreen() {
  const [configInitialized, setConfigInitialized] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      await initializeConfig();
      setConfigInitialized(true);
    };
    loadConfig();
  }, []);

  if (!configInitialized) {
    return null; // or a loading indicator
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <Text style={styles.userName}>Alex Johnson</Text>
          <Text style={styles.userEmail}>alex.johnson@example.com</Text>
        </View>

        <Divider />

        {/* General Settings */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>General</List.Subheader>
          <List.Item
            title="Enable OpenAI"
            description="Use AI for smarter context generation"
            left={props => <List.Icon {...props} icon="brain" />}
            right={() => (
              <Switch
                value={CONFIG.ENABLE_OPENAI}
                onValueChange={async (value) => {
                  await AsyncStorage.setItem('ENABLE_OPENAI', value.toString());
                  CONFIG.ENABLE_OPENAI = value;
                }}
                color="#000"
              />
            )}
          />
          <List.Item
            title="Cache Duration"
            description={`Current: ${CONFIG.CACHE_DURATION / (60 * 1000)} minutes`}
            left={props => <List.Icon {...props} icon="timer-cog-outline" />}
            onPress={() => {
              Alert.alert(
                'Cache Duration',
                'Set how long to cache smart context data',
                [
                  {
                    text: '1 minute',
                    onPress: async () => {
                      await AsyncStorage.setItem('CACHE_DURATION', (1 * 60 * 1000).toString());
                      CONFIG.CACHE_DURATION = 1 * 60 * 1000;
                    }
                  },
                  {
                    text: '5 minutes',
                    onPress: async () => {
                      await AsyncStorage.setItem('CACHE_DURATION', (5 * 60 * 1000).toString());
                      CONFIG.CACHE_DURATION = 5 * 60 * 1000;
                    }
                  },
                  {
                    text: '15 minutes',
                    onPress: async () => {
                      await AsyncStorage.setItem('CACHE_DURATION', (15 * 60 * 1000).toString());
                      CONFIG.CACHE_DURATION = 15 * 60 * 1000;
                    }
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  }
                ]
              );
            }}
          />
        </List.Section>

        <Divider />

        {/* About Section */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>About</List.Subheader>
          <List.Item
            title="Privacy Policy"
            description="Learn how we handle your data"
            left={props => <List.Icon {...props} icon="shield-check-outline" />}
            onPress={() => Alert.alert(
              'Privacy Policy',
              'TaskEase is committed to protecting your privacy. We do not collect or store any personal data. All your settings and focus session data are stored locally on your device. We use notifications only with your permission to enhance your focus experience. No data is shared with third parties.',
              [{ text: 'OK', style: 'default' }]
            )}
          />
        </List.Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '500',
    color: '#000',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
  },
});

