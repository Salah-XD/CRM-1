import React, { useState } from "react";
import {
  FileDoneOutlined, // Proposal Done
  CheckCircleOutlined, // Audit Done
  CreditCardOutlined, // Invoice Done
  DollarOutlined, // Week Sales (remains the same)
} from "@ant-design/icons";
import AdminDashboard from "../Layout/AdminDashboard";

const Dashboard = () => {
  const [auditFilter, setAuditFilter] = useState("overall");

  // Data for dashboard cards
  const data = [
    {
      icon: (
        <FileDoneOutlined className="text-blue-600" style={{ fontSize: "28px" }} />
      ),
      value: "120+",
      label: "Proposals done overall",
    },
    {
      icon: (
        <CheckCircleOutlined
          className="text-green-600"
          style={{ fontSize: "28px" }}
        />
      ),
      value: auditFilter === "today" ? "20" : auditFilter === "week" ? "100" : auditFilter === "month" ? "150" : "178+",
      label: `Audits done ${auditFilter}`,
      filter: (
        <div className="mt-3">
          <select
            value={auditFilter}
            onChange={(e) => setAuditFilter(e.target.value)}
            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="overall">Overall</option>
          </select>
        </div>
      ),
    },
    {
      icon: (
        <CreditCardOutlined
          className="text-orange-600"
          style={{ fontSize: "28px" }}
        />
      ),
      value: "350",
      label: "Invoices done overall",
    },
    {
      icon: (
        <DollarOutlined className="text-red-600" style={{ fontSize: "28px" }} />
      ),
      value: "₹1.6 L",
      label: "Week sales",
    },
  ];

  return (
    <AdminDashboard>
      <div className="p-8 bg-blue-50 min-h-screen">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mr-6">{item.icon}</div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                <div className="text-gray-600 mt-1">{item.label}</div>
                {item.filter && item.filter}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminDashboard>
  );
};

export default Dashboard;
