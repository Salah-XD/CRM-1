import React from "react";
import { Form, Input, Button, Select } from "antd";
import { NavLink, useLocation } from "react-router-dom";

const { Option } = Select;

const BusinessDetail = ({ onSubmit, loading, disabled }) => {
  const [form] = Form.useForm();
  const location = useLocation();

  const handleSubmit = async (values) => {
    if (location.pathname === "/client-onboarding") {
      values.added_by = "Client Form";
    } else {
      values.added_by = "Manual";
    }
    onSubmit(values);
  };

  const innerDivClass =
    location.pathname === "/client-onboarding"
      ? "m-6 p-4   w-3/4 mx-auto"
      : "ml-6  ";

  return (
    <div className="w-full">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className={innerDivClass}>
          <Form.Item
            className="w-1/2"
            name="name"
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
            name="contact_person"
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
            className="w-1/2"
            label={
              <span className="text-gray-600 font-semibold">Email ID</span>
            }
            name="email"
            rules={[
              { required: true, message: "Please enter email ID" },
              { type: "email", message: "Please enter a valid email ID" },
            ]}
          >
            <Input
              placeholder="Enter your email address"
              className="placeholder-gray-400 p-3 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="phone"
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
            className="w-1/4"
            label={
              <span className="text-gray-600 font-semibold">
                FSSAI License Number
              </span>
            }
            name="fssai_license_number"
            rules={[
              { required: false, message: "Please enter FSSAI License Number" },
            ]}
          >
            <Input
              placeholder="Enter your License Number"
              className="placeholder-gray-400 p-3 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            className="w-1/4"
            label={
              <span className="text-gray-600 font-semibold">GST Number</span>
            }
            name="gst_number"
            rules={[{ required: false, message: "Please enter GST number" }]}
          >
            <Input
              placeholder="Enter your GST number"
              className="placeholder-gray-400 p-3 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="type_of_industry"
            className="w-1/4"
            label={
              <span className="text-gray-600 font-semibold">
                Type of Industry
              </span>
            }
            rules={[
              { required: false, message: "Please select industry type" },
            ]}
          >
            <Select placeholder="Select Industry Type" size={"large"}>
              <Option value="Catering">Catering</Option>
              <Option value="Meat">Meat</Option>
              <Option value="Sweet">Sweet</Option>
              <Option value="Shop">Shop</Option>
              <Option value="Bakery">Bakery</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="Vertical_of_industry"
            className="w-1/4"
            label={
              <span className="text-gray-600 font-semibold">
                Vertical of Industry
              </span>
            }
            rules={[
              { required: false, message: "Please select industry vertical" },
            ]}
          >
            <Select placeholder="Select Industry Vertical" size={"large"}>
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
            label={<span className="text-gray-600 font-semibold">Address</span>}
            name={["address", "line1"]}
            className="w-1/2"
            rules={[
              { required: false, message: "Please enter Address Line 1" },
            ]}
          >
            <Input
              placeholder="Line 1"
              className="placeholder-gray-400 p-3 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name={["address", "line2"]}
            className="w-1/2"
            rules={[
              { required: false, message: "Please enter Address Line 2" },
            ]}
          >
            <Input
              placeholder="Line 2(Optional)"
              className="placeholder-gray-400 p-3 rounded-lg"
            />
          </Form.Item>
          <div className="flex justify-between w-1/2">
            <Form.Item
              name={["address", "city"]}
              rules={[{ required: false, message: "Please enter city" }]}
              className="w-full mr-2"
            >
              <Input
                placeholder="City"
                className="placeholder-gray-400 p-3 rounded-lg w-full"
              />
            </Form.Item>
            <Form.Item
              name={["address", "state"]}
              rules={[{ required: false, message: "Please enter state" }]}
              className="w-full mr-2"
            >
              <Input
                placeholder="State"
                className="placeholder-gray-400 p-3 rounded-lg w-full"
              />
            </Form.Item>
            <Form.Item
              name={["address", "pincode"]}
              rules={[{ required: false, message: "Please enter pincode" }]}
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
            <NavLink to="/client-profile">
              <Button className="border-primary text-border-2 font-semibold">
                Cancel
              </Button>
            </NavLink>
            <Button
              type="primary"
              className="ml-6"
              htmlType="submit"
              loading={loading}
            >
              Save
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default BusinessDetail;
