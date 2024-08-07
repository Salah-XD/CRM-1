import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import axios from "axios";
import "../css/outletForm.css"; 

const OutletForm = ({
  isModalVisible,
  handleOk,
  handleCancel,
  item,
  businessId,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (item) {
      form.setFieldsValue(item);
    }
  }, [item, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = { ...values, business:businessId };

      if (businessId) {
        // Specific dynamic route - Make axios POST request
        await axios.post("/api/saveOutlet", formData);
           handleOk();
        formData.resetFields();
     
      } else {
        // Other routes - Use handleOk
        handleOk(formData);
        formData.resetFields();
      }

      form.resetFields();
    } catch (error) {
      console.error("Error saving outlet data:", error);
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
            placeholder="Enter FSSAI NO"
            className="placeholder-gray-400 p-3 rounded-lg w-full"
          />
        </Form.Item>
        <Form.Item
          name="gst_number"
          label={
            <span className="text-gray-600 font-semibold">GST Number</span>
          }
          rules={[
            {
              pattern: /^[A-Za-z0-9]{14}$/,
              message: "GST number must be 14 alphanumeric characters",
            },
          ]}
        >
          <Input
            placeholder="Enter your GST number"
            className="placeholder-gray-400 p-3 rounded-lg"
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
