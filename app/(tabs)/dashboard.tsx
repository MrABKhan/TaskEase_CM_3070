import React from 'react';
import { ScrollView } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { TaskRecommendations } from '../../components/TaskRecommendations';

export default function Dashboard() {
  return (
    <ThemedView className="flex-1 p-4">
      <ScrollView>
        <TaskRecommendations />
      </ScrollView>
    </ThemedView>
  );
} 