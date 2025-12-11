import apiClient, { getErrorMessage } from './client';
import { Friend, FriendRequest } from '../types';

export const friendService = {
  // Get all users (for search)
  async getUsers(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const response = await apiClient.get('/users/');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Get friends list
  async getFriends(): Promise<{ success: boolean; data?: Friend[]; error?: string }> {
    try {
      const response = await apiClient.get<Friend[]>('/friends/');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Get friend requests
  async getFriendRequests(): Promise<{ success: boolean; data?: FriendRequest[]; error?: string }> {
    try {
      const response = await apiClient.get<FriendRequest[]>('/friend-requests/');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Send friend request
  async sendFriendRequest(userId: number): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post(`/friend-requests/send/${userId}/`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Accept friend request
  async acceptFriendRequest(requestId: number): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post(`/friend-requests/${requestId}/accept/`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Reject friend request
  async rejectFriendRequest(requestId: number): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post(`/friend-requests/${requestId}/reject/`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Remove friend
  async removeFriend(userId: number): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.delete(`/friends/${userId}/remove/`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
};
