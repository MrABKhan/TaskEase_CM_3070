import { Tabs } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <Tabs screenOptions={{
        headerStyle: {
          backgroundColor: MD3LightTheme.colors.primaryContainer,
        },
        headerTintColor: MD3LightTheme.colors.onPrimaryContainer,
        tabBarStyle: {
          backgroundColor: MD3LightTheme.colors.surface,
        },
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarLabel: 'Home',
            tabBarIcon: ({ size }) => (
              <Text style={{ fontSize: size }}>🏠</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="add-task"
          options={{
            title: 'Add Task',
            tabBarLabel: 'Add Task',
            tabBarIcon: ({ size }) => (
              <Text style={{ fontSize: size }}>➕</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="focus"
          options={{
            title: 'Focus',
            tabBarLabel: 'Focus',
            tabBarIcon: ({ size }) => (
              <Text style={{ fontSize: size }}>🎯</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="templates"
          options={{
            title: 'Templates',
            tabBarLabel: 'Templates',
            tabBarIcon: ({ size }) => (
              <Text style={{ fontSize: size }}>📋</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarLabel: 'Analytics',
            tabBarIcon: ({ size }) => (
              <Text style={{ fontSize: size }}>📈</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarLabel: 'Profile',
            tabBarIcon: ({ size }) => (
              <Text style={{ fontSize: size }}>👤</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarLabel: 'Settings',
            tabBarIcon: ({ size }) => (
              <Text style={{ fontSize: size }}>⚙️</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="task-detail"
          options={{
            href: null, // This hides the tab from the tab bar
            title: 'Task Detail',
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
