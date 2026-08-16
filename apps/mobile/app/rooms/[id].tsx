import React, { useState, useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { GroupChatRoom, VoiceVideoCallModal } from '@itvara/ui';
import { io, Socket } from 'socket.io-client';

const currentUserId = "mock-user-id"; 

export default function MobileGroupRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isCallModalVisible, setIsCallModalVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const mockMembers = [
    { id: currentUserId, name: 'You', profilePhoto: null, isOnline: true },
    { id: 'user-2', name: 'Alice Smith', profilePhoto: null, isOnline: true },
    { id: 'user-3', name: 'Bob Jones', profilePhoto: null, isOnline: false },
  ];

  const callParticipants = mockMembers.map(m => ({
    id: m.id,
    name: m.name,
    isMuted: false,
    isVideoOn: true,
    profilePhoto: m.profilePhoto
  }));

  useEffect(() => {
    // Replace URL with process.env.EXPO_PUBLIC_WS_URL
    const newSocket = io(process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:4000', {
      withCredentials: true,
      transports: ['websocket'],
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#F7F7F7]">
      <View className="flex-1">
        <GroupChatRoom
          socket={socket}
          roomId={id!}
          roomName="Himalayan Backpackers"
          currentUserId={currentUserId}
          members={mockMembers}
          onStartCall={() => setIsCallModalVisible(true)}
        />
      </View>

      <VoiceVideoCallModal
        visible={isCallModalVisible}
        roomId={id!}
        roomName="Himalayan Backpackers"
        currentUserId={currentUserId}
        participants={callParticipants}
        onClose={() => setIsCallModalVisible(false)}
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleVideo={() => setIsVideoOn(!isVideoOn)}
        onFlipCamera={() => console.log('Flip camera')}
      />
    </SafeAreaView>
  );
}
