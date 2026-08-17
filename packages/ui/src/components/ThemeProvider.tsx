"use client";
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { ThemePreference } from '@itvara/types';
import { setItem, getItem } from '@itvara/utils'; // Assuming this handles platform specific storage (localStorage / AsyncStorage)

interface ThemeContextType {
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => Promise<void>;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themePreference, setThemeState] = useState<ThemePreference>(ThemePreference.SYSTEM);
  const systemColorScheme = useNativeColorScheme();
  
  useEffect(() => {
    // Load from storage on mount
    const loadTheme = async () => {
      const stored = await getItem('itvara_theme_pref');
      if (stored && Object.values(ThemePreference).includes(stored as ThemePreference)) {
        setThemeState(stored as ThemePreference);
      }
    };
    loadTheme();
  }, []);

  const setThemePreference = async (pref: ThemePreference) => {
    setThemeState(pref);
    await setItem('itvara_theme_pref', pref);
  };

  const isDark = useMemo(() => {
    if (themePreference === ThemePreference.DARK) return true;
    if (themePreference === ThemePreference.LIGHT) return false;
    return systemColorScheme === 'dark';
  }, [themePreference, systemColorScheme]);

  useEffect(() => {
    // Sync dark mode class with DOM (for web NativeWind integration)
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ themePreference, setThemePreference, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
