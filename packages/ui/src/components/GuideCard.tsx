import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export interface GuideCardProps {
  id: string;
  name: string;
  profilePhoto?: string | null;
  rating: number;
  experienceYears: number;
  dailyRate: number;
  languages: string[];
  specialties: string[];
  isVerified: boolean;
  onHirePress: (id: string) => void;
}

export const GuideCard: React.FC<GuideCardProps> = ({
  id,
  name,
  profilePhoto,
  rating,
  experienceYears,
  dailyRate,
  languages,
  specialties,
  isVerified,
  onHirePress,
}) => {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex-row">
      {/* Photo & Verified Badge */}
      <View className="relative mr-4">
        {profilePhoto ? (
          <Image source={{ uri: profilePhoto }} className="w-20 h-20 rounded-full" />
        ) : (
          <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center">
            <Text className="text-gray-500 text-xl">{name.charAt(0)}</Text>
          </View>
        )}
        {isVerified && (
          <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-6 h-6 border-2 border-white items-center justify-center">
            <Text className="text-white text-xs font-bold">✓</Text>
          </View>
        )}
      </View>

      {/* Details Area */}
      <View className="flex-1 justify-between">
        <View>
          <View className="flex-row justify-between items-start mb-1">
            <Text className="text-lg font-bold text-[#222222] truncate pr-2 flex-1">{name}</Text>
            <View className="flex-row items-center">
              <Text className="text-yellow-500 mr-1">★</Text>
              <Text className="text-sm font-semibold text-[#222222]">{rating.toFixed(1)}</Text>
            </View>
          </View>
          
          <Text className="text-xs text-gray-500 mb-2">
            {experienceYears} years exp. • {specialties.slice(0, 2).join(', ')}
          </Text>

          {/* Languages Badges */}
          <View className="flex-row flex-wrap mb-2">
            {languages.slice(0, 3).map((lang, idx) => (
              <View key={idx} className="bg-gray-100 rounded-full px-2 py-1 mr-1 mb-1">
                <Text className="text-[10px] text-gray-600">{lang}</Text>
              </View>
            ))}
            {languages.length > 3 && (
              <View className="bg-gray-100 rounded-full px-2 py-1 mr-1 mb-1">
                <Text className="text-[10px] text-gray-600">+{languages.length - 3}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Pricing & CTA */}
        <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-gray-100">
          <View>
            <Text className="text-lg font-bold text-[#222222]">₹{dailyRate}</Text>
            <Text className="text-[10px] text-gray-500">/ day</Text>
          </View>
          <TouchableOpacity 
            onPress={() => onHirePress(id)}
            className="bg-[#FF385C] py-2 px-4 rounded-xl"
          >
            <Text className="text-white font-semibold text-sm">Hire Guide</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
