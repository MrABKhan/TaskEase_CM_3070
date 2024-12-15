import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'bg-primary',
  outline: 'border border-primary bg-transparent',
  ghost: 'bg-transparent',
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
};

const textStyles = {
  default: 'text-white dark:text-white',
  outline: 'text-primary',
  ghost: 'text-primary',
};

export function Button({ 
  title, 
  icon, 
  iconPosition = 'left',
  variant = 'default',
  size = 'md',
  style,
  className,
  ...props 
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const textStyle = textStyles[variant];

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center rounded-lg mt-2.5 ${variantStyle} ${sizeStyle} ${className || ''}`}
      style={style}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <Icon name={icon} size={20} className="mr-2.5 text-current" />
      )}
      <Text className={`font-bold ${textStyle}`}>
        {title}
      </Text>
      {icon && iconPosition === 'right' && (
        <Icon name={icon} size={20} className="ml-2.5 text-current" />
      )}
    </TouchableOpacity>
  );
}

