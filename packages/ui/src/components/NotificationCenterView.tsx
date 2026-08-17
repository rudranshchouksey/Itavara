"use client";
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Heart, MessageSquare, Tag, AtSign, Users, Bell, CheckCircle2 } from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';

export interface NotificationItem {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'TAG' | 'MENTION' | 'ROOM_INVITE' | 'SYSTEM';
  actorName?: string;
  actorProfilePhoto?: string;
  content: string; // The text describing the action
  isRead: boolean;
  createdAt: Date;
}

interface NotificationCenterViewProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const NotificationCenterView = ({
  notifications,
  onMarkAsRead,
  onLoadMore,
  hasMore,
  isLoading = false,
  className
}: NotificationCenterViewProps) => {
  return (
    <ScrollView 
      className={`flex-1 bg-white dark:bg-neutral-900 ${className || ''}`}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {notifications.length === 0 ? (
        <View className="p-8 items-center justify-center flex-1">
          <Bell size={48} color="#D4D4D4" />
          <Text className="text-neutral-500 dark:text-neutral-400 text-lg mt-4 font-medium">
            You're all caught up!
          </Text>
        </View>
      ) : (
        <View className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {notifications.map(notif => (
            <NotificationRow 
              key={notif.id} 
              notification={notif} 
              onMarkAsRead={onMarkAsRead} 
            />
          ))}
        </View>
      )}

      {hasMore && (
        <TouchableOpacity 
          onPress={onLoadMore}
          className="p-4 items-center"
        >
          <Text className="text-[#FF385C] font-semibold text-sm">Load More</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const NotificationRow = ({ notification, onMarkAsRead }: { notification: NotificationItem, onMarkAsRead: (id: string) => void }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'LIKE': return <Heart size={20} color="#FF385C" fill="#FF385C" />;
      case 'COMMENT': return <MessageSquare size={20} color="#3B82F6" />;
      case 'TAG': return <Tag size={20} color="#10B981" />;
      case 'MENTION': return <AtSign size={20} color="#8B5CF6" />;
      case 'ROOM_INVITE': return <Users size={20} color="#F59E0B" />;
      default: return <Bell size={20} color="#6B7280" />;
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => onMarkAsRead(notification.id)}
      className={`p-4 flex-row items-start ${notification.isRead ? 'bg-transparent' : 'bg-[#FF385C]/5 dark:bg-[#FF385C]/10'}`}
    >
      <View className="mr-3 mt-1 relative">
        <View className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
          {notification.actorProfilePhoto ? (
            <img src={notification.actorProfilePhoto} alt="actor" className="w-full h-full object-cover" />
          ) : (
            getIcon()
          )}
        </View>
        {!notification.isRead && (
          <View className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-neutral-900 bg-[#FF385C]" />
        )}
      </View>

      <View className="flex-1 mr-2">
        <Text className="text-neutral-900 dark:text-neutral-100 text-sm leading-5">
          {notification.actorName && (
            <Text className="font-bold">{notification.actorName} </Text>
          )}
          {notification.content}
        </Text>
        <Text className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </Text>
      </View>

      {!notification.isRead && (
        <TouchableOpacity onPress={() => onMarkAsRead(notification.id)}>
          <CheckCircle2 size={20} color="#D4D4D4" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};
