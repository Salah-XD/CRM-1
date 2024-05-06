import React from "react";
import { Form, Input, Button, Select } from "antd";
import { NavLink } from "react-router-dom";

const { Option } = Select;

const BusinessDetail = ({ form, onFinish, loading }) => {
  return (
    <div className="m-6 w-1/2">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="businessName"
          label="Business Name"
          rules={[{ required: true, message: "Please enter business name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="contactPerson"
          label="Contact Person Name"
          rules={[
            { required: true, message: "Please enter contact person name" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="businessType"
          label="Business Type"
          rules={[{ required: true, message: "Please select business type" }]}
        >
          <Select>
            <Option value="temple">Temple</Option>
            <Option value="hotel">Hotel</Option>
            <Option value="canteen">Canteen</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="fssaiRegistered"
          label="FSSAI Registered"
          rules={[
            {
              required: true,
              message: "Please enter FSSAI registration number",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email ID"
          rules={[
            { required: true, message: "Please enter email ID" },
            { type: "email", message: "Please enter a valid email ID" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="gstRequired"
          label="GST Required"
          rules={[{ required: true, message: "Please select GST requirement" }]}
        >
          <Select>
            <Option value={true}>Yes</Option>
            <Option value={false}>No</Option>
          </Select>
        </Form.Item>
        <Form.Item name="registeredAddress" label="Registered Address">
          <Input.TextArea />
        </Form.Item>
        <div className="sticky bottom-0 z-50 bg-white w-full py-4 px-6 flex justify-start">
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
            <NavLink to="/">
              <Button className="ml-2">Cancel</Button>
            </NavLink>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default BusinessDetail;
