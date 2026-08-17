"use client";
import React, { useState } from 'react';
import { useTheme } from '@itvara/ui';
import { ThemePreference } from '@itvara/types';

export default function ThemeSettingsScreen() {
  const { themePreference, setThemePreference } = useTheme();
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
          // 'Authorization': `Bearer ${token}` // handled by cookies/auth context normally
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Theme Settings</h1>
      
      <div className="space-y-4">
        <ThemeCard 
          title="Light" 
          description="A clean, bright look." 
          isActive={themePreference === ThemePreference.LIGHT} 
          onClick={() => handleThemeChange(ThemePreference.LIGHT)}
          isLoading={isSaving && themePreference !== ThemePreference.LIGHT}
        />
        <ThemeCard 
          title="Dark" 
          description="Easier on the eyes, great for night time." 
          isActive={themePreference === ThemePreference.DARK} 
          onClick={() => handleThemeChange(ThemePreference.DARK)}
          isLoading={isSaving && themePreference !== ThemePreference.DARK}
        />
        <ThemeCard 
          title="System Default" 
          description="Automatically adapt to your device's theme." 
          isActive={themePreference === ThemePreference.SYSTEM} 
          onClick={() => handleThemeChange(ThemePreference.SYSTEM)}
          isLoading={isSaving && themePreference !== ThemePreference.SYSTEM}
        />
      </div>
    </div>
  );
}

const ThemeCard = ({ title, description, isActive, onClick, isLoading }: any) => {
  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
        isActive 
          ? 'border-[#FF385C] bg-[#FF385C]/5 dark:bg-[#FF385C]/10' 
          : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700'
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{description}</p>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          isActive ? 'border-[#FF385C]' : 'border-neutral-300 dark:border-neutral-600'
        }`}>
          {isActive && <div className="w-3 h-3 rounded-full bg-[#FF385C]" />}
        </div>
      </div>
    </div>
  );
};
