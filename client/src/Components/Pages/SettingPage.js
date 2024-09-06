import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import AdminDashboard from '../Layout/AdminDashboard';
import NoteForm from './NoteForm';
import MailSettingForm from './MailSettingForm';
import MailSettingCC from './MailSettingCC';
import UserListSetting from './UserListSetting';
import ProfileSettings from './ProfileSetting';

const { Sider, Content } = Layout;

const menuItems = [
  {
    key: 'Profile',
    icon: <UserOutlined />,
    label: 'Profile',
  },
  {
    key: 'Notes',
    icon: <AppstoreOutlined />,
    label: 'Notes',
  },
  {
    key: 'Mail',
    icon: <MailOutlined />,
    label: 'Mail',
    children: [
      {
        key: 'MailMessage',
        label: 'Mail Message',
      },
      {
        key: 'CCMails',
        label: 'CC\'s Mails',
      },
    ],
  },
  {
    key: 'User',
    icon: <SettingOutlined />,
    label: 'User',
  },
];

const SettingsPage = () => {
  const [current, setCurrent] = useState('Profile'); // Set default tab to 'Profile'

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const renderContent = () => {
    switch (current) {
      case 'Profile':
        return <ProfileSettings />;
      case 'Notes':
        return <NoteForm />;
      case 'Mail':
        return <MailSettingForm />;
      case 'MailMessage':
        return <MailSettingForm />;
      case 'CCMails':
        return <MailSettingCC />;
      case 'User':
        return <UserListSetting />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <AdminDashboard>
      <div className="top-0 z-50 bg-white">
        <div className="border shadow-bottom px-4 py-4 flex items-center">
          <h2 className="text-2xl font-semibold">Settings</h2>
        </div>
      </div>
      <Layout style={{ minHeight: '100vh', background: '#E6F7FF' }}>
        <Sider
          width={200}
          style={{
            background: '#fff',
            borderRight: '1px solid #e8e8e8',
          }}
        >
          <Menu
            theme="light"
            onClick={onClick}
            style={{
              width: 200,
            }}
            defaultOpenKeys={['Profile']}
            selectedKeys={[current]}
            mode="inline"
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Content
            style={{
              padding: 24,
              borderRadius: '8px',
              minHeight: 280,
            }}
            className="bg-blue-50"
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </AdminDashboard>
  );
};

export default SettingsPage;
