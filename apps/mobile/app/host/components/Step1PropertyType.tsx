import React from 'react';
import { View, Pressable } from 'react-native';
import { Typography } from '@itvara/ui';

const PROPERTY_TYPES = [
  'MONASTERY', 'ASHRAM', 'HOSTEL', 'WORK_STUDIO', 'TENT', 'MANSION', 'LOCAL_ROOM'
];

export default function Step1PropertyType({ formData, setFormData }: any) {
  return (
    <View className="gap-4">
      <Typography variant="h2" className="text-xl font-bold text-[#222222]">What type of place will guests have?</Typography>
      <View className="flex-row flex-wrap justify-between mt-2">
        {PROPERTY_TYPES.map(type => (
          <Pressable
            key={type}
            onPress={() => setFormData({ ...formData, type })}
            className={`w-[48%] p-4 rounded-xl border-2 mb-3 ${
              formData.type === type ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'
            }`}
          >
            <Typography variant="body" className="font-semibold mt-2">{type.replace('_', ' ')}</Typography>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
