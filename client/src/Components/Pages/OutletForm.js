import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import axios from "axios";
import "../css/outletForm.css";

const { Option } = Select;

const OutletForm = ({
  isModalVisible,
  handleOk,
  handleCancel,
  item,
  businessId,
}) => {
  const [form] = Form.useForm();
  const [industryType, setIndustryType] = useState(null);

  useEffect(() => {
    if (item) {
      form.setFieldsValue(item);
      setIndustryType(item.services);
    }
  }, [item, form]);

  const handleIndustryChange = (value) => {
    setIndustryType(value);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = { ...values, business: businessId };

      if (businessId) {
        // Specific dynamic route - Make axios POST request
        await axios.post("/api/saveOutlet", formData);
        handleOk();
        form.resetFields();
      } else {
        // Other routes - Use handleOk
        handleOk(formData);
        form.resetFields();
      }
    } catch (error) {
      console.error("Error saving outlet data:", error);
    }
  };

  const getUnitLabel = () => {
    switch (industryType) {
      case "Transportation":
        return "No of Vehicle";
      case "Manufacturing":
        return "No of Food Handlers";
      case "Trade and retail":
        return "Area (Sq. ft)";
      case "Catering":
        return "No of Food Handlers";
      default:
        return "Enter the Unit";
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
          label={
            <span className="text-gray-600 font-semibold">
              Type Of Industry
            </span>
          }
          name="type_of_industry"
          rules={[{ required: true, message: "Please select an industry Type" }]}
        >
          <Select
            placeholder="Select industry Type"
            className="w-full"
            size="large"
            onChange={handleIndustryChange}
          >
            <Option value="Catering">Catering</Option>
            <Option value="Manufacturing">Manufacturing</Option>
            <Option value="Trade and Retail">Trade and Retail</Option>
            <Option value="Transportation">Transportation</Option>
          </Select>
        </Form.Item>
        {industryType && (
          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">
                {getUnitLabel()}
              </span>
            }
            name="unit"
            rules={[{ required: true, message: "Please enter the unit" }]}
          >
            <Input
              placeholder="Enter the unit"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
            />
          </Form.Item>
        )}
           {industryType==="Manufacturing" && (
          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">
                No. Of Production Line
              </span>
            }
            name="no_of_production_line"
            rules={[{ required: true, message: "Please enter the unit" }]}
          >
            <Input
              placeholder="Enter the unit"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
            />
          </Form.Item>
        )}
        <Form.Item
          name="gst_number"
          label={
            <span className="text-gray-600 font-semibold">GST Number</span>
          }
        
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
