import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable, Alert } from 'react-native';
import { Avatar, Button, Typography, Modal, TextInput } from '@itvara/ui';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Jane Doe',
    bio: 'Avid traveler and digital nomad. I love exploring off-the-beaten-path destinations.',
    hometown: 'Seattle, WA',
    joinDate: 'Joined Aug 2024',
    profilePhoto: null,
  });

  const MOCK_BADGES = ['VERIFIED_TRAVELER'];

  const handleSaveProfile = async () => {
    // Call PATCH /api/users/profile
    setIsEditing(false);
  };

  const handleAvatarUpload = async () => {
    // Call POST /api/upload/avatar-url
    Alert.alert('Upload Triggered', 'Simulating S3 pre-signed URL upload...');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
      <View className="p-4">
        {/* Header Section */}
        <View className="bg-white p-5 rounded-2xl shadow-sm mb-4">
          <View className="flex-row items-center mb-4">
            <Avatar src={profileData.profilePhoto} alt={profileData.name} size={80} />
            <View className="ml-4 flex-1">
              <Typography variant="h2" className="text-2xl font-bold text-[#222222]">
                {profileData.name}
              </Typography>
              <Typography variant="body" className="text-gray-500 mt-1 text-sm">
                {profileData.hometown} • {profileData.joinDate}
              </Typography>
            </View>
          </View>
          
          <View className="flex-row flex-wrap gap-2 mb-4">
            {MOCK_BADGES.map((badge) => (
              <View key={badge} className="px-3 py-1 bg-green-100 rounded-full">
                <Text className="text-green-800 text-xs font-semibold">
                  {badge.replace('_', ' ')}
                </Text>
              </View>
            ))}
          </View>
          
          <Button 
            title="Edit Profile" 
            onPress={() => setIsEditing(true)} 
            variant="outline"
          />
        </View>

        {/* Bio Section */}
        <View className="bg-white p-5 rounded-2xl shadow-sm mb-4">
          <Typography variant="h2" className="text-lg font-semibold mb-3 text-[#222222]">
            About
          </Typography>
          <Typography variant="body" className="text-gray-700 leading-6">
            {profileData.bio}
          </Typography>
        </View>

        {/* Timeline Photos (Mock) */}
        <View className="bg-white p-5 rounded-2xl shadow-sm mb-4">
          <Typography variant="h2" className="text-lg font-semibold mb-3 text-[#222222]">
            Timeline Photos
          </Typography>
          <View className="flex-row flex-wrap justify-between">
            {[1, 2, 3, 4].map((i) => (
              <View key={i} className="w-[48%] aspect-square bg-gray-200 rounded-lg mb-2" />
            ))}
          </View>
        </View>

        {/* Public Reviews (Mock) */}
        <View className="bg-white p-5 rounded-2xl shadow-sm mb-8">
          <Typography variant="h2" className="text-lg font-semibold mb-3 text-[#222222]">
            Public Reviews
          </Typography>
          {[1, 2].map((i) => (
            <View key={i} className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0">
              <View className="flex-row items-center mb-2">
                <Avatar size={36} alt={`Reviewer ${i}`} />
                <View className="ml-3">
                  <Typography variant="body" className="font-semibold text-sm">Reviewer Name</Typography>
                  <Typography variant="caption" className="text-gray-500 text-xs">Oct 2024</Typography>
                </View>
              </View>
              <Typography variant="body" className="text-gray-700 text-sm">
                "Jane was an amazing guest! Kept the place super clean and was very communicative."
              </Typography>
            </View>
          ))}
        </View>
      </View>

      {/* Edit Profile Drawer / Modal */}
      <Modal visible={isEditing} onClose={() => setIsEditing(false)} title="Edit Profile">
        <View className="flex-col gap-4">
          <View className="items-center mb-4">
            <Avatar src={profileData.profilePhoto} size={80} />
            <Pressable onPress={handleAvatarUpload} className="mt-2">
              <Text className="text-[#FF385C] font-semibold">Change Photo</Text>
            </Pressable>
          </View>
          
          <View className="mb-3">
            <Typography variant="body" className="mb-1 font-semibold text-sm">Name</Typography>
            <TextInput 
              value={profileData.name} 
              onChangeText={(text) => setProfileData({...profileData, name: text})} 
            />
          </View>
          
          <View className="mb-3">
            <Typography variant="body" className="mb-1 font-semibold text-sm">Hometown</Typography>
            <TextInput 
              value={profileData.hometown} 
              onChangeText={(text) => setProfileData({...profileData, hometown: text})} 
            />
          </View>
          
          <View className="mb-4">
            <Typography variant="body" className="mb-1 font-semibold text-sm">Bio</Typography>
            <TextInput 
              value={profileData.bio} 
              onChangeText={(text) => setProfileData({...profileData, bio: text})} 
              multiline
              numberOfLines={4}
            />
          </View>
          
          <Button 
            title="Save Changes" 
            onPress={handleSaveProfile} 
          />
        </View>
      </Modal>
    </ScrollView>
  );
}
