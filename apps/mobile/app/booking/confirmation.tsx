import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Typography, Button } from '@itvara/ui';
import { useLocalSearchParams, router } from 'expo-router';
// Note: lucide-react-native used for mobile
import { CheckCircle2, MapPin, FileText } from 'lucide-react-native';

export default function BookingConfirmationScreen() {
  const { id } = useLocalSearchParams();
  const bookingId = id || 'demo-id';

  // Mocked data for layout
  const booking = {
    id: bookingId,
    listingTitle: 'Peaceful Himalayan Monastery Retreat',
    location: 'Dharamshala, Himachal Pradesh, India',
    checkIn: 'Oct 12, 2026',
    checkOut: 'Oct 17, 2026',
    totalPrice: 15400,
    hostName: 'Lama Tenzin',
    hostPhone: '+91 98765 43210'
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5 py-8" showsVerticalScrollIndicator={false}>
        
        {/* Success Header */}
        <View className="items-center mb-10 mt-6">
          <CheckCircle2 size={72} color="#22c55e" strokeWidth={1.5} className="mb-4" />
          <Typography variant="h1" className="text-3xl font-extrabold text-[#222222] text-center mb-2">
            Pack your bags!
          </Typography>
          <Typography variant="body" className="text-base text-gray-500 text-center px-4">
            Your booking is confirmed. We've sent a receipt to your email.
          </Typography>
        </View>

        {/* Booking Summary Card */}
        <View className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
          <View className="bg-gray-50 px-5 py-5 border-b border-gray-200">
            <Typography variant="h2" className="text-xl font-bold text-[#222222] mb-1">
              {booking.listingTitle}
            </Typography>
            <View className="flex-row items-center gap-1">
              <MapPin size={14} color="#6b7280" />
              <Typography variant="body" className="text-sm text-gray-500">{booking.location}</Typography>
            </View>
          </View>
          
          <View className="px-5 py-5">
            <View className="flex-row justify-between mb-6">
              <View>
                <Typography variant="caption" className="text-gray-500 font-bold mb-1">CHECK-IN</Typography>
                <Typography variant="body" className="text-base font-semibold text-[#222222]">{booking.checkIn}</Typography>
                <Typography variant="caption" className="text-gray-500">3:00 PM</Typography>
              </View>
              <View>
                <Typography variant="caption" className="text-gray-500 font-bold mb-1">CHECK-OUT</Typography>
                <Typography variant="body" className="text-base font-semibold text-[#222222]">{booking.checkOut}</Typography>
                <Typography variant="caption" className="text-gray-500">11:00 AM</Typography>
              </View>
            </View>

            <View className="border-t border-gray-100 py-5 mb-4">
              <Typography variant="h2" className="text-base font-bold mb-2 text-[#222222]">Host Contact</Typography>
              <Typography variant="body" className="text-gray-600 leading-relaxed">
                Your host, {booking.hostName}, will be waiting for you. Reach them at{' '}
                <Typography variant="body" className="text-[#FF385C] font-bold">{booking.hostPhone}</Typography>
                {' '}for directions or early check-in.
              </Typography>
            </View>

            <View className="flex-row justify-between items-center bg-gray-50 p-4 rounded-xl">
              <Typography variant="body" className="font-semibold text-gray-700">Total Paid</Typography>
              <Typography variant="h2" className="text-lg font-bold text-[#222222]">₹{booking.totalPrice}</Typography>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="gap-3 mb-10">
          <View className="bg-[#FF385C] rounded-xl flex-row justify-center items-center py-4">
            <FileText size={20} color="white" />
            <Typography variant="body" className="text-white font-bold ml-2">Download E-Receipt</Typography>
          </View>
          
          <Button 
            variant="outline" 
            title="Explore More Stays" 
            onPress={() => router.push('/')} 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
