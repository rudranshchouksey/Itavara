'use client';

import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatWindow, ChatMessage } from '@itvara/ui';

export default function MessagesPage() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Read JWT from your auth state/cookies
    const token = localStorage.getItem('access_token') || 'mock-token';

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsUrl) throw new Error('NEXT_PUBLIC_WS_URL is not defined in .env');

    const newSocket = io(wsUrl, {
      auth: { token },
      withCredentials: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full">
      {/* Sidebar for conversations list could go here */}
      <div className="w-1/3 border-r border-[#333] bg-[#121212] p-4 hidden md:block">
        <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
        <div className="text-[#999]">Select a conversation</div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1">
        <ChatWindow 
          socket={socket}
          conversationId="mock-conv-id" // Replace with dynamic ID from route or state
          currentUserId="mock-user-id" // Replace with actual logged in user
          recipientName="Travel Buddy"
          recipientIsOnline={true}
          initialMessages={[]}
        />
      </div>
    </div>
  );
}
