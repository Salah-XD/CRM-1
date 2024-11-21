import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Radio,
  Input,
  Modal,
  Menu,
  ConfigProvider,
  Select,
  message,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import AdminDashboard from "../Layout/AdminDashboard";
import axios from "axios";
import toast from "react-hot-toast";
import { ExclamationCircleFilled } from "@ant-design/icons";
import AuditDateModal from "../Layout/AuditDateModal";

const { confirm } = Modal;
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

const ApprovedAuditCard = () => {
  const [flattenedTableData, setFlattenedTableData] = useState([]);
  const [sortData, setSortData] = useState("alllist");
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 8,
      total: 0,
    },
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleInvoice, setIsModalVisibleInvoice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalId, setProposalId] = useState(null);
  const [showSendMailModal, setShowSendMailModal] = useState(false);
  const [auditModal, setAuditModal] = useState(false);
  const [auditorName,setAuditorName]=useState("");
  const [auditorId,setAuditorId]=useState();
  const [auditors, setAuditors] = useState([]);
  const navigate = useNavigate();

  // Toggling


  const showModalInvoice = (proposalId) => {
    console.log(proposalId);
    setProposalId(proposalId);
    setIsModalVisibleInvoice(true);
  };

  const showModalAgreement = (proposalId) => {
    setProposalId(proposalId);
    setIsModalVisible(true);
  };

  const showSendMail = (proposalId) => {
    setProposalId(proposalId);
    setShowSendMailModal(true);
  };


  // Fetch data function
  const fetchData = useCallback(() => {
    setLoading(true);
    const url = "/api/proposal/getAllProposalDetails";

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
          key: `${row._id}-${index}`, // Combine _id with index for a unique key
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
        const response = await axios.get("/api/auditor/getAllAuditors"); // Adjust the endpoint as needed
        setAuditors(response.data);
        console.log(response.data);
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

  // Row Selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };

  // Show confirm Delete
  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure delete?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        axios
          .delete("/api/proposal/deleteFields", { data: selectedRows })
          .then((response) => {
            const currentPage = tableParams.pagination.current;
            const pageSize = tableParams.pagination.pageSize;
            const newTotal = tableParams.pagination.total - selectedRows.length;
            const newCurrentPage = Math.min(
              currentPage,
              Math.ceil(newTotal / pageSize)
            );

            setTableParams((prevState) => ({
              ...prevState,
              pagination: {
                ...prevState.pagination,
                total: newTotal,
                current: newCurrentPage,
              },
            }));

            setSelectedRows([]);
            setShouldFetch(true); // Trigger data fetch
            toast.success("Successfully Deleted");
          })
          .catch((error) => {
            console.error("Error deleting rows:", error);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const showSingleDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure delete?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        axios
          .delete("/api/proposal/deleteFields", { data: [id] }) // Send ID as an array
          .then((response) => {
            const currentPage = tableParams.pagination.current;
            const pageSize = tableParams.pagination.pageSize;
            const newTotal = tableParams.pagination.total - 1; // Only one row is deleted
            const newCurrentPage = Math.min(
              currentPage,
              Math.ceil(newTotal / pageSize)
            );

            setTableParams((prevState) => ({
              ...prevState,
              pagination: {
                ...prevState.pagination,
                total: newTotal,
                current: newCurrentPage,
              },
            }));

            setShouldFetch(true); // Trigger data fetch
            toast.success("Successfully Deleted");
          })
          .catch((error) => {
            console.error("Error deleting row:", error);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleAuditorChange=(auditorName,record)=>{
    setAuditorName(auditorName);
    setAuditorId(record._id);
    setAuditModal(true);

  }
  const handleCloseModal = () => {
    
    setAuditModal(false);
  }

  const handleConfirm=()=>{
          
  }
  
  // Handle Menu
  const handleMenuClick = (record, { key }) => {
    console.log("Menu clicked for record:", record); // Debugging
    console.log("Record _id:", record._id); // Debugging

    switch (key) {
      case "generate_agreement":
        showModalAgreement(record._id);
        break;

      case "send_mail":
        showSendMail(record._id);
        break;

      case "generate_invoice":
        showModalInvoice(record._id);
        break;

      case "delete":
        showSingleDeleteConfirm(record._id);
        break;

      case "view":
        navigate(`/proposal/view-proposal/${record._id}`);
        break;

      default:
        break;
    }
  };

  const menu = (record) => (
    <Menu
      onClick={(e) => handleMenuClick(record, e)}
      style={{ padding: "8px" }}
    >
      <Menu.Item
        key="generate_agreement"
        style={{ margin: "8px 0", backgroundColor: "#E0F7FA" }}
      >
        <span
          style={{ color: "#00796B", fontWeight: "bold", fontSize: "12px" }}
        >
          Generate Agreement
        </span>
      </Menu.Item>
      <Menu.Item
        key="generate_invoice"
        style={{ margin: "8px 0", backgroundColor: "#E0F7FA" }}
      >
        <span
          style={{ color: "#00796B", fontWeight: "bold", fontSize: "12px" }}
        >
          Generate Invoice
        </span>
      </Menu.Item>
      <Menu.Item
        key="view"
        style={{ margin: "8px 0", backgroundColor: "#E1BEE7" }}
      >
        <span
          style={{ color: "#4A148C", fontWeight: "bold", fontSize: "12px" }}
        >
          <EyeOutlined /> View
        </span>
      </Menu.Item>
      <Menu.Item
        key="send_mail"
        style={{ margin: "8px 0", backgroundColor: "#FFE0B2" }}
      >
        <span
          style={{ color: "#E65100", fontWeight: "bold", fontSize: "12px" }}
        >
          <MailOutlined /> Send Mail
        </span>
      </Menu.Item>
      <Menu.Item
        key="delete"
        style={{ margin: "8px 0", backgroundColor: "#FFCDD2" }}
      >
        <span
          style={{ color: "#B71C1C", fontWeight: "bold", fontSize: "12px" }}
        >
          <DeleteOutlined /> Delete
        </span>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Auditor Name",
      dataIndex: "auditor_name",
      key: "auditor_name",
      render: (text, record) => (
        <Select
          defaultValue={text}
          style={{ width: 150 }}
          onChange={(value) => handleAuditorChange(value, record)}
        >
          {auditors.map((auditor) => (
            <Option key={auditor._id} value={auditor.auditor_name}>
              {auditor.auditor_name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Proposal Number",
      dataIndex: "proposal_number",
      key: "proposal_number",
    },
    {
      title: "Auditor Number",
      dataIndex: "auditor_number",
      key: "auditor_number",
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

    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status, record) => {
    //     const statusOptions = [
    //       "yet to start",
    //       "Submitted",
    //       "Assigned",
    //       "Reamend",
    //       "Completed",
    //     ];

    //     const getTagColor = (option) => {
    //       switch (option) {
    //         case "Assigned":
    //           return "volcano";
    //         case "Reamend":
    //           return "blue";
    //         case "Submitted":
    //           return "green";
    //         case "Completed":
    //           return "green";
    //         case "yet to start":
    //           return "blue";
    //       }
    //     };

    //     return (
    //       <Select
    //         defaultValue={status}
    //         style={{
    //           width: "auto",
    //           minWidth: "120px",
    //           border: "none",
    //           boxShadow: "none",
    //           padding: "0",
    //         }}
    //         dropdownStyle={{
    //           width: "auto",
    //           border: "none", // Remove border from dropdown
    //         }}
    //         onChange={(value) => handleStatusChange(value, record)}
    //       >
    //         {statusOptions.map((option) => (
    //           <Select.Option key={option} value={option}>
    //             <Tag color={getTagColor(option)}>{option.toUpperCase()}</Tag>
    //           </Select.Option>
    //         ))}
    //       </Select>
    //     );
    //   },
    // },

    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Dropdown
    //       overlay={menu(record)}
    //       trigger={["click"]}
    //       placement="bottomLeft"
    //       arrow
    //       danger
    //     >
    //       <Button type="link" icon={<MoreOutlined />} />
    //     </Dropdown>
    //   ),
    // },
  ];

  // Fetch data when shouldFetch changes
  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setShouldFetch(false);
    }
  }, [shouldFetch, fetchData]);

  // Fetch data with debounce
  const fetchDataWithDebounce = debounce(() => {
    // if (searchKeyword.trim()) {
    // Your backend call logic here
    // console.log("Fetching data for keyword:", searchKeyword);
    //}
  }, debounceDelay);

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

  const handleStatusChange = (value, record) => {
    axios
      .put(`/api/proposal/updateProposalStatus/${record._id}`, {
        status: value,
      })
      .then((response) => {
        message.success("Status updated successfully");
        setShouldFetch(true);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        toast.error("Failed to update status");
      });
  };
  return (
    <AdminDashboard>
      <div className="bg-blue-50 m-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Unassigned Audit Works</h2>
          <div className="space-x-2">
            {/* <Space wrap>
              <Button
                onClick={showDeleteConfirm}
                icon={<DeleteOutlined />}
                disabled={selectedRowKeys.length === 0}
                shape="round"
              >
                Delete
              </Button>
            </Space> */}
            {/* <Button shape="round" icon={<FilterOutlined />} size="default">
              Filters
            </Button>
            <Button
              shape="round"
              icon={<CloudDownloadOutlined />}
              size="default"
            >
              Export
            </Button> */}
          </div>
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
              // rowSelection={{
              //   type: selectionType,
              //   ...rowSelection,
              // }}
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
        visible={auditModal}
        onCancel={handleCloseModal}
         onConfirm={handleConfirm}
      />
    </AdminDashboard>
  );
};

export default ApprovedAuditCard;
