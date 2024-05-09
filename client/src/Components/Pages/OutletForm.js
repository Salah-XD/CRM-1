// OutletForm.js
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Radio, message } from "antd";
import axios from "axios";

const { Option } = Select;

const OutletForm = ({ isModalVisible, handleOk, handleCancel }) => {
  const [form] = Form.useForm();
  const [ownership, setOwnership] = useState("yes");
  const [businessList, setBussinessList] = useState([]);

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

  const handleOwnershipChange = (e) => {
    setOwnership(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // Prepare data to be sent in the request
      const outletData = {
        ...values,
      };

      // Make Axios POST request to save outlet data
      await axios.post("/saveOutlet", outletData);

      // Show success message
      message.success("Outlet data saved successfully");

      // Close the modal
      handleOk();
    } catch (error) {
      console.error("Error saving outlet data:", error);
      message.error("Failed to save outlet data. Please try again later.");
    }
  };

  return (
    <Modal
      className="h-80vh overflow-hidden"
      title={<span className="text-xl">Add Outlet</span>}
      visible={isModalVisible}
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={
            <span className="text-gray-600 font-semibold">Branch Name</span>
          }
          name="branch_name"
          rules={[{ required: true, message: "Please enter branch name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={
            <span className="text-gray-600 font-semibold">Business Name</span>
          }
          name="business"
          rules={[{ required: true, message: "Please select a business name" }]}
        >
          <Select>
            {businessList.map((business) => (
              <Option key={business._id} value={business._id}>
                {business.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <span className="text-gray-600 font-semibold">
              Is the branch/outlet owned by others?
            </span>
          }
          name="private_owned"
        >
          <Radio.Group
            defaultValue="yes"
             onChange={handleOwnershipChange}
            value={ownership}
          >
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Radio.Group>
        </Form.Item>
        <div
          className={ownership === "no" ? "opacity-50 pointer-events-none" : ""}
        >
          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">
                Outlet Owned By
              </span>
            }
            name="name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">GST Number</span>
            }
            name="gst_number"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">
                Primary Contact Number
              </span>
            }
            name="primary_contact_number"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={<span className="text-gray-600 font-semibold">Email</span>}
            name="email"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={<span className="text-gray-600 font-semibold">Address</span>}
            name={["address", "line1"]}
          >
            <Input placeholder="Line 1" />
          </Form.Item>
          <Form.Item name={["address", "line2"]}>
            <Input placeholder="Line 2" />
          </Form.Item>
          <div className="flex justify-between">
            <Form.Item name={["address", "city"]} className="w-1/3 mr-2">
              <Input placeholder="City" />
            </Form.Item>
            <Form.Item name={["address", "state"]} className="w-1/3 mr-2">
              <Input placeholder="State" />
            </Form.Item>
            <Form.Item name={["address", "pincode"]} className="w-1/3">
              <Input placeholder="Pincode" />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default OutletForm;
