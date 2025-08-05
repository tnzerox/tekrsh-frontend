
import React from 'react';
import { Card, Typography, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { User } from '@/types/auth';

const { Text } = Typography;

interface UserInfoProps {
  user: User | null;
  userType: 'admin' | 'superadmin';
}

export const UserInfo: React.FC<UserInfoProps> = ({ user, userType }) => {
  if (!user) return null;

  return (
    <Card 
      title="Profile Information"
      className="shadow-lg"
      styles={{
        header: { 
          backgroundColor: userType === 'superadmin' ? 'rgb(254 243 199)' : 'rgb(236 253 245)',
          borderBottom: `1px solid ${userType === 'superadmin' ? 'rgb(251 191 36)' : 'rgb(16 185 129)'}`
        }
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
            userType === 'superadmin' ? 'bg-amber-500' : 'bg-emerald-500'
          } text-white`}>
            <UserOutlined className="text-xl" />
          </div>
          <div>
            <Text strong className="text-lg">{user.name}</Text>
            <br />
            <Text type="secondary">{user.email}</Text>
            <br />
            <Tag color={user.is_active ? 'green' : 'red'}>
              {user.is_active ? 'Active' : 'Inactive'}
            </Tag>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex justify-between">
            <Text strong>Role:</Text>
            <Text>{user.role.name}</Text>
          </div>
          <div className="flex justify-between">
            <Text strong>Organization ID:</Text>
            <Text>{user.organization_id}</Text>
          </div>
        </div>
      </div>
    </Card>
  );
};
