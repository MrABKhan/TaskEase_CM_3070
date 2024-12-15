import React from 'react';
import { View, ScrollView } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { Switch } from '../../components/Switch';
import { Card } from '../../components/Card';
import { Collapsible } from '../../components/Collapsible';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [soundEffects, setSoundEffects] = React.useState(true);
  const [focusMode, setFocusMode] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <ScrollView className="flex-1 p-4">
        <ThemedText type="title" className="mb-6">
          Settings
        </ThemedText>

        <Card className="mb-6">
          <View className="space-y-4">
            <View className="flex-row justify-between items-center">
              <View>
                <ThemedText type="defaultSemiBold">Notifications</ThemedText>
                <ThemedText className="text-text-light/70 dark:text-text-dark/70">
                  Get reminders and updates
                </ThemedText>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
              />
            </View>

            <View className="flex-row justify-between items-center">
              <View>
                <ThemedText type="defaultSemiBold">Dark Mode</ThemedText>
                <ThemedText className="text-text-light/70 dark:text-text-dark/70">
                  Switch app appearance
                </ThemedText>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
              />
            </View>

            <View className="flex-row justify-between items-center">
              <View>
                <ThemedText type="defaultSemiBold">Sound Effects</ThemedText>
                <ThemedText className="text-text-light/70 dark:text-text-dark/70">
                  Play sounds for actions
                </ThemedText>
              </View>
              <Switch
                value={soundEffects}
                onValueChange={setSoundEffects}
              />
            </View>

            <View className="flex-row justify-between items-center">
              <View>
                <ThemedText type="defaultSemiBold">Focus Mode</ThemedText>
                <ThemedText className="text-text-light/70 dark:text-text-dark/70">
                  Block distractions
                </ThemedText>
              </View>
              <Switch
                value={focusMode}
                onValueChange={setFocusMode}
              />
            </View>
          </View>
        </Card>

        <Collapsible
          title="About"
          expanded={expanded === 'about'}
          onToggle={() => toggleSection('about')}
        >
          <ThemedText>
            TaskEase helps you stay focused and productive with smart task management
            and focus tracking features.
          </ThemedText>
        </Collapsible>

        <Collapsible
          title="Help & Support"
          expanded={expanded === 'help'}
          onToggle={() => toggleSection('help')}
        >
          <ThemedText>
            Need help? Contact us at support@taskease.com or visit our help center
            for more information.
          </ThemedText>
        </Collapsible>

        <ThemedText className="text-center text-text-light/50 dark:text-text-dark/50 mt-6">
          Version 1.0.0
        </ThemedText>
      </ScrollView>
    </View>
  );
}

