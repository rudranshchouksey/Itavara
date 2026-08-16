"use client";
import React, { useState, useMemo } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';

export type RentalCategory = 'VEHICLE_CAB' | 'VEHICLE_BIKE' | 'CULTURAL_ATTIRE';

export interface RentalItem {
  id: string;
  category: RentalCategory;
  title: string;
  description: string;
  pricePerDay: number;
  imageUrls: string[];
  sizesAvailable: string[];
}

export interface RentalSelectorWidgetProps {
  visible: boolean;
  locality: string;
  items: RentalItem[];
  isLoading: boolean;
  onClose: () => void;
  onBook: (itemId: string, selectedSize: string | null, days: number, totalPrice: number) => void;
  className?: string;
}

export const RentalSelectorWidget: React.FC<RentalSelectorWidgetProps> = ({
  visible,
  locality,
  items,
  isLoading,
  onClose,
  onBook,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<'VEHICLES' | 'ATTIRE'>('VEHICLES');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [durationDays, setDurationDays] = useState<number>(1);

  const filteredItems = useMemo(() => {
    if (activeTab === 'VEHICLES') {
      return items.filter(i => i.category === 'VEHICLE_CAB' || i.category === 'VEHICLE_BIKE');
    }
    return items.filter(i => i.category === 'CULTURAL_ATTIRE');
  }, [items, activeTab]);

  const selectedItem = useMemo(() => items.find(i => i.id === selectedItemId), [items, selectedItemId]);

  const totalPrice = selectedItem ? selectedItem.pricePerDay * durationDays : 0;

  const handleBook = () => {
    if (selectedItem) {
      onBook(selectedItem.id, selectedSize, durationDays, totalPrice);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className={`flex-1 justify-end bg-black/50 ${className || ''}`}>
        <View className="bg-white rounded-t-3xl h-[85%] overflow-hidden shadow-xl">
          {/* Header */}
          <View className="px-6 pt-6 pb-4 border-b border-gray-100 flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-bold text-[#222222]">Local Rentals</Text>
              <Text className="text-gray-500 text-sm">Explore {locality}</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
              <Text className="text-gray-600 font-bold">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View className="flex-row border-b border-gray-200">
            <TouchableOpacity 
              className={`flex-1 py-4 items-center border-b-2 ${activeTab === 'VEHICLES' ? 'border-[#FF385C]' : 'border-transparent'}`}
              onPress={() => { setActiveTab('VEHICLES'); setSelectedItemId(null); }}
            >
              <Text className={`font-semibold ${activeTab === 'VEHICLES' ? 'text-[#FF385C]' : 'text-gray-500'}`}>Vehicles</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 py-4 items-center border-b-2 ${activeTab === 'ATTIRE' ? 'border-[#FF385C]' : 'border-transparent'}`}
              onPress={() => { setActiveTab('ATTIRE'); setSelectedItemId(null); }}
            >
              <Text className={`font-semibold ${activeTab === 'ATTIRE' ? 'text-[#FF385C]' : 'text-gray-500'}`}>Cultural Attire</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 bg-[#F7F7F7] p-4">
            {isLoading ? (
              <View className="py-10 items-center">
                <ActivityIndicator size="large" color="#FF385C" />
              </View>
            ) : filteredItems.length === 0 ? (
              <View className="py-10 items-center bg-white rounded-2xl border border-gray-100 mt-4">
                <Text className="text-gray-500">No {activeTab.toLowerCase()} found in this area.</Text>
              </View>
            ) : (
              filteredItems.map(item => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    setSelectedItemId(item.id);
                    setSelectedSize(null);
                  }}
                  className={`bg-white rounded-2xl p-4 mb-4 shadow-sm border ${selectedItemId === item.id ? 'border-[#FF385C]' : 'border-transparent'}`}
                >
                  <View className="flex-row">
                    <View className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden mr-4">
                      {item.imageUrls?.[0] && (
                        <Image source={{ uri: item.imageUrls[0] }} className="w-full h-full" />
                      )}
                    </View>
                    <View className="flex-1 justify-between">
                      <View>
                        <Text className="text-lg font-bold text-[#222222]">{item.title}</Text>
                        <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>{item.description}</Text>
                      </View>
                      <Text className="text-sm font-semibold text-[#FF385C] mt-2">₹{item.pricePerDay} / day</Text>
                    </View>
                  </View>

                  {/* Size selector for attire if selected */}
                  {selectedItemId === item.id && activeTab === 'ATTIRE' && item.sizesAvailable?.length > 0 && (
                    <View className="mt-4 pt-4 border-t border-gray-100">
                      <Text className="text-xs font-semibold text-gray-600 mb-2">Select Size</Text>
                      <View className="flex-row flex-wrap">
                        {item.sizesAvailable.map(size => (
                          <TouchableOpacity
                            key={size}
                            onPress={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-full mr-2 mb-2 border ${selectedSize === size ? 'bg-[#FF385C] border-[#FF385C]' : 'bg-white border-gray-300'}`}
                          >
                            <Text className={`text-xs ${selectedSize === size ? 'text-white' : 'text-[#222222]'}`}>{size}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          {/* Footer / Booking Bar */}
          {selectedItem && (
            <View className="bg-white p-4 border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-sm text-gray-500">Duration</Text>
                  <View className="flex-row items-center mt-1">
                    <TouchableOpacity 
                      onPress={() => setDurationDays(Math.max(1, durationDays - 1))}
                      className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                    >
                      <Text className="font-bold text-[#222222]">-</Text>
                    </TouchableOpacity>
                    <Text className="font-semibold mx-4 text-lg text-[#222222]">{durationDays} {durationDays === 1 ? 'day' : 'days'}</Text>
                    <TouchableOpacity 
                      onPress={() => setDurationDays(durationDays + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                    >
                      <Text className="font-bold text-[#222222]">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-sm text-gray-500">Total Price</Text>
                  <Text className="text-2xl font-bold text-[#222222]">₹{totalPrice}</Text>
                </View>
              </View>

              <TouchableOpacity 
                onPress={handleBook}
                disabled={activeTab === 'ATTIRE' && !selectedSize && selectedItem.sizesAvailable?.length > 0}
                className={`py-4 rounded-xl items-center ${
                  (activeTab === 'ATTIRE' && !selectedSize && selectedItem.sizesAvailable?.length > 0) 
                    ? 'bg-gray-300' 
                    : 'bg-[#FF385C]'
                }`}
              >
                <Text className="text-white font-bold text-lg">
                  Add to Itinerary
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
