
import React from 'react';
import { Card, Row, Col, Statistic, Typography, Tag, Space } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  SettingOutlined, 
  DatabaseOutlined,
  CrownOutlined 
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { StatsCard, UserInfo, PermissionsBadge } from '@/components/dashboard';

const { Title, Text } = Typography;

export const SuperAdminDashboardPage: React.FC = () => {
  const { user, permissions } = useAuth();

  const stats = [
    {
      title: 'Total Users',
      value: 1234,
      icon: <TeamOutlined className="text-amber-500" />,
      color: 'from-amber-500 to-orange-600'
    },
    {
      title: 'Active Sessions',
      value: 89,
      icon: <UserOutlined className="text-orange-500" />,
      color: 'from-orange-500 to-red-600'
    },
    {
      title: 'System Health',
      value: '99.9%',
      icon: <DatabaseOutlined className="text-yellow-500" />,
      color: 'from-yellow-500 to-amber-600'
    },
    {
      title: 'Configurations',
      value: 42,
      icon: <SettingOutlined className="text-amber-600" />,
      color: 'from-amber-600 to-yellow-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CrownOutlined className="text-3xl text-amber-500" />
          <div>
            <Title level={2} className="!mb-0 !text-amber-800 dark:!text-amber-200">
              SuperAdmin Control Center
            </Title>
            <Text className="text-amber-600 dark:text-amber-400">
              Ultimate system administration and oversight
            </Text>
          </div>
        </div>
        <Tag color="gold" className="px-3 py-1 text-sm font-medium">
          SuperAdmin Access
        </Tag>
      </div>

      <Row gutter={[24, 24]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatsCard {...stat} />
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card 
            title="System Overview" 
            className="shadow-lg border-amber-200 dark:border-amber-800"
            styles={{
              header: { 
                backgroundColor: 'rgb(254 243 199)', 
                borderBottom: '1px solid rgb(251 191 36)' 
              }
            }}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <Text strong>Total System Users</Text>
                <Text className="text-amber-600 font-bold">1,234</Text>
              </div>
              <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Text strong>Active Organizations</Text>
                <Text className="text-orange-600 font-bold">45</Text>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Text strong>System Uptime</Text>
                <Text className="text-yellow-600 font-bold">99.9%</Text>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Space direction="vertical" size="large" className="w-full">
            <UserInfo user={user} userType="superadmin" />
            <PermissionsBadge permissions={permissions} userType="superadmin" />
          </Space>
        </Col>
      </Row>
    </div>
  );
};
