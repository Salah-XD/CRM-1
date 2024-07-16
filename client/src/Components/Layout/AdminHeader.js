import React from "react";
import { Layout } from "antd";

const { Header } = Layout;

const AdminHeader = ({ name = "CRM App" }) => {
  return (
    <Header className="bg-white top-0 z-50 text-black flex items-center justify-start px-4 shadow-md mb-1">
      <img src="/logo.png" alt="CRM Logo" className="h-12 w-15 mr-2" />
      <span className="text-xl font-semibold">{name}</span>
    </Header>
  );
};

export default AdminHeader;
