import React from 'react';
import { View, ViewProps } from 'react-native';

interface ProgressProps extends ViewProps {
  value: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const variantStyles = {
  default: 'bg-primary',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

export function Progress({ 
  value, 
  variant = 'default',
  style,
  className,
  ...props 
}: ProgressProps) {
  const width = Math.min(Math.max(value, 0), 100);
  
  return (
    <View 
      className={`h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className || ''}`}
      style={style}
      {...props}
    >
      <View
        className={`h-full ${variantStyles[variant]}`}
        style={{ width: `${width}%` }}
      />
    </View>
  );
}

