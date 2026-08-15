import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Heart, MessageCircle, Share2, ArrowLeft, ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InlineItineraryCard } from '@itvara/ui';

const { width } = Dimensions.get('window');

export default function MobileBlogPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // In a real app, use SWR or React Query
    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/posts/mini-blog/${id}`)
      .then(res => res.json())
      .then(data => setPost(data.data))
      .catch(console.error);
  }, [id]);

  if (!post) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Loading story...</Text>
      </View>
    );
  }

  const wordCount = post.content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const progress = contentOffset.y / (contentSize.height - layoutMeasurement.height);
    setScrollProgress(Math.min(Math.max(progress, 0), 1));
  };

  // Parse blocks separating standard text and itinerary JSON
  const blocks = [];
  const parts = post.content.split(/(```json itinerary\n[\s\S]*?\n```)/);
  for (const part of parts) {
    if (part.startsWith('```json itinerary')) {
      try {
        const jsonStr = part.replace(/```json itinerary\n/, '').replace(/\n```$/, '');
        blocks.push({ type: 'itinerary', data: JSON.parse(jsonStr) });
      } catch (e) {
        blocks.push({ type: 'text', content: part }); // Fallback to text if invalid JSON
      }
    } else {
      blocks.push({ type: 'text', content: part });
    }
  }

  return (
    <View className="flex-1 bg-white">
      {/* Progress Bar Header */}
      <SafeAreaView edges={['top']} className="bg-white z-10 border-b border-gray-100">
        <View className="h-14 flex-row items-center justify-between px-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ChevronLeft size={28} color="#111827" />
          </TouchableOpacity>
          <View className="flex-row space-x-4">
            <TouchableOpacity><Heart size={24} color="#111827" /></TouchableOpacity>
            <TouchableOpacity><Share2 size={24} color="#111827" /></TouchableOpacity>
          </View>
        </View>
        {/* Progress Line */}
        <View className="h-1 bg-gray-200 w-full">
          <View className="h-full bg-[#FF385C]" style={{ width: `${scrollProgress * 100}%` }} />
        </View>
      </SafeAreaView>

      <ScrollView 
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {post.mediaUrls?.[0] && (
          <Image 
            source={{ uri: post.mediaUrls[0] }} 
            style={{ width, height: width * 0.75 }} 
            resizeMode="cover" 
          />
        )}

        <View className="p-6">
          <Text className="text-3xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </Text>

          <View className="flex-row items-center justify-between border-b border-gray-100 pb-6 mb-8">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                {post.user.profilePhoto && <Image source={{ uri: post.user.profilePhoto }} className="w-full h-full" />}
              </View>
              <View>
                <Text className="font-bold text-gray-900 text-base">{post.user.name}</Text>
                <Text className="text-gray-500 text-xs">{new Date(post.createdAt).toLocaleDateString()}</Text>
              </View>
            </View>
            <View className="bg-gray-100 px-3 py-1.5 rounded-full">
              <Text className="text-[#FF385C] font-semibold text-xs">{readingTime} min read</Text>
            </View>
          </View>

          {/* Markdown Content - Very Basic Parsing for UI representation */}
          <View>
            {blocks.map((block, blockIdx) => {
              if (block.type === 'itinerary') {
                return (
                  <InlineItineraryCard 
                    key={blockIdx}
                    day={block.data.day}
                    description={block.data.description}
                    stay={block.data.stay}
                    guideAvailable={block.data.guideAvailable}
                    guidePrice={block.data.guidePrice}
                  />
                );
              }
              
              // Text block fallback rendering
              return block.content.split('\n').map((paragraph: string, idx: number) => {
                if (paragraph.startsWith('## ')) return <Text key={`${blockIdx}-${idx}`} className="text-2xl font-bold mt-6 mb-2 text-gray-900">{paragraph.replace('## ', '')}</Text>;
                if (paragraph.startsWith('### ')) return <Text key={`${blockIdx}-${idx}`} className="text-xl font-bold mt-4 mb-2 text-gray-900">{paragraph.replace('### ', '')}</Text>;
                if (paragraph.startsWith('- ')) return <Text key={`${blockIdx}-${idx}`} className="text-lg text-gray-700 ml-4 mb-1">• {paragraph.replace('- ', '')}</Text>;
                if (paragraph.trim() === '') return <View key={`${blockIdx}-${idx}`} className="h-4" />;
                return <Text key={`${blockIdx}-${idx}`} className="text-lg text-gray-800 leading-7 mb-4">{paragraph}</Text>;
              });
            })}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Bar */}
      <View className="absolute bottom-8 self-center bg-gray-900 rounded-full flex-row items-center justify-between px-6 py-4 w-[85%] shadow-lg">
        <TouchableOpacity className="flex-row items-center">
          <Heart size={20} color="white" />
          <Text className="text-white ml-2 font-semibold">{post._count.likes}</Text>
        </TouchableOpacity>
        <View className="w-[1px] h-6 bg-gray-700 mx-4" />
        <TouchableOpacity className="flex-row items-center">
          <MessageCircle size={20} color="white" />
          <Text className="text-white ml-2 font-semibold">{post._count.comments}</Text>
        </TouchableOpacity>
        <View className="w-[1px] h-6 bg-gray-700 mx-4" />
        <TouchableOpacity>
          <Share2 size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
