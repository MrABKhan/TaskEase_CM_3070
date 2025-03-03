import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FAB } from 'react-native-paper';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/new-task')}
        color="#fff"
      />
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#666',
          headerShown: false,
          tabBarItemStyle: styles.tabBarItem,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="smart-input"
          options={{
            title: '',
            tabBarIcon: ({ focused }) => (
              <View style={styles.smartButtonWrapper}>
                <View style={[styles.smartButton, focused && styles.smartButtonFocused]}>
                  <MaterialCommunityIcons name="microphone" size={28} color="#fff" />
                  <Text style={styles.smartButtonText}>AI Task</Text>
                </View>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="chart-bar" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="focus"
          options={{
            title: 'Focus',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="timer-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="cog-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: '#000',
    zIndex: 1,
  },
  tabBar: {
    height: 65,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tabBarItem: {
    height: 65,
    paddingBottom: 0,
  },
  smartButtonWrapper: {
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  smartButton: {
    backgroundColor: '#007AFF',
    borderRadius: 40,
    width: 74,
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: -4,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  smartButtonText: {
    color: '#fff',
    fontSize: 11,
    marginTop: 0,
  },
  smartButtonFocused: {
    transform: [{ scale: 1.0 }],
  },
});
