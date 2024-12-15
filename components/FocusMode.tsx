import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ViewProps } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemedText } from './ThemedText';
import { Progress } from './Progress';

interface FocusModeProps extends ViewProps {
  className?: string;
}

export function FocusMode({ style, className, ...props }: FocusModeProps) {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleToggle = () => {
    setIsActive(!isActive);
    // Add timer logic here
  };

  return (
    <View className={`p-4 ${className || ''}`} style={style} {...props}>
      <View className="bg-card-light dark:bg-card-dark rounded-xl p-6">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <ThemedText type="title" className="mb-1">Focus Mode</ThemedText>
            <ThemedText className="text-text-light/70 dark:text-text-dark/70">
              {isActive ? 'Currently focusing' : 'Start focusing'}
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={handleToggle}
            className={`w-12 h-12 rounded-full items-center justify-center
              ${isActive ? 'bg-red-500' : 'bg-primary'}`}
          >
            <Icon 
              name={isActive ? 'stop-circle' : 'play'} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <View className="flex-row justify-between mb-2">
            <ThemedText>Progress</ThemedText>
            <ThemedText>{progress}%</ThemedText>
          </View>
          <Progress value={progress} />
        </View>

        <View className="flex-row justify-between">
          <View className="items-center">
            <ThemedText type="defaultSemiBold">25:00</ThemedText>
            <Text className="text-text-light/70 dark:text-text-dark/70 text-sm">Duration</Text>
          </View>
          <View className="items-center">
            <ThemedText type="defaultSemiBold">3</ThemedText>
            <Text className="text-text-light/70 dark:text-text-dark/70 text-sm">Sessions</Text>
          </View>
          <View className="items-center">
            <ThemedText type="defaultSemiBold">5:00</ThemedText>
            <Text className="text-text-light/70 dark:text-text-dark/70 text-sm">Break</Text>
          </View>
        </View>
      </View>
    </View>
  );
} 