import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ThemedViewProps extends ViewProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export function ThemedView({ 
  style, 
  variant = 'primary', 
  children, 
  ...props 
}: ThemedViewProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background[variant],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

