import React from 'react';
import { View, ViewProps, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import Icon from 'react-native-vector-icons/Feather';

interface CollapsibleProps extends ViewProps {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function Collapsible({ 
  title, 
  children, 
  expanded = false, 
  onToggle,
  style,
  className,
  ...props 
}: CollapsibleProps) {
  return (
    <View className={`mb-4 ${className || ''}`} style={style} {...props}>
      <TouchableOpacity 
        onPress={onToggle}
        className="flex-row items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-t-xl"
      >
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <Icon 
          name={expanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          className="text-text-light dark:text-text-dark" 
        />
      </TouchableOpacity>
      {expanded && (
        <View className="p-4 bg-card-light dark:bg-card-dark rounded-b-xl border-t border-gray-200 dark:border-gray-700">
          {children}
        </View>
      )}
    </View>
  );
}
