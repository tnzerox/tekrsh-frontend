
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, CrownOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/Loading';

const { Title, Text } = Typography;

export const SuperAdminLoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, userType, clearAuthError } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userType === 'superadmin') {
      navigate('/superadmin/dashboard');
    } else if (isAuthenticated && userType === 'admin') {
      navigate('/admin/dashboard');
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
        user_type: 'superadmin'
      });
    } catch (err) {
      // Error is handled by Redux
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-50 dark:from-amber-900 dark:via-yellow-900 dark:to-orange-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card 
        className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-amber-900/90 backdrop-blur-sm"
        styles={{
          body: { padding: '2rem' }
        }}
      >
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
            <CrownOutlined className="text-white text-2xl" />
          </div>
          <Title level={2} className="!text-amber-800 dark:!text-amber-100 !mb-2">
            SuperAdmin Portal
          </Title>
          <Text className="text-amber-700 dark:text-amber-300">
            Ultimate administrative access
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
              prefix={<UserOutlined className="text-amber-500" />}
              placeholder="superadmin@example.com"
              className="h-12 border-amber-300 dark:border-amber-600 focus:border-amber-500 dark:focus:border-amber-400"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-amber-500" />}
              placeholder="Enter your password"
              className="h-12 border-amber-300 dark:border-amber-600 focus:border-amber-500 dark:focus:border-amber-400"
            />
          </Form.Item>

          <Form.Item className="mb-6">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              icon={isLoading ? undefined : <LoginOutlined />}
              className="h-12 bg-gradient-to-r from-amber-500 to-orange-600 border-0 hover:from-amber-600 hover:to-orange-700 shadow-lg"
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

        <div className="text-center pt-4 border-t border-amber-200 dark:border-amber-700">
          <Text className="text-amber-600 dark:text-amber-400">
            Regular admin access?{' '}
            <Link 
              to="/admin/login" 
              className="text-amber-700 hover:text-amber-800 dark:text-amber-300 font-medium"
            >
              Admin Portal
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};
