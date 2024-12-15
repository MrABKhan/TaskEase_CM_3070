import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { XPBar } from '../../components/XPBar';
import { StreakCounter } from '../../components/StreakCounter';
import { AchievementBadge } from '../../components/AchievementBadge';

export default function Profile() {
  const achievements = [
    {
      title: "Task Master",
      description: "Complete 100 tasks",
      type: "gold" as const,
      progress: 85,
    },
    {
      title: "Early Bird",
      description: "Complete 5 tasks before 9 AM",
      type: "silver" as const,
      progress: 60,
    },
    {
      title: "Focus Champion",
      description: "Complete 10 focus sessions",
      type: "bronze" as const,
      progress: 30,
    },
  ];

  return (
    <ThemedView>
      <ScrollView style={styles.container}>
        <XPBar currentXP={750} requiredXP={1000} level={5} />
        <StreakCounter currentStreak={7} bestStreak={15} />
        {achievements.map((achievement, index) => (
          <AchievementBadge key={index} {...achievement} />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
}); 