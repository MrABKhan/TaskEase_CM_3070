import { ScrollView } from 'react-native';
import { List, Switch, Text, Surface, Divider } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Settings ⚙️</Text>
      
      <Surface style={styles.surface} elevation={1}>
        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => <Switch value={darkMode} onValueChange={setDarkMode} />}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Notifications</List.Subheader>
          <List.Item
            title="Push Notifications"
            description="Receive task reminders"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => <Switch value={notifications} onValueChange={setNotifications} />}
          />
          <List.Item
            title="Sound Effects"
            description="Play sounds for actions"
            left={props => <List.Icon {...props} icon="volume-high" />}
            right={() => <Switch value={soundEffects} onValueChange={setSoundEffects} />}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="file-document" />}
          />
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="shield-account" />}
          />
        </List.Section>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginVertical: 20,
    textAlign: 'center',
  },
  surface: {
    margin: 16,
    borderRadius: 10,
  },
});

