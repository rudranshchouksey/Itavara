import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Animated, Platform } from 'react-native';
import { Heart } from 'lucide-react-native';
import { Badge } from './Badge';
import { calculateHaversineDistance, formatCurrency } from '@itvara/utils';
import * as Haptics from 'expo-haptics';

interface ListingCardProps {
  images: string[];
  title: string;
  category: string;
  pricePerNight: number;
  currencyCode?: string;
  latitude: number;
  longitude: number;
  currentLatitude?: number;
  currentLongitude?: number;
  isWishlistedInitially?: boolean;
  onWishlistToggle?: (isWishlisted: boolean) => void;
  onPress?: () => void;
}

export const ListingCard = ({
  images,
  title,
  category,
  pricePerNight,
  currencyCode = 'INR',
  latitude,
  longitude,
  currentLatitude,
  currentLongitude,
  isWishlistedInitially = false,
  onWishlistToggle,
  onPress
}: ListingCardProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(isWishlistedInitially);
  const [cardWidth, setCardWidth] = useState(0);
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    if (slideSize > 0) {
      const index = event.nativeEvent.contentOffset.x / slideSize;
      const roundIndex = Math.round(index);
      if (roundIndex !== activeImageIndex) {
        setActiveImageIndex(roundIndex);
      }
    }
  };

  const toggleWishlist = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const newState = !isWishlisted;
    setIsWishlisted(newState);
    
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (onWishlistToggle) onWishlistToggle(newState);
  };

  const distanceText = currentLatitude && currentLongitude
    ? calculateHaversineDistance(currentLatitude, currentLongitude, latitude, longitude)
    : null;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} className="w-full mb-6">
      <View 
        onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
        className="relative w-full aspect-square rounded-[16px] overflow-hidden mb-3 bg-neutral-100"
      >
        {cardWidth > 0 && (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className="w-full h-full"
          >
            {images.map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: img }}
                style={{ width: cardWidth, height: cardWidth }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        <TouchableOpacity
          onPress={toggleWishlist}
          className="absolute top-3 right-3 p-2 z-10"
        >
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <Heart
              size={24}
              color={isWishlisted ? '#FF385C' : 'white'}
              fill={isWishlisted ? '#FF385C' : 'rgba(0,0,0,0.3)'}
            />
          </Animated.View>
        </TouchableOpacity>

        {images.length > 1 && (
          <View className="absolute bottom-3 w-full flex-row justify-center items-center gap-1.5">
            {images.map((_, idx) => (
              <View
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeImageIndex === idx ? 'w-1.5 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </View>
        )}
      </View>

      <View className="flex-row justify-between items-start mt-1 px-1">
        <View className="flex-1">
          <Text className="text-base font-semibold text-neutralDark" numberOfLines={1}>
            {title}
          </Text>
          <View className="flex-row items-center mt-1.5 gap-2 flex-wrap">
            <Badge text={category} variant="category" />
            {distanceText && (
              <Text className="text-sm text-neutral-500">
                {distanceText}
              </Text>
            )}
          </View>
          <View className="flex-row items-center mt-2">
            <Text className="text-base font-semibold text-neutralDark">
              {formatCurrency(pricePerNight, currencyCode)}
            </Text>
            <Text className="text-base text-neutral-600"> / night</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
