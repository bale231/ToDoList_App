// API Configuration
export const API_URL = 'https://bale231.pythonanywhere.com/api';

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAxvwdmENvt6KZj-Jnlv7FtA9EZd_P-AC0",
  authDomain: "todo-webapp-e0ac5.firebaseapp.com",
  projectId: "todo-webapp-e0ac5",
  storageBucket: "todo-webapp-e0ac5.firebasestorage.app",
  messagingSenderId: "543071263999",
  appId: "1:543071263999:web:e798d5ff32778b055400ca"
};

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  REMEMBER_ME: 'rememberMe',
};

// App Colors (matching webapp)
export const APP_COLORS = {
  blue: '#2563eb',
  green: '#16a34a',
  yellow: '#eab308',
  red: '#dc2626',
  purple: '#9333ea',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// List Colors
export const LIST_COLORS = ['blue', 'green', 'yellow', 'red', 'purple'] as const;

export type ListColor = typeof LIST_COLORS[number];
