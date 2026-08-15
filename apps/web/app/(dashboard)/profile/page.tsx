"use client";

import React, { useState, useEffect } from 'react';
import { Avatar, Button, Typography, Modal, TextInput } from '@itvara/ui';
import Link from 'next/link';
// Mock fetch for demonstration
// import { useUserRole } from '@itvara/ui/src/hooks/useUserRole';

export default function ProfilePage() {
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
    fetch('http://localhost:4000/api/users/profile/posts')
      .then(res => res.json())
      .then(data => {
        if (data.data) setPosts(data.data);
      })
      .catch(console.error);
  }, []);

  // Handlers
  const handleSaveProfile = async () => {
    // In a real app, call PATCH /api/users/profile
    setIsEditing(false);
  };

  const handleAvatarUpload = async () => {
    // In a real app, call POST /api/upload/avatar-url, then PUT to S3
    alert('Simulating S3 pre-signed URL upload...');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm mb-8">
        <div className="flex items-center gap-6">
          <Avatar src={profileData.profilePhoto} alt={profileData.name} size={96} />
          <div>
            <Typography variant="h1" className="text-3xl font-bold text-[#222222]">
              {profileData.name}
            </Typography>
            <Typography variant="body" className="text-gray-500 mt-1">
              {profileData.hometown} • {profileData.joinDate}
            </Typography>
            <div className="flex gap-2 mt-3">
              {MOCK_BADGES.map((badge) => (
                <span key={badge} className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  {badge.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Button 
          title="Edit Profile" 
          onPress={() => setIsEditing(true)} 
          className="mt-4 md:mt-0"
          variant="outline"
        />
      </div>

      {/* Bio Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
        <Typography variant="h2" className="text-xl font-semibold mb-4 text-[#222222]">About</Typography>
        <Typography variant="body" className="text-gray-700 leading-relaxed">
          {profileData.bio}
        </Typography>
      </div>

      {/* Timeline Posts */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
        <Typography variant="h2" className="text-xl font-semibold mb-4 text-[#222222]">Timeline</Typography>
        {posts.length === 0 ? (
          <Typography variant="body" className="text-gray-500">No posts yet.</Typography>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => {
              const isCoAuthored = post.userId !== 'current_user_id_placeholder' && post.travelBuddyTags?.some((t: any) => t.status === 'ACCEPTED');
              
              return (
                <Link href={`/blog/${post.id}`} key={post.id} className="block group">
                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                    {post.mediaUrls?.[0] ? (
                      <div className="w-full h-48 bg-gray-200 relative">
                        <img src={post.mediaUrls[0]} alt="Post" className="w-full h-full object-cover" />
                        {isCoAuthored && (
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-white text-xs font-semibold">
                            Co-Authored Trip
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center relative">
                        <Typography variant="body" className="text-gray-400">No Image</Typography>
                        {isCoAuthored && (
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-white text-xs font-semibold">
                            Co-Authored Trip
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <Typography variant="body" className="font-semibold text-[#222222] truncate">{post.title || 'Untitled Trip'}</Typography>
                      <Typography variant="caption" className="text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</Typography>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Public Reviews (Mock) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <Typography variant="h2" className="text-xl font-semibold mb-4 text-[#222222]">Public Reviews</Typography>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                <Avatar size={40} alt={`Reviewer ${i}`} />
                <div>
                  <Typography variant="body" className="font-semibold text-sm">Reviewer Name</Typography>
                  <Typography variant="caption" className="text-gray-500 text-xs">Oct 2024</Typography>
                </div>
              </div>
              <Typography variant="body" className="text-gray-700 text-sm">
                "Jane was an amazing guest! Kept the place super clean and was very communicative."
              </Typography>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Drawer / Modal */}
      <Modal visible={isEditing} onClose={() => setIsEditing(false)} title="Edit Profile">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center mb-4">
            <Avatar src={profileData.profilePhoto} size={80} />
            <Button 
              title="Change Photo" 
              onPress={handleAvatarUpload} 
              variant="ghost" 
              className="ml-4"
            />
          </div>
          
          <TextInput 
            label="Name"
            value={profileData.name} 
            onChangeText={(text) => setProfileData({...profileData, name: text})} 
          />
          
          <TextInput 
            label="Hometown"
            value={profileData.hometown} 
            onChangeText={(text) => setProfileData({...profileData, hometown: text})} 
          />
          
          <TextInput 
            label="Bio"
            value={profileData.bio} 
            onChangeText={(text) => setProfileData({...profileData, bio: text})} 
            multiline
            numberOfLines={4}
          />
          
          <Button 
            title="Save Changes" 
            onPress={handleSaveProfile} 
            className="mt-4"
          />
        </div>
      </Modal>
    </div>
  );
}
