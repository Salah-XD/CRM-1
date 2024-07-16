import React, { useState } from "react";
import { Modal, Form, Input, message, Button } from "antd";
import axios from "axios";
import "../css/outletForm.css"; // Import the custom CSS

const OutletForm = ({ isModalVisible, handleOk, handleCancel, businessId }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const outletData = { ...values, business: businessId };
      await axios.post("/api/saveOutlet", outletData);
      message.success("Outlet data saved successfully");
      handleOk();
      form.resetFields();
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
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={
            <span className="text-gray-600 font-semibold">Outlet Name</span>
          }
          name="branch_name"
          rules={[{ required: true, message: "Please enter branch name" }]}
        >
          <Input
            placeholder="Enter the name of the branch"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-gray-600 font-semibold">Contact Number</span>
          }
          name="contact_number"
        >
          <Input
            placeholder="Enter primary contact number"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
          />
        </Form.Item>
        <Form.Item
          label={
            <span className="text-gray-600 font-semibold">Contact Person</span>
          }
          name="contact_person"
        >
          <Input
            placeholder="Enter contact person name"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-gray-600 font-semibold">
              No. of food handlers
            </span>
          }
          name="no_of_food_handlers"
        >
          <Input
            placeholder="Number of food handlers"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
          />
        </Form.Item>
        <Form.Item
          label={
            <span className="text-gray-600 font-semibold">
              FSSAI License Number
            </span>
          }
          name="fssai_license_number"
        >
          <Input
            placeholder="Enter FSSAI NO"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
          />
        </Form.Item>
        <Form.Item
          label={
            <span className="text-gray-600 font-semibold">GST Number</span>
          }
          name="gst_number"
        >
          <Input
            placeholder="Enter GST number"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
          />
        </Form.Item>
        <div className="flex justify-center">
          <div className="flex justify-between space-x-2">
            <Button className="mr-5" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" className="ml-5" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default OutletForm;
