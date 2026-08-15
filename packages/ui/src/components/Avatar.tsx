"use client";
import React from 'react';
import { Image, View, Text } from 'react-native';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 48, className = '' }: AvatarProps) {
  const containerStyle = { width: size, height: size, borderRadius: size / 2 };

  if (!src) {
    // Fallback initials
    const initials = alt ? alt.substring(0, 2).toUpperCase() : 'U';
    
    return (
      <View 
        style={containerStyle} 
        className={`bg-gray-200 items-center justify-center overflow-hidden ${className}`}
      >
        <Text className="text-gray-500 font-semibold" style={{ fontSize: size * 0.4 }}>
          {initials}
        </Text>
      </View>
    );
  }

  return (
    <View style={containerStyle} className={`overflow-hidden bg-gray-100 ${className}`}>
      <Image 
        source={{ uri: src }} 
        style={{ width: '100%', height: '100%' }} 
        resizeMode="cover"
        accessibilityLabel={alt}
      />
    </View>
  );
}
