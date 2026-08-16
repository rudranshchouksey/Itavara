import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal as RNModal, Platform, Image } from 'react-native';

export interface VoiceVideoCallModalProps {
  visible: boolean;
  roomId: string;
  roomName: string;
  isAudioOnly?: boolean;
  participants: Array<{ id: string; name: string; isMuted: boolean; isVideoOn: boolean; profilePhoto?: string | null }>;
  onClose: () => void;
  onToggleMute: () => void;
  onToggleVideo?: () => void;
  onFlipCamera?: () => void;
  currentUserId: string;
}

export const VoiceVideoCallModal: React.FC<VoiceVideoCallModalProps> = ({
  visible,
  roomId,
  roomName,
  isAudioOnly = false,
  participants,
  onClose,
  onToggleMute,
  onToggleVideo,
  onFlipCamera,
  currentUserId,
}) => {
  const me = participants.find(p => p.id === currentUserId);
  const others = participants.filter(p => p.id !== currentUserId);

  return (
    <RNModal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-[#222222]">
        {/* Header */}
        <View className="pt-12 pb-4 px-4 flex-row justify-between items-center bg-black/30 z-10">
          <Text className="text-white text-lg font-bold">{roomName}</Text>
          <Text className="text-white/80 text-sm">{isAudioOnly ? 'Audio Call' : 'Video Call'}</Text>
        </View>

        {/* Video Grid Area */}
        <View className="flex-1 flex-row flex-wrap justify-center items-center p-2">
          {participants.length === 0 ? (
            <Text className="text-white">Connecting...</Text>
          ) : (
            participants.map((p, index) => {
              // Determine grid sizing
              const isGrid = participants.length > 2;
              const widthClass = isGrid ? 'w-1/2' : 'w-full';
              const heightClass = isGrid ? 'h-1/2' : (participants.length === 2 ? 'h-1/2' : 'h-full');

              return (
                <View key={p.id} className={`${widthClass} ${heightClass} p-1 relative`}>
                  <View className="flex-1 bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 items-center justify-center">
                    {!p.isVideoOn || isAudioOnly ? (
                      // Audio-only or Video-off state
                      <View className="items-center justify-center">
                        {p.profilePhoto ? (
                          <Image source={{ uri: p.profilePhoto }} className="w-24 h-24 rounded-full mb-4" />
                        ) : (
                          <View className="w-24 h-24 bg-gray-600 rounded-full items-center justify-center mb-4">
                            <Text className="text-white text-3xl font-bold">{p.name.charAt(0)}</Text>
                          </View>
                        )}
                        <Text className="text-white text-lg">{p.name}</Text>
                      </View>
                    ) : (
                      // Video Mock State
                      <View className="absolute inset-0 bg-[#333333] items-center justify-center">
                        <Text className="text-white/50">[Video Stream for {p.name}]</Text>
                      </View>
                    )}

                    {/* Overlay info */}
                    <View className="absolute bottom-4 left-4 bg-black/50 px-2 py-1 rounded-md flex-row items-center">
                      <Text className="text-white text-xs">{p.name} {p.id === currentUserId ? '(You)' : ''}</Text>
                      {p.isMuted && <Text className="text-red-500 ml-2 text-xs">Muted</Text>}
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Controls Footer */}
        <View className="pb-10 pt-4 px-6 bg-black/40 flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={onToggleMute}
            className={`w-14 h-14 rounded-full items-center justify-center ${me?.isMuted ? 'bg-red-500' : 'bg-gray-600'}`}
          >
            <Text className="text-white font-bold">{me?.isMuted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>

          {!isAudioOnly && (
            <TouchableOpacity 
              onPress={onToggleVideo}
              className={`w-14 h-14 rounded-full items-center justify-center ${!me?.isVideoOn ? 'bg-red-500' : 'bg-gray-600'}`}
            >
              <Text className="text-white text-xs font-bold text-center">{me?.isVideoOn ? 'Stop\nVideo' : 'Start\nVideo'}</Text>
            </TouchableOpacity>
          )}

          {!isAudioOnly && Platform.OS !== 'web' && (
            <TouchableOpacity 
              onPress={onFlipCamera}
              className="w-14 h-14 rounded-full bg-gray-600 items-center justify-center"
            >
              <Text className="text-white text-xs font-bold text-center">Flip</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            onPress={onClose}
            className="w-14 h-14 rounded-full bg-[#FF385C] items-center justify-center"
          >
            <Text className="text-white font-bold">End</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
};
