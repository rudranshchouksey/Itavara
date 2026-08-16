"use client";
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Socket } from 'socket.io-client';

export interface GroupMessage {
  id: string;
  senderId: string;
  content: string;
  mediaUrl?: string | null;
  createdAt: Date | string;
  sender: {
    id: string;
    name: string;
    profilePhoto: string | null;
  };
}

export interface GroupRoomMember {
  id: string;
  name: string;
  profilePhoto: string | null;
  isOnline?: boolean;
}

export interface GroupChatRoomProps {
  socket: Socket | null;
  roomId: string;
  roomName: string;
  currentUserId: string;
  members?: GroupRoomMember[];
  initialMessages?: GroupMessage[];
  onStartCall?: () => void;
}

export const GroupChatRoom: React.FC<GroupChatRoomProps> = ({
  socket,
  roomId,
  roomName,
  currentUserId,
  members = [],
  initialMessages = [],
  onStartCall,
}) => {
  const [messages, setMessages] = useState<GroupMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join_group_room', { roomId });

    const handleNewMessage = (message: GroupMessage) => {
      setMessages((prev) => [...prev, message]);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    };

    socket.on('new_group_message', handleNewMessage);

    return () => {
      socket.off('new_group_message', handleNewMessage);
    };
  }, [socket, roomId]);

  const sendMessage = () => {
    if (!inputText.trim() || !socket) return;

    socket.emit('send_group_message', {
      roomId,
      content: inputText.trim(),
    });

    setInputText('');
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 bg-[#F7F7F7]">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
          <View>
            <Text className="text-lg font-bold text-[#222222]">{roomName}</Text>
            <Text className="text-xs text-gray-500">{members.length} members</Text>
          </View>
          <TouchableOpacity 
            onPress={onStartCall}
            className="p-2 bg-[#FF385C] rounded-full"
          >
            <Text className="text-white text-xs font-bold px-2">Video Call</Text>
          </TouchableOpacity>
        </View>

        {/* Member Avatars (Horizontal Scroll) */}
        <View className="bg-white px-4 py-2 border-b border-gray-100">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {members.map(member => (
              <View key={member.id} className="items-center mr-4">
                <View className="relative">
                  {member.profilePhoto ? (
                    <Image source={{ uri: member.profilePhoto }} className="w-10 h-10 rounded-full" />
                  ) : (
                    <View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center">
                      <Text className="text-white text-xs">{member.name.charAt(0)}</Text>
                    </View>
                  )}
                  {member.isOnline && (
                    <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </View>
                <Text className="text-[10px] text-gray-500 mt-1 truncate max-w-[40px]">{member.name.split(' ')[0]}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Messages List */}
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 p-4"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId;
            const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== msg.senderId);

            return (
              <View 
                key={msg.id} 
                className={`flex-row mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <View className="w-8 mr-2">
                    {showAvatar && (
                      <Image 
                        source={{ uri: msg.sender.profilePhoto || 'https://via.placeholder.com/150' }} 
                        className="w-8 h-8 rounded-full" 
                      />
                    )}
                  </View>
                )}
                <View className={`max-w-[75%] rounded-2xl p-3 shadow-sm ${
                  isMe ? 'bg-[#FF385C] rounded-br-sm' : 'bg-white rounded-bl-sm border border-gray-100'
                }`}>
                  {!isMe && showAvatar && (
                    <Text className="text-xs text-gray-500 mb-1 font-medium">{msg.sender.name}</Text>
                  )}
                  <Text className={`text-sm ${isMe ? 'text-white' : 'text-[#222222]'}`}>
                    {msg.content}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Input Area */}
        <View className="flex-row items-center p-3 bg-white border-t border-gray-200">
          <TextInput
            className="flex-1 bg-[#F7F7F7] rounded-full px-4 py-2 mr-2 text-[#222222]"
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            onPress={sendMessage}
            className="bg-[#FF385C] w-10 h-10 rounded-full items-center justify-center shadow-sm"
          >
            <Text className="text-white font-bold">→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
