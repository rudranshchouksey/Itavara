import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Platform, ScrollView } from 'react-native';
import { Search, MapPin, Calendar, Users, X } from 'lucide-react-native';
import { useSearchParamsSync } from '../hooks/useSearchParamsSync';

export const SearchBar = () => {
  const { params, updateParams } = useSearchParamsSync();
  const [expanded, setExpanded] = useState(false);
  
  // Local state for the search inputs
  const [destination, setDestination] = useState((Array.isArray(params.destination) ? params.destination[0] : params.destination) || '');
  const [adults, setAdults] = useState(Number(params.adults) || 0);
  const [children, setChildren] = useState(Number(params.children) || 0);
  const [pets, setPets] = useState(Number(params.pets) || 0);
  
  // Mocks for autocomplete
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const MOCK_DESTINATIONS = ['Rishikesh, India', 'Goa, India', 'Dharamshala, India', 'Bali, Indonesia'];

  // Sync back local state if URL changes externally (optional, but good practice)
  useEffect(() => {
    if (params.destination !== undefined) setDestination(Array.isArray(params.destination) ? params.destination[0] : params.destination);
    if (params.adults !== undefined) setAdults(Number(params.adults));
    if (params.children !== undefined) setChildren(Number(params.children));
    if (params.pets !== undefined) setPets(Number(params.pets));
  }, [params]);

  const handleSearch = () => {
    updateParams({
      destination,
      adults: adults > 0 ? adults : undefined,
      children: children > 0 ? children : undefined,
      pets: pets > 0 ? pets : undefined,
    });
    setExpanded(false);
  };

  const handleClear = () => {
    setDestination('');
    setAdults(0);
    setChildren(0);
    setPets(0);
    updateParams({
      destination: undefined,
      adults: undefined,
      children: undefined,
      pets: undefined,
    });
  };

  if (!expanded) {
    // Collapsed "pill" state
    return (
      <Pressable 
        onPress={() => setExpanded(true)}
        className="flex-row items-center bg-white rounded-full shadow-sm border border-gray-200 p-2 mx-4 mt-2"
        style={Platform.OS === 'web' ? { cursor: 'pointer', maxWidth: 400, marginHorizontal: 'auto' } : {}}
      >
        <View className="bg-gray-100 p-2 rounded-full">
          <Search size={20} color="#222222" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-[#222222] text-sm">
            {destination || 'Where to?'}
          </Text>
          <Text className="text-gray-500 text-xs">
            Anywhere • Any week • {adults + children > 0 ? `${adults + children} guests` : 'Add guests'}
          </Text>
        </View>
      </Pressable>
    );
  }

  // Expanded state
  return (
    <View 
      className="bg-white rounded-3xl shadow-lg border border-gray-200 p-4 mx-4 mt-2"
      style={Platform.OS === 'web' ? { maxWidth: 500, marginHorizontal: 'auto', zIndex: 50 } : {}}
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-[#222222]">Search</Text>
        <Pressable onPress={() => setExpanded(false)} className="p-2 bg-gray-100 rounded-full">
          <X size={20} color="#222222" />
        </Pressable>
      </View>

      {/* 1. Destination Input */}
      <View className="mb-4 bg-gray-50 p-4 rounded-2xl relative">
        <Text className="text-xs font-bold text-[#222222] mb-1">Where</Text>
        <TextInput 
          placeholder="Search destinations"
          value={destination}
          onChangeText={(text) => {
            setDestination(text);
            setShowAutocomplete(true);
          }}
          className="text-base text-[#222222] outline-none"
          // @ts-ignore - React Native Web specific
          style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}}
          onFocus={() => setShowAutocomplete(true)}
        />
        {showAutocomplete && destination.length > 0 && (
          <View className="absolute top-20 left-0 right-0 bg-white rounded-xl shadow-md border border-gray-100 z-10">
            {MOCK_DESTINATIONS.filter(d => d.toLowerCase().includes((Array.isArray(destination) ? destination[0] : destination).toLowerCase())).map((dest) => (
              <Pressable 
                key={dest} 
                className="flex-row items-center p-3 border-b border-gray-50"
                onPress={() => {
                  setDestination(dest);
                  setShowAutocomplete(false);
                }}
              >
                <MapPin size={20} color="#666" />
                <Text className="ml-2 text-[#222222]">{dest}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* 2. Date Range Mock */}
      <View className="mb-4 bg-gray-50 p-4 rounded-2xl flex-row justify-between">
        <View>
          <Text className="text-xs font-bold text-[#222222] mb-1">Check in</Text>
          <Text className="text-base text-gray-500">Add dates</Text>
        </View>
        <View className="w-[1px] bg-gray-300" />
        <View>
          <Text className="text-xs font-bold text-[#222222] mb-1">Check out</Text>
          <Text className="text-base text-gray-500">Add dates</Text>
        </View>
      </View>

      {/* 3. Guests */}
      <View className="mb-6 bg-gray-50 p-4 rounded-2xl">
        <Text className="text-xs font-bold text-[#222222] mb-3">Who</Text>
        
        {/* Adults */}
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="font-semibold text-[#222222]">Adults</Text>
            <Text className="text-gray-500 text-sm">Ages 13 or above</Text>
          </View>
          <View className="flex-row items-center gap-4">
            <Pressable onPress={() => setAdults(Math.max(0, adults - 1))} className="w-8 h-8 rounded-full border border-gray-300 items-center justify-center">
              <Text className="text-gray-500 text-lg leading-none">-</Text>
            </Pressable>
            <Text className="w-4 text-center">{adults}</Text>
            <Pressable onPress={() => setAdults(adults + 1)} className="w-8 h-8 rounded-full border border-gray-300 items-center justify-center">
              <Text className="text-gray-500 text-lg leading-none">+</Text>
            </Pressable>
          </View>
        </View>

        {/* Children */}
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="font-semibold text-[#222222]">Children</Text>
            <Text className="text-gray-500 text-sm">Ages 2-12</Text>
          </View>
          <View className="flex-row items-center gap-4">
            <Pressable onPress={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full border border-gray-300 items-center justify-center">
              <Text className="text-gray-500 text-lg leading-none">-</Text>
            </Pressable>
            <Text className="w-4 text-center">{children}</Text>
            <Pressable onPress={() => setChildren(children + 1)} className="w-8 h-8 rounded-full border border-gray-300 items-center justify-center">
              <Text className="text-gray-500 text-lg leading-none">+</Text>
            </Pressable>
          </View>
        </View>

        {/* Pets */}
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="font-semibold text-[#222222]">Pets</Text>
            <Text className="text-gray-500 text-sm">Bringing a service animal?</Text>
          </View>
          <View className="flex-row items-center gap-4">
            <Pressable onPress={() => setPets(Math.max(0, pets - 1))} className="w-8 h-8 rounded-full border border-gray-300 items-center justify-center">
              <Text className="text-gray-500 text-lg leading-none">-</Text>
            </Pressable>
            <Text className="w-4 text-center">{pets}</Text>
            <Pressable onPress={() => setPets(pets + 1)} className="w-8 h-8 rounded-full border border-gray-300 items-center justify-center">
              <Text className="text-gray-500 text-lg leading-none">+</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <Pressable onPress={handleClear} className="px-4 py-2">
          <Text className="text-[#222222] font-semibold underline">Clear all</Text>
        </Pressable>
        <Pressable 
          onPress={handleSearch}
          className="bg-[#FF385C] flex-row items-center px-6 py-3 rounded-lg"
        >
          <Search size={16} color="white" />
          <Text className="text-white font-bold ml-2">Search</Text>
        </Pressable>
      </View>
    </View>
  );
};
