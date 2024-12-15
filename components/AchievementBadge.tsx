import React from 'react';
import { View, Text, ViewProps } from 'react-native';

interface AchievementBadgeProps extends ViewProps {
  title: string;
  description: string;
  progress: number;
  variant?: 'bronze' | 'silver' | 'gold';
  className?: string;
}

const variantStyles = {
  bronze: 'border-[#CD7F32] bg-[#CD7F32]/10',
  silver: 'border-[#C0C0C0] bg-[#C0C0C0]/10',
  gold: 'border-[#FFD700] bg-[#FFD700]/10',
};

const progressBarColors = {
  bronze: 'bg-[#CD7F32]',
  silver: 'bg-[#C0C0C0]',
  gold: 'bg-[#FFD700]',
};

export function AchievementBadge({ 
  title, 
  description, 
  progress, 
  variant = 'bronze',
  style,
  className,
  ...props 
}: AchievementBadgeProps) {
  return (
    <View
      className={`rounded-xl p-4 border mb-2 flex-row items-center ${variantStyles[variant]} ${className || ''}`}
      style={style}
      {...props}
    >
      <View className="flex-1">
        <Text className="text-base font-semibold text-text-light dark:text-text-dark mb-1">
          {title}
        </Text>
        <Text className="text-sm text-text-light/70 dark:text-text-dark/70">
          {description}
        </Text>
        <View className="h-1 bg-black/10 rounded-sm w-full mt-2">
          <View 
            className={`h-full rounded-sm ${progressBarColors[variant]}`} 
            style={{ width: `${progress}%` }} 
          />
        </View>
      </View>
    </View>
  );
} 