"use client";
import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Sparkles, ArrowRight } from 'lucide-react-native';

interface SponsoredFeedBannerProps {
  campaignId: string;
  imageUrl: string;
  title: string;
  description: string;
  advertiserName: string;
  advertiserLogo?: string;
  callToAction?: string;
  onImpression?: (campaignId: string) => void;
  onClick?: (campaignId: string) => void;
}

export const SponsoredFeedBanner = ({
  campaignId,
  imageUrl,
  title,
  description,
  advertiserName,
  advertiserLogo,
  callToAction = "Learn More",
  onImpression,
  onClick
}: SponsoredFeedBannerProps) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const impressionRecorded = useRef(false);

  useEffect(() => {
    if (!impressionRecorded.current && onImpression) {
      onImpression(campaignId);
      impressionRecorded.current = true;
    }
  }, [campaignId, onImpression]);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (onClick) {
      onClick(campaignId);
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }} className="w-full mb-6">
      <TouchableOpacity 
        activeOpacity={0.95} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        className="w-full bg-white rounded-[20px] shadow-sm border border-neutral-100 overflow-hidden"
      >
        <View className="relative w-full h-48">
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/20" />
          
          <View className="absolute top-3 left-3 flex-row items-center bg-white/90 backdrop-blur-md px-2 py-1 rounded-full">
            <Sparkles size={12} color="#FF385C" className="mr-1" />
            <Text className="text-xs font-semibold text-neutralDark">Sponsored</Text>
          </View>
        </View>

        <View className="p-4">
          <View className="flex-row items-center mb-3">
            {advertiserLogo ? (
              <Image 
                source={{ uri: advertiserLogo }} 
                className="w-6 h-6 rounded-full mr-2"
              />
            ) : (
              <View className="w-6 h-6 rounded-full bg-neutral-200 mr-2" />
            )}
            <Text className="text-sm font-medium text-neutral-600">
              {advertiserName}
            </Text>
          </View>

          <Text className="text-lg font-bold text-neutralDark mb-1">
            {title}
          </Text>
          <Text className="text-sm text-neutral-500 mb-4" numberOfLines={2}>
            {description}
          </Text>

          <View className="flex-row justify-between items-center pt-2 border-t border-neutral-100">
            <Text className="text-sm font-semibold" style={{ color: '#FF385C' }}>
              {callToAction}
            </Text>
            <ArrowRight size={16} color="#FF385C" />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
