// hooks/useCategories.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { categoryService } from '@/services/categoryService';
import {
  CategoryFilters,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  BulkUpdateStatusRequest,
  BulkDeleteRequest,
} from '@/types/category';

export const CATEGORY_QUERY_KEYS = {
  all: ['categories'] as const,
  lists: () => [...CATEGORY_QUERY_KEYS.all, 'list'] as const,
  list: (filters: CategoryFilters) => [...CATEGORY_QUERY_KEYS.lists(), filters] as const,
  details: () => [...CATEGORY_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...CATEGORY_QUERY_KEYS.details(), id] as const,
  tree: () => [...CATEGORY_QUERY_KEYS.all, 'tree'] as const,
  options: () => [...CATEGORY_QUERY_KEYS.all, 'options'] as const,
};

export function useCategories(filters: CategoryFilters = {}) {
  const queryClient = useQueryClient();

  // Get paginated categories
  const categoriesQuery = useQuery({
    queryKey: CATEGORY_QUERY_KEYS.list(filters),
    queryFn: () => categoryService.getCategories(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create category mutation
  const createCategory = useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.all });
      message.success('Category created successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create category';
      message.error(errorMessage);
    },
  });

  // Update category mutation
  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryRequest }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.all });
      message.success('Category updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update category';
      message.error(errorMessage);
    },
  });

  // Delete category mutation
  const deleteCategory = useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.all });
      message.success('Category deleted successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete category';
      message.error(errorMessage);
    },
  });

  // Bulk update status mutation
  const bulkUpdateStatus = useMutation({
    mutationFn: (data: BulkUpdateStatusRequest) => categoryService.bulkUpdateStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.all });
      message.success('Categories status updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update categories status';
      message.error(errorMessage);
    },
  });

  // Bulk delete mutation
  const bulkDelete = useMutation({
    mutationFn: (data: BulkDeleteRequest) => categoryService.bulkDelete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.all });
      message.success('Categories deleted successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete categories';
      message.error(errorMessage);
    },
  });

  return {
    // Data
    categories: categoriesQuery.data?.data ?? [],
    total: categoriesQuery.data?.meta.total ?? 0,
    currentPage: categoriesQuery.data?.meta.current_page ?? 1,
    perPage: categoriesQuery.data?.meta.per_page ?? 15,
    lastPage: categoriesQuery.data?.meta.last_page ?? 1,
    
    // States
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    error: categoriesQuery.error,
    
    // Actions
    refetch: categoriesQuery.refetch,
    createCategory,
    updateCategory,
    deleteCategory,
    bulkUpdateStatus,
    bulkDelete,
  };
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.detail(id),
    queryFn: () => categoryService.getCategory(id),
    enabled: !!id,
  });
}

export function useCategoryTree(activeOnly = false) {
  return useQuery({
    queryKey: [...CATEGORY_QUERY_KEYS.tree(), { activeOnly }],
    queryFn: () => categoryService.getCategoryTree(activeOnly),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCategoryOptions(activeOnly = true, exclude: number[] = []) {
  return useQuery({
    queryKey: [...CATEGORY_QUERY_KEYS.options(), { activeOnly, exclude }],
    queryFn: () => categoryService.getCategoryOptions(activeOnly, exclude),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}