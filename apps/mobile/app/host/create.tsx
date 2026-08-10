import React, { useState } from 'react';
import { View, ScrollView, Alert, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';
import { Button, Typography } from '@itvara/ui';
import { useRouter } from 'expo-router';

import Step1PropertyType from './components/Step1PropertyType';
import Step2Location from './components/Step2Location';
import Step3Details from './components/Step3Details';
import Step4Addons from './components/Step4Addons';

export default function CreateListingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: 'HOSTEL',
    latitude: 28.6139,
    longitude: 77.2090,
    address: '',
    pricePerNight: 1000,
    maxGuests: 1,
    bedCount: 1,
    amenities: [],
    customOptions: {
      hasCabRental: false,
      hasLocalAttire: false,
      hasFoodCuration: false,
      hasLocalGuide: false
    }
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    try {
      // In a real app, you would use your actual API URL here (e.g. from constants or env)
      const apiUrl = Platform.OS === 'android' ? 'http://10.0.2.2:4000/api/listings/create' : 'http://localhost:4000/api/listings/create';
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `My ${formData.type} Listing`,
          description: 'A beautiful place for guests.',
          ...formData
        })
      });

      if (res.ok) {
        Alert.alert('Success', 'Listing created successfully!');
        router.push('/(tabs)/profile'); // Route back to profile or dashboard
      } else {
        Alert.alert('Error', 'Failed to create listing');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network error occurred');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
          <Typography variant="h1" className="text-2xl font-bold mb-4 text-[#222222]">
            Create a New Listing
          </Typography>
          
          {/* Progress Bar */}
          <View className="flex-row items-center mb-6">
            {[1, 2, 3, 4].map((i) => (
              <View key={i} className="flex-row items-center flex-1">
                <View className={`w-8 h-8 rounded-full items-center justify-center ${step >= i ? 'bg-[#FF385C]' : 'bg-gray-200'}`}>
                  <Typography variant="body" className={`font-bold ${step >= i ? 'text-white' : 'text-gray-600'}`}>{i.toString()}</Typography>
                </View>
                {i < 4 && <View className={`flex-1 h-1 mx-1 ${step > i ? 'bg-[#FF385C]' : 'bg-gray-200'}`} />}
              </View>
            ))}
          </View>

          <View className="flex-1">
            {step === 1 && <Step1PropertyType formData={formData} setFormData={setFormData} />}
            {step === 2 && <Step2Location formData={formData} setFormData={setFormData} />}
            {step === 3 && <Step3Details formData={formData} setFormData={setFormData} />}
            {step === 4 && <Step4Addons formData={formData} setFormData={setFormData} />}
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View className="flex-row justify-between p-4 border-t border-gray-100 bg-white">
          {step > 1 ? (
            <Button variant="outline" title="Back" onPress={prevStep} />
          ) : (
            <View /> // Spacing
          )}
          
          {step < 4 ? (
            <Button variant="primary" title="Next" onPress={nextStep} />
          ) : (
            <Button variant="primary" title="Create Listing" onPress={handleSubmit} />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
