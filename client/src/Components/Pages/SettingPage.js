import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import AdminDashboard from '../Layout/AdminDashboard';
import NoteForm from './NoteForm';
import MailSettingForm from './MailSettingForm';
import MailSettingCC from './MailSettingCC';
import UserListSetting from './UserListSetting';
import ProfileSettings from './ProfileSetting';

const { Sider, Content } = Layout;

const SettingsPage = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('Profile');
  const [subMenuItem, setSubMenuItem] = useState('');

  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'Profile':
        return <ProfileSettings />;
      case 'Notes':
        return <NoteForm />;
      case 'Mail':
        if (subMenuItem === 'MailMessage') {
          return <MailSettingForm />;
        }
        if (subMenuItem === 'CCMails') {
          return <MailSettingCC />;
        }
        return <MailSettingForm />;
      case 'User':
        return <UserListSetting />;
      default:
        return null;
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
            mode="inline"
            defaultOpenKeys={['Mail']}
            style={{ borderRight: 0 }}
            selectedKeys={[selectedMenuItem]}
            openKeys={['Mail']} // Ensure 'Mail' submenu is open by default
            onClick={(e) => {
              if (e.key === 'Mail' || e.key === 'MailMessage' || e.key === 'CCMails') {
                setSelectedMenuItem('Mail');
                setSubMenuItem(e.key); // Set sub-menu item when a submenu item is clicked
              } else {
                setSelectedMenuItem(e.key);
                setSubMenuItem(''); // Reset sub-menu item on main menu item click
              }
            }}
            onOpenChange={(keys) => {
              // Handle submenu open change
              if (keys.length === 0) {
                setSelectedMenuItem('');
                setSubMenuItem('');
              }
            }}
          >
            <Menu.ItemGroup key="g1">
              <Menu.Item key="Profile">Profile</Menu.Item>
              <Menu.Item key="User">User</Menu.Item>
              <Menu.Item key="Notes">Notes</Menu.Item>
              <Menu.SubMenu key="Mail" title="Mail">
                <Menu.Item key="MailMessage">Mail Message</Menu.Item>
                <Menu.Item key="CCMails">CC's Mails</Menu.Item>
              </Menu.SubMenu>
            </Menu.ItemGroup>
          </Menu>
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
