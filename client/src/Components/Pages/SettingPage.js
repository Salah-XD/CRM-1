import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import AdminDashboard from '../Layout/AdminDashboard';
import NoteForm from './NoteForm';
import MailSettingForm from './MailSettingForm';

const { Sider, Content } = Layout;

const MailComponent = () => <div>Mail Content</div>;

const SettingsPage = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('Notes');

  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'Notes':
        return <NoteForm />; // Use the imported NotesForm component
      case 'Mail':
        return <MailSettingForm />;
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
            mode="vertical"
            defaultOpenKeys={['notes']}
            style={{ borderRight: 0 }}
            selectedKeys={[selectedMenuItem]}
            onClick={(e) => setSelectedMenuItem(e.key)}
          >
            <Menu.ItemGroup key="g1">
              <Menu.Item key="Notes">Notes</Menu.Item>
              <Menu.Item key="Mail">Mail</Menu.Item>
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
