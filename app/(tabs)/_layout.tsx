import { Tabs } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <Tabs screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#666',
        headerShadowVisible: false,
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarLabel: 'Calendar',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar-month-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="focus"
          options={{
            title: 'Focus',
            tabBarLabel: 'Focus',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="timer-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
