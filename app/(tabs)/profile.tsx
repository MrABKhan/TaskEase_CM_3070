import { View, ScrollView } from 'react-native';
import { Text, Avatar, List, Button, Surface } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header} elevation={1}>
        <Avatar.Text size={80} label="JD" />
        <Text variant="headlineSmall" style={styles.name}>John Doe</Text>
        <Text variant="bodyMedium">john.doe@example.com</Text>
      </Surface>

      <Surface style={styles.statsCard} elevation={1}>
        <View style={styles.statItem}>
          <Text variant="titleLarge">156</Text>
          <Text variant="bodyMedium">Tasks</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="titleLarge">23</Text>
          <Text variant="bodyMedium">Streaks</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="titleLarge">89%</Text>
          <Text variant="bodyMedium">Complete</Text>
        </View>
      </Surface>

      <List.Section>
        <List.Subheader>Settings</List.Subheader>
        <List.Item
          title="Account Settings"
          left={props => <List.Icon {...props} icon="account-cog" />}
        />
        <List.Item
          title="Notifications"
          left={props => <List.Icon {...props} icon="bell" />}
        />
        <List.Item
          title="Privacy"
          left={props => <List.Icon {...props} icon="shield-account" />}
        />
        <List.Item
          title="Help & Support"
          left={props => <List.Icon {...props} icon="help-circle" />}
        />
      </List.Section>

      <Button 
        mode="outlined" 
        style={styles.logoutButton}
        icon="logout"
      >
        Log Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  name: {
    marginTop: 8,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    margin: 16,
    borderRadius: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  logoutButton: {
    margin: 16,
  },
}); 