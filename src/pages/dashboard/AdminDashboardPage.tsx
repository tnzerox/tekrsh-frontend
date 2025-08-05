
import React from 'react';
import { Card, Row, Col, Typography, Statistic, Progress, List, Avatar, Tag } from 'antd';
import { 
  UserOutlined, 
  ShoppingOutlined, 
  DollarOutlined, 
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';

const { Title, Text } = Typography;

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Users',
      value: 1234,
      prefix: <UserOutlined className="text-emerald-500" />,
      change: 12,
      positive: true
    },
    {
      title: 'Products',
      value: 89,
      prefix: <ShoppingOutlined className="text-blue-500" />,
      change: 5,
      positive: true
    },
    {
      title: 'Revenue',
      value: 45678,
      prefix: <DollarOutlined className="text-yellow-500" />,
      change: -2,
      positive: false
    },
    {
      title: 'Orders',
      value: 234,
      prefix: <TrophyOutlined className="text-purple-500" />,
      change: 8,
      positive: true
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New user registration', user: 'John Doe', time: '2 minutes ago' },
    { id: 2, action: 'Product updated', user: 'Jane Smith', time: '5 minutes ago' },
    { id: 3, action: 'Order completed', user: 'Mike Johnson', time: '10 minutes ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 border-0 text-white">
        <div className="flex items-center justify-between">
          <div>
            <Title level={2} className="!text-white !mb-2">
              Welcome back, {user?.name}!
            </Title>
            <Text className="text-emerald-100 text-lg">
              Here's what's happening with your admin portal today.
            </Text>
          </div>
          <div className="hidden md:block">
            <Avatar size={64} icon={<UserOutlined />} className="bg-white/20" />
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={
                  <div className="flex items-center">
                    {stat.positive ? (
                      <ArrowUpOutlined className="text-green-500 ml-2" />
                    ) : (
                      <ArrowDownOutlined className="text-red-500 ml-2" />
                    )}
                    <span className={stat.positive ? 'text-green-500' : 'text-red-500'}>
                      {Math.abs(stat.change)}%
                    </span>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Content Grid */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="System Performance" className="h-full">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Text>CPU Usage</Text>
                  <Text>65%</Text>
                </div>
                <Progress percent={65} strokeColor="#10b981" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Text>Memory Usage</Text>
                  <Text>78%</Text>
                </div>
                <Progress percent={78} strokeColor="#f59e0b" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <Text>Storage</Text>
                  <Text>45%</Text>
                </div>
                <Progress percent={45} strokeColor="#3b82f6" />
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Recent Activities" className="h-full">
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} size="small" />}
                    title={item.action}
                    description={
                      <div>
                        <Text type="secondary">{item.user}</Text>
                        <br />
                        <Text type="secondary" className="text-xs">{item.time}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
