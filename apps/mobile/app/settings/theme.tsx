import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@itvara/ui';
import { ThemePreference } from '@itvara/types';

export default function ThemeSettingsScreen() {
  const { themePreference, setThemePreference, isDark } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  const handleThemeChange = async (pref: ThemePreference) => {
    setIsSaving(true);
    await setThemePreference(pref);
    
    try {
      // Sync to backend
      const res = await fetch('http://localhost:3001/api/users/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // auth headers
        },
        body: JSON.stringify({ themePreference: pref })
      });
      if (!res.ok) {
        console.error('Failed to sync theme preference');
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const backgroundColor = isDark ? '#222222' : '#F7F7F7';
  const textColor = isDark ? '#FFFFFF' : '#222222';

  return (
    <ScrollView style={{ flex: 1, backgroundColor }} contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor, marginBottom: 24 }}>
        Theme Settings
      </Text>
      
      <View style={{ gap: 16 }}>
        <ThemeCard 
          title="Light" 
          description="A clean, bright look." 
          isActive={themePreference === ThemePreference.LIGHT} 
          onClick={() => handleThemeChange(ThemePreference.LIGHT)}
          isDark={isDark}
        />
        <ThemeCard 
          title="Dark" 
          description="Easier on the eyes, great for night time." 
          isActive={themePreference === ThemePreference.DARK} 
          onClick={() => handleThemeChange(ThemePreference.DARK)}
          isDark={isDark}
        />
        <ThemeCard 
          title="System Default" 
          description="Automatically adapt to your device's theme." 
          isActive={themePreference === ThemePreference.SYSTEM} 
          onClick={() => handleThemeChange(ThemePreference.SYSTEM)}
          isDark={isDark}
        />
      </View>
    </ScrollView>
  );
}

const ThemeCard = ({ title, description, isActive, onClick, isDark }: any) => {
  const bgColor = isActive ? (isDark ? 'rgba(255, 56, 92, 0.1)' : 'rgba(255, 56, 92, 0.05)') : 'transparent';
  const borderColor = isActive ? '#FF385C' : (isDark ? '#404040' : '#E5E5E5');
  const textColor = isDark ? '#FFFFFF' : '#222222';
  const subTextColor = isDark ? '#A3A3A3' : '#737373';

  return (
    <TouchableOpacity 
      onPress={onClick}
      activeOpacity={0.8}
      style={{
        padding: 20,
        borderRadius: 16,
        borderWidth: 2,
        borderColor,
        backgroundColor: bgColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: textColor, marginBottom: 4 }}>{title}</Text>
        <Text style={{ fontSize: 14, color: subTextColor }}>{description}</Text>
      </View>
      <View style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: isActive ? '#FF385C' : (isDark ? '#525252' : '#D4D4D4'),
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {isActive && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF385C' }} />}
      </View>
    </TouchableOpacity>
  );
};
