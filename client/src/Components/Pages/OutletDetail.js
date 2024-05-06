import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Checkbox, Radio } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const OutletDetail = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ownership, setOwnership] = useState("yes");

  const columns = [
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Branch Name",
      dataIndex: "branchName",
      key: "branchName",
    },
    {
      title: "Owned By",
      dataIndex: "ownedBy",
      key: "ownedBy",
    },
    {
      title: "GSTN No",
      dataIndex: "gstnNo",
      key: "gstnNo",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
  ];

  const data = [
    {
      key: "1",
      clientName: "Client A",
      branchName: "Branch A",
      ownedBy: "Owner A",
      gstnNo: "GSTN123",
      city: "City A",
      location: "Location A",
    },
    {
      key: "2",
      clientName: "Client B",
      branchName: "Branch B",
      ownedBy: "Owner B",
      gstnNo: "GSTN456",
      city: "City B",
      location: "Location B",
    },
    // Add more demo data as needed
  ];

  
  const handleDelete = () => {
    // Implement API request to delete selected clients
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // Implement logic to add basic fields
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOwnershipChange = (e) => {
    setOwnership(e.target.value);
  };

  return (
    <div>
      <div className="flex justify-between items-center m-6">
        <h2 className="text-lg font-semibold">Client List</h2>
        <div className="space-x-2">
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            Delete
          </Button>
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
        <Table
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          columns={columns}
          dataSource={data}
        />
      </div>
      <Modal
        title="Add Outlet"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Client Name">
            <Input />
          </Form.Item>
          <Form.Item label="Branch Name">
            <Input />
          </Form.Item>
          <Form.Item label="Is the branch/outlet owned by others?">
            <Radio.Group onChange={handleOwnershipChange} value={ownership}>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Form.Item>
          <div
            className={
              ownership === "no" ? "opacity-50 pointer-events-none" : ""
            }
          >
            <Form.Item label="Outlet Owned By">
              <Input disabled={ownership === "no"} />
            </Form.Item>
            <Form.Item label="GST Number">
              <Input disabled={ownership === "no"} />
            </Form.Item>
            <Form.Item label="Address">
              <Input.TextArea disabled={ownership === "no"} />
            </Form.Item>
            <Form.Item label="Primary Contact Number">
              <Input disabled={ownership === "no"} />
            </Form.Item>
            <Form.Item label="Email">
              <Input disabled={ownership === "no"} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default OutletDetail;
