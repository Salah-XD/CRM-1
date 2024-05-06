import React from "react";
import { Form, Input, Button, Select } from "antd";
import { NavLink } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const BusinessDetail = ({ form, onFinish, loading }) => {

const handleSubmit = async (values) => {
  console.log("Form data:", values); // Logging form data before submitting
  try {
    const response = await axios.post("your-api-endpoint", values);
    console.log("Form data submitted:", response.data);
    // Handle success, e.g., show a success message or redirect
  } catch (error) {
    console.error("Error submitting form data:", error);
    // Handle error, e.g., show an error message
  }
};

  return (
    <div className="">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="m-6">
          <Form.Item
            className="w-1/2"
            name="businessName"
            label={
              <span className="text-gray-600 font-semibold">FBO Name</span>
            }
            rules={[{ required: true, message: "Please enter business name" }]}
          >
            <Input
              placeholder="Enter your Business Name"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
            />
          </Form.Item>
          <Form.Item
            name="contactPerson"
            className="w-1/2"
            label={
              <span className="text-gray-600 font-semibold">
                Contact Person Name
              </span>
            }
            rules={[
              { required: true, message: "Please enter contact person name" },
            ]}
          >
            <Input
              placeholder="Enter your contact person name"
              className="placeholder-gray-400 p-3 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="businessType"
            FSSAI
            License
            Number
            className="w-1/4"
            label={
              <span className="text-gray-600 font-semibold">Business Type</span>
            }
            rules={[{ required: true, message: "Please select business type" }]}
          >
            <Select placeholder="Select Business Name">
              <Option value="temple">Restaurant</Option>
              <Option value="temple">Temple</Option>
              <Option value="hotel">Hotel</Option>
              <Option value="canteen">Canteen</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">
                FSSAI License Number
              </span>
            }
            className="w-1/4"
            name="fssai_license_number"
            rules={[
              { required: true, message: "Please enter FSSAI License Number" },
            ]}
          >
            <Input
              placeholder="Enter  your License Number"
              className="placeholder-gray-400 p-3 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            className="w-1/4"
            label={
              <span className="text-gray-600 font-semibold">Phone Number</span>
            }
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input
              placeholder="Enter your phone number"
              className="placeholder-gray-400 p-3 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            className="w-1/2"
            label={
              <span className="text-gray-600 font-semibold">Email ID</span>
            }
            name="email"
            rules={[
              { required: true, message: "Please enter email ID" },
              { type: "email", message: "Please enter a valid email ID" },
            ]}
            required
          >
            <Input
              placeholder="Enter your email address"
              className="placeholder-gray-400 p-3 rounded-lg" // Set the color of the placeholder text
            />
          </Form.Item>
          <Form.Item
            className="w-1/4"
            label={
              <span className="text-gray-600 font-semibold">GST Number</span>
            }
            name="gst_number"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="Enter your GST number"
              className="placeholder-gray-400 p-3 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-600 font-semibold">Address</span>}
            name="address.line1"
            className="w-1/2"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="Line 1"
              className="placeholder-gray-400 p-3 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="address.line2"
            className="w-1/2"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="Line 2"
              className="placeholder-gray-400 p-3 rounded-lg"
            />
          </Form.Item>
          <div className="flex justify-between w-1/2">
            <Form.Item
              name="address.city"
              rules={[{ required: true }]}
              className="w-full mr-2"
            >
              <Input
                placeholder="City"
                className="placeholder-gray-400 p-3 rounded-lg w-full"
              />
            </Form.Item>

            <Form.Item
              name="address.state"
              rules={[{ required: true }]}
              className="w-full mr-2"
            >
              <Input
                placeholder="State"
                className="placeholder-gray-400 p-3 rounded-lg w-full"
              />
            </Form.Item>

            <Form.Item
              name="address.pincode"
              rules={[{ required: true }]}
              className="w-full"
            >
              <Input
                placeholder="Pincode"
                className="placeholder-gray-400 p-3 rounded-lg w-full"
              />
            </Form.Item>
          </div>
        </div>

        <div className="sticky bottom-0 z-50 bg-white w-full py-4 px-6 flex justify-start shadow-top">
          <Form.Item>
            <NavLink to="/">
              <Button className="border-primary  text- border-2 font-semibold">
                Cancel
              </Button>
            </NavLink>
            <Button
              type="primary"
              className="ml-6"
              htmlType="submit"
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default BusinessDetail;
