
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, SafetyOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/Loading';

const { Title, Text } = Typography;

export const AdminLoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, userType, clearAuthError } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userType === 'admin') {
      navigate('/admin/dashboard');
    } else if (isAuthenticated && userType === 'superadmin') {
      navigate('/superadmin/dashboard');
    }
  }, [isAuthenticated, userType, navigate]);

  useEffect(() => {
    if (error) {
      clearAuthError();
    }
  }, []);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await login({ 
        email: values.email, 
        password: values.password,
        user_type: 'admin'
      });
    } catch (err) {
      // Error is handled by Redux
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 via-slate-50 to-emerald-50 dark:from-stone-900 dark:via-slate-900 dark:to-emerald-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card 
        className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-stone-800/90 backdrop-blur-sm"
        styles={{
          body: { padding: '2rem' }
        }}
      >
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-4">
            <SafetyOutlined className="text-white text-2xl" />
          </div>
          <Title level={2} className="!text-stone-800 dark:!text-stone-100 !mb-2">
            Admin Portal
          </Title>
          <Text className="text-stone-600 dark:text-stone-400">
            Sign in to access the admin dashboard
          </Text>
        </div>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
          className="space-y-4"
        >
          {error && (
            <Alert 
              message={error} 
              type="error" 
              showIcon 
              className="mb-4 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
            />
          )}

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-stone-400" />}
              placeholder="admin@example.com"
              className="h-12 border-stone-300 dark:border-stone-600 focus:border-emerald-500 dark:focus:border-emerald-400"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-stone-400" />}
              placeholder="Enter your password"
              className="h-12 border-stone-300 dark:border-stone-600 focus:border-emerald-500 dark:focus:border-emerald-400"
            />
          </Form.Item>

          <Form.Item className="mb-6">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              icon={isLoading ? undefined : <LoginOutlined />}
              className="h-12 bg-gradient-to-r from-emerald-500 to-teal-600 border-0 hover:from-emerald-600 hover:to-teal-700 shadow-lg"
            >
              {isLoading ? (
                <Space>
                  <LoadingSpinner size="sm" />
                  <span>Signing in...</span>
                </Space>
              ) : (
                'Sign In'
              )}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center pt-4 border-t border-stone-200 dark:border-stone-700">
          <Text className="text-stone-500 dark:text-stone-400">
            Need SuperAdmin access?{' '}
            <Link 
              to="/superadmin/login" 
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium"
            >
              SuperAdmin Portal
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};
