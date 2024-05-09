import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  Radio,
  Select,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const OutletDetail = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [ownership, setOwnership] = useState("yes");
  const [bussinessList, setBussinessList] = useState([]);

  useEffect(() => {
    const fetchBusinessNames = async () => {
      try {
        const response = await axios.get("/getAllBussinessName");
        setBussinessList(response.data.businesses);
        console.log(response.data.businesses);
      } catch (error) {
        console.error("Error fetching business names:", error);
      }
    };
    fetchBusinessNames();
  }, []);

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

  const handleDelete = () => {
    // Implement API request to delete selected clients
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
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
        className="h-80vh overflow-hidden"
        title={<span className="text-xl">Add Outlet</span>}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">Branch Name</span>
            }
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">Business Name</span>
            }
            name="businessName" // Make sure this matches the name in your form data
            rules={[
              { required: true, message: "Please select a business name" },
            ]}
          >
            <Select>
              {bussinessList.map((business) => (
                <Select.Option key={business.id} value={business.name}>
                  {business.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">
                Is the branch/outlet owned by others?
              </span>
            }
          >
            <Radio.Group
              onChange={handleOwnershipChange}
              value={ownership}
              className="flex justify-center"
            >
              <Radio value="yes" className="rounded-full px-4 py-2 mr-4">
                <span className="text-gray-600 font-semibold">Yes</span>
              </Radio>
              <Radio value="no" className="rounded-full px-4 py-2">
                <span className="text-gray-600 font-semibold">No</span>
              </Radio>
            </Radio.Group>
          </Form.Item>
          <div
            className={
              ownership === "no" ? "opacity-50 pointer-events-none" : ""
            }
          >
            <Form.Item
              label={
                <span className="text-gray-600 font-semibold">
                  Outlet Owned By
                </span>
              }
            >
              <Input disabled={ownership === "no"} />
            </Form.Item>
            <Form.Item
              label={
                <span className="text-gray-600 font-semibold">GST Number</span>
              }
            >
              <Input disabled={ownership === "no"} />
            </Form.Item>
            <Form.Item
              label={
                <span className="text-gray-600 font-semibold">Address</span>
              }
            >
              <Input.TextArea disabled={ownership === "no"} />
            </Form.Item>
            <Form.Item
              label={
                <span className="text-gray-600 font-semibold">
                  Primary Contact Number
                </span>
              }
            >
              <Input disabled={ownership === "no"} />
            </Form.Item>
            <Form.Item
              label={<span className="text-gray-600 font-semibold">Email</span>}
            >
              <Input disabled={ownership === "no"} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default OutletDetail;
