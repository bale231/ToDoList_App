import * as SecureStore from 'expo-secure-store';
import apiClient, { getErrorMessage } from './client';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types';
import { STORAGE_KEYS } from '../constants/config';

export const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<{ success: boolean; data?: LoginResponse; error?: string }> {
    try {
      const response = await apiClient.post<LoginResponse>('/login/', credentials);
      const { access, refresh } = response.data;

      // Save tokens securely
      await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, access);
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refresh);
      await SecureStore.setItemAsync(STORAGE_KEYS.REMEMBER_ME, credentials.remember_me ? 'true' : 'false');

      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Register
  async register(data: RegisterRequest): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post('/register/', data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Get current user
  async getCurrentUser(): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const response = await apiClient.get<User>('/jwt-user/');
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post('/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all stored data
      await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REMEMBER_ME);
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  },

  // Reset password request
  async resetPasswordRequest(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post('/reset-password/', { email });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Update profile
  async updateProfile(formData: FormData): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post('/update-profile-jwt/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Update theme
  async updateTheme(theme: 'light' | 'dark'): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post('/update-theme/', { theme });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Delete account
  async deleteAccount(): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.delete('/delete-account/');
      await this.logout();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
};
