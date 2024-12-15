import React from 'react';
import { View, Text, ViewProps } from 'react-native';

interface BadgeProps extends ViewProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const variantStyles = {
  default: 'bg-gray-100 dark:bg-gray-800',
  success: 'bg-green-100 dark:bg-green-800/30',
  warning: 'bg-yellow-100 dark:bg-yellow-800/30',
  error: 'bg-red-100 dark:bg-red-800/30',
};

const textStyles = {
  default: 'text-gray-800 dark:text-gray-200',
  success: 'text-green-800 dark:text-green-200',
  warning: 'text-yellow-800 dark:text-yellow-200',
  error: 'text-red-800 dark:text-red-200',
};

export function Badge({ text, variant = 'default', className, style, ...props }: BadgeProps) {
  return (
    <View
      className={`px-2 py-1 rounded-md ${variantStyles[variant]} ${className || ''}`}
      style={style}
      {...props}
    >
      <Text className={`text-xs font-medium ${textStyles[variant]}`}>
        {text}
      </Text>
    </View>
  );
}

