import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Heart, MessageCircle, Share2 } from 'lucide-react-native';
import { BookablePill } from './BookablePill';

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

// Since we are creating a generic UI component, we expect post data via props.
export interface ReelData {
  id: string;
  mediaUrls: string[];
  content?: string;
  user: {
    name: string;
    profilePhoto?: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
  tags?: Array<{
    taggedListing?: {
      id: string;
      title: string;
      pricePerNight: number;
    }
  }>;
}

interface ReelPlayerProps {
  post: ReelData;
  isActive: boolean;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onViewListing?: (listingId: string) => void;
}

export const ReelPlayer: React.FC<ReelPlayerProps> = ({
  post,
  isActive,
  onLike,
  onComment,
  onShare,
  onViewListing
}) => {
  const videoRef = useRef<Video>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // In a real app, this should be synced with the server/props

  const videoUrl = post.mediaUrls[0];
  const taggedListing = post.tags?.find(t => t.taggedListing)?.taggedListing;

  useEffect(() => {
    if (isActive) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
      videoRef.current?.setPositionAsync(0);
    }
  }, [isActive]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onLike) onLike(post.id);
  };

  return (
    <View style={[styles.container, { height: windowHeight, width: windowWidth }]} className="bg-neutral-900 relative">
      {videoUrl ? (
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={StyleSheet.absoluteFillObject}
          resizeMode={ResizeMode.COVER}
          isLooping
          isMuted={isMuted}
          shouldPlay={isActive}
        />
      ) : (
        <View style={StyleSheet.absoluteFillObject} className="bg-neutral-800 items-center justify-center">
          <Text className="text-white">Media not available</Text>
        </View>
      )}

      {/* Overlay controls - Touch to mute/unmute */}
      <TouchableOpacity 
        style={StyleSheet.absoluteFillObject} 
        activeOpacity={1} 
        onPress={() => setIsMuted(!isMuted)}
      />

      {/* Right Sidebar Controls */}
      <View className="absolute right-4 bottom-32 items-center space-y-6">
        <TouchableOpacity onPress={handleLike} className="items-center">
          <Heart size={32} color={isLiked ? '#FF385C' : 'white'} fill={isLiked ? '#FF385C' : 'none'} />
          <Text className="text-white text-xs mt-1 font-semibold">{post._count.likes + (isLiked ? 1 : 0)}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onComment && onComment(post.id)} className="items-center">
          <MessageCircle size={32} color="white" />
          <Text className="text-white text-xs mt-1 font-semibold">{post._count.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onShare && onShare(post.id)} className="items-center">
          <Share2 size={32} color="white" />
          <Text className="text-white text-xs mt-1 font-semibold">Share</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Area - User Info & Listing Tag */}
      <View className="absolute bottom-16 left-4 right-20 space-y-3">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-neutral-600 border border-white/20 mr-3 overflow-hidden">
            {post.user.profilePhoto && (
              <View /* User Avatar Image placeholder */ className="flex-1 bg-gray-500" />
            )}
          </View>
          <Text className="text-white font-bold text-base">{post.user.name}</Text>
        </View>

        {post.content && (
          <Text className="text-white text-sm" numberOfLines={2}>{post.content}</Text>
        )}

        {/* Commerce Pipeline / Tagged Listing */}
        {taggedListing && (
          <BookablePill
            id={taggedListing.id}
            title={taggedListing.title}
            price={taggedListing.pricePerNight}
            type="STAY"
            onPress={onViewListing}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
