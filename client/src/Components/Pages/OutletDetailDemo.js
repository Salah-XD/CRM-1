import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Checkbox, Space, Divider } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import { NavLink } from "react-router-dom";
import OutletForm from "./OutletForm";
import toast from "react-hot-toast";

const { confirm } = Modal;

const OutletDetail = ({ businessId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flattenedTableData, setFlattenedTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
   const [selectionType, setSelectionType] = useState("checkbox");

  useEffect(() => {
    fetchData();
  }, [businessId]);

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`/getOutletDetails/${businessId}`)
      .then((response) => {
        const flattenedData = response.data.data.map((row) => ({
          ...row,
          key: row._id, // Ensure each row has a unique key
        }));
        setFlattenedTableData(flattenedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure you want to delete the selected outlets?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        axios
          .delete(`/deleteOutletFields`, { data: selectedRows })
          .then(() => {
            fetchData(); // Fetch updated data after deletion
            setSelectedRows([]); // Clear selected rows
            toast.success("Successfully Deleted");
          })
          .catch((error) => {
            console.error("Error deleting outlets:", error);
          });
      },
    });
  };

  const handleSubmit = () => {
    // Extract the formId from the pathname
    const formId = location.pathname.split("/")[2]; // Assuming the formId is the third segment of the pathname

    // Perform form submission logic here
    // Check if the current route is "client-onboarding"
    if (location.pathname.startsWith("/client-onboarding") && formId) {
      navigate(`/client-success/${formId}`);
    } else {
      navigate("/");
      toast.success("Succesfully Saved");
    }
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
      dataIndex: ["address", "city"], // Use nested data index for nested objects
      key: "city",
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
    },
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
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
          <Button
            type="danger"
            shape="round"
            icon={<DeleteOutlined />}
            onClick={showDeleteConfirm}
            disabled={selectedRows.length === 0}
          >
            Delete Selected
          </Button>
        </div>
      </div>
      <div className="m-6">
        <Divider />
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={flattenedTableData}
        />
      </div>

      <OutletForm
        businessId={businessId}
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        model={{ businessId }} // Pass businessId as prop to OutletForm through model prop
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
          onClick={handleSubmit} // Handle form submission
          loading={loading}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default OutletDetail;
