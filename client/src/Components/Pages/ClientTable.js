import React, { useState, useEffect } from "react";
import { Table, Radio, Button, Input, Checkbox, Tag } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  FilterOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import AdminDashboard from "../Layout/AdminDashboard";
import axios from "axios";
import { NavLink } from "react-router-dom";

const { Search } = Input;

const ClientTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [sortData, setSortData] = useState("alllist");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 2,
  });

  useEffect(() => {
    fetchData(); // Fetch initial data when component mounts
  }, [pagination.current, sortData]); // Reload data when pagination or sorting changes

const fetchData = () => {
  axios
    .get(
      `getAllBussinesDetails?page=${pagination.current}&pageSize=${pagination.pageSize}&sort=${sortData}`
    )
    .then((response) => {
      const { businesses, totalPages, currentPage } = response.data;

      setTableData(businesses); // Set table data
      setPagination((prevPagination) => ({
        ...prevPagination,
        current: currentPage,
        total: totalPages,
      }));
      console.log(totalPages); // Log totalPages
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

};

useEffect(() => {
  console.log(pagination.total);
}, [pagination.total]);


  const onSearch = (value) => console.log(value);

  const handleRowSelect = (selectedRowKey) => {
    const isSelected = selectedRows.includes(selectedRowKey);
    let updatedSelectedRows;

    if (isSelected) {
      updatedSelectedRows = selectedRows.filter(
        (key) => key !== selectedRowKey
      );
    } else {
      updatedSelectedRows = [...selectedRows, selectedRowKey];
    }

    setSelectedRows(updatedSelectedRows);
  };

  const handleDelete = () => {
    console.log(selectedRows);
    axios
      .delete("your_delete_api_endpoint", { data: selectedRows })
      .then((response) => {
        fetchData(); // Fetch updated data after deletion
        setSelectedRows([]); // Clear selected rows
      })
      .catch((error) => {
        console.error("Error deleting rows:", error);
      });
  };

  const columns = [
    {
      title: (
        <Checkbox
          onChange={(e) =>
            handleRowSelect(
              e.target.checked ? tableData.map((item) => item.key) : []
            )
          }
        />
      ),
      render: (_, record) => (
        <Checkbox
          onChange={(e) => handleRowSelect([...selectedRows, record.key])}
          checked={selectedRows.includes(record.key)}
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
          Outlet
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
      render: (text) => (
        <span className="text-primary  underline">{text}</span>
      ),
    },
  ];

  return (
    <AdminDashboard>
      <div className="bg-white m-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Client List</h2>
          <div className="space-x-2">
            <Button
              type="text"
              shape="round"
              icon={<DeleteOutlined />}
              size="default"
              onClick={handleDelete}
            >
              <span className="text-gray-600 font-semibold"> Delete</span>
            </Button>
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
              }  text-gray-600 font-semibold`}
            >
              All List
            </Radio.Button>
            <Radio.Button
              value="newlyadded"
              className={`${
                sortData === "newlyadded" ? "bg-gray-300" : ""
              }  text-gray-600 font-semibold`}
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
            columns={columns}
            dataSource={tableData}
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
    </AdminDashboard>
  );
};

export default ClientTable;
