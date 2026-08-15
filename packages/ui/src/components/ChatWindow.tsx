import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Socket } from 'socket.io-client';

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  mediaUrl?: string | null;
  isRead: boolean;
  createdAt: Date | string;
}

export interface ChatWindowProps {
  socket: Socket | null;
  conversationId: string;
  currentUserId: string;
  recipientName: string;
  recipientIsOnline?: boolean;
  initialMessages?: ChatMessage[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  socket,
  conversationId,
  currentUserId,
  recipientName,
  recipientIsOnline = false,
  initialMessages = []
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recipientTyping, setRecipientTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join_conversation', { conversationId });

    socket.on('new_message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
      // If we're receiving a message, send a read receipt
      if (message.senderId !== currentUserId) {
        socket.emit('message_read_receipt', { messageId: message.id, conversationId });
      }
    });

    socket.on('typing_indicator', ({ userId, isTyping: typingStatus }) => {
      if (userId !== currentUserId) {
        setRecipientTyping(typingStatus);
      }
    });

    socket.on('read_receipt', ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg))
      );
    });

    return () => {
      socket.off('new_message');
      socket.off('typing_indicator');
      socket.off('read_receipt');
    };
  }, [socket, conversationId, currentUserId]);

  const handleSend = () => {
    if (!inputText.trim() && !socket) return;

    socket?.emit('send_message', {
      conversationId,
      content: inputText.trim(),
      mediaUrl: null, // Hook up real media picker later
    });

    setInputText('');
    handleTyping(false);
  };

  const handleTyping = (typing: boolean) => {
    if (isTyping !== typing) {
      setIsTyping(typing);
      socket?.emit('typing_indicator', { conversationId, isTyping: typing });
    }
  };

  const onChangeText = (text: string) => {
    setInputText(text);
    handleTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => handleTyping(false), 2000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{recipientName}</Text>
          {recipientIsOnline && <View style={styles.onlineDot} />}
        </View>
      </View>

      {/* Message List */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <View key={msg.id} style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
              {msg.mediaUrl && (
                <Image source={{ uri: msg.mediaUrl }} style={styles.messageImage} />
              )}
              <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
                {msg.content}
              </Text>
              {isMe && msg.isRead && <Text style={styles.readReceipt}>Read</Text>}
            </View>
          );
        })}
        {recipientTyping && (
          <View style={styles.typingIndicatorContainer}>
            <Text style={styles.typingIndicatorText}>Typing...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Text style={styles.attachButtonText}>+</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={onChangeText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={!inputText.trim()}>
          <Text style={[styles.sendButtonText, !inputText.trim() && styles.sendButtonDisabled]}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1C1C1E',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginRight: 8,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34C759',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF385C',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2C2C2E',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFF',
  },
  theirMessageText: {
    color: '#E5E5E5',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  readReceipt: {
    fontSize: 10,
    color: '#FFF',
    opacity: 0.7,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingIndicatorContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  typingIndicatorText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
  },
  attachButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  attachButtonText: {
    color: '#FF385C',
    fontSize: 24,
    fontWeight: '300',
  },
  input: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    color: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 15,
  },
  sendButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
  },
  sendButtonText: {
    color: '#FF385C',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButtonDisabled: {
    color: '#666',
  },
});
