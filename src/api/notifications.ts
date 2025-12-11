import apiClient, { getErrorMessage } from './client';
import { Notification } from '../types';

export const notificationService = {
  // Get all notifications
  async getNotifications(): Promise<{ success: boolean; data?: Notification[]; error?: string }> {
    try {
      const response = await apiClient.get<Notification[]>('/notifications/');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: number): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read/`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post('/notifications/mark_all_read/');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Delete notification
  async deleteNotification(notificationId: number): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.delete(`/notifications/${notificationId}/`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Update notification preferences
  async updatePreferences(enabled: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.patch('/notifications/preferences/', {
        push_notifications_enabled: enabled,
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Save FCM token
  async saveFCMToken(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post('/notifications/save-fcm-token/', {
        fcm_token: token,
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
};
