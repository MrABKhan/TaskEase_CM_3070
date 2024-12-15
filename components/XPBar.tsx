import React from 'react';
import { View, ViewProps } from 'react-native';
import { ThemedText } from './ThemedText';

interface XPBarProps extends ViewProps {
  currentXP: number;
  maxXP: number;
  level: number;
  className?: string;
}

export function XPBar({ currentXP, maxXP, level, style, className, ...props }: XPBarProps) {
  const progress = (currentXP / maxXP) * 100;

  return (
    <View className={`bg-card-light dark:bg-card-dark rounded-xl p-4 ${className || ''}`} style={style} {...props}>
      <View className="flex-row justify-between mb-2">
        <ThemedText type="defaultSemiBold">Level {level}</ThemedText>
        <ThemedText className="text-text-light/70 dark:text-text-dark/70">
          {currentXP} / {maxXP} XP
        </ThemedText>
      </View>
      <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <View
          className="h-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
} 