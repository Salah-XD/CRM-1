import React, { useState, useEffect } from "react";
import { Table, Radio, Button, Input, Checkbox, Tag } from "antd";
import {
  DownloadOutlined,
  DeleteOutlined,
  PlusOutlined,
  FilterOutlined,
  CloudDownloadOutlined 
} from "@ant-design/icons";
import AdminDashboard from "../Layout/AdminDashboard";
import axios from "axios";
import { NavLink } from "react-router-dom";

const { Search } = Input;

const ClientTable = () => {
  const [size, setSize] = useState("default");
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchData(); // Fetch initial data when component mounts
  }, []);

  const fetchData = () => {
    // Dummy data for demonstration
    const dummyData = [
      {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
        businessName: "ABC Corp",
        contactPerson: "Alice",
        phoneNumber: "1234567890",
        mailId: "alice@example.com",
        outlet: "Outlet 1",
        addedBy: "Manual",
        createOn: "2022-05-01",
      },
      {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
        businessName: "XYZ Inc",
        contactPerson: "Bob",
        phoneNumber: "9876543210",
        mailId: "bob@example.com",
        outlet: "Outlet 2",
        addedBy: "Web Enquiry",
        createOn: "2022-05-02",
      },
      {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        businessName: "PQR Ltd",
        contactPerson: "Charlie",
        phoneNumber: "5555555555",
        mailId: "charlie@example.com",
        outlet: "Outlet 3",
        addedBy: "Manual",
        createOn: "2022-05-03",
      },
    ];

    setTableData(dummyData); // Set table data
  };

  const onSearch = (value) => console.log(value);

  const handleRowSelect = (selectedRowKeys) => {
    setSelectedRows(selectedRowKeys);
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
      title: "Business Name",
      dataIndex: "businessName",
      key: "businessName",
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Mail ID",
      dataIndex: "mailId",
      key: "mailId",
    },
    {
      title: "Outlet",
      dataIndex: "outlet",
      key: "outlet",
    },
    {
      title: "Added By",
      dataIndex: "addedBy",
      key: "addedBy",
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
      title: "Create On",
      dataIndex: "createOn",
      key: "createOn",
    },
  ];

  return (
    <AdminDashboard>
      <div className="bg-white m-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Client List</h2>
          <div className="space-x-2">
            <Button
              type="text"
              shape="round"
              icon={<DeleteOutlined />}
              size="default"
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button
              type="text"
              shape="round"
              icon={<FilterOutlined />}
              size="default"
            >
              Filters
            </Button>
            <Button shape="round" icon={<CloudDownloadOutlined />} size={size}>
              Export
            </Button>
            <NavLink to="/add-client">
              <Button
                type="primary"
                shape="round"
                icon={<PlusOutlined />}
                size={size}
              >
                Add New
              </Button>
            </NavLink>
            <Button
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              size={size}
            >
              Send Form Link
            </Button>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
            <Radio.Button value="large">All List</Radio.Button>
            <Radio.Button value="default">Newly Added</Radio.Button>
          </Radio.Group>

          <div className="space-x-2">
            <Search placeholder="Search" onSearch={onSearch} enterButton />
          </div>
        </div>

        <div>
          <Table columns={columns} dataSource={tableData} />
        </div>
      </div>
    </AdminDashboard>
  );
};

export default ClientTable;
