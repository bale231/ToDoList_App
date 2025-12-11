import { ListColor } from '../constants/config';

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  profile: UserProfile;
}

export interface UserProfile {
  id: number;
  profile_picture: string | null;
  theme: 'light' | 'dark';
  email_verified: boolean;
  push_notifications_enabled: boolean;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  full_name?: string;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
}

// Todo Types
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  order: number;
  quantity: number | null;
  unit: string | null;
  created_by: {
    id: number;
    username: string;
    full_name: string;
    profile_picture: string | null;
  } | null;
  modified_by: {
    id: number;
    username: string;
    full_name: string;
    profile_picture: string | null;
  } | null;
}

// List (Category) Types
export interface TodoList {
  id: number;
  name: string;
  color: ListColor;
  created_at: string;
  sort_order: 'created' | 'alphabetical' | 'completion';
  todos: Todo[];
  user: number;
  category: number | null;
  is_shared?: boolean;
  can_edit?: boolean;
  shared_by?: {
    id: number;
    username: string;
    full_name: string;
  };
}

// Category (List Category) Types
export interface ListCategory {
  id: number;
  name: string;
  created_at: string;
  user: number;
  is_shared?: boolean;
  can_edit?: boolean;
}

// Notification Types
export interface Notification {
  id: number;
  type: 'update_normal' | 'update_important' | 'friend_request' | 'list_modified' | 'general';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  from_user: {
    id: number;
    username: string;
    full_name: string;
    profile_picture: string | null;
  } | null;
  list_name: string | null;
}

// Friend Types
export interface Friend {
  id: number;
  username: string;
  full_name: string;
  profile_picture: string | null;
}

export interface FriendRequest {
  id: number;
  from_user: Friend;
  to_user: Friend;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

// Share Types
export interface ShareInfo {
  user: Friend;
  can_edit: boolean;
}

// API Response Types
export interface ApiError {
  error?: string;
  detail?: string;
  message?: string;
}
