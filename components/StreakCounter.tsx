import React from 'react';
import { View, ViewProps } from 'react-native';
import { ThemedText } from './ThemedText';
import Icon from 'react-native-vector-icons/Feather';

interface StreakCounterProps extends ViewProps {
  count: number;
  className?: string;
}

export function StreakCounter({ count, style, className, ...props }: StreakCounterProps) {
  return (
    <View 
      className={`flex-row items-center bg-card-light dark:bg-card-dark rounded-xl p-4 ${className || ''}`}
      style={style}
      {...props}
    >
      <Icon 
        name="zap" 
        size={24} 
        className="text-yellow-500 mr-2" 
      />
      <View>
        <ThemedText type="defaultSemiBold">
          {count} Day Streak
        </ThemedText>
        <ThemedText className="text-text-light/70 dark:text-text-dark/70">
          Keep up the momentum!
        </ThemedText>
      </View>
    </View>
  );
} 