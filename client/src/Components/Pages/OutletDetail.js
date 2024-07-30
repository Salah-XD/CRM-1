import React, { useState } from "react";
import { Table, Button, Modal, Space, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import OutletForm from "./OutletForm";
import "../css/outletForm.css"; // Import the custom CSS

const OutletDetail = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [outletItems, setOutletItems] = useState([]); // State for outlet items
  const [editingItem, setEditingItem] = useState(null); // State for the item being edited

  const showModal = (item = null) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleOk = (newItem) => {
    if (editingItem) {
      // Update existing item
      setOutletItems((prevItems) =>
        prevItems.map((item) => (item.id === editingItem.id ? newItem : item))
      );
    } else {
      // Add new item
      setOutletItems((prevItems) => [
        ...prevItems,
        { ...newItem, id: Date.now() }, // Generate unique ID using timestamp
      ]);
    }
    setIsModalVisible(false);
    message.success("Outlet data saved successfully");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null); // Reset editingItem
  };

  const handleRemove = (id) => {
    setOutletItems((prevItems) => prevItems.filter((item) => item.id !== id));
    message.success("Outlet removed successfully");
  };

  const columns = [
    {
      title: "Outlet Name",
      dataIndex: "branch_name",
      key: "branch_name",
    },
    {
      title: "FSSAI No",
      dataIndex: "fssai_license_number",
      key: "fssai_license_number",
    },
    {
      title: "No of Food Handlers",
      dataIndex: "no_of_food_handlers",
      key: "no_of_food_handlers",
    },
    {
      title: "Contact Number",
      dataIndex: "contact_number",
      key: "contact_number",
    },
    {
      title: "Contact Person",
      dataIndex: "contact_person",
      key: "contact_person",
    },
    {
      title: "GST NO.",
      dataIndex: "gst_number",
      key: "gst_number",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          icon={<DeleteOutlined style={{ color: "red" }} />}
          onClick={() => handleRemove(record.id)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="w-3/4 mx-auto">
        <div className="flex justify-between items-center m-6">
          <h2 className="text-lg font-semibold">Outlet List</h2>
          <div className="space-x-2">
            <Button
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Add Outlet
            </Button>
          </div>
        </div>
        <div className="m-6">
          <Table
            columns={columns}
            dataSource={outletItems}
            rowKey={(record) => record.id}
          />
        </div>
        <OutletForm
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          item={editingItem}
        />
      </div>
    </>
  );
};

export default OutletDetail;
