import React from 'react';
import { View, Switch } from 'react-native';
import { Typography } from '@itvara/ui';

export default function Step4Addons({ formData, setFormData }: any) {
  const toggleOption = (key: string) => {
    setFormData({
      ...formData,
      customOptions: {
        ...formData.customOptions,
        [key]: !formData.customOptions[key]
      }
    });
  };

  const ADDONS = [
    { key: 'hasCabRental', label: 'Cab Rentals', description: 'Offer local transportation for your guests.' },
    { key: 'hasLocalAttire', label: 'Local Cultural Attire', description: 'Provide traditional clothing during their stay.' },
    { key: 'hasFoodCuration', label: 'Food Curation', description: 'Offer curated local meals.' },
    { key: 'hasLocalGuide', label: 'Local Guide', description: 'Provide a local guide for tours.' },
  ];

  return (
    <View className="gap-6">
      <View>
        <Typography variant="h2" className="text-xl font-bold text-[#222222]">Custom Trip Addons</Typography>
        <Typography variant="body" className="text-gray-500 mt-1">
          Stand out by offering exclusive local experiences directly with your listing.
        </Typography>
      </View>

      <View className="gap-4">
        {ADDONS.map(addon => (
          <View key={addon.key} className="flex-row items-center justify-between p-4 border border-gray-200 rounded-xl bg-white">
            <View className="flex-1 pr-4">
              <Typography variant="h2" className="text-lg font-semibold text-[#222222]">{addon.label}</Typography>
              <Typography variant="body" className="text-sm text-gray-500">{addon.description}</Typography>
            </View>
            <Switch 
              value={formData.customOptions[addon.key]}
              onValueChange={() => toggleOption(addon.key)}
              trackColor={{ false: "#d1d5db", true: "#FF385C" }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
