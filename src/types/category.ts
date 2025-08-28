// types/category.ts
export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
  parent?: Category;
  children?: Category[];
  children_count?: number;
  featured: boolean;
  active: boolean;
  full_path?: string;
  level?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  parent_id?: number;
  featured?: boolean;
  active?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  parent_id?: number;
  featured?: boolean;
  active?: boolean;
}

export interface CategoryFilters {
  search?: string;
  parent_id?: number;
  status?: 'active' | 'inactive';
  featured?: boolean;
  active?: boolean;
  sort_field?: 'id' | 'name' | 'slug' | 'featured' | 'active' | 'created_at' | 'updated_at';
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface CategoryOption {
  value: number;
  label: string;
  level: number;
}

export interface CategoryTreeResponse {
  data: Category[];
}

export interface CategoryOptionsResponse {
  data: CategoryOption[];
}

export interface PaginatedCategoryResponse {
  data: Category[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface CategoryResponse {
  data: Category;
  message?: string;
}

export interface BulkUpdateStatusRequest {
  category_ids: number[];
  status: 'active' | 'inactive';
}

export interface BulkDeleteRequest {
  category_ids: number[];
}