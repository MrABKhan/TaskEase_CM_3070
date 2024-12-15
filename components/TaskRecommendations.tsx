import React from 'react';
import { View, TouchableOpacity, ViewProps } from 'react-native';
import { ThemedText } from './ThemedText';
import { Card } from './Card';
import Icon from 'react-native-vector-icons/Feather';

interface Task {
  id: string;
  title: string;
  category: string;
  duration: number;
  priority: 'high' | 'medium' | 'low';
}

interface TaskRecommendationsProps extends ViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  className?: string;
}

const priorityStyles = {
  high: 'bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-200',
  medium: 'bg-yellow-100 dark:bg-yellow-800/30 text-yellow-800 dark:text-yellow-200',
  low: 'bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-200',
};

export function TaskRecommendations({ 
  tasks, 
  onSelectTask,
  style,
  className,
  ...props 
}: TaskRecommendationsProps) {
  return (
    <View className={`${className || ''}`} style={style} {...props}>
      <ThemedText type="subtitle" className="mb-4">
        Recommended Tasks
      </ThemedText>
      {tasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          onPress={() => onSelectTask(task)}
          className="mb-3"
        >
          <Card>
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <ThemedText type="defaultSemiBold" className="mb-1">
                  {task.title}
                </ThemedText>
                <View className="flex-row items-center">
                  <Icon name="folder" size={14} className="text-text-light/50 dark:text-text-dark/50 mr-1" />
                  <ThemedText className="text-sm text-text-light/70 dark:text-text-dark/70">
                    {task.category}
                  </ThemedText>
                  <Icon name="clock" size={14} className="text-text-light/50 dark:text-text-dark/50 ml-3 mr-1" />
                  <ThemedText className="text-sm text-text-light/70 dark:text-text-dark/70">
                    {task.duration}m
                  </ThemedText>
                </View>
              </View>
              <View className={`px-2 py-1 rounded-md ${priorityStyles[task.priority]}`}>
                <ThemedText className="text-xs capitalize">
                  {task.priority}
                </ThemedText>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
} 