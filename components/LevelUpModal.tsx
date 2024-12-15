import React from 'react';
import { View, Modal, ViewProps } from 'react-native';
import { ThemedText } from './ThemedText';
import { Button } from './Button';
import { AchievementBadge } from './AchievementBadge';

interface LevelUpModalProps extends ViewProps {
  visible: boolean;
  onClose: () => void;
  level: number;
  achievements: Array<{
    title: string;
    description: string;
    progress: number;
    variant: 'bronze' | 'silver' | 'gold';
  }>;
  className?: string;
}

export function LevelUpModal({ 
  visible, 
  onClose, 
  level,
  achievements,
  style,
  className,
  ...props 
}: LevelUpModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View 
          className={`bg-card-light dark:bg-card-dark rounded-xl p-6 w-full max-w-md ${className || ''}`}
          style={style}
          {...props}
        >
          <ThemedText type="title" className="text-center mb-2">
            Level Up!
          </ThemedText>
          <ThemedText className="text-center text-text-light/70 dark:text-text-dark/70 mb-6">
            Congratulations! You've reached level {level}
          </ThemedText>

          <View className="mb-6">
            {achievements.map((achievement, index) => (
              <AchievementBadge
                key={index}
                {...achievement}
              />
            ))}
          </View>

          <Button
            title="Continue"
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
} 