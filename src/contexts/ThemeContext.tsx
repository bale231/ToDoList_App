import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../api/auth';
import { STORAGE_KEYS } from '../constants/config';

type Theme = 'light' | 'dark';
type ThemeMode = 'auto' | 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    error: string;
    success: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemTheme = useColorScheme() || 'light';
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [theme, setTheme] = useState<Theme>(systemTheme as Theme);

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (themeMode === 'auto') {
      setTheme(systemTheme as Theme);
    } else {
      setTheme(themeMode as Theme);
    }
  }, [themeMode, systemTheme]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme && ['auto', 'light', 'dark'].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);

      // Sync with backend if user is logged in
      if (mode !== 'auto') {
        await authService.updateTheme(mode);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = theme === 'dark'
    ? {
        background: '#0f172a',          // Slate 900
        card: 'rgba(30, 41, 59, 0.7)',  // Glassmorphism gray-900/70
        cardSolid: '#1e293b',           // Slate 800
        text: '#ffffff',
        textSecondary: '#94a3b8',       // Slate 400
        border: 'rgba(255, 255, 255, 0.2)', // White/20
        borderSolid: '#334155',         // Slate 700
        primary: '#3b82f6',             // Blue 500
        primaryDark: '#2563eb',         // Blue 600
        error: '#ef4444',               // Red 500
        success: '#10b981',             // Green 500
        warning: '#f59e0b',             // Amber 500
        yellow: '#facc15',              // Yellow 400
        purple: '#a855f7',              // Purple 500
        blue: '#60a5fa',                // Blue 400
        green: '#34d399',               // Green 400
        red: '#f87171',                 // Red 400
        blur: 'rgba(0, 0, 0, 0.6)',     // Backdrop blur
      }
    : {
        background: '#f3f4f6',          // Gray 100
        card: 'rgba(255, 255, 255, 0.7)', // Glassmorphism white/70
        cardSolid: '#ffffff',
        text: '#1f2937',                // Gray 800
        textSecondary: '#6b7280',       // Gray 500
        border: 'rgba(229, 231, 235, 0.5)', // Gray-200/50
        borderSolid: '#e5e7eb',
        primary: '#3b82f6',             // Blue 500
        primaryDark: '#2563eb',         // Blue 600
        error: '#ef4444',               // Red 500
        success: '#10b981',             // Green 500
        warning: '#f59e0b',             // Amber 500
        yellow: '#eab308',              // Yellow 500
        purple: '#a855f7',              // Purple 500
        blue: '#3b82f6',                // Blue 500
        green: '#22c55e',               // Green 500
        red: '#ef4444',                 // Red 500
        blur: 'rgba(0, 0, 0, 0.3)',     // Backdrop blur
      };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode,
        colors,
      }}
    >
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
