import React from 'react';
import { View, ScrollView } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { XPBar } from '../../components/XPBar';
import { StreakCounter } from '../../components/StreakCounter';
import { TaskRecommendations } from '../../components/TaskRecommendations';

const mockTasks = [
  {
    id: '1',
    title: 'Review quarterly report',
    category: 'Work',
    duration: 45,
    priority: 'high' as const,
  },
  {
    id: '2',
    title: 'Daily exercise routine',
    category: 'Health',
    duration: 30,
    priority: 'medium' as const,
  },
  {
    id: '3',
    title: 'Read book chapter',
    category: 'Personal',
    duration: 20,
    priority: 'low' as const,
  },
];

export default function TabOneScreen() {
  const handleTaskSelect = (task: any) => {
    console.log('Selected task:', task);
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <ScrollView className="flex-1 p-4">
        <ThemedText type="title" className="mb-6">
          Dashboard
        </ThemedText>

        <XPBar
          currentXP={450}
          maxXP={1000}
          level={5}
          className="mb-4"
        />

        <StreakCounter
          count={7}
          className="mb-6"
        />

        <TaskRecommendations
          tasks={mockTasks}
          onSelectTask={handleTaskSelect}
        />
      </ScrollView>
    </View>
  );
}

