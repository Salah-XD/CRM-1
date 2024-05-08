import React from "react";
import { Layout } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Header } = Layout;

const AdminHeader = () => {
  return (
    <Header className="bg-white  top-0 z-50 text-black flex items-center justify-start px-4 shadow-md mb-1">
      <CheckCircleOutlined className="text-green-600 text-3xl mr-2" />
      <span className="text-xl font-semibold mr-4">CRM App</span>
    </Header>
  );
};

export default AdminHeader;
