import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { SearchBar, Typography } from '@itvara/ui';

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white pt-8">
      <View className="flex-1">
        <SearchBar />
        <View className="flex-1 items-center justify-center">
          <Typography variant="h2" className="text-gray-500">Explore listings will appear here</Typography>
        </View>
      </View>
    </SafeAreaView>
  );
}
