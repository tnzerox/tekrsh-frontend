
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    SHOW: (id: number) => `/users/${id}`,
    ONBOARD: `/admin/onboard-store`,
  },
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    UPDATE: (id: number) => `/products/${id}`,
    DELETE: (id: number) => `/products/${id}`,
    SHOW: (id: number) => `/products/${id}`,
  },
  REPORTS: {
    DASHBOARD: '/reports/dashboard',
    USERS: '/reports/users',
  },
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'admin_token',
  REFRESH_TOKEN: 'admin_refresh_token',
  USER: 'admin_user',
  PERMISSIONS: 'admin_permissions',
} as const;

export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  VIEW_REPORTS: 'view_reports',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_PRODUCTS: 'manage_products',
  VIEW_PRODUCTS: 'view_products',
} as const;

export const ROUTES = {
  // Admin Routes
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SETTINGS: '/admin/settings',
  
  // SuperAdmin Routes
  SUPERADMIN_LOGIN: '/superadmin/login',
  SUPERADMIN_DASHBOARD: '/superadmin/dashboard',
  SUPERADMIN_USERS: '/superadmin/users',
  SUPERADMIN_PRODUCTS: '/superadmin/products',
  SUPERADMIN_REPORTS: '/superadmin/reports',
  SUPERADMIN_SETTINGS: '/superadmin/settings',
  
  // Legacy Routes (redirect to appropriate panel)
  LOGIN: '/login',
  DASHBOARD: '/',
  USERS: '/users',
  PRODUCTS: '/products',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;
