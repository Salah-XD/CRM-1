import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Radio,
  Button,
  Input,
  Checkbox,
  Tag,
  Space,
  Modal,
  Dropdown,
  Menu,
  ConfigProvider,
  Select,
  message
} from "antd";
import {
  DeleteOutlined,
  MoreOutlined,
  SearchOutlined,
  MailOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import AdminDashboard from "../Layout/AdminDashboard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ExclamationCircleFilled } from "@ant-design/icons";
import GenerateProposalSendMail from "./GenerateProposalSendMail";


const { confirm } = Modal;

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

const AgreementTable = () => {
  const [flattenedTableData, setFlattenedTableData] = useState([]);
  const [sortData, setSortData] = useState("alllist");
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 8, // Adjust page size as needed
      total: 0, // Initial total count
    },
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleAgreement, setIsModalVisibleAgreement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreementId, setAgreementId] = useState(null);
  const [proposalIds,setProposalIds]=useState([]);
  const  [outletIds,setOutletIds]=useState([]);
  const [showSendMailModal, setShowSendMailModal] = useState(false);
  
  const navigate = useNavigate();

  // Toggling

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAgreementOk = () => {
    setIsModalVisibleAgreement(false);
  };

  const handleAgreementCancel = () => {
    setIsModalVisibleAgreement(false);
  };

  const showModalAgreement = (agreementId) => {
    console.log(agreementId);
    setAgreementId(agreementId);
    setIsModalVisibleAgreement(true);
  };

  // Fetch data function
  const fetchData = useCallback(() => {
    setLoading(true);

    // Construct the URL with the businessId included in the path
    const url = "/api/agreement/getAllAgreementDetails";

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
            total: total, // Set the total count from the server response
            current: currentPage, // Update current page from response
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
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // Set selected row keys and rows
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
  
      // Extract proposalIds and outletIds from selected rows
      const selectedProposalIds = selectedRows.map((row) => row.proposalId);
      const selectedOutletIds = selectedRows.map((row) => row.outlets);
  
      // Set the proposalIds and outletIds state
      setProposalIds(selectedProposalIds);
      setOutletIds(selectedOutletIds);
  
      // Console log the proposalIds and outletIds
      console.log("Selected Proposal IDs:", selectedProposalIds);
      console.log("Selected Outlet IDs:", selectedOutletIds);
    },
  };
  

  const handleStatusChange = (value, record) => {
    axios
      .put(`/api/agreement//updateAgreementStatus/${record._id}`, {
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

  // Show confirm Delete
  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure delete?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {

        const requestData = {
          proposalId: proposalIds,
          outletId: outletIds,
          id:selectedRows,
        };
        axios
          .delete("/api/agreement/deleteFields", { data: requestData })
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

  const showSingleDeleteConfirm = (id,proposalId,outletId) => {
    confirm({
      title: "Are you sure delete?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        axios
          .delete("/api/agreement/deleteFields", { data: {
            id: [id],                   // Single ID to delete
            proposalId: [proposalId], // Array of proposal IDs
            outletId: [outletId]      // Array of outlet IDs
          }}) // Send ID as an array
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

  //handle showSendMail
  const showSendMail = (agreementId) => {
    setAgreementId(agreementId);
    setShowSendMailModal(true);
  };

  const showCloseSendMail = () => {
    setShowSendMailModal(false);
    setAgreementId(null);
  };

  // Handle Menu
  const handleMenuClick = (record, { key }) => {
    switch (key) {
      case "generate_agreement":
        showModalAgreement(record._id);
        break;

      case "delete":
        showSingleDeleteConfirm(record._id,record.proposalId,record.outlets);
        break;

      case "view":
        navigate(`/agreement/view-agreement/${record._id}`);
        break;

      case "send_mail":
        showSendMail(record._id);
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
      title: "FBO Name",
      dataIndex: "fbo_name",
      key: "fbo_name",
    },

    {
      title: "Agreement Date",
      dataIndex: "agreement_date",
      key: "agreement_date",
    },

    {
      title: "Total No. of Outlets",
      dataIndex: "no_of_outlets",
      key: "no_of_outlets",
    },

   

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const statusOptions = [
          "Mail not sent",
          "Mail Sent",
          "Audit Planned Done",
          "Hold",
        ];
    
        const getTagColor = (option) => {
          switch (option) {
            case "Mail not sent":
              return "grey";
            case "Mail Sent":
              return "volcano";
            case "Audit Planned Done":
              return "green";
            case "Hold":
              return "orange";
            default:
              return "blue";
          }
        };

        return (
          <Select
            defaultValue={status}
            style={{
              width: "auto",
              minWidth: "120px",
              border: "none",
              boxShadow: "none",
              padding: "0",
            }}
            dropdownStyle={{
              width: "auto",
              border: "none", // Remove border from dropdown
            }}
            onChange={(value) => handleStatusChange(value, record)}
          >
            {statusOptions.map((option) => (
              <Select.Option key={option} value={option}>
                <Tag color={getTagColor(option)}>{option.toUpperCase()}</Tag>
              </Select.Option>
            ))}
          </Select>
        );
      },
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown
          overlay={menu(record)}
          trigger={["click"]}
          placement="bottomLeft"
          arrow
          danger
        >
          <Button type="link" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Fetch data with debounce
  const fetchDataWithDebounce = debounce(() => {
    if (searchKeyword.trim()) {
      // Your backend call logic here
      console.log("Fetching data for keyword:", searchKeyword);
    }
  }, debounceDelay);

  // Fetch initial data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch data when shouldFetch changes
  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setShouldFetch(false);
    }
  }, [shouldFetch, fetchData]);
  const handleInputChange = (event) => {
    if (isModalOpen) return;

    const { value } = event.target;
    setSearchKeyword(value);
  };

  useEffect(() => {
    if (searchKeyword.trim()) {
      fetchDataWithDebounce();
    } else {
      // Reset fields to normal state
      // Your code to reset fields here
      console.log("Resetting fields to normal state");
    }
  }, [searchKeyword, fetchDataWithDebounce]);

  return (
    <AdminDashboard>
      <div className="bg-blue-50 m-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Agreement Table</h2>
          <div className="space-x-2">
            <Space wrap>
              <Button
                onClick={showDeleteConfirm}
                icon={<DeleteOutlined />}
                disabled={selectedRowKeys.length === 0}
                shape="round"
              >
                Delete
              </Button>
            </Space>
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
                value="newagreement"
                style={{
                  backgroundColor:
                    sortData === "newagreement" ? "transparent" : "white",
                  color: sortData === "newagreement" ? "black" : "black",
                  padding: "0 16px",
                  height: "32px",
                  lineHeight: "30px",
                  border: "1px solid #d3d3d3",
                  fontWeight: sortData === "alllist" ? "normal" : "500",
                }}
              >
                New Agreement
              </Radio.Button>
            </Radio.Group>
          </ConfigProvider>

          <div className="space-x-2">
            <Input
              size="default"
              placeholder="Search by FBO Name, Phone Number, etc."
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
              rowSelection={{
                type: selectionType,
                ...rowSelection,
              }}
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

      <GenerateProposalSendMail
        visible={showSendMailModal}
        onClose={showCloseSendMail}
        id={agreementId}
        name="agreement"
        route="generateagreement"
        title="Genrate Agreement"
        buttonTitle="Go to Agreement"
      />
    </AdminDashboard>
  );
};

export default AgreementTable;
