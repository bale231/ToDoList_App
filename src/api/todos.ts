import apiClient, { getErrorMessage } from './client';
import { TodoList, Todo, ListCategory } from '../types';

export const todoService = {
  // Categories (List Categories)
  async getCategories(): Promise<{ success: boolean; data?: ListCategory[]; error?: string }> {
    try {
      const response = await apiClient.get<ListCategory[]>('/categories/');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async createCategory(name: string): Promise<{ success: boolean; data?: ListCategory; error?: string }> {
    try {
      const response = await apiClient.post<ListCategory>('/categories/', { name });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async updateCategory(id: number, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.patch(`/categories/${id}/`, { name });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async deleteCategory(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.delete(`/categories/${id}/`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async setSelectedCategory(categoryId: number | null): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.patch('/categories/selected/', { category_id: categoryId });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Lists
  async getLists(): Promise<{ success: boolean; data?: TodoList[]; error?: string }> {
    try {
      const response = await apiClient.get<TodoList[]>('/lists/');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async createList(data: { name: string; color: string; category?: number }): Promise<{ success: boolean; data?: TodoList; error?: string }> {
    try {
      const response = await apiClient.post<TodoList>('/lists/', data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async updateList(id: number, data: { name?: string; color?: string; category?: number }): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.put(`/lists/${id}/`, data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async deleteList(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.delete(`/lists/${id}/`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async renameList(id: number, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.patch(`/lists/${id}/rename/`, { name });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async updateListSortOrder(id: number, sortOrder: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.patch(`/lists/${id}/sort_order/`, { sort_order: sortOrder });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Todos
  async createTodo(listId: number, data: { title: string; quantity?: number; unit?: string }): Promise<{ success: boolean; data?: Todo; error?: string }> {
    try {
      const response = await apiClient.post<Todo>(`/lists/${listId}/todos/`, data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async toggleTodo(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.patch(`/todos/${id}/toggle/`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async updateTodo(id: number, data: { title?: string; quantity?: number; unit?: string }): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.patch(`/todos/${id}/update/`, data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async deleteTodo(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.delete(`/todos/${id}/`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async moveTodo(id: number, newListId: number): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.patch(`/todos/${id}/move/`, { new_list_id: newListId });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  // Sharing
  async shareList(listId: number, userId: number, canEdit: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.post(`/lists/${listId}/share/`, { user_id: userId, can_edit: canEdit });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async unshareList(listId: number, userId: number): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.delete(`/lists/${listId}/share/${userId}/`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },

  async getListShares(listId: number): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const response = await apiClient.get(`/lists/${listId}/shares/`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
};
