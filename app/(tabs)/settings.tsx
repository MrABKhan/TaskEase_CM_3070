import { View, ScrollView, Alert, Linking } from 'react-native';
import { Text, List, Switch, Divider, Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG, initializeConfig } from '../services/smartContext';
import { useRouter } from 'expo-router';
import auth from '../services/auth';
import { EventRegister } from 'react-native-event-listeners';

export default function SettingsScreen() {
  const [configInitialized, setConfigInitialized] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [enableOpenAI, setEnableOpenAI] = useState(false);
  const [cacheDuration, setCacheDuration] = useState(CONFIG.CACHE_DURATION);
  const router = useRouter();

  useEffect(() => {
    const loadConfig = async () => {
      await initializeConfig();
      setEnableOpenAI(CONFIG.ENABLE_OPENAI);
      setCacheDuration(CONFIG.CACHE_DURATION);
      setConfigInitialized(true);
    };
    loadConfig();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await auth.getUser();
      if (userData) {
        setUser({
          name: userData.name,
          email: userData.email,
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleOpenAIToggle = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('ENABLE_OPENAI', value.toString());
      CONFIG.ENABLE_OPENAI = value;
      setEnableOpenAI(value);
      EventRegister.emit('smartContextSettingsChanged', { type: 'openai', value });
    } catch (error) {
      console.error('Error updating OpenAI setting:', error);
    }
  };

  const handleCacheDurationChange = async (duration: number) => {
    try {
      await AsyncStorage.setItem('CACHE_DURATION', duration.toString());
      CONFIG.CACHE_DURATION = duration;
      setCacheDuration(duration);
      EventRegister.emit('smartContextSettingsChanged', { type: 'cacheDuration', value: duration });
    } catch (error) {
      console.error('Error updating cache duration:', error);
    }
  };

  if (!configInitialized) {
    return null; // or a loading indicator
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user?.name?.[0] || 'U'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
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
                value={enableOpenAI}
                onValueChange={handleOpenAIToggle}
                color="#000"
              />
            )}
          />
          <List.Item
            title="Cache Duration"
            description={`Current: ${cacheDuration / (60 * 1000)} minutes`}
            left={props => <List.Icon {...props} icon="timer-cog-outline" />}
            onPress={() => {
              Alert.alert(
                'Cache Duration',
                'Set how long to cache smart context data',
                [
                  {
                    text: '1 minute',
                    onPress: () => handleCacheDurationChange(1 * 60 * 1000)
                  },
                  {
                    text: '5 minutes',
                    onPress: () => handleCacheDurationChange(5 * 60 * 1000)
                  },
                  {
                    text: '15 minutes',
                    onPress: () => handleCacheDurationChange(15 * 60 * 1000)
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
            title="Reseed Sample Data"
            description="Generate new sample tasks"
            left={props => <List.Icon {...props} icon="refresh" />}
            onPress={() => {
              Alert.alert(
                'Reseed Sample Data',
                'This will generate new sample tasks. Your existing tasks will be preserved. Do you want to continue?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  },
                  {
                    text: 'Reseed',
                    onPress: async () => {
                      try {
                        await auth.reseedData();
                        Alert.alert('Success', 'Sample tasks have been regenerated successfully.');
                      } catch (error) {
                        console.error('Error reseeding data:', error);
                        Alert.alert('Error', 'Failed to regenerate sample tasks. Please try again.');
                      }
                    }
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

        {/* Account Section */}
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Account</List.Subheader>
          <Button
            mode="outlined"
            onPress={handleSignOut}
            style={styles.signOutButton}
            textColor="#FF3B30"
          >
            Sign Out
          </Button>
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
  signOutButton: {
    marginHorizontal: 16,
    marginTop: 8,
    borderColor: '#FF3B30',
  },
});

