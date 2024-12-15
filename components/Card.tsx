import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, style, className, ...props }: CardProps) {
  return (
    <View
      className={`bg-card-light dark:bg-card-dark rounded-xl p-4 ${className || ''}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}

