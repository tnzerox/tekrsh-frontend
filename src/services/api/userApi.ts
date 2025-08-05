
import { apiClient } from './ApiClient';
import { UserListItem, CreateUserRequest, UpdateUserRequest, OnboardUserRequest, Onboarded } from '@/types/user';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { API_ENDPOINTS } from '@/utils/constants';

export const userApi = {
  getUsers: async (page = 1, limit = 10): Promise<PaginatedResponse<UserListItem>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<UserListItem>>>(
      `${API_ENDPOINTS.USERS.LIST}?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  getUser: async (id: number): Promise<UserListItem> => {
    const response = await apiClient.get<ApiResponse<UserListItem>>(API_ENDPOINTS.USERS.SHOW(id));
    return response.data.data;
  },

  createUser: async (userData: CreateUserRequest): Promise<UserListItem> => {
    const response = await apiClient.post<ApiResponse<UserListItem>>(API_ENDPOINTS.USERS.CREATE, userData);
    return response.data.data;
  },

  updateUser: async (id: number, userData: UpdateUserRequest): Promise<UserListItem> => {
    const response = await apiClient.put<ApiResponse<UserListItem>>(API_ENDPOINTS.USERS.UPDATE(id), userData);
    return response.data.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  },

  onboardUser: async (userData: OnboardUserRequest): Promise<Onboarded> => {
    const response = await apiClient.post<ApiResponse<Onboarded>>(API_ENDPOINTS.USERS.ONBOARD, userData);
    return response.data.data;
  },
};
