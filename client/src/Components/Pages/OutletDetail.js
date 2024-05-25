import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import OutletForm from "./OutletForm";
import axios from "axios";
import { NavLink } from "react-router-dom";

const OutletDetail = ({ businessId }) => {
  // Receive businessId as a prop
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flattenedTableData, setFlattenedTableData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Log the businessId
  console.log("Business ID:", businessId);

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

  const handleSubmit = () => {
    setLoading(true); // Set loading state to true while submitting
    // Perform your submit action, like making an API call
    // After successful submission, you can reset loading state
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center m-6">
        <h2 className="text-lg font-semibold">Outlet List</h2>
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
        businessId={businessId}
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        model={{ businessId }} // Pass businessId as prop to OutletForm through model prop
        handleSubmit={handleSubmit} // Pass handleSubmit function as prop to OutletForm
      />
      <div className="sticky bottom-0 z-50 bg-white w-full py-4 px-6 flex justify-start shadow-top">
        <NavLink to="/">
          <Button className="border-primary  text- border-2 font-semibold">
            Cancel
          </Button>
        </NavLink>
        <Button
          type="primary"
          className="ml-6"
          htmlType="submit"
          loading={loading}
          onClick={handleSubmit} // Call handleSubmit function when Submit button is clicked
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default OutletDetail;
