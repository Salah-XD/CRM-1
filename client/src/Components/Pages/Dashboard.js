import React from "react";
import {
  HeartOutlined,
  CalendarOutlined,
  DollarOutlined,
  AimOutlined,
} from "@ant-design/icons";
import AdminDashboard from "../Layout/AdminDashboard";

const Dashboard = () => {
  const data = [
    {
      icon: (
        <HeartOutlined className="text-blue-500" style={{ fontSize: "24px" }} />
      ),
      value: "178+",
      label: "Audits done today",
    },
    {
      icon: (
        <CalendarOutlined
          className="text-yellow-500"
          style={{ fontSize: "24px" }}
        />
      ),
      value: "404",
      label: "Week achievement",
    },
    {
      icon: (
        <DollarOutlined className="text-red-500" style={{ fontSize: "24px" }} />
      ),
      value: "₹1.6 L",
      label: "Week sales",
    },
    {
      icon: (
        <AimOutlined className="text-purple-500" style={{ fontSize: "24px" }} />
      ),
      value: "₹20 L",
      label: "Month Target",
    },
  ];

  return (
    <AdminDashboard>
      <div className="p-6 bg-blue-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-white rounded shadow-md"
            >
              <div className="mr-4">{item.icon}</div>
              <div>
                <div className="text-xl font-bold">{item.value}</div>
                <div className="text-gray-500">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminDashboard>
  );
};

export default Dashboard;
