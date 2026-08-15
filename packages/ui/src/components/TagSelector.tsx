"use client";
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Search, MapPin, X } from 'lucide-react-native';

// Mock data type matching Prisma Listing struct
export interface ListingResult {
  id: string;
  title: string;
  pricePerNight: number;
  type: string;
  locationName: string;
}

interface TagSelectorProps {
  onSelect: (listingId: string) => void;
  onClose: () => void;
  postType: 'REEL' | 'MINI_BLOG';
}

export const TagSelector: React.FC<TagSelectorProps> = ({ onSelect, onClose, postType }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ListingResult[]>([]);

  // Mock search function
  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      setIsLoading(true);
      // Simulate API call to GET /api/listings/search?q=text
      setTimeout(() => {
        setResults([
          { id: '1', title: 'Serene Ashram Retreat', pricePerNight: 20, type: 'ASHRAM', locationName: 'Rishikesh' },
          { id: '2', title: 'Mountain View Hostel', pricePerNight: 15, type: 'HOSTEL', locationName: 'Manali' },
          { id: '3', title: 'Hidden Monastery Stay', pricePerNight: 35, type: 'MONASTERY', locationName: 'Spiti Valley' },
        ]);
        setIsLoading(false);
      }, 600);
    } else {
      setResults([]);
    }
  };

  const renderItem = ({ item }: { item: ListingResult }) => (
    <TouchableOpacity 
      className="flex-row items-center p-4 border-b border-gray-100 active:bg-gray-50"
      onPress={() => onSelect(item.id)}
    >
      <View className="w-12 h-12 rounded-lg bg-gray-200 items-center justify-center mr-4">
        <MapPin color="#6B7280" size={24} />
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-gray-900">{item.title}</Text>
        <Text className="text-gray-500 text-sm">{item.locationName} • {item.type}</Text>
      </View>
      <View className="items-end">
        <Text className="font-semibold text-[#FF385C]">${item.pricePerNight}</Text>
        <Text className="text-gray-400 text-xs">per night</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white rounded-t-3xl pt-2">
      {/* Handle for bottom sheet look */}
      <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center my-2" />
      
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-gray-100">
        <Text className="text-lg font-bold text-gray-900">
          Tag a Stay
        </Text>
        <TouchableOpacity onPress={onClose} className="p-2">
          <X size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View className="p-4 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Search size={20} color="#9CA3AF" />
          <TextInput 
            className="flex-1 ml-3 text-base text-gray-900"
            placeholder="Search your stays or explore..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>
        <Text className="text-xs text-gray-500 mt-3 ml-1">
          {postType === 'REEL' 
            ? "Tags will appear dynamically in the video." 
            : "Tags will be linked to this specific paragraph."}
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF385C" />
        </View>
      ) : (
        <FlatList 
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            query.length > 2 && !isLoading ? (
              <View className="p-8 items-center">
                <Text className="text-gray-500 text-center">No stays found matching "{query}"</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};
