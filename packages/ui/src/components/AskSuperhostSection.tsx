"use client";
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, TextInput } from 'react-native';

export interface Mentor {
  id: string;
  name: string;
  profilePhoto?: string | null;
  bio?: string | null;
  hometown?: string | null;
}

export interface AskSuperhostSectionProps {
  mentors: Mentor[];
  onRequestSession: (mentorId: string, topic: string, date: Date, notes: string) => void;
  onInstantConnect: (mentorId: string) => void;
  className?: string;
}

export const AskSuperhostSection: React.FC<AskSuperhostSectionProps> = ({
  mentors,
  onRequestSession,
  onInstantConnect,
  className
}) => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [topic, setTopic] = useState('LISTING_PREP');
  const [notes, setNotes] = useState('');
  
  // For demo, we just book it for tomorrow
  const handleBook = () => {
    if (selectedMentor) {
      const tmrw = new Date();
      tmrw.setDate(tmrw.getDate() + 1);
      onRequestSession(selectedMentor.id, topic, tmrw, notes);
      setSelectedMentor(null);
      setNotes('');
    }
  };

  return (
    <View className={`py-8 bg-white border-y border-gray-100 ${className || ''}`}>
      <View className="px-6 mb-6">
        <Text className="text-3xl font-bold text-[#222222] mb-2">Ask a Superhost</Text>
        <Text className="text-gray-500 text-base leading-6">
          Connect 1-on-1 with verified Itvara Superhosts to get expert advice on listing preparation, hospitality, and pricing.
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6">
        {mentors.map((mentor) => (
          <View key={mentor.id} className="w-72 bg-[#F7F7F7] rounded-3xl p-5 mr-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              {mentor.profilePhoto ? (
                <Image source={{ uri: mentor.profilePhoto }} className="w-16 h-16 rounded-full mr-4" />
              ) : (
                <View className="w-16 h-16 bg-gray-200 rounded-full mr-4 items-center justify-center">
                  <Text className="text-[#222222] text-xl font-bold">{mentor.name.charAt(0)}</Text>
                </View>
              )}
              <View className="flex-1">
                <Text className="text-lg font-bold text-[#222222]">{mentor.name}</Text>
                <Text className="text-xs text-[#FF385C] font-semibold mt-1">Superhost • {mentor.hometown || 'Verified'}</Text>
              </View>
            </View>

            <Text className="text-gray-600 text-sm mb-6" numberOfLines={3}>
              {mentor.bio || `Hi, I'm ${mentor.name}. I'd love to share my hosting experience with you!`}
            </Text>

            <View className="flex-row gap-2">
              <TouchableOpacity 
                onPress={() => setSelectedMentor(mentor)}
                className="flex-1 bg-[#222222] py-3 rounded-xl items-center"
              >
                <Text className="text-white font-semibold text-sm">Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => onInstantConnect(mentor.id)}
                className="flex-1 bg-[#FF385C] py-3 rounded-xl items-center"
              >
                <Text className="text-white font-semibold text-sm">Instant Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {mentors.length === 0 && (
          <View className="w-72 bg-gray-50 rounded-3xl p-6 mr-4 border border-gray-200 justify-center items-center">
            <Text className="text-gray-500 text-center">No Superhosts available at the moment.</Text>
          </View>
        )}
      </ScrollView>

      {/* Video Guides Section */}
      <View className="px-6 mt-10">
        <Text className="text-xl font-bold text-[#222222] mb-4">Watch Preparation Guides</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
          {['Photography Basics', 'Pricing Strategy', 'Welcoming Guests'].map((title, idx) => (
            <TouchableOpacity key={idx} className="mr-4 w-48 relative">
              <View className="w-48 h-32 bg-gray-200 rounded-2xl overflow-hidden items-center justify-center">
                <View className="w-10 h-10 bg-white/80 rounded-full items-center justify-center pl-1">
                  <Text className="text-[#FF385C] text-lg">▶</Text>
                </View>
              </View>
              <Text className="font-semibold text-[#222222] mt-2">{title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Booking Modal */}
      <Modal visible={!!selectedMentor} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl h-[70%] p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-[#222222]">Request Session</Text>
              <TouchableOpacity onPress={() => setSelectedMentor(null)} className="p-2 bg-gray-100 rounded-full">
                <Text className="text-gray-600">✕</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 mb-6">
              You are requesting a 1-on-1 mentorship session with <Text className="font-bold">{selectedMentor?.name}</Text>.
            </Text>

            <Text className="text-sm font-bold text-[#222222] mb-2">Topic</Text>
            <View className="flex-row flex-wrap mb-6">
              {[
                { id: 'LISTING_PREP', label: 'Listing Prep' },
                { id: 'PRICING_STRATEGY', label: 'Pricing Strategy' },
                { id: 'HOSPITALITY_TIPS', label: 'Hospitality Tips' }
              ].map(t => (
                <TouchableOpacity 
                  key={t.id}
                  onPress={() => setTopic(t.id)}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 border ${topic === t.id ? 'bg-[#FF385C] border-[#FF385C]' : 'bg-white border-gray-300'}`}
                >
                  <Text className={topic === t.id ? 'text-white font-semibold' : 'text-gray-600'}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-sm font-bold text-[#222222] mb-2">What do you want to learn? (Optional)</Text>
            <TextInput
              className="bg-gray-100 rounded-xl p-4 text-[#222222] h-24 mb-6"
              placeholder="E.g. I need help staging my photos."
              placeholderTextColor="#888"
              multiline
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />

            <View className="flex-1 justify-end pb-4">
              <TouchableOpacity 
                onPress={handleBook}
                className="bg-[#FF385C] py-4 rounded-xl items-center"
              >
                <Text className="text-white font-bold text-lg">Send Request</Text>
              </TouchableOpacity>
              <Text className="text-center text-xs text-gray-500 mt-3">
                The mentor will receive a calendar invite automatically.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
