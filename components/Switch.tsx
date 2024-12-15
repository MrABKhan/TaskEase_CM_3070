import React from 'react';
import { Pressable, View, ViewProps } from 'react-native';

interface SwitchProps extends ViewProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  className?: string;
}

export function Switch({ value, onValueChange, style, className, ...props }: SwitchProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      className={`w-14 h-8 rounded-full ${value ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'} ${className || ''}`}
      style={style}
      {...props}
    >
      <View
        className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-all duration-200 
          ${value ? 'translate-x-7' : 'translate-x-1'}`}
        style={{ marginTop: 4 }}
      />
    </Pressable>
  );
}

