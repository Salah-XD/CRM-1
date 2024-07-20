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
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  FilterOutlined,
  CloudDownloadOutlined,
  MoreOutlined,
  SearchOutlined,
  MailOutlined,
  EditOutlined,
  EyeOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import AdminDashboard from "../Layout/AdminDashboard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import GenerateProposalModal from "./GenerateProposalModal";
import EnquiryForm from "./EnquiryForm";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;
const { Search } = Input;

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

const EnquiryTable = () => {
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
  const [isEnquiryModalVisible, setIsEnquiryModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
   const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  const navigate = useNavigate();

  // Toggling
  const showModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
    setIsModalVisible(true);
  };

  const handleOk = () => {
      fetchData(); 
    setSelectedId(null);
    setIsModalOpen(false);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setSelectedId(null);
    setIsModalOpen(false);
    setIsModalVisible(false);
  };

  //For Enquiry Model
  const showEnquiryModal = () => {
    setIsModalOpen(true);
    setIsEnquiryModalVisible(true);
  };

  const closeEnquiryModal = () => {
    setIsModalOpen(false);
    setIsEnquiryModalVisible(false);
        setSelectedEnquiryId(null);
  };

 const handleOkEnquiryModel = () => {
   fetchData(); // Fetch updated data after adding an enquiry
   setIsModalOpen(false);
   setIsEnquiryModalVisible(false);
 };


  const showEditModal = (enquiryId = null) => {
    setSelectedEnquiryId(enquiryId);
    setIsEnquiryModalVisible(true);
  };



  // Fetch data function
  const fetchData = useCallback(() => {
    setLoading(true);

    // Construct the URL with the businessId included in the path
    const url = "/api/enquiry/getAllEnquiryDetails";

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
          .delete("/api/enquiry/deleteFields", { data: selectedRows })
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
        .delete("/api/enquiry/deleteFields", { data: [id] }) // Send ID as an array
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

  // Handle Menu
  const handleMenuClick = (record, { key }) => {
    switch (key) {
      case "generate_proposal":
        showModal(record._id);
        break;
      case "delete":
        showSingleDeleteConfirm(record._id);
      break;
      case "edit":
        showEditModal(record._id);

      break;
      default:
       
    }
  };


  const menu = (record) => (
    <Menu
      onClick={(e) => handleMenuClick(record, e)}
      style={{ padding: "8px" }}
    >
      <Menu.Item
        key="generate_proposal"
        style={{ margin: "8px 0", backgroundColor: "#E0F7FA" }}
      >
        <span
          style={{ color: "#00796B", fontWeight: "bold", fontSize: "12px" }}
        >
          Generate Proposal
        </span>
      </Menu.Item>

      {/* <Menu.Item
        key="send-mail"
        style={{ margin: "8px 0", backgroundColor: "#FFE0B2" }}
      >
        <span
          style={{ color: "#E65100", fontWeight: "bold", fontSize: "12px" }}
        >
          <MailOutlined /> Send Mail
        </span>
      </Menu.Item> */}
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
      <Menu.Item
        key="edit"
        style={{ margin: "8px 0", backgroundColor: "#E1BEE7" }}
      >
        <span
          style={{ color: "#4A148C", fontWeight: "bold", fontSize: "12px" }}
        >
          <EditOutlined /> Edit
        </span>
      </Menu.Item>
    </Menu>
  );

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

  const columns = [
    {
      title: "FBO Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contact Person",
      dataIndex: "contact_person",
      key: "contact_person",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Enquiry Date",
      dataIndex: "enquiry_date",
      key: "enquiry_date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color;
        if (status === "New Enquiry") {
          color = "volcano";
        } else if (status === "Proposal Done") {
          color = "green";
        } else {
          color = "red";
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },

    // },
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

  return (
    <AdminDashboard>
      <div className="bg-blue-50 m-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Enquiry From Customer</h2>
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

            <Button
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              size="default"
              onClick={showEnquiryModal}
            >
              Add New
            </Button>
          </div>
        </div>

        <div className="flex justify-between my-4">
          <ConfigProvider
            theme={{
              components: {
                Radio: {
                  buttonBorderWidth: 0, // Remove border
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
                value="newenquiry"
                style={{
                  backgroundColor:
                    sortData === "newenquiry" ? "transparent" : "white",
                  color: sortData === "newenquiry" ? "black" : "black",
                  padding: "0 16px",
                  height: "32px",
                  lineHeight: "30px",
                  border: "1px solid #d3d3d3",
                  fontWeight: sortData === "alllist" ? "normal" : "500",
                }}
              >
                New Enquiry
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
                colorTextHeading: "#4A5568", // Darker grey color for titles
                colorText: "#4A5568", // Darker grey color for general text
                fontWeight: "bold", // Make text bold
              },
              components: {
                Table: {
                  colorText: "#4A5568", // Darker grey color for table text
                  fontWeight: "bold", // Make table text bold
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
      <GenerateProposalModal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        enquiryId={selectedId}
      />
      <EnquiryForm
        visible={isEnquiryModalVisible}
        onClose={closeEnquiryModal}
        handleOkEnquiryModel={handleOkEnquiryModel}
        enquiryId={selectedEnquiryId}
      />
    </AdminDashboard>
  );
};

export default EnquiryTable;
