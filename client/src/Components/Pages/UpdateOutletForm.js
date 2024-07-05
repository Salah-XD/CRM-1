import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message, Spin, Select } from "antd";
import axios from "axios";
import "../css/outletForm.css"; // Import the custom CSS

const { Option } = Select;

const UpdateOutletForm = ({
  isModalVisible,
  handleOk,
  handleCancel,
  outletId,
  businessId,
}) => {
  const [form] = Form.useForm();
  const [ownership, setOwnership] = useState("yes");
  const [loading, setLoading] = useState(true); // State to handle loading
  const [isEditMode, setIsEditMode] = useState(false); // State to manage edit mode

  useEffect(() => {
    const fetchOutletDetails = async () => {
      try {
        const response = await axios.get(
          `/getParticularOutletDetails/${outletId}`
        );
        const outlet = response.data;

        // Set initial ownership state based on fetched data
        setOwnership(outlet.private_owned ? "yes" : "no");

        // Set initial values for the form
        form.setFieldsValue({
          branch_name: outlet.branch_name,
          private_owned: outlet.private_owned ? "yes" : "no",
          ...outlet.private_details,
          address: outlet.private_details?.address,
        });

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching outlet details:", error);
        message.error(
          "Failed to fetch outlet details. Please try again later."
        );
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    if (outletId) {
      fetchOutletDetails();
    } else {
      setLoading(false); // If no outletId, set loading to false immediately
    }
  }, [outletId, form]);

  const handleOwnershipChange = (e) => {
    setOwnership(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Validate form fields and get values
      const values = await form.validateFields();
      // Include business ID in the outlet data
      const outletData = { ...values, business: businessId };

      // Check if outletId is present to determine create or update
      if (outletId) {
        // Update existing outlet
        await axios.put(`/updateOutlet/${outletId}`, outletData);
        message.success("Outlet data updated successfully");
      } else {
        // Create new outlet
        await axios.post("/saveOutlet", outletData);
        message.success("Outlet data saved successfully");
      }

      // Handle success actions
      handleOk();
      form.resetFields();
      setIsEditMode(false); // Exit edit mode after submission
    } catch (error) {
      // Check if the error is from form validation
      if (error.name === "ValidationError") {
        console.error("Validation error:", error);
        message.error("Please correct the validation errors.");
      } else {
        // Log the error and show a generic error message
        console.error("Error saving outlet data:", error);
        message.error("Failed to save outlet data. Please try again later.");
      }
    }
  };

  const isDisabled = (fieldName) =>
    ownership === "no" && fieldName !== "private_owned";

  return (
    <Modal
      className="h-80vh overflow-hidden"
      title={
        <div className="flex justify-between items-center">
          <span className="text-xl">
            {outletId ? "View/Edit Outlet" : "Add Outlet"}
          </span>
          <div className="mr-8">
            {outletId && !isEditMode && (
              <Button type="primary" onClick={() => setIsEditMode(true)}>
                Edit
              </Button>
            )}
          </div>
        </div>
      }
      visible={isModalVisible}
      onCancel={() => {
        handleCancel();
        setIsEditMode(false); // Exit edit mode on cancel
      }}
      footer={null}
    >
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spin size="large" />
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            label={
              <span className="text-gray-fed600 font-semibold">
                Outlet Name
              </span>
            }
            name="branch_name"
            rules={[{ required: true, message: "Please enter branch name" }]}
          >
            <Input
              placeholder="Enter the name of the branch"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={!isEditMode}
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
                  disabled={!isEditMode}
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
                  disabled={!isEditMode}
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
              <span className="text-gray-600 font-semibold">
                Contact Number
              </span>
            }
            name="contact_number"
          >
            <Input
              placeholder="Enter  contact number"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={isDisabled("primary_contact_number") || !isEditMode}
            />
          </Form.Item>
          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">
                Contact Person
              </span>
            }
            name="contact_person"
          >
            <Input
              placeholder="Enter contact person name"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={isDisabled("primary_contact_number") || !isEditMode}
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
              disabled={isDisabled("no_of_food_handlers") || !isEditMode}
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
                No. of food handlers
              </span>
            }
            name="no_of_food_handlers"
          >
            <Input
              placeholder="Enter number of food handlers"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={isDisabled("no_of_food_handlers") || !isEditMode}
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
              placeholder="Enter FSSAI License"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={isDisabled("fssai_license_number") || !isEditMode}
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
              disabled={isDisabled("gst_number") || !isEditMode}
            />
          </Form.Item>

          {isEditMode && (
            <div className="flex justify-center">
              <div className="flex justify-between space-x-2">
                <Button onClick={() => setIsEditMode(false)} className="mr-5">Cancel</Button>
                <Button type="primary" className="ml-5" onClick={handleSubmit}>
                  Update
                </Button>
              </div>
            </div>
          )}
        </Form>
      )}
    </Modal>
  );
};

export default UpdateOutletForm;
