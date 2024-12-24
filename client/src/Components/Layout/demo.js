import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  UserOutlined,
  DashboardOutlined,
  MailOutlined,
  MessageOutlined,
  FileTextOutlined,
  CrownFilled,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import AdminHeader from "./AdminHeader";

const { Sider, Content } = Layout;

const items = [
  {
    label: "Dashboards",
    key: "2",
    icon: <DashboardOutlined />,
    link: "/option1",
  },
  { label: "Client Profiles", key: "1", icon: <UserOutlined />, link: "/" },
  { label: "Enquires", key: "3", icon: <MailOutlined />, link: "/files" },
  { label: "Proposals", key: "4", icon: <UserOutlined />, link: "/files" },
  { label: "Invoices", key: "5", icon: <MessageOutlined />, link: "/files" },
  { label: "Agreement", key: "6", icon: <FileTextOutlined />, link: "/files" },
  { label: "Logout", key: "7", icon: <LogoutOutlined />, link: "/files" },
];

const AdminDashboard = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          width={200}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            transition: "width 0.3s ease", // Adjust transition duration
            willChange: "width", // Optimize for transition
            zIndex: 1000, // Ensure the Sider stays above other content during transition
          }}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="light"
        >
          <div className="flex mt-4 justify-center mb-4 ">
            <div className="mr-2 text-4xl">
              <CrownFilled />
            </div>
            <div>
              <div className="">Venkat</div>
              <div className="text-xs text-ligtGrey">Super Admin</div>
            </div>
          </div>
          <Menu defaultSelectedKeys={["1"]} mode="inline">
            {items.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                <NavLink to={item.link} className="text-white">
                  {item.label}
                </NavLink>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout
          style={{
            marginLeft: collapsed ? 80 : 200,
            transition: "margin-left 0.3s ease", // Adjust transition duration
            willChange: "margin-left", // Optimize for transition
          }}
          className="bg-white"
        >
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AdminDashboard;
