import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { io, Socket } from 'socket.io-client';
import { ChatWindow } from '@itvara/ui';

export default function MessageScreen() {
  const { id: conversationId } = useLocalSearchParams<{ id: string }>();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // In a real app, securely get this from SecureStore
    const token = 'mock-mobile-token';
    const API_URL = process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:4000';

    const newSocket = io(API_URL, {
      auth: { token },
      withCredentials: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ChatWindow 
          socket={socket}
          conversationId={conversationId || 'default-id'}
          currentUserId="mock-mobile-user"
          recipientName="Your Host"
          recipientIsOnline={true}
          initialMessages={[]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
  },
});
