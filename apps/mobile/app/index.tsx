import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView, Platform } from 'react-native';
import { SearchBar, Typography, ListingCard } from '@itvara/ui';
import { useLocalSearchParams } from 'expo-router';

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const hasSearchParams = params && (params.destination || params.adults);
  const [flexibleListings, setFlexibleListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasSearchParams) {
      fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/listings/flexible?vibe=spiritual`)
        .then(res => res.json())
        .then(data => {
          setFlexibleListings(data.listings || []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [hasSearchParams]);

  return (
    <SafeAreaView className="flex-1 bg-white pt-8">
      <View className="flex-1">
        <SearchBar />
        
        <ScrollView className="flex-1 px-4 mt-6" contentContainerStyle={{ paddingBottom: 100 }}>
          {hasSearchParams ? (
            <View className="flex-1 items-center justify-center mt-20">
              <Typography variant="h2" className="text-gray-500 text-center">
                Search results for {params.destination} will appear here.
              </Typography>
            </View>
          ) : (
            <View>
              <View className="mb-6">
                <Typography variant="h1" className="text-2xl font-bold text-[#222222]">I'm Flexible!</Typography>
                <Typography variant="body" className="text-gray-500 mt-1">Discover unique spiritual and nature retreats curated just for you.</Typography>
              </View>
              
              {loading ? (
                <Typography variant="body" className="text-gray-500">Curating stays...</Typography>
              ) : flexibleListings.length > 0 ? (
                flexibleListings.map(listing => (
                  <View key={listing.id} className="mb-6">
                    <ListingCard
                      listing={{
                        id: listing.id,
                        title: listing.title,
                        price: Number(listing.pricePerNight),
                        rating: 4.8,
                        imageUrls: ['https://via.placeholder.com/400x300?text=Retreat'],
                        isSuperhost: true,
                        amenities: listing.type
                      }}
                      onPress={() => console.log('Navigate to listing', listing.id)}
                    />
                  </View>
                ))
              ) : (
                <Typography variant="body" className="text-gray-500">No flexible stays found right now. Check back later!</Typography>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
