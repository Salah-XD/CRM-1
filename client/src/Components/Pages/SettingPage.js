import React, { useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom"; // Import Link for navigation
import AdminDashboard from "../Layout/AdminDashboard";
import NoteForm from "./NoteForm";
import MailSettingForm from "./MailSettingForm";
import MailSettingCC from "./MailSettingCC";
import UserListSetting from "./UserListSetting";
import ProfileSettings from "./CompanyAddressSetting";
import FormLinkMailSetting from "./FormLinkMailSetting";
import CompanyAddressSetting from "./CompanyAddressSetting"; // New Component
import BankDetailsSetting from "./BankDetailsSetting"; // New Component

const { Sider, Content } = Layout;

const menuItems = [
  {
    key: "Profile",
    icon: <UserOutlined />,
    label: "Profile",
    link: "/settings/profile",
    children: [
      {
        key: "CompanyAddress",
        label: "Company Address",
        link: "/settings/company-address",
      },
      {
        key: "BankDetails",
        label: "Bank Details",
        link: "/settings/bank-details",
      },
    ],
  },
  {
    key: "Notes",
    icon: <AppstoreOutlined />,
    label: "Notes",
    link: "/settings/notes",
  },
  {
    key: "Mail",
    icon: <MailOutlined />,
    label: "Mail",
    link: "/settings/mail",
    children: [
      {
        key: "MailMessage",
        label: "Account Mail",
        link: "/settings/mail-message",
      },
      {
        key: "formlink",
        label: "Form Link Mail",
        link: "/settings/form-link-mail",
      },
      {
        key: "CCMails",
        label: "CC's Mails",
        link: "/settings/cc-mails",
      },
    ],
  },
  {
    key: "User",
    icon: <SettingOutlined />,
    label: "User",
    link: "/settings/user",
  },
];

const SettingsPage = () => {
  const [current, setCurrent] = useState("Profile"); // Set default tab to 'Profile'

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const renderContent = () => {
    switch (current) {
      case "Profile":
        return <ProfileSettings />;
      case "CompanyAddress":
        return <CompanyAddressSetting />;
      case "BankDetails":
        return <BankDetailsSetting />;
      case "Notes":
        return <NoteForm />;
      case "Mail":
        return <MailSettingForm />;
      case "MailMessage":
        return <MailSettingForm />;
      case "CCMails":
        return <MailSettingCC />;
      case "formlink":
        return <FormLinkMailSetting />;
      case "User":
        return <UserListSetting />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <AdminDashboard>
      <Layout style={{ minHeight: "100vh", background: "#E6F7FF" }}>
        {/* Sidebar */}
        <Sider
          width={200}
          style={{
            background: "#fff",
            borderRight: "1px solid #e8e8e8",
            position: "fixed", // Keep sidebar fixed
            height: "100vh",
            overflow: "auto",
          }}
        >
          <div className="flex ml-7 mt-4 mb-4 admin-crown">
            <div className="mr-2 text-4xl">Settings</div>
          </div>
          <Menu
            theme="light"
            onClick={onClick}
            style={{
              width: 200,
            }}
            defaultOpenKeys={["Profile"]}
            selectedKeys={[current]}
            mode="inline"
          >
            {menuItems.map((item) => (
              item.children ? (
                <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                  {item.children.map((child) => (
                    <Menu.Item key={child.key}>
                      <Link to={child.link}>{child.label}</Link>
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              ) : (
                <Menu.Item key={item.key} icon={item.icon}>
                  <Link to={item.link}>{item.label}</Link>
                </Menu.Item>
              )
            ))}
          </Menu>
        </Sider>

        {/* Content */}
        <Layout style={{ marginLeft: 200 }}> {/* Adjust for sidebar width */}
          <Content
            style={{
              padding: 24,
              borderRadius: "8px",
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
