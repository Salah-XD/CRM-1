import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FileDoneOutlined, // Proposal Done
  CheckCircleOutlined, // Audit Done
  CreditCardOutlined, // Invoice Done
} from "@ant-design/icons";
import AdminDashboard from "../Layout/AdminDashboard";

const Dashboard = () => {
  const [proposalFilter, setProposalFilter] = useState("overall");
  const [invoiceFilter, setInvoiceFilter] = useState("overall");

  const [proposalCount, setProposalCount] = useState("Loading...");
  const [invoiceCount, setInvoiceCount] = useState("Loading...");

  // Fetch proposal count based on the filter
  useEffect(() => {
    const fetchProposalCount = async () => {
      try {
        const response = await axios.get(
          `/api/proposal/proposalcount?filter=${proposalFilter}`
        );
        setProposalCount(response.data.count || "0");
      } catch (error) {
        console.error("Error fetching proposal count:", error);
        setProposalCount("Error");
      }
    };

    fetchProposalCount();
  }, [proposalFilter]);

  // Fetch invoice count based on the filter
  useEffect(() => {
    const fetchInvoiceCount = async () => {
      try {
        const response = await axios.get(
          `/api/invoice/invoicecount?filter=${invoiceFilter}`
        );
        setInvoiceCount(response.data.count || "0");
      } catch (error) {
        console.error("Error fetching invoice count:", error);
        setInvoiceCount("Error");
      }
    };

    fetchInvoiceCount();
  }, [invoiceFilter]);

  // Data for dashboard cards
  const data = [
    {
      icon: (
        <FileDoneOutlined
          className="text-blue-600"
          style={{ fontSize: "28px" }}
        />
      ),
      value: proposalCount,
      label: `Proposals done ${proposalFilter}`,
      filter: (
        <div className="mt-3">
          <select
            value={proposalFilter}
            onChange={(e) => setProposalFilter(e.target.value)}
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
      value: invoiceCount,
      label: `Invoices done ${invoiceFilter}`,
      filter: (
        <div className="mt-3">
          <select
            value={invoiceFilter}
            onChange={(e) => setInvoiceFilter(e.target.value)}
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
        <CheckCircleOutlined
          className="text-green-600"
          style={{ fontSize: "28px" }}
        />
      ),
      value: "Coming soon", // Placeholder for audit data
      label: "Audits done overall",
      filter: null, // No filter for now
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
                <div className="text-2xl font-semibold text-gray-900">
                  {item.value}
                </div>
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
