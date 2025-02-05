import React, { useState, useEffect, useCallback } from "react";
import { Table, Radio, Input, ConfigProvider, Select, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import AdminDashboard from "../Layout/AdminDashboard";
import axios from "axios";
import AuditDateModal from "../Layout/AuditDateModal";

const { Option } = Select;

// Debounce function definition
const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

// Define your debounce delay (e.g., 300ms)
const debounceDelay = 300;

const UnassignedAuditTable = () => {
  const [flattenedTableData, setFlattenedTableData] = useState([]);
  const [sortData, setSortData] = useState("alllist");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 8,
      total: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auditModal, setAuditModal] = useState(false);
  const [auditorName, setAuditorName] = useState("");
  const [auditorId, setAuditorId] = useState();
  const [auditors, setAuditors] = useState([]);
  const [proposalId, setProposalId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [location, setLocation] = useState("");
  const [outletName, setOutletName] = useState("");
  const [fboName, setFboName] = useState("");
  const [service, setService] = useState(""); 
  const [auditNumber, setAuditNumber] = useState("");
  const [selectedAuditor, setSelectedAuditor] = useState(null);
  const [proposalNumber, setProposalNumber] = useState("");
  const [customer_type, setCustomerType] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  // Fetch data function
  const fetchData = useCallback(() => {
    setLoading(true);
    const url = "/api/auditor/processProposalsWithOutlets";

    axios
      .get(url, {
        params: {
          page: tableParams.pagination.current,
          pageSize: tableParams.pagination.pageSize,
          sort: `${sortData}`,
          keyword: searchKeyword,
        },
      })
      .then((response) => {
        const { data } = response;
        const { data: responseData, total, currentPage } = data;

        const flattenedData = responseData.map((row, index) => ({
          ...row,
          key: `${row._id}-${index}`,
        }));
        setFlattenedTableData(flattenedData);

        setTableParams((prevState) => ({
          ...prevState,
          pagination: {
            ...prevState.pagination,
            total: total,
            current: currentPage,
          },
        }));

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [
    tableParams.pagination.current,
    tableParams.pagination.pageSize,
    sortData,
    searchKeyword,
  ]);

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchAllAuditors = async () => {
      try {
        const response = await axios.get("/api/auditor/getAuditAdmins"); // Adjust the endpoint as needed
        setAuditors(response.data.data);
        console.log("this is the resdfdfdponse" + response.data);
      } catch (error) {
        console.error("Error fetching auditors:", error);
      }
    };

    fetchData();
    fetchAllAuditors();
  }, [fetchData]);

  // Pagination
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    if (pagination.pageSize !== tableParams.pagination.pageSize) {
      setFlattenedTableData([]);
    }
  };
  const handleAuditorChange = (auditorName, record) => {
    setAuditorName(auditorName);
    setAuditorId(record.auditor_id);
    setOutletId(record.outlet_id);
    setProposalId(record.proposal_id);
    setLocation(record.location);
    setOutletName(record.outlet_name);
    setFboName(record.fbo_name);
    setAuditNumber(record.audit_number);
    setProposalNumber(record.proposal_number);
    setCustomerType(record.customer_type);
    setService(record.service);
    setAuditModal(true);
  };

  const handleCloseModal = () => {
    message.error("The auditor has not allocated");
    setSelectedAuditor(null);
    setAuditModal(false);
  };

  const handleConfirm = async ({ auditorId, auditDate, record }) => {
    console.log("this is the proposal number", proposalNumber);
    // // Prepare the request payload
    const requestData = {
      proposalId,
      outletId,
      outlet_name: outletName,
      user: auditorId,
      fbo_name: fboName,
      assigned_date: auditDate,
      audit_number: auditNumber,
      status: "assigned",
      proposal_number: proposalNumber,
      location,
      service,
      customer_type
    };

    try {
      const response = await axios.post(
        "/api/auditor/saveAuditRecord",
        requestData
      );
      message.success("The auditor has been allocated");
      
      fetchData();
      setAuditorName("");
      setAuditorId("");
      setOutletId("");
      setProposalId("");
      setLocation("");
      setOutletName("");
      setFboName("");
      setAuditNumber("");
      setProposalNumber("");
      setAuditModal(false);

      console.log("Audit record saved successfully:", response.data);
    } catch (error) {
      console.error(
        "Error saving audit record:",
        error.response?.data || error.message
      );
    }
  };

  const columns = [
    {
      title: "Auditor Name",
      dataIndex: "auditor_name",
      key: "auditor_name",
      render: (text, record) => {
        return (
          <Select
          value={record.auditor_name || "not-selected"} // Set default value if none is selected
          style={{ width: 150 }}
          onChange={(value) => {
            if (value === "not-selected") {
              handleAuditorChange("", { auditor_id: null, ...record }); // Handle "Not Selected"
            } else {
              const [auditorName, auditorId] = value.split("|"); // Decode value
              handleAuditorChange(
                auditorName,
                { auditor_id: auditorId, ...record } // Pass the row's data
              );
            }
          }}
        >
          <Option value="not-selected">Not Selected</Option> {/* Add Not Selected option */}
          {auditors.map((auditor) => (
            <Option
              key={auditor._id}
              value={`${auditor.userName}|${auditor._id}`}
            >
              {auditor.userName}
            </Option>
          ))}
        </Select>
        
        );
      },
    },
    {
      title: "FBO Name",
      dataIndex: "fbo_name",
      key: "fbo_name",
    },
    {
      title: "Proposal Number",
      dataIndex: "proposal_number",
      key: "proposal_number",
    },
    {
      title: "Auditor Number",
      dataIndex: "audit_number",
      key: "audit_number",
    },
    {
      title: "Outlet Name",
      dataIndex: "outlet_name",
      key: "outlet_name",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Date and time",
      dataIndex: "date_time",
      key: "date_time",
    },
  ];

  // Fetch data when shouldFetch changes
  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setShouldFetch(false);
    }
  }, [shouldFetch, fetchData]);

  // Fetch data with debounce
  const fetchDataWithDebounce = debounce(() => {}, debounceDelay);

  const handleInputChange = (event) => {
    if (isModalOpen) return;

    const { value } = event.target;
    setSearchKeyword(value);
  };

  useEffect(() => {
    if (searchKeyword.trim()) {
      fetchDataWithDebounce();
    }
  }, [searchKeyword, fetchDataWithDebounce]);

  return (
    <AdminDashboard>
      <div className="bg-blue-50 m-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Unassigned Audit Works</h2>
          <div className="space-x-2"></div>
        </div>

        <div className="flex justify-between my-4">
          <ConfigProvider
            theme={{
              components: {
                Radio: {
                  buttonBorderWidth: 0,
                },
              },
            }}
          >
            <Radio.Group
              value={sortData}
              onChange={(e) => setSortData(e.target.value)}
            >
              <Radio.Button
                value="alllist"
                style={{
                  backgroundColor:
                    sortData === "alllist" ? "transparent" : "white",
                  color: sortData === "alllist" ? "black" : "black",
                  padding: "0 16px",
                  height: "32px",
                  lineHeight: "30px",
                  border: "1px solid #d3d3d3",
                  fontWeight: sortData === "alllist" ? "500" : "normal",
                }}
              >
                All List
              </Radio.Button>
              <Radio.Button
                value="newproposal"
                style={{
                  backgroundColor:
                    sortData === "newproposal" ? "transparent" : "white",
                  color: sortData === "newproposal" ? "black" : "black",
                  padding: "0 16px",
                  height: "32px",
                  lineHeight: "30px",
                  border: "1px solid #d3d3d3",
                  fontWeight: sortData === "alllist" ? "normal" : "500",
                }}
              >
                New Audit
              </Radio.Button>
            </Radio.Group>
          </ConfigProvider>

          <div className="space-x-2">
            <Input
              size="default"
              placeholder="Search "
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={handleInputChange}
              style={{ width: 300 }}
            />
          </div>
        </div>

        <div>
          <ConfigProvider
            theme={{
              token: {
                colorTextHeading: "#4A5568",
                colorText: "#4A5568",
                fontWeight: "bold",
              },
              components: {
                Table: {
                  colorText: "#4A5568",
                  fontWeight: "bold",
                },
              },
            }}
          >
            <Table
              columns={columns}
              dataSource={flattenedTableData}
              rowKey={(record) => record.key}
              pagination={tableParams.pagination}
              loading={loading}
              onChange={handleTableChange}
            />
          </ConfigProvider>
        </div>
      </div>
      <AuditDateModal
        auditorName={auditorName}
        auditorId={auditorId}
        visible={auditModal}
        onCancel={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </AdminDashboard>
  );
};

export default UnassignedAuditTable;
