"use client";
import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { MapPin, UserCheck, Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export interface InlineItineraryCardProps {
  day: number;
  description: string;
  stay?: {
    id?: string;
    title: string;
    type?: string;
    price: number;
    image?: string;
  };
  guideAvailable?: boolean;
  guidePrice?: number;
  onBookDay?: () => void;
  onBookStay?: () => void;
}

export const InlineItineraryCard: React.FC<InlineItineraryCardProps> = ({
  day,
  description,
  stay,
  guideAvailable,
  guidePrice,
  onBookDay,
  onBookStay
}) => {
  const handlePress = (callback?: () => void) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (callback) callback();
  };

  return (
    <View className="w-full bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[24px] p-5 my-6 shadow-sm">
      {/* Day Header */}
      <View className="flex-row items-center mb-3">
        <View className="bg-[#FF385C]/10 px-3 py-1.5 rounded-full flex-row items-center">
          <Calendar size={14} color="#FF385C" />
          <Text className="text-[#FF385C] font-bold text-sm ml-1.5">Day {day}</Text>
        </View>
        <Text className="text-gray-900 font-bold text-lg ml-3 flex-1" numberOfLines={2}>
          {description}
        </Text>
      </View>

      {/* Stay/Camp Preview */}
      {stay && (
        <View className="bg-gray-50 rounded-[16px] p-3 mb-4 flex-row items-center">
          {stay.image ? (
            <Image 
              source={{ uri: stay.image }} 
              className="w-16 h-16 rounded-[12px]" 
              resizeMode="cover"
            />
          ) : (
            <View className="w-16 h-16 rounded-[12px] bg-gray-200 items-center justify-center">
              <MapPin size={24} color="#9CA3AF" />
            </View>
          )}
          <View className="flex-1 ml-3">
            <Text className="text-gray-900 font-bold text-base" numberOfLines={1}>
              {stay.title}
            </Text>
            {stay.type && (
              <Text className="text-gray-500 text-xs mt-0.5">{stay.type}</Text>
            )}
            <Text className="text-gray-900 font-semibold text-sm mt-1">
              ₹{stay.price} <Text className="text-gray-500 font-normal">/ night</Text>
            </Text>
          </View>
          <TouchableOpacity 
            className="bg-white border border-gray-200 px-3 py-2 rounded-xl"
            onPress={() => handlePress(onBookStay)}
          >
            <Text className="text-gray-900 font-semibold text-sm">View</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Local Guide Badge */}
      {guideAvailable && (
        <View className="flex-row items-center bg-[#F7F7F7] px-4 py-3 rounded-[16px] mb-4">
          <View className="bg-green-100 p-2 rounded-full mr-3">
            <UserCheck size={16} color="#16A34A" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold text-sm">Local Guide Available</Text>
            {guidePrice && (
              <Text className="text-gray-500 text-xs mt-0.5">+ ₹{guidePrice} for the day</Text>
            )}
          </View>
        </View>
      )}

      {/* Primary Action */}
      <TouchableOpacity 
        className="w-full bg-[#FF385C] py-3.5 rounded-xl items-center justify-center flex-row"
        onPress={() => handlePress(onBookDay)}
      >
        <Text className="text-white font-bold text-base">Book Entire Day Plan</Text>
      </TouchableOpacity>
    </View>
  );
};
