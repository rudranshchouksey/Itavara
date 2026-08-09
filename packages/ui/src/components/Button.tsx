import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  title: string;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  title,
  className = '',
  onPress,
  ...props
}: ButtonProps) => {
  const handlePress = (e: any) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (onPress) onPress(e);
  };

  const baseStyles = 'rounded-card flex-row justify-center items-center';
  
  const variants = {
    primary: 'bg-brand',
    secondary: 'bg-neutralDark',
    outline: 'border-2 border-brand bg-transparent',
    ghost: 'bg-transparent',
  };
  
  const sizes = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  const textColors = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-brand',
    ghost: 'text-brand',
  };

  const textSizes = {
    sm: 'text-sm font-medium',
    md: 'text-base font-semibold',
    lg: 'text-lg font-bold',
  };

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${isLoading ? 'opacity-70' : ''} ${className}`}
      onPress={handlePress}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#FF385C' : '#fff'} />
      ) : (
        <Text className={`${textColors[variant]} ${textSizes[size]}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
