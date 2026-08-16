"use client";
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { GuideCard, GuideCardProps } from './GuideCard';

export interface GuideDirectoryViewProps {
  guides: Omit<GuideCardProps, 'onHirePress'>[];
  isLoading: boolean;
  onSearch: (filters: { location?: string; language?: string; specialty?: string }) => void;
  onHireGuide: (guideId: string) => void;
  className?: string;
}

export const GuideDirectoryView: React.FC<GuideDirectoryViewProps> = ({
  guides,
  isLoading,
  onSearch,
  onHireGuide,
  className,
}) => {
  const [locationQuery, setLocationQuery] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);

  const specialtiesList = ['Heritage', 'Trekking', 'Spiritual', 'Culinary', 'Wildlife'];

  const handleSearch = () => {
    onSearch({
      location: locationQuery || undefined,
      specialty: activeSpecialty || undefined,
    });
  };

  const toggleSpecialty = (specialty: string) => {
    const newSpecialty = activeSpecialty === specialty ? null : specialty;
    setActiveSpecialty(newSpecialty);
    onSearch({
      location: locationQuery || undefined,
      specialty: newSpecialty || undefined,
    });
  };

  return (
    <View className={`flex-1 bg-[#F7F7F7] ${className || ''}`}>
      {/* Search Header */}
      <View className="bg-white p-4 pt-6 border-b border-gray-200 z-10 shadow-sm">
        <Text className="text-2xl font-bold text-[#222222] mb-4">Find a Local Guide</Text>
        
        {/* Search Input */}
        <View className="flex-row mb-4">
          <TextInput
            className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-[#222222] border border-transparent focus:border-[#FF385C]"
            placeholder="Where are you traveling? (e.g. Varanasi)"
            placeholderTextColor="#888"
            value={locationQuery}
            onChangeText={setLocationQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity 
            onPress={handleSearch}
            className="ml-2 bg-[#FF385C] rounded-xl px-6 items-center justify-center"
          >
            <Text className="text-white font-bold">Search</Text>
          </TouchableOpacity>
        </View>

        {/* Specialties Filter Bar */}
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
            {specialtiesList.map((spec) => {
              const isActive = activeSpecialty === spec;
              return (
                <TouchableOpacity
                  key={spec}
                  onPress={() => toggleSpecialty(spec)}
                  className={`mr-2 px-4 py-2 rounded-full border ${
                    isActive ? 'bg-[#FF385C] border-[#FF385C]' : 'bg-white border-gray-300'
                  }`}
                >
                  <Text className={`font-medium ${isActive ? 'text-white' : 'text-gray-600'}`}>
                    {spec}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Results Area */}
      <ScrollView className="flex-1 p-4">
        {isLoading ? (
          <View className="py-10 items-center justify-center">
            <ActivityIndicator size="large" color="#FF385C" />
            <Text className="text-gray-500 mt-4 font-medium">Finding the best local experts...</Text>
          </View>
        ) : guides.length === 0 ? (
          <View className="py-10 items-center justify-center bg-white rounded-2xl border border-gray-100">
            <Text className="text-gray-500 text-lg mb-2">No guides found</Text>
            <Text className="text-gray-400 text-center px-6">
              Try adjusting your search criteria to discover guides in other areas or specialties.
            </Text>
          </View>
        ) : (
          <View className="pb-10">
            <Text className="text-gray-600 font-semibold mb-4 ml-1">
              {guides.length} {guides.length === 1 ? 'Guide' : 'Guides'} Available
            </Text>
            {guides.map((guide) => (
              <GuideCard
                key={guide.id}
                {...guide}
                onHirePress={onHireGuide}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};
