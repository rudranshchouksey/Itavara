"use client";
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MapPin, UserCheck } from 'lucide-react-native';
// If using Expo, BlurView can be used for true glassmorphism. Using standard Views with opacity as fallback.
// import { BlurView } from 'expo-blur';

export type BookableType = 'STAY' | 'GUIDE';

export interface BookablePillProps {
  id: string;
  title: string;
  price: number;
  type: BookableType;
  onPress?: (id: string, type: BookableType) => void;
}

export const BookablePill: React.FC<BookablePillProps> = ({
  id,
  title,
  price,
  type,
  onPress,
}) => {
  const Icon = type === 'STAY' ? MapPin : UserCheck;
  const ctaText = type === 'STAY' ? 'Book Stay' : 'Hire Guide';
  const priceUnit = type === 'STAY' ? 'night' : 'hr';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress && onPress(id, type)}
      style={styles.glassContainer}
      className="flex-row items-center rounded-2xl p-3 border border-white/20 mt-2 shadow-lg"
    >
      {/* Icon Container */}
      <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center mr-3">
        <Icon size={20} color="#FF385C" />
      </View>

      {/* Details */}
      <View className="flex-1 justify-center">
        <Text className="text-white text-sm font-bold shadow-sm" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-neutral-200 text-xs shadow-sm mt-0.5 font-medium">
          ₹{price} / {priceUnit}
        </Text>
      </View>

      {/* CTA Button */}
      <View className="bg-[#FF385C] px-4 py-2 rounded-full ml-2 shadow-sm items-center justify-center">
        <Text className="text-white font-bold text-xs tracking-wide uppercase">
          {ctaText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  glassContainer: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.4)' : 'rgba(20,20,20,0.7)',
    // In a real Expo app, we would wrap this in <BlurView intensity={50} tint="dark">
  },
});
