import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  DashboardOutlined,
  MailOutlined,
  MessageOutlined,
  FileTextOutlined,
  CrownFilled,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Layout, Menu, ConfigProvider, Button } from "antd";
import AdminHeader from "./AdminHeader";
import "../css/AdminDashboard.css";
import { useAuth } from "../Context/AuthContext.js";

const { Sider, Content } = Layout;

const AdminDashboard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true" || false
  );
  const [openKeys, setOpenKeys] = useState(
    JSON.parse(localStorage.getItem("sidebarOpenKeys")) || []
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed);
  }, [collapsed]);

  useEffect(() => {
    localStorage.setItem("sidebarOpenKeys", JSON.stringify(openKeys));
  }, [openKeys]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const menuItems = [
    {
      label: "Home",
      key: "/dashboard",
      icon: <DashboardOutlined />,
      link: "/dashboard",
    },
    {
      label: "Client Profiles",
      key: "/client-table",
      icon: <UserOutlined />,
      link: "/client-table",
    },
    {
      label: "Enquiry",
      key: "/enquiry",
      icon: <MailOutlined />,
      link: "/enquiry",
    },
    {
      label: "Accounts Management",
      key: "/accounts",
      icon: <MessageOutlined />,
      children: [
        { label: "Proposal", key: "/proposal", link: "/proposal" },
        { label: "Invoice", key: "/invoice", link: "/invoice" },
        { label: "Audit Plan", key: "/audit-plan", link: "/audit-plan" },
        { label: "Agreement", key: "/agreement", link: "/agreement" },
      ],
    },
    {
      label: "Audit Management",
      key: "/audit",
      icon: <FileTextOutlined />,
      children: [
        { label: "All Audits", key: "/all-audits", link: "/all-audits" },
        {
          label: "New Audit Approvals",
          key: "/new-approvals",
          link: "/new-approvals",
        },
        { label: "Audit Report - CRUD", key: "/crud", link: "/crud" },
        {
          label: "Auditor User Management",
          key: "/auditor-management",
          link: "/auditor-management",
        },
      ],
    },
    {
      label: "Targets Management",
      key: "/targets",
      icon: <DashboardOutlined />,
      children: [
        { label: "Fix targets", key: "/fix-targets", link: "/fix-targets" },
        { label: "Leader board", key: "/leader-board", link: "/leader-board" },
      ],
    },
    {
      label: "Settings",
      key: "/settings",
      icon: <SettingOutlined />,
      link: "/settings",
    },
    {
      label: "Logout",
      key: "logout",
      icon: <LogoutOutlined />,
      action: handleLogout,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemSelectedBg: "white",
            colorItemTextSelected: "#16A7B9",
          },
        },
      }}
    >
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>
      <Layout style={{ minHeight: "100vh", background: "#E6F7FF" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="light"
          width={250} // Increased width
          collapsedWidth={80}
          style={{
            overflow: "auto",
            height: "calc(100vh - 64px)", // Assuming AdminHeader height is 64px
            position: "fixed",
            left: 0,
            top: 64, // Adjusting for the height of the AdminHeader
            bottom: 0,
            background: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: collapsed ? "center" : "flex-end",
              padding: "10px",
            }}
          >
            <Button
              type="text"
              onClick={() => setCollapsed(!collapsed)}
              className="ant-layout-sider-trigger"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            />
          </div>
          {!collapsed && (
            <div className="flex mt-4 ml-7 mb-4 admin-crown">
              <div className="mr-2 text-4xl">
                <UserOutlined />
              </div>
              <div>
                <div className="text-600  text-lg font-semibold">
                  {user?.name ? user.name : "Venkat"}
                </div>

                <div className="text-xs text-lightGrey">Super Admin</div>
              </div>
            </div>
          )}
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            theme="light"
            className="custom-menu"
          >
            {menuItems.map((item) =>
              item.children ? (
                <Menu.SubMenu
                  key={item.key}
                  icon={item.icon}
                  title={item.label}
                >
                  {item.children.map((subItem) => (
                    <Menu.Item key={subItem.key}>
                      <NavLink
                        to={subItem.link}
                        className="custom-menu-item"
                        activeClassName="custom-selected"
                      >
                        {subItem.label}
                      </NavLink>
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              ) : (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  onClick={item.action}
                >
                  <NavLink
                    to={item.link}
                    className="custom-menu-item"
                    activeClassName="custom-selected"
                  >
                    {item.label}
                  </NavLink>
                </Menu.Item>
              )
            )}
          </Menu>
        </Sider>
        <Layout
          style={{
            marginLeft: collapsed ? 80 : 250, // Adjusted margin for new width
            transition: "margin-left 0.2s",
            background: "#E6F7FF",
          }}
        >
          <Content style={{ background: "#E6F7FF" }}>{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminDashboard;
