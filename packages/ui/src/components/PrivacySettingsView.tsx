"use client";
import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Lock, AtSign, EyeOff, ShieldBan, VolumeX, X } from 'lucide-react-native';
import { TaggingPermission } from '@itvara/types';

// Assuming TaggingPermission is exported similarly to others. If not, we use strings
// export enum TaggingPermission { EVERYONE = 'EVERYONE', FOLLOWERS_ONLY = 'FOLLOWERS_ONLY', NO_ONE = 'NO_ONE' }

export interface PrivacySettingsViewProps {
  isPrivateAccount: boolean;
  allowTaggingFrom: 'EVERYONE' | 'FOLLOWERS_ONLY' | 'NO_ONE';
  hiddenKeywords: string[];
  blockedUserIds: string[];
  mutedUserIds: string[];
  onUpdateSetting: (key: string, value: any) => void;
  onUnblockUser: (userId: string) => void;
  onUnmuteUser: (userId: string) => void;
  className?: string;
}

export const PrivacySettingsView = ({
  isPrivateAccount,
  allowTaggingFrom,
  hiddenKeywords,
  blockedUserIds,
  mutedUserIds,
  onUpdateSetting,
  onUnblockUser,
  onUnmuteUser,
  className
}: PrivacySettingsViewProps) => {

  const [newKeyword, setNewKeyword] = useState('');

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !hiddenKeywords.includes(newKeyword.trim().toLowerCase())) {
      onUpdateSetting('hiddenKeywords', [...hiddenKeywords, newKeyword.trim().toLowerCase()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    onUpdateSetting('hiddenKeywords', hiddenKeywords.filter(k => k !== keyword));
  };

  return (
    <ScrollView className={`flex-1 bg-white dark:bg-neutral-900 ${className || ''}`} contentContainerStyle={{ padding: 24 }}>
      <Text className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Privacy Suite</Text>
      
      {/* Private Account */}
      <View className="mb-8 p-5 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
        <View className="flex-row items-center justify-between">
          <View className="flex-row flex-1 items-start">
            <Lock size={24} color="#FF385C" className="mt-1 mr-3" />
            <View className="flex-1 pr-4">
              <Text className="text-base font-bold text-neutral-900 dark:text-white">Private Account</Text>
              <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                When your account is private, only people you approve can see your photos, posts, and listings. Your existing followers won't be affected.
              </Text>
            </View>
          </View>
          <Switch 
            value={isPrivateAccount}
            onValueChange={(val) => onUpdateSetting('isPrivateAccount', val)}
            trackColor={{ false: '#E5E5E5', true: '#FF385C' }}
          />
        </View>
      </View>

      {/* Tagging Permissions */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <AtSign size={20} color="#222222" className="mr-2" />
          <Text className="text-lg font-semibold text-neutral-900 dark:text-white">Mentions & Tags</Text>
        </View>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Choose who can tag you in comments, posts, and stories.
        </Text>
        
        <View className="space-y-2">
          {['EVERYONE', 'FOLLOWERS_ONLY', 'NO_ONE'].map((option) => (
            <TouchableOpacity 
              key={option}
              activeOpacity={0.7}
              onPress={() => onUpdateSetting('allowTaggingFrom', option)}
              className="flex-row items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl"
            >
              <Text className="text-base font-medium text-neutral-900 dark:text-white">
                {option.replace('_', ' ')}
              </Text>
              <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${allowTaggingFrom === option ? 'border-[#FF385C]' : 'border-neutral-300 dark:border-neutral-600'}`}>
                {allowTaggingFrom === option && <View className="w-2.5 h-2.5 rounded-full bg-[#FF385C]" />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Hidden Keywords */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <EyeOff size={20} color="#222222" className="mr-2" />
          <Text className="text-lg font-semibold text-neutral-900 dark:text-white">Hidden Keywords</Text>
        </View>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Comments containing these words will be automatically filtered and replaced with ***.
        </Text>
        
        <View className="flex-row mb-4">
          <TextInput 
            value={newKeyword}
            onChangeText={setNewKeyword}
            placeholder="Add a word or phrase..."
            placeholderTextColor="#A3A3A3"
            onSubmitEditing={handleAddKeyword}
            className="flex-1 bg-neutral-50 dark:bg-neutral-800 px-4 py-3 rounded-l-xl text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700"
          />
          <TouchableOpacity 
            onPress={handleAddKeyword}
            className="bg-[#FF385C] px-6 items-center justify-center rounded-r-xl"
          >
            <Text className="text-white font-bold">Add</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap">
          {hiddenKeywords.map(keyword => (
            <View key={keyword} className="bg-neutral-100 dark:bg-neutral-800 rounded-full px-3 py-1.5 flex-row items-center mr-2 mb-2">
              <Text className="text-sm text-neutral-700 dark:text-neutral-300 mr-2">{keyword}</Text>
              <TouchableOpacity onPress={() => handleRemoveKeyword(keyword)}>
                <X size={14} color="#6B7280" />
              </TouchableOpacity>
            </View>
          ))}
          {hiddenKeywords.length === 0 && (
            <Text className="text-sm text-neutral-400 italic">No hidden keywords added yet.</Text>
          )}
        </View>
      </View>

      {/* Blocked and Muted Accounts (Simple Lists) */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl mb-3">
          <View className="flex-row items-center">
            <ShieldBan size={20} color="#EF4444" className="mr-3" />
            <Text className="text-base font-semibold text-neutral-900 dark:text-white">Blocked Accounts</Text>
          </View>
          <Text className="text-sm font-bold text-neutral-500">{blockedUserIds.length}</Text>
        </View>
        <View className="flex-row items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
          <View className="flex-row items-center">
            <VolumeX size={20} color="#F59E0B" className="mr-3" />
            <Text className="text-base font-semibold text-neutral-900 dark:text-white">Muted Accounts</Text>
          </View>
          <Text className="text-sm font-bold text-neutral-500">{mutedUserIds.length}</Text>
        </View>
      </View>

    </ScrollView>
  );
};
