import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FileDoneOutlined, // Proposal Done
  CheckCircleOutlined, // Audit Done
  CreditCardOutlined, // Invoice Done
} from "@ant-design/icons";
import { Spin } from "antd"; // Import Spin
import AdminDashboard from "../Layout/AdminDashboard";

const Dashboard = () => {
  const [filter, setFilter] = useState("overall");
  const [counts, setCounts] = useState({
    proposalCount: null, // null indicates loading
    invoiceCount: null,
    auditCount: null, // Placeholder for audit data
  });

  // Fetch counts based on the filter
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        console.log("Fetching counts with filter:", filter); // Debugging step

        const [proposalResponse, invoiceResponse, auditResponse] = await Promise.all([
          axios.get(`/api/proposal/proposalcount?filter=${filter}`),
          axios.get(`/api/invoice/invoicecount?filter=${filter}`),
          axios.get(`/api/auditor/auditManagementCount?filter=${filter}`), // Make sure filter is being used here
        ]);

        // Log the responses for debugging
        console.log("Proposal Response:", proposalResponse);
        console.log("Invoice Response:", invoiceResponse);
        console.log("Audit Response:", auditResponse);

        setCounts({
          proposalCount: proposalResponse.data.count || "0",
          invoiceCount: invoiceResponse.data.count || "0",
          auditCount: auditResponse.data.count || "0", // Update if there's audit data
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
        setCounts((prev) => ({
          ...prev,
          proposalCount: "Error",
          invoiceCount: "Error",
          auditCount: "Error", // Keep as "Coming soon" in case of error
        }));
      }
    };

    fetchCounts();
  }, [filter]);

  // Data for dashboard cards
  const data = [
    {
      icon: (
        <FileDoneOutlined
          className="text-blue-600"
          style={{ fontSize: "28px" }}
        />
      ),
      value: counts.proposalCount !== null ? (
        counts.proposalCount
      ) : (
        <Spin size="small" /> // Show Spin while loading
      ),
      label: `Proposals done ${filter}`,
    },
    {
      icon: (
        <CreditCardOutlined
          className="text-orange-600"
          style={{ fontSize: "28px" }}
        />
      ),
      value: counts.invoiceCount !== null ? (
        counts.invoiceCount
      ) : (
        <Spin size="small" /> // Show Spin while loading
      ),
      label: `Invoices done ${filter}`,
    },
    {
      icon: (
        <CheckCircleOutlined
          className="text-green-600"
          style={{ fontSize: "28px" }}
        />
      ),
      value: counts.auditCount !== null ? (
        counts.auditCount
      ) : (
        <Spin size="small" /> // Show Spin while loading
      ),// Audit count remains static for now
      label: `Audits done ${filter}`,
    },
  ];

  return (
    <AdminDashboard>
      <div className="p-8 bg-blue-50 min-h-screen">
        <div className="flex justify-between">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Dashboard
          </h2>
          <div className="flex ">
            <h1 className="text-3xl mr-4 ">Filter</h1>

            <div className="mb-6">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="overall">Overall</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mr-6">{item.icon}</div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">
                  {item.value}
                </div>
                <div className="text-gray-600 mt-1">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminDashboard>
  );
};

export default Dashboard;
