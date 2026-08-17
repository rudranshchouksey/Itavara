"use client";
import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { BellOff, BellRing, MessageSquare, Tags, Users, ShieldAlert } from 'lucide-react-native';

export interface NotificationPreferencesProps {
  likesComments: boolean;
  followersTags: boolean;
  messagesCalls: boolean;
  marketingPromotions: boolean;
  securityAlerts: boolean;
  pauseAllUntil: Date | null;
  onUpdate: (key: string, value: any) => void;
  className?: string;
}

export const NotificationFilterSettings = ({
  likesComments,
  followersTags,
  messagesCalls,
  marketingPromotions,
  securityAlerts,
  pauseAllUntil,
  onUpdate,
  className
}: NotificationPreferencesProps) => {
  const isPaused = pauseAllUntil !== null && new Date(pauseAllUntil) > new Date();

  const handlePauseToggle = (val: boolean) => {
    if (val) {
      // Pause for 8 hours
      const unpauseDate = new Date();
      unpauseDate.setHours(unpauseDate.getHours() + 8);
      onUpdate('pauseAllUntil', unpauseDate.toISOString());
    } else {
      onUpdate('pauseAllUntil', null);
    }
  };

  return (
    <View className={`p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 ${className || ''}`}>
      
      <View className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {isPaused ? <BellOff size={24} color="#FF385C" /> : <BellRing size={24} color="#222222" />}
            <View className="ml-3">
              <Text className="text-base font-bold text-neutral-900 dark:text-white">Pause All Notifications</Text>
              <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                {isPaused ? 'Paused for 8 hours' : 'Mute everything temporarily'}
              </Text>
            </View>
          </View>
          <Switch 
            value={isPaused} 
            onValueChange={handlePauseToggle}
            trackColor={{ false: '#E5E5E5', true: '#FF385C' }}
          />
        </View>
      </View>

      <Text className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 px-1">
        Push Notification Types
      </Text>

      <View className="space-y-4 px-1">
        <SettingRow 
          icon={<HeartIcon />}
          title="Likes & Comments"
          description="When someone interacts with your posts or listings"
          value={likesComments}
          onChange={(val) => onUpdate('likesComments', val)}
          disabled={isPaused}
        />
        <SettingRow 
          icon={<Tags size={20} color="#6B7280" />}
          title="Followers & Tags"
          description="New followers, buddy tags, and mentions"
          value={followersTags}
          onChange={(val) => onUpdate('followersTags', val)}
          disabled={isPaused}
        />
        <SettingRow 
          icon={<MessageSquare size={20} color="#6B7280" />}
          title="Messages & Calls"
          description="Direct messages and group room invites"
          value={messagesCalls}
          onChange={(val) => onUpdate('messagesCalls', val)}
          disabled={isPaused}
        />
        <SettingRow 
          icon={<Users size={20} color="#6B7280" />}
          title="Marketing & Promotions"
          description="Personalized offers and Itvara news"
          value={marketingPromotions}
          onChange={(val) => onUpdate('marketingPromotions', val)}
          disabled={isPaused}
        />
        <SettingRow 
          icon={<ShieldAlert size={20} color="#EF4444" />}
          title="Security Alerts"
          description="Unrecognized logins and password changes"
          value={securityAlerts}
          onChange={(val) => onUpdate('securityAlerts', val)}
          disabled={isPaused} // Or perhaps we don't allow disabling this via Pause All
        />
      </View>
    </View>
  );
};

const HeartIcon = () => (
  <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
    {/* Simple SVG replacement since we can't easily import a custom Heart icon without Lucide sometimes failing on web/native mismatches */}
    <Text style={{ fontSize: 16 }}>❤️</Text>
  </View>
);

const SettingRow = ({ icon, title, description, value, onChange, disabled }: any) => {
  return (
    <View className={`flex-row items-center justify-between ${disabled ? 'opacity-50' : 'opacity-100'}`}>
      <View className="flex-row flex-1 mr-4">
        <View className="mt-1 mr-3 w-6 items-center">
          {icon}
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{title}</Text>
          <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 leading-tight">{description}</Text>
        </View>
      </View>
      <Switch 
        value={value} 
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: '#E5E5E5', true: '#FF385C' }}
      />
    </View>
  );
};
