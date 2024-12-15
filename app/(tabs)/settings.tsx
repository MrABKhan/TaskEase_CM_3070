import { View, ScrollView } from 'react-native';
import { Text, List, Switch, Divider } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoBreaks, setAutoBreaks] = useState(false);

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
            title="Notifications"
            left={props => <List.Icon {...props} icon="bell-outline" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                color="#000"
              />
            )}
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

