import React, { useState, useEffect } from "react";
import { Table, Radio, Button, Input, Checkbox, Tag, Space, Modal } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  FilterOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import AdminDashboard from "../Layout/AdminDashboard";
import axios from "axios";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import SendMailModal from "./SendMail";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

const { Search } = Input;

const ClientTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [flattenedTableData, setFlattenedTableData] = useState([]);
  const [sortData, setSortData] = useState("alllist");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 2,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading,setLoading]=useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, sortData]);

 const fetchData = () => {
   setLoading(true);
   axios
     .get(
       `getAllBussinesDetails?page=${pagination.current}&pageSize=${pagination.pageSize}&sort=${sortData}`
     )
     .then((response) => {
       const { businesses, totalPages, currentPage } = response.data;
       setFlattenedTableData(businesses.flatMap((row) => row)); // Flatten the table data
       setPagination((prevPagination) => ({
         ...prevPagination,
         current: currentPage,
         total: totalPages,
       }));
     })
     .catch((error) => {
       console.error("Error fetching data:", error);
     })
     .finally(() => {
       setLoading(false);
     });
 };


  const onSearch = (value) => console.log(value);

  const handleRowSelect = (selectedRowId) => {
    let updatedSelectedRows;

    if (selectedRowId === "all") {
      // If "all" is selected, select all rows
      updatedSelectedRows = flattenedTableData.map((item) => item._id);
    } else if (selectedRowId === null) {
      // If selectedRowId is null, remove all IDs
      updatedSelectedRows = [];
    } else if (selectedRows.includes(selectedRowId)) {
      // If the row is already selected, remove it from selectedRows
      updatedSelectedRows = selectedRows.filter((id) => id !== selectedRowId);
    } else {
      // If the row is not selected, add it to selectedRows
      updatedSelectedRows = [...selectedRows, selectedRowId];
    }

    setSelectedRows(updatedSelectedRows);
    console.log(updatedSelectedRows);
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure delete?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        axios
          .delete("deleteSelectedFields", { data: selectedRows })
          .then((response) => {
            fetchData(); // Fetch updated data after deletion
            setSelectedRows([]); // Clear selected rows
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

  const  handelDelete=()=>{
    if(!selectedRows){
      toast.error("Please Select Rows tod delete");
    }
  }


  const columns = [
    {
      title: (
        <Checkbox
          onChange={(e) => handleRowSelect(e.target.checked ? "all" : null)}
        />
      ),
      render: (_, record) => (
        <Checkbox
          onChange={(e) => handleRowSelect(record._id)}
          checked={selectedRows.includes(record._id)}
        />
      ),
    },
    {
      title: (
        <span className="text-gray-600 font-semibold text-gray-700">
          Business Name
        </span>
      ),
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: (
        <span className="text-gray-600 font-semibold text-gray-700">
          Contact Person
        </span>
      ),
      dataIndex: "contact_person",
      key: "contact_person",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: (
        <span className="text-gray-600 font-semibold text-gray-700">
          Phone Number
        </span>
      ),
      dataIndex: "phone",
      key: "phone",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: (
        <span className="text-gray-600 font-semibold text-gray-700">
          Mail ID
        </span>
      ),
      dataIndex: "email",
      key: "email",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: (
        <span className="text-gray-600 font-semibold text-gray-700">
          Outlets
        </span>
      ),
      dataIndex: "outletCount",
      key: "outletCount",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: (
        <span className="text-gray-600 font-semibold text-gray-700">
          Added By
        </span>
      ),
      dataIndex: "added_by",
      key: "added_by",
      render: (addedBy) => {
        let color =
          addedBy === "Manual"
            ? "volcano"
            : addedBy === "Web Enquiry"
            ? "geekblue"
            : "green";
        return <Tag color={color}>{addedBy.toUpperCase()}</Tag>;
      },
    },
    {
      title: (
        <span className="text-gray-600 font-semibold text-gray-700">
          Created On
        </span>
      ),
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => <span className="text-primary underline">{text}</span>,
    },
  ];

  return (
    <AdminDashboard>
      <div className="bg-white m-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Client List</h2>
          <div className="space-x-2">
            <Space wrap>
              <Button
                onClick={showDeleteConfirm}
                icon={<DeleteOutlined />}
                type="text"
              >
                <span className="text-gray-600 font-semibold"> Delete</span>
              </Button>
            </Space>
            <Button
              type="text"
              shape="round"
              icon={<FilterOutlined />}
              size="default"
            >
              <span className="text-gray-600 font-semibold">Filters</span>
            </Button>
            <Button
              shape="round"
              icon={<CloudDownloadOutlined />}
              size="default"
            >
              <span className="text-gray-600 font-semibold">Export</span>
            </Button>
            <NavLink to="/add-client">
              <Button
                type="primary"
                shape="round"
                icon={<PlusOutlined />}
                size="default"
              >
                Add New
              </Button>
            </NavLink>

            <Button
              onClick={toggleModal}
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              size="default"
            >
              Send Form Link
            </Button>
          </div>
        </div>

        <div className="flex justify-between my-4">
          <Radio.Group
            value={sortData}
            onChange={(e) => setSortData(e.target.value)}
          >
            <Radio.Button
              value="alllist"
              className={`${
                sortData === "alllist" ? "bg-gray-300" : ""
              } text-gray-600 font-semibold`}
            >
              All List
            </Radio.Button>
            <Radio.Button
              value="newlyadded"
              className={`${
                sortData === "newlyadded" ? "bg-gray-300" : ""
              } text-gray-600 font-semibold`}
            >
              Newly Added
            </Radio.Button>
          </Radio.Group>

          <div className="space-x-2">
            <Search placeholder="Search" onSearch={onSearch} enterButton />
          </div>
        </div>

        <div>
          <Table
          loading={loading}
            columns={columns}
            dataSource={flattenedTableData}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showLessItems: false, // Ensure all pagination buttons are visible
              onChange: (page) =>
                setPagination((prevPagination) => ({
                  ...prevPagination,
                  current: page,
                })),
            }}
          />
        </div>
      </div>
      <SendMailModal visible={isModalVisible} onCancel={toggleModal} />
    </AdminDashboard>
  );
};

export default ClientTable;
