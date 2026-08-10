import React from 'react';
import { Text, TextProps } from 'react-native';

export interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  className?: string;
  children: React.ReactNode;
}

export const Typography = ({
  variant = 'body',
  className = '',
  children,
  ...props
}: TypographyProps) => {
  const variants = {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-bold',
    h3: 'text-xl font-bold',
    body: 'text-base',
    caption: 'text-sm',
  };

  return (
    <Text 
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Text>
  );
};
