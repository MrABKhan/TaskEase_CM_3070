import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

export function Input({ 
  label, 
  error, 
  style, 
  className,
  ...props 
}: InputProps) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-text-light dark:text-text-dark mb-1">
          {label}
        </Text>
      )}
      <TextInput
        className={`bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 
          rounded-lg px-4 py-2 text-text-light dark:text-text-dark ${error ? 'border-red-500' : ''} ${className || ''}`}
        style={style}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text className="text-sm text-red-500 mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}

