import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Pressable, Alert, Image } from 'react-native';
import { Avatar, Button, Typography, Modal, TextInput } from '@itvara/ui';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Jane Doe',
    bio: 'Avid traveler and digital nomad. I love exploring off-the-beaten-path destinations.',
    hometown: 'Seattle, WA',
    joinDate: 'Joined Aug 2024',
    profilePhoto: null,
  });
  const [posts, setPosts] = useState<any[]>([]);

  const MOCK_BADGES = ['VERIFIED_TRAVELER'];

  useEffect(() => {
    // Replace with real local IP if testing on physical device
    fetch('http://localhost:4000/api/users/profile/posts')
      .then(res => res.json())
      .then(data => {
        if (data.data) setPosts(data.data);
      })
      .catch(console.error);
  }, []);

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

        {/* Timeline Posts */}
        <View className="bg-white p-5 rounded-2xl shadow-sm mb-4">
          <Typography variant="h2" className="text-lg font-semibold mb-3 text-[#222222]">
            Timeline
          </Typography>
          {posts.length === 0 ? (
            <Typography variant="body" className="text-gray-500">No posts yet.</Typography>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {posts.map((post) => {
                const isCoAuthored = post.userId !== 'current_user_id_placeholder' && post.travelBuddyTags?.some((t: any) => t.status === 'ACCEPTED');
                
                return (
                  <Pressable 
                    key={post.id} 
                    className="w-[48%] mb-4 bg-gray-50 rounded-xl overflow-hidden border border-gray-100"
                    onPress={() => router.push(`/blog/${post.id}`)}
                  >
                    {post.mediaUrls?.[0] ? (
                      <View className="w-full h-32 bg-gray-200 relative">
                        <Image source={{ uri: post.mediaUrls[0] }} className="w-full h-full" resizeMode="cover" />
                        {isCoAuthored && (
                          <View className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-md">
                            <Text className="text-white text-[10px] font-semibold">Co-Authored</Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View className="w-full h-32 bg-gray-200 flex items-center justify-center relative">
                        <Typography variant="body" className="text-gray-400 text-xs">No Image</Typography>
                        {isCoAuthored && (
                          <View className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-md">
                            <Text className="text-white text-[10px] font-semibold">Co-Authored</Text>
                          </View>
                        )}
                      </View>
                    )}
                    <View className="p-3">
                      <Text className="font-semibold text-[#222222] text-sm" numberOfLines={1}>
                        {post.title || 'Untitled Trip'}
                      </Text>
                      <Text className="text-gray-500 text-xs mt-1">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
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
