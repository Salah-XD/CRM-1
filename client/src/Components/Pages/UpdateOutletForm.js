import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Input, Button, message, Spin } from "antd";
import axios from "axios";
import "../css/outletForm.css"; // Import the custom CSS

const UpdateOutletForm = ({
  isModalVisible,
  handleOk,
  handleCancel,
  outletId,
  businessId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true); // State to handle loading
  const [isEditMode, setIsEditMode] = useState(false); // State to manage edit mode

  const fetchOutletDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/getParticularOutletDetails/${outletId}`
      );
      const outlet = response.data;

      // Set initial values for the form
      form.setFieldsValue({
        branch_name: outlet.branch_name,
        contact_number: outlet.contact_number,
        contact_person: outlet.contact_person,
        no_of_food_handlers: outlet.no_of_food_handlers,
        fssai_license_number: outlet.fssai_license_number,
        gst_number: outlet.gst_number,
        Vertical_of_industry: outlet.Vertical_of_industry,
        address: outlet.private_details?.address,
      });

      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching outlet details:", error);
      message.error("Failed to fetch outlet details. Please try again later.");
      setLoading(false); // Set loading to false even if there's an error
    }
  }, [outletId, form]);

  useEffect(() => {
    if (isModalVisible) {
      setLoading(true); // Set loading to true when modal is visible
      if (outletId) {
        fetchOutletDetails();
      } else {
        form.resetFields(); // Reset form fields if there's no outletId
        setLoading(false); // Set loading to false immediately
      }
    }
  }, [isModalVisible, outletId, form, fetchOutletDetails]);

  const handleSubmit = async () => {
    try {
      // Validate form fields and get values
      const values = await form.validateFields();
      // Include business ID in the outlet data
      const outletData = { ...values, business: businessId };

      // Check if outletId is present to determine create or update
      if (outletId) {
        // Update existing outlet
        await axios.put(`/api/updateOutlet/${outletId}`, outletData);
        message.success("Outlet data updated successfully");
      } else {
        // Create new outlet
        await axios.post("/api/saveOutlet", outletData);
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
              <span className="text-gray-600 font-semibold">Outlet Name</span>
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
                FSSAI License Number
              </span>
            }
            name="fssai_license_number"
            rules={[
              {
                required: true,
                message: "Please enter the FSSAI License Number",
              },
              {
                len: 14,
                message:
                  "FSSAI License Number must be exactly 14 characters long",
              },
              {
                pattern: /^[0-9]+$/,
                message: "FSSAI License Number must be numeric only",
              },
            ]}
          >
            <Input
              placeholder="Enter FSSAI License"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={!isEditMode}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">GST Number</span>
            }
            name="gst_number"
            rules={[
              {
                pattern: /^[A-Za-z0-9]{14}$/,
                message: "GST number must be 14 alphanumeric characters",
              },
            ]}
          >
            <Input
              placeholder="Enter GST number"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={!isEditMode}
            />
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
              placeholder="Enter contact number"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={!isEditMode}
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
              disabled={!isEditMode}
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
              placeholder="Enter number of food handlers"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={!isEditMode}
            />
          </Form.Item>

          {isEditMode && (
            <div className="flex justify-center">
              <div className="flex justify-between space-x-2">
                <Button onClick={() => setIsEditMode(false)} className="mr-5">
                  Cancel
                </Button>
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
