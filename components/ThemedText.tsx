import React from 'react';
import { Text, TextProps } from 'react-native';

interface ThemedTextProps extends TextProps {
  type?: 'title' | 'subtitle' | 'default' | 'defaultSemiBold' | 'small';
  className?: string;
}

const textStyles = {
  title: 'text-2xl font-bold text-text-light dark:text-text-dark',
  subtitle: 'text-xl font-semibold text-text-light dark:text-text-dark',
  default: 'text-base text-text-light dark:text-text-dark',
  defaultSemiBold: 'text-base font-semibold text-text-light dark:text-text-dark',
  small: 'text-sm text-text-light dark:text-text-dark',
};

export function ThemedText({ type = 'default', style, className, children, ...props }: ThemedTextProps) {
  return (
    <Text
      className={`${textStyles[type]} ${className || ''}`}
      style={style}
      {...props}
    >
      {children}
    </Text>
  );
}
