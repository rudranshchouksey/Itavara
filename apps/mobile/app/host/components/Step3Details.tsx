import React from 'react';
import { View, Pressable, Switch } from 'react-native';
import { Typography, TextInput } from '@itvara/ui';

export default function Step3Details({ formData, setFormData }: any) {
  const increment = (field: string) => setFormData({ ...formData, [field]: formData[field] + 1 });
  const decrement = (field: string) => setFormData({ ...formData, [field]: Math.max(1, formData[field] - 1) });

  const AMENITIES = ['Wifi', 'Kitchen', 'Free parking', 'Washer'];

  const toggleAmenity = (amenity: string) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({ ...formData, amenities: formData.amenities.filter((a: string) => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
    }
  };

  return (
    <View className="gap-6">
      <Typography variant="h2" className="text-xl font-bold text-[#222222]">Share some basics about your place</Typography>
      
      <View className="flex-row justify-between items-center border-b border-gray-100 pb-4">
        <Typography variant="h2" className="text-lg text-[#222222]">Max Guests</Typography>
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => decrement('maxGuests')} className="w-8 h-8 rounded-full border border-gray-400 items-center justify-center"><Typography variant="body">-</Typography></Pressable>
          <Typography variant="body" className="w-4 text-center">{formData.maxGuests}</Typography>
          <Pressable onPress={() => increment('maxGuests')} className="w-8 h-8 rounded-full border border-gray-400 items-center justify-center"><Typography variant="body">+</Typography></Pressable>
        </View>
      </View>

      <View className="flex-row justify-between items-center border-b border-gray-100 pb-4">
        <Typography variant="h2" className="text-lg text-[#222222]">Beds</Typography>
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => decrement('bedCount')} className="w-8 h-8 rounded-full border border-gray-400 items-center justify-center"><Typography variant="body">-</Typography></Pressable>
          <Typography variant="body" className="w-4 text-center">{formData.bedCount}</Typography>
          <Pressable onPress={() => increment('bedCount')} className="w-8 h-8 rounded-full border border-gray-400 items-center justify-center"><Typography variant="body">+</Typography></Pressable>
        </View>
      </View>

      <View className="border-b border-gray-100 pb-4">
        <Typography variant="h2" className="text-lg text-[#222222] mb-2">Base Price per night (INR)</Typography>
        <TextInput 
          value={formData.pricePerNight.toString()}
          onChangeText={(val) => setFormData({ ...formData, pricePerNight: parseInt(val) || 0 })}
          keyboardType="numeric"
        />
      </View>

      <View className="gap-2">
        <Typography variant="h2" className="text-lg text-[#222222]">Amenities</Typography>
        <View className="flex-row flex-wrap justify-between">
          {AMENITIES.map(amenity => (
            <Pressable 
              key={amenity} 
              onPress={() => toggleAmenity(amenity)}
              className="w-[48%] flex-row items-center justify-between p-3 border border-gray-200 rounded-lg mb-3 bg-white"
            >
              <Typography variant="body" className="text-[#222222]">{amenity}</Typography>
              <Switch 
                value={formData.amenities.includes(amenity)} 
                onValueChange={() => toggleAmenity(amenity)}
                trackColor={{ false: "#d1d5db", true: "#FF385C" }}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
