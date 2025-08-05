
import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider, Spin, theme } from 'antd';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from '@/store/store';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminLayout } from '@/components/common/Layout';
import { ProtectedRoute, GuestRoute } from '@/components/auth';
import {
  AdminLoginPage,
  SuperAdminLoginPage,
  AdminDashboardPage,
  SuperAdminDashboardPage,
} from '@/pages';
import { PERMISSIONS } from '@/utils/constants';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spin size="large" />
  </div>
);

const App = () => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ConfigProvider
            theme={{
              algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
              token: {
                colorPrimary: '#10b981',
                colorInfo: '#10b981',
                colorSuccess: '#059669',
                colorWarning: '#d97706',
                colorError: '#dc2626',
                borderRadius: 8,
                fontFamily: 'Inter, system-ui, sans-serif',
              },
            }}
          >
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Login Routes */}
                    <Route
                      path="/admin/login"
                      element={
                        // <GuestRoute>
                          <AdminLoginPage />
                        // </GuestRoute>
                      }
                    />
                    <Route
                      path="/superadmin/login"
                      element={
                        // <GuestRoute>
                          <SuperAdminLoginPage />
                        // </GuestRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin/dashboard"
                      element={
                        <ProtectedRoute permission={PERMISSIONS.VIEW_DASHBOARD} userType="admin">
                          <AdminLayout userType="admin">
                            <Suspense fallback={<Spin size="large" />}>
                              <AdminDashboardPage />
                            </Suspense>
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* SuperAdmin Routes */}
                    <Route
                      path="/superadmin/dashboard"
                      element={
                        <ProtectedRoute userType="superadmin">
                          <AdminLayout userType="superadmin">
                            <Suspense fallback={<Spin size="large" />}>
                              <SuperAdminDashboardPage />
                            </Suspense>
                          </AdminLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Default Routes */}
                    <Route path="/" element={<Navigate to="/admin/login" replace />} />
                    <Route path="/login" element={<Navigate to="/admin/login" replace />} />

                    {/* Catch all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </ConfigProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
