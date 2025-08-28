// services/categoryService.ts
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryFilters,
  PaginatedCategoryResponse,
  CategoryResponse,
  CategoryTreeResponse,
  CategoryOptionsResponse,
  BulkUpdateStatusRequest,
  BulkDeleteRequest,
} from '@/types/category';
import { apiClient } from './api';

class CategoryService {
  private baseUrl = '/admin/categories';

  async getCategories(filters: CategoryFilters = {}): Promise<PaginatedCategoryResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<PaginatedCategoryResponse>(
      `${this.baseUrl}?${params.toString()}`
    );
    return response.data;
  }

  async getCategoryTree(activeOnly = false): Promise<CategoryTreeResponse> {
    const params = activeOnly ? '?active=true' : '';
    const response = await apiClient.get<CategoryTreeResponse>(`${this.baseUrl}/tree${params}`);
    return response.data;
  }

  async getCategoryOptions(activeOnly = true, exclude: number[] = []): Promise<CategoryOptionsResponse> {
    const params = new URLSearchParams();
    if (activeOnly) params.append('active', 'true');
    if (exclude.length > 0) {
      exclude.forEach(id => params.append('exclude[]', String(id)));
    }
    
    const response = await apiClient.get<CategoryOptionsResponse>(
      `${this.baseUrl}/options?${params.toString()}`
    );
    return response.data;
  }

  async getCategory(id: number): Promise<CategoryResponse> {
    const response = await apiClient.get<CategoryResponse>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createCategory(data: CreateCategoryRequest): Promise<CategoryResponse> {
    const response = await apiClient.post<CategoryResponse>(this.baseUrl, data);
    return response.data;
  }

  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<CategoryResponse> {
    const response = await apiClient.put<CategoryResponse>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  async bulkUpdateStatus(data: BulkUpdateStatusRequest): Promise<void> {
    await apiClient.post(`${this.baseUrl}/bulk-update-status`, data);
  }

  async bulkDelete(data: BulkDeleteRequest): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/bulk-delete`, { data });
  }
}

export const categoryService = new CategoryService();