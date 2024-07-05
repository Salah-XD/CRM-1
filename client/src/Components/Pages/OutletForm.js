import React, { useState } from "react";
import { Modal, Form, Input, message, Button, Select } from "antd";
import axios from "axios";
import "../css/outletForm.css"; // Import the custom CSS
const { Option } = Select;

const OutletForm = ({ isModalVisible, handleOk, handleCancel, businessId }) => {
  const [form] = Form.useForm();
  const [ownership, setOwnership] = useState("yes"); // Set initial state to "yes"

  const handleOwnershipChange = (e) => {
    setOwnership(e.target.value);
  };

  // Initial values for the form
  const initialValues = {
    private_owned: ownership, // Set initial value for the ownership field
  };

  // Function to determine if fields should be disabled based on ownership
  const isDisabled = (fieldName) =>
    ownership === "no" && fieldName !== "private_owned";

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const outletData = { ...values, business: businessId };
      await axios.post("/saveOutlet", outletData);
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
      <Form form={form} layout="vertical" initialValues={initialValues}>
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
            <span className="text-gray-600 font-semibold">
              Is the branch/outlet owned by others?
            </span>
          }
          name="private_owned"
        >
          <div className="flex space-x-4">
            <label className="custom-radio">
              <input
                type="radio"
                value="yes"
                checked={ownership === "yes"}
                onChange={handleOwnershipChange}
              />
              <span
                className={`radio-btn ${
                  ownership === "yes" ? "radio-checked" : ""
                }`}
              ></span>
              Yes
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                value="no"
                checked={ownership === "no"}
                onChange={handleOwnershipChange}
              />
              <span
                className={`radio-btn ${
                  ownership === "no" ? "radio-checked" : ""
                }`}
              ></span>
              No
            </label>
          </div>
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
            disabled={isDisabled("contact_number")}
          />
        </Form.Item>
        <Form.Item
          label={
            <span className="text-gray-600 font-semibold">Contact person</span>
          }
          name="contact_person"
        >
          <Input
            placeholder="Enter contact person name"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
            disabled={isDisabled("contact_person")}
          />
        </Form.Item>

        <Form.Item
          name="Vertical_of_industry"
          label={
            <span className="text-gray-600 font-semibold">
              Vertical of Industry
            </span>
          }
        >
          <Select
            placeholder="Select Industry Vertical"
            size={"large"}
            disabled={isDisabled("Vertical_of_industry")}
          >
            <Option value="Star hotel">Star hotel</Option>
            <Option value="Ethnic restaurant">Ethnic restaurant</Option>
            <Option value="QSR">QSR</Option>
            <Option value="Industrial catering">Industrial catering</Option>
            <Option value="Meat Retail">Meat Retail</Option>
            <Option value="Sweet Retail">Sweet Retail</Option>
            <Option value="Bakery">Bakery</Option>
            <Option value="Others">Others</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <span className="text-gray-600 font-semibold">
              {" "}
              No. of food handlers
            </span>
          }
          name="no_of_food_handlers"
        >
          <Input
            placeholder="Number of food handlers"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
            disabled={isDisabled("no_of_food_handlers")}
          />
        </Form.Item>
        <Form.Item
          label={
            <span className="text-gray-600 font-semibold">
              {" "}
              FSSAI License Number
            </span>
          }
          name="fssai_license_number"
        >
          <Input
            placeholder="Enter FSSAI NO"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
            disabled={isDisabled("fssai_license_number")}
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
            disabled={isDisabled("gst_number")}
          />
        </Form.Item>
        <div className="flex justify-center">
          <div className="flex justify-between space-x-2">
            <Button className="mr-5">
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
