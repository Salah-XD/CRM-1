import React, { useState, useEffect } from "react";
import { Table,Tag } from "antd";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

function ProposalTable() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flattenedTableData, setFlattenedTableData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectionType, setSelectionType] = useState("checkbox");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 2, // Adjust page size as needed
      total: 1, // Initial total count
    },
  });

  useEffect(() => {
    fetchData();
  }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

  const fetchData = () => {
    setLoading(true);

    // Construct the URL with the businessId included in the path
    const url = "/getAllBussinesDetails";

    axios
      .get(url, {
        params: {
          page: tableParams.pagination.current,
          pageSize: tableParams.pagination.pageSize,
          sort: "alllist",
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
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination.pageSize) {
      setFlattenedTableData([]);
    }
  };

  const columns = [
    {
      title: "FBO name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Total No. of Outlets",
      dataIndex: "outletCount",
      key: "outletCount",
    },
    {
      title: "No of Outlets Invoiced",
      dataIndex: "outlet_invoiced",
      key: "outlet_invoiced",
    },
    {
      title: "Created by",
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
      title: "Status",
      dataIndex: "proposal_status",
      key: "proposal_status",
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };

  return (
    <div>
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
    </div>
  );
}

export default ProposalTable;
