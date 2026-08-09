import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'verified' | 'superhost' | 'category' | 'default';
  className?: string;
}

export const Badge = ({ text, variant = 'default', className = '' }: BadgeProps) => {
  const variants = {
    verified: 'bg-green-100 border-green-200',
    superhost: 'bg-yellow-100 border-yellow-200',
    category: 'bg-neutralLight border-neutral-200',
    default: 'bg-neutral-100 border-neutral-200',
  };

  const textColors = {
    verified: 'text-green-800',
    superhost: 'text-yellow-800',
    category: 'text-neutralDark',
    default: 'text-neutral-600',
  };

  return (
    <View className={`rounded-pill border px-3 py-1 items-center justify-center self-start ${variants[variant]} ${className}`}>
      <Text className={`text-xs font-semibold ${textColors[variant]}`}>
        {text}
      </Text>
    </View>
  );
};
