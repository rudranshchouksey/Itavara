import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

export interface StoryHighlight {
  id: string;
  title: string;
  coverImageUrl: string;
  mediaUrls: string[];
}

export interface HostHighlightRowProps {
  highlights: StoryHighlight[];
  onHighlightPress: (highlight: StoryHighlight) => void;
}

export const HostHighlightRow: React.FC<HostHighlightRowProps> = ({ highlights, onHighlightPress }) => {
  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {highlights.map((highlight) => (
          <TouchableOpacity
            key={highlight.id}
            style={styles.bubbleContainer}
            onPress={() => onHighlightPress(highlight)}
            activeOpacity={0.8}
          >
            <View style={styles.gradientRing}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: highlight.coverImageUrl }} style={styles.image} />
              </View>
            </View>
            <Text style={styles.title} numberOfLines={1}>
              {highlight.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  bubbleContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 72,
  },
  gradientRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FF385C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  imageWrapper: {
    width: 62,
    height: 62,
    borderRadius: 31,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#1C1C1E', // Background color match for gap effect
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    color: '#E5E5E5',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
