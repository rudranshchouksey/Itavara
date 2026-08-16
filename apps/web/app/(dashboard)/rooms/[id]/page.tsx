"use client";
import React, { useState, useEffect, use } from 'react';
import { GroupChatRoom, VoiceVideoCallModal } from '@itvara/ui';
import { io, Socket } from 'socket.io-client';
import { env } from '@itvara/config';

// Replace with a real user context hook in production
const currentUserId = "mock-user-id"; 

export default function GroupRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const roomId = unwrappedParams.id;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isCallModalVisible, setIsCallModalVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Mock participants list for UI demonstration
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
    // Connect to Socket.io server
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000', {
      withCredentials: true,
      transports: ['websocket'],
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#F7F7F7]">
      {/* Sidebar / Layout wrap assumed from dashboard layout */}
      <div className="flex-1 flex flex-col h-full border-x border-gray-200">
        <GroupChatRoom
          socket={socket}
          roomId={roomId}
          roomName="Himalayan Backpackers"
          currentUserId={currentUserId}
          members={mockMembers}
          onStartCall={() => setIsCallModalVisible(true)}
        />
      </div>

      <VoiceVideoCallModal
        visible={isCallModalVisible}
        roomId={roomId}
        roomName="Himalayan Backpackers"
        currentUserId={currentUserId}
        participants={callParticipants}
        onClose={() => setIsCallModalVisible(false)}
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleVideo={() => setIsVideoOn(!isVideoOn)}
      />
    </div>
  );
}
