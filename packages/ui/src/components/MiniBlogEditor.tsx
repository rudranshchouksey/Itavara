"use client";
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ImagePlus, Link as LinkIcon, List, Heading2 } from 'lucide-react-native';

interface MiniBlogEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave?: (data: { title: string, content: string, mediaUrls: string[] }) => void;
}

const WORDS_PER_MINUTE = 200;
const MAX_WORDS = 2500;

export const MiniBlogEditor: React.FC<MiniBlogEditorProps> = ({
  initialTitle = '',
  initialContent = '',
  onSave
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  
  // Real-time word count calculation
  useEffect(() => {
    const text = content.trim();
    const count = text ? text.split(/\s+/).length : 0;
    setWordCount(count);
    setReadingTime(Math.ceil(count / WORDS_PER_MINUTE));
  }, [content]);

  const handleSave = () => {
    if (wordCount > MAX_WORDS) {
      alert(`Content exceeds maximum word limit of ${MAX_WORDS}`);
      return;
    }
    if (onSave) {
      const mediaUrls = coverPhoto ? [coverPhoto] : [];
      onSave({ title, content, mediaUrls });
    }
  };

  const insertMarkdown = (syntax: string) => {
    // Basic markdown helper
    setContent((prev) => prev + syntax);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top Toolbar */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <View>
          <Text className="text-gray-500 text-xs">{wordCount} / {MAX_WORDS} words</Text>
          <Text className="text-gray-400 text-xs mt-0.5">{readingTime} min read</Text>
        </View>
        <TouchableOpacity 
          className={`px-4 py-2 rounded-full ${wordCount > MAX_WORDS || title.length === 0 ? 'bg-gray-300' : 'bg-[#FF385C]'}`}
          onPress={handleSave}
          disabled={wordCount > MAX_WORDS || title.length === 0}
        >
          <Text className="text-white font-semibold">Publish</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Cover Photo Placeholder */}
        <TouchableOpacity 
          className="h-48 w-full bg-gray-100 rounded-2xl items-center justify-center mb-6 overflow-hidden border border-dashed border-gray-300"
          onPress={() => setCoverPhoto('https://via.placeholder.com/800x400')} // Mock behavior
        >
          {coverPhoto ? (
            <Image source={{ uri: coverPhoto }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="items-center">
              <ImagePlus size={32} color="#9CA3AF" />
              <Text className="text-gray-400 mt-2 font-medium">Add Cover Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Title Input */}
        <TextInput
          className="text-3xl font-bold text-gray-900 mb-6 border-b border-transparent focus:border-gray-200"
          placeholder="Blog Title..."
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
          multiline
        />

        {/* Content Input */}
        <TextInput
          className="text-lg text-gray-800 leading-relaxed min-h-[300px]"
          placeholder="Tell your story... (Markdown supported)"
          placeholderTextColor="#9CA3AF"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

      {/* Markdown Quick Tools (Bottom) */}
      <View className="flex-row items-center justify-around py-3 border-t border-gray-200 bg-gray-50">
        <TouchableOpacity onPress={() => insertMarkdown('## ')} className="p-2">
          <Heading2 size={24} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => insertMarkdown('- ')} className="p-2">
          <List size={24} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => insertMarkdown('[Link text](url)')} className="p-2">
          <LinkIcon size={24} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Gallery feature placeholder')} className="p-2">
          <ImagePlus size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
