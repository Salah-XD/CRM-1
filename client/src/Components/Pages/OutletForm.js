import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import axios from "axios";
import "../css/outletForm.css"; // Import the custom CSS

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
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          label={
            <span className="text-gray-600 font-semibold">Branch Name</span>
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
            <span className="text-gray-600 font-semibold">Outlet Owned By</span>
          }
          name="name"
          rules={[
            {
              required: !isDisabled("name"),
              message: "Please enter owner's name",
            },
          ]}
        >
          <Input
            placeholder="Franchiser’s GST Registered Name"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
            disabled={isDisabled("name")}
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-gray-600 font-semibold">GST Number</span>
          }
          name="gst_number"
          rules={[
            {
              required: !isDisabled("gst_number"),
              message: "Please enter GST number",
            },
          ]}
        >
          <Input
            placeholder="Enter GST number"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
            disabled={isDisabled("gst_number")}
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-gray-600 font-semibold">
              Primary Contact Number
            </span>
          }
          name="primary_contact_number"
          rules={[
            {
              required: !isDisabled("primary_contact_number"),
              message: "Please enter primary contact number",
            },
          ]}
        >
          <Input
            placeholder="Enter primary contact number"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
            disabled={isDisabled("primary_contact_number")}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-600 font-semibold">Email</span>}
          name="email"
          rules={[
            { required: !isDisabled("email"), message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input
            placeholder="Enter email"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
            disabled={isDisabled("email")}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-600 font-semibold">Address</span>}
          name={["address", "line1"]}
          rules={[
            {
              required: !isDisabled("line1"),
              message: "Please enter address line 1",
            },
          ]}
        >
          <Input
            placeholder="Enter address line 1"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
            disabled={isDisabled("line1")}
          />
        </Form.Item>

        <Form.Item name={["address", "line2"]}>
          <Input
            placeholder="Enter address line 2 (optional)"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
            disabled={isDisabled("line2")}
          />
        </Form.Item>

        <div className="flex justify-between">
          <Form.Item
            name={["address", "city"]}
            className="w-1/3 mr-2"
            rules={[
              { required: !isDisabled("city"), message: "Please enter city" },
            ]}
          >
            <Input
              placeholder="Enter city"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={isDisabled("city")}
            />
          </Form.Item>

          <Form.Item
            name={["address", "state"]}
            className="w-1/3 mr-2"
            rules={[
              { required: !isDisabled("state"), message: "Please enter state" },
            ]}
          >
            <Input
              placeholder="Enter state"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={isDisabled("state")}
            />
          </Form.Item>

          <Form.Item
            name={["address", "pincode"]}
            className="w-1/3"
            rules={[
              {
                required: !isDisabled("pincode"),
                message: "Please enter pincode",
              },
            ]}
          >
            <Input
              placeholder="Enter pincode"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={isDisabled("pincode")}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default OutletForm;
