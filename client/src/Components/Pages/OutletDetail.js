import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import OutletForm from "./OutletForm";
import axios from "axios";

const OutletDetail = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flattenedTableData, setFlattenedTableData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("/getOutletDetails") // Replace '/your-api-endpoint' with your actual API endpoint
      .then((response) => {
        const flattenedData = response.data.data.flatMap((row) => row);
        setFlattenedTableData(flattenedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const columns = [
    {
      title: "Branch Name",
      dataIndex: "branch_name",
      key: "branch_name",
    },
    {
      title: "Business Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "GST NO.",
      dataIndex: "gst_number",
      key: "gst_number",
    },
    {
      title: "City",
      dataIndex: "address",
      key: "city",
      render: (address) => address.city,
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
    },
  ];

  const handleOk = () => {
    fetchData();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center m-6">
        <h2 className="text-lg font-semibold">Client List</h2>
        <div className="space-x-2">
          <Button
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            onClick={showModal}
          >
            Add Outlet
          </Button>
        </div>
      </div>
      <div className="m-6">
        <Table columns={columns} dataSource={flattenedTableData} />
      </div>

      <OutletForm
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default OutletDetail;
