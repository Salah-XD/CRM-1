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

  const getRoleLabel = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "SUPER ADMIN";
      case "ACCOUNT_ADMIN":
        return "ACCOUNT ADMIN";
      case "AUDIT_ADMIN":
        return "AUDIT ADMIN";
      case "AUDITOR":
        return "Auditor";
      default:
        return "User";
    }
  };

  const roles = getRoleLabel(user?.role);
  const role=user?.role;
  
 const menuItems = [
   {
     label: "Home",
     key: "/dashboard",
     icon: <DashboardOutlined />,
     link: "/dashboard",
     roles: ["SUPER_ADMIN", "ACCOUNT_ADMIN", "AUDIT_ADMIN"],
   },
   {
     label: "Customers",
     key: "/customers",
     icon: <UserOutlined />,
     roles: ["SUPER_ADMIN", "ACCOUNT_ADMIN"],
     children: [
       {
         label: "Client Approval",
         key: "/client-approval",
         link: "/client-approval",
         roles: ["SUPER_ADMIN", "ACCOUNT_ADMIN"],
       },
       {
         label: "Client Profile",
         key: "/client-profile",
         link: "/client-profile",
         roles: ["SUPER_ADMIN"],
       },
     ],
   },
   {
     label: "Accounts Management",
     key: "/accounts",
     icon: <MessageOutlined />,
     roles: ["SUPER_ADMIN", "ACCOUNT_ADMIN"],
     children: [
       {
         label: "Enquiry",
         key: "/enquiry",
         link: "/enquiry",
         roles: ["SUPER_ADMIN", "ACCOUNT_ADMIN"],
       },
       {
         label: "Proposal",
         key: "/proposal",
         link: "/proposal",
         roles: ["SUPER_ADMIN", "ACCOUNT_ADMIN"],
       },
       {
         label: "Invoice",
         key: "/invoice",
         link: "/invoice",
         roles: ["SUPER_ADMIN", "ACCOUNT_ADMIN"],
       },

       {
         label: "Agreement",
         key: "/agreement",
         link: "/agreement",
         roles: ["SUPER_ADMIN", "ACCOUNT_ADMIN"],
       },

       
        
     ],
   },
   {
    label: "HR Audit Management",
    key: "/audit",
    icon: <FileTextOutlined />,
    roles: ["SUPER_ADMIN", "AUDIT_ADMIN","AUDITOR"],
    children: [
      {
        label: "Unassigned",
        key: "/unassigned",
        link: "/audit-work",
        roles: ["SUPER_ADMIN", "AUDIT_ADMIN"],
      },
      {
        label: "Assigned",
        key: "/assigned",
        link: "/assigned-audit",
        roles: ["SUPER_ADMIN", "AUDIT_ADMIN","AUDITOR"],
      },
      {
        label: "Draft",
        key: "/draft",
        link: "/draft",
        roles: ["SUPER_ADMIN", "AUDIT_ADMIN","AUDITOR"],
      },
      {
        label: "Submitted for Approval",
        key: "/submittedForApproval",
        link: "/submittedForApproval",
        roles: ["SUPER_ADMIN", "AUDIT_ADMIN","AUDITOR"],
      },
      {
        label: "Rejected",
        key: "/rejected",
        link: "/rejected",
        roles: ["SUPER_ADMIN", "AUDIT_ADMIN","AUDITOR"],
      },
   
      {
        label: "Approved",
        key: "/approved",
        link: "/approved",
        roles: ["SUPER_ADMIN", "AUDIT_ADMIN","AUDITOR"],
      },
    ],
  }
,  
   {
     label: "Settings",
     key: "/setting",
     icon: <SettingOutlined />,
     link: "/setting",
     roles: ["SUPER_ADMIN"],
   },
   {
     label: "Logout",
     key: "logout",
     icon: <LogoutOutlined />,
     action: handleLogout,
     roles: ["SUPER_ADMIN", "ACCOUNT_ADMIN", "AUDIT_ADMIN","AUDITOR"],
   },
 ];

 const filterMenuItems = (items, role) => {
   return items
     .filter((item) => item.roles.includes(role))
     .map((item) => {
       if (item.children) {
         return {
           ...item,
           children: filterMenuItems(item.children, role),
         };
       }
       return item;
     });
 };

 const filteredMenuItems = filterMenuItems(menuItems, role);


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
                      {user?.userName ? user.userName : "User"}
                    </div>
                    <div className="text-xs text-lightGrey"> {roles}</div>
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
                {filteredMenuItems.map((item) =>
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
