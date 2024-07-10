import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  DashboardOutlined,
  MessageOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Layout, Menu, ConfigProvider, Button } from "antd";
import AdminHeader from "./AdminHeader";
import "../css/AdminDashboard.css";
import { useAuth } from "../Context/AuthContext.js";
import Cookies from "js-cookie";

const { Sider, Content } = Layout;

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true" || false
  );
  const [openKeys, setOpenKeys] = useState(
    JSON.parse(localStorage.getItem("sidebarOpenKeys")) || []
  );
  const [selectedKey, setSelectedKey] = useState(
    Cookies.get("selectedKey") || location.pathname
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

  useEffect(() => {
    const currentPath = location.pathname;
    setSelectedKey(currentPath);
    Cookies.set("selectedKey", currentPath, { expires: 7 });

    // Check if the current path matches any of the parent keys or their children
    const openKeys = menuItems.reduce((acc, item) => {
      if (item.children) {
        const isChildActive = item.children.some((subItem) =>
          currentPath.startsWith(subItem.link)
        );
        if (isChildActive) {
          acc.push(item.key);
        }
      } else if (currentPath.startsWith(item.link)) {
        acc.push(item.key);
      }
      return acc;
    }, []);
    setOpenKeys(openKeys);
  }, [location.pathname]);

  const handleMenuItemClick = (key) => {
    setSelectedKey(key);
    Cookies.set("selectedKey", key, { expires: 7 });
  };

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
      label: "Customers",
      key: "/customers",
      icon: <MessageOutlined />,
      children: [
        {
          label: "Web Enquiry (leads)",
          key: "/web-enquiry",
          link: "/web-enquiry",
        },
        {
          label: "Client Profile",
          key: "/client-profile",
          link: "/client-profile",
        },
      ],
    },
    {
      label: "Accounts Management",
      key: "/accounts",
      icon: <MessageOutlined />,
      children: [
        {
          label: "Enquiry from customers",
          key: "/enquiry",
          link: "/enquiry",
        },
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
          width={250}
          collapsedWidth={80}
          style={{
            overflow: "auto",
            height: "calc(100vh - 64px)",
            position: "fixed",
            left: 0,
            top: 64,
            bottom: 50,
            background: "white",
            borderRight: "1px solid #e8e8e8",
          }}
        >
          <div className="sider-menu">
            <div className="sider-menu-content">
              {!collapsed && (
                <div className="flex ml-7 mt-4 mb-4 admin-crown">
                  <div className="mr-2 text-4xl">
                    <UserOutlined />
                  </div>
                  <div>
                    <div className="text-600 text-lg font-semibold">
                      {user?.name ? user.name : "Venkat"}
                    </div>
                    <div className="text-xs text-lightGrey">Super Admin</div>
                  </div>
                </div>
              )}
              <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
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
                            onClick={() => handleMenuItemClick(subItem.key)}
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
                      onClick={
                        item.action
                          ? item.action
                          : () => handleMenuItemClick(item.key)
                      }
                    >
                      <NavLink
                        to={item.link}
                        className="custom-menu-item"
                        activeClassName="custom-selected"
                        onClick={() => handleMenuItemClick(item.key)}
                      >
                        {item.label}
                      </NavLink>
                    </Menu.Item>
                  )
                )}
              </Menu>
            </div>
            <div className="sider-menu-bottom">
              <Button
                type="text"
                onClick={() => setCollapsed(!collapsed)}
                className="ant-layout-sider-trigger"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              />
            </div>
          </div>
        </Sider>
        <Layout
          style={{
            marginLeft: collapsed ? 80 : 250,
            transition: "margin-left 0.2s",
            background: "#E6F7FF",
          }}
        >
          <Content className="bg-blue-50">{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminDashboard;
