import React, { useState, useMemo } from 'react';
import { View, ScrollView, Image, Dimensions, SafeAreaView, Switch } from 'react-native';
import { Typography, Avatar, Button } from '@itvara/ui';
import { useLocalSearchParams } from 'expo-router';
import { MapPin, Wifi, Car, Coffee, Shield, Star, Heart, Share } from 'lucide-react-native';
import { calculateTripQuote } from '@itvara/utils';

const { width } = Dimensions.get('window');

export default function StayDetailScreen() {
  const { id } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [nights, setNights] = useState(5);
  const [addons, setAddons] = useState({
    cabRental: false,
    culturalAttire: false,
    foodCuration: false,
    localGuide: false,
  });

  const quote = useMemo(() => calculateTripQuote({
    basePricePerNight: 2500, // listing.price
    nights,
    addons
  }), [nights, addons]);

  // Mocked data for layout
  const listing = {
    title: 'Peaceful Himalayan Monastery Retreat',
    type: 'MONASTERY',
    price: 2500,
    rating: 4.95,
    reviews: 124,
    location: 'Dharamshala, Himachal Pradesh, India',
    images: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517457210515-5e581e28f32c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1513269228966-21805b50d507?auto=format&fit=crop&q=80&w=600'
    ],
    host: {
      name: 'Lama Tenzin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
      isSuperhost: true,
      identityVerified: true,
      hostingSince: '2019'
    },
    amenities: [
      { name: 'Wifi', icon: Wifi },
      { name: 'Free parking', icon: Car },
      { name: 'Breakfast', icon: Coffee },
      { name: 'Security', icon: Shield }
    ],
    description: 'Experience true serenity in our traditional monastery. Wake up to the sounds of morning chants and breathtaking views of the Dhauladhar range.'
  };

  const onScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setCurrentImageIndex(Math.round(index));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" bounces={false} showsVerticalScrollIndicator={false}>
        
        {/* Native Image Carousel */}
        <View className="relative h-[300px]">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {listing.images.map((img, idx) => (
              <Image 
                key={idx}
                source={{ uri: img }}
                style={{ width, height: 300 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          
          {/* Top action buttons overlay */}
          <View className="absolute top-4 left-4 right-4 flex-row justify-between">
            <View className="w-10 h-10 rounded-full bg-white/70 items-center justify-center">
               <Typography variant="body" className="font-bold">{'<'}</Typography>
            </View>
            <View className="flex-row gap-2">
              <View className="w-10 h-10 rounded-full bg-white/70 items-center justify-center">
                 <Share size={20} color="#222" />
              </View>
              <View className="w-10 h-10 rounded-full bg-white/70 items-center justify-center">
                 <Heart size={20} color="#222" />
              </View>
            </View>
          </View>
          
          {/* Image Counter Overlay */}
          <View className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded-md">
            <Typography variant="caption" className="text-white font-semibold">
              {currentImageIndex + 1} / {listing.images.length}
            </Typography>
          </View>
        </View>

        <View className="px-5 py-6">
          {/* Title & Info */}
          <Typography variant="h1" className="text-2xl font-bold text-[#222222] mb-2">
            {listing.title}
          </Typography>
          
          <View className="flex-row items-center flex-wrap gap-x-2 gap-y-1 mb-6">
            <View className="flex-row items-center">
              <Star size={16} fill="#222" />
              <Typography variant="body" className="font-semibold ml-1">{listing.rating}</Typography>
            </View>
            <Typography variant="body" className="text-gray-400">•</Typography>
            <Typography variant="body" className="underline font-semibold">{listing.reviews} reviews</Typography>
            <Typography variant="body" className="text-gray-400">•</Typography>
            <Typography variant="body" className="underline font-semibold">{listing.location}</Typography>
          </View>

          {/* Host Intro Card */}
          <View className="flex-row items-center justify-between pb-6 border-b border-gray-200">
            <View className="flex-1 pr-4">
              <Typography variant="h2" className="text-lg font-bold mb-1">
                Hosted by {listing.host.name}
              </Typography>
              <Typography variant="body" className="text-gray-500">
                {listing.host.isSuperhost ? 'Superhost • ' : ''}
                {listing.host.identityVerified ? 'Identity verified • ' : ''}
                Hosting since {listing.host.hostingSince}
              </Typography>
            </View>
            <Avatar src={listing.host.avatar} size={56} alt={listing.host.name} />
          </View>

          {/* Description */}
          <View className="py-6 border-b border-gray-200">
            <Typography variant="body" className="text-[#222222] text-base leading-relaxed">
              {listing.description}
            </Typography>
          </View>

          {/* Amenities Checklist */}
          <View className="py-6 border-b border-gray-200">
            <Typography variant="h2" className="text-xl font-bold mb-4 text-[#222222]">
              What this place offers
            </Typography>
            <View className="gap-4">
              {listing.amenities.map((amenity, i) => {
                const Icon = amenity.icon;
                return (
                  <View key={i} className="flex-row items-center">
                    <Icon size={24} color="#222" strokeWidth={1.5} />
                    <Typography variant="body" className="text-lg ml-4 text-[#222222]">
                      {amenity.name}
                    </Typography>
                  </View>
                );
              })}
            </View>
            <View className="mt-6 border border-gray-900 rounded-lg p-3 items-center">
              <Typography variant="body" className="font-semibold text-[#222222]">
                Show all amenities
              </Typography>
            </View>
          </View>

          {/* Mapbox Interactive Map Placeholder */}
          <View className="py-6 mb-20">
            <Typography variant="h2" className="text-xl font-bold mb-1 text-[#222222]">
              Where you'll be
            </Typography>
            <Typography variant="body" className="text-gray-500 mb-4">
              {listing.location}
            </Typography>
            
            <View className="w-full h-[250px] bg-blue-50 rounded-xl overflow-hidden items-center justify-center">
              {/* @rnmapbox/maps Stub */}
              <View className="absolute inset-0 bg-gray-200 opacity-50" />
              <View className="items-center z-10">
                <MapPin size={40} color="#FF385C" />
                <View className="w-32 h-32 bg-[#FF385C] rounded-full opacity-30 absolute top-1/2 left-1/2 -ml-16 -mt-16" />
                <View className="bg-white px-3 py-1 mt-2 rounded-lg shadow-sm">
                  <Typography variant="body" className="text-sm font-semibold text-gray-700">Mapbox Placeholder</Typography>
                </View>
              </View>
            </View>
          </View>
          
        </View>

        {/* Custom Trip Options (Addons) */}
        <View className="px-5 py-6 mb-24 border-t border-gray-200">
          <Typography variant="h2" className="text-xl font-bold mb-4 text-[#222222]">
            Custom Trip Add-ons
          </Typography>
          
          <View className="flex-row items-center justify-between mb-4">
            <Typography variant="body" className="text-base text-gray-700">Cab / Car Rental</Typography>
            <Switch 
              value={addons.cabRental} 
              onValueChange={(val) => setAddons({...addons, cabRental: val})} 
              trackColor={{ true: '#FF385C' }}
            />
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <Typography variant="body" className="text-base text-gray-700">Local Guide</Typography>
            <Switch 
              value={addons.localGuide} 
              onValueChange={(val) => setAddons({...addons, localGuide: val})} 
              trackColor={{ true: '#FF385C' }}
            />
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <Typography variant="body" className="text-base text-gray-700">Cultural Attire</Typography>
            <Switch 
              value={addons.culturalAttire} 
              onValueChange={(val) => setAddons({...addons, culturalAttire: val})} 
              trackColor={{ true: '#FF385C' }}
            />
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <Typography variant="body" className="text-base text-gray-700">Food Curation</Typography>
            <Switch 
              value={addons.foodCuration} 
              onValueChange={(val) => setAddons({...addons, foodCuration: val})} 
              trackColor={{ true: '#FF385C' }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Footer */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-3 flex-row justify-between items-center pb-8">
        <View>
          <View className="flex-row items-baseline gap-1">
            <Typography variant="h2" className="text-lg font-bold text-[#222222]">₹{quote.grandTotal}</Typography>
            <Typography variant="body" className="text-gray-500 text-sm">total</Typography>
          </View>
          <Typography variant="caption" className="text-gray-500 underline text-xs">
            Show price breakdown
          </Typography>
        </View>
        <Button variant="primary" title="Reserve" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}
