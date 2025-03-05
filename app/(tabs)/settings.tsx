import { View, ScrollView, Alert } from 'react-native';
import { Text, List, Switch, Divider } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG, initializeConfig } from '../services/smartContext';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoBreaks, setAutoBreaks] = useState(false);
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
          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                color="#000"
              />
            )}
          />
          <List.Item
            title="Sound Effects"
            left={props => <List.Icon {...props} icon="volume-high" />}
            right={() => (
              <Switch
                value={soundEffects}
                onValueChange={setSoundEffects}
                color="#000"
              />
            )}
          />
        </List.Section>

        <Divider />

        {/* Focus Settings */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Focus Mode</List.Subheader>
          <List.Item
            title="Focus Duration"
            description="25 minutes"
            left={props => <List.Icon {...props} icon="timer-outline" />}
          />
          <List.Item
            title="Break Duration"
            description="5 minutes"
            left={props => <List.Icon {...props} icon="coffee-outline" />}
          />
          <List.Item
            title="Auto Start Breaks"
            left={props => <List.Icon {...props} icon="play-circle-outline" />}
            right={() => (
              <Switch
                value={autoBreaks}
                onValueChange={setAutoBreaks}
                color="#000"
              />
            )}
          />
        </List.Section>

        <Divider />

        {/* Account Settings */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Account</List.Subheader>
          <List.Item
            title="Sync Data"
            description="Last synced: Today 2:30 PM"
            left={props => <List.Icon {...props} icon="sync" />}
          />
          <List.Item
            title="Export Data"
            left={props => <List.Icon {...props} icon="export" />}
          />
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="shield-check-outline" />}
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

