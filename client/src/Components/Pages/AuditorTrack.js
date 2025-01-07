import React, { useState, useEffect, useCallback } from "react";
import { Table, Input, ConfigProvider, Modal } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { SearchOutlined } from "@ant-design/icons";

const AuditTrack = () => {
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8, total: 0 });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    axios
      .get("/api/auditor/getAuditorAuditCounts", {
        params: {
          page: pagination.current,
          pageSize: pagination.pageSize,
          keyword: searchKeyword,
        },
      })
      .then(({ data }) => {
        setTableData(data.data);
        setPagination({ ...pagination, total: data.total });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error fetching data");
        setLoading(false);
      });
  }, [pagination.current, pagination.pageSize, searchKeyword]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (e) => setSearchKeyword(e.target.value);

  const columns = [
    { title: "Auditor", dataIndex: "userName", key: "userName" },
    { title: "Assigned Audits", dataIndex: "totalAssigned", key: "totalAssigned" },
    { title: "Submitted Audits", dataIndex: "totalSubmitted", key: "totalSubmitted" },
    { title: "Modified Audits", dataIndex: "totalModified", key: "totalModified" },
    { title: "Approved Audits", dataIndex: "totalApproved", key: "totalApproved" },
  ];

  return (
    <ConfigProvider>
      <div className="audit-track-container">
        {/* <Input
          prefix={<SearchOutlined />}
          placeholder="Search by Users"
          onChange={handleSearchChange}
          style={{ marginBottom: 16 }}
        /> */}
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={pagination}
          loading={loading}
          onChange={(newPagination) => setPagination(newPagination)}
          rowKey={(record) => record._id}
        />
      </div>
    </ConfigProvider>
  );
};

export default AuditTrack;
