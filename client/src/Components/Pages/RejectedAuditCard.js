import React, { useState, useEffect, useCallback } from "react";
import { Input, Space, Select, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "../Layout/AdminDashboard";
import axios from "axios";
import AuditCard from "../Layout/AuditCard";

const RejectedAuditCard = () => {
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [audits, setAudits] = useState([]); // State to store audits
  const [auditors, setAuditors] = useState([]); // State to store auditor options
  const [selectedAuditor, setSelectedAuditor] = useState("none"); // Default to "None"
  const navigate = useNavigate();

  // Fetch audit data function
  const fetchAudits = useCallback(
    (filters = {}) => {
      setLoading(true);

      // Construct query parameters
      const { searchQuery, userId } = filters;
      const queryParams = new URLSearchParams({
        status: "rejected",
        ...(searchQuery && { searchQuery }),
        ...(userId && { userId }),
      }).toString();

      const url = `/api/auditor/getAllAudits?${queryParams}`;
      axios
        .get(url)
        .then((response) => {
          if (response.data.success) {
            setAudits(response.data.data); // Store fetched audits in state
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching audits:", error);
          setLoading(false);
        });
    },
    []
  );

  // Fetch auditor options
  const fetchAuditors = useCallback(() => {
    axios
      .get("/api/auditor/getAuditAdmins")
      .then((response) => {
        if (response.data.success) {
          setAuditors(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching auditors:", error));
  }, []);

  useEffect(() => {
    fetchAudits(); // Fetch audits on component mount
    fetchAuditors(); // Fetch auditors on component mount
  }, [fetchAudits, fetchAuditors]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);

    // Reset filter to "None" when searching
    setSelectedAuditor("none");

    // Trigger search
    fetchAudits({ searchQuery: value });
  };

  const handleAuditorChange = (value) => {
    setSelectedAuditor(value);

    // Fetch audits filtered by the selected auditor
    const userId = value === "none" ? null : value; // Handle "None" as no filter
    fetchAudits({ userId });
  };

  return (
    <AdminDashboard>
      <div className="bg-blue-50 m-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Rejected Audits</h2>
        </div>

        <div className="flex justify-end my-4">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-semibold">Filters</h2>
            </div>
            <div className="ml-5">
              <Select
                showSearch
                placeholder="Select an Auditor"
                optionFilterProp="label"
                options={[
                  { value: "none", label: "None" }, // Default "None" option
                  ...auditors.map((auditor) => ({
                    value: auditor._id,
                    label: auditor.userName,
                  })),
                ]}
                value={selectedAuditor}
                onChange={handleAuditorChange}
                style={{ width: 200 }}
              />
            </div>
            <Input
              size="default"
              placeholder="Search"
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={handleInputChange}
              style={{ width: 300 }}
            />
          </div>
        </div>

        <div>
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Spin size="medium" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 p-4">
              {audits.map((audit) => (
                <AuditCard
                  key={audit._id}
                  status={audit.status}
                  auditorName={audit.userName}
                  fboName={audit.fbo_name}
                  outletName={audit.outlet_name}
                  location={audit.location}
                  date={new Date(audit.started_at).toLocaleDateString()}
                  proposalNumber={audit.proposal_number}
                  auditNumber={audit.audit_number}
                  id={audit._id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminDashboard>
  );
};

export default RejectedAuditCard;
