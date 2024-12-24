import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Upload,
  Button,
  Row,
  Col,
  message,
  Spin,
  Select,
  Typography,
} from "antd";
import axios from "axios";

const { Option } = Select;
const { Title } = Typography;

const indianStatesAndUTs = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
  "Ladakh",
  "Jammu and Kashmir",
];

const CompanyAddressSetting = () => {
  const [form] = Form.useForm();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("/api/setting/getCompanyDetail");
        form.setFieldsValue(response.data.profile);
      } catch (error) {
        message.error("Failed to fetch profile settings.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfileData();
  }, [form]);

  const handleSubmit = async (values) => {
    try {
      await axios.post("/api/setting/saveOrUpdateProfile", values);
      message.success("Profile settings saved successfully.");
    } catch (error) {
      message.error("Failed to save profile settings.");
    }
  };

  return (
    <Spin spinning={isFetching}>
      <div style={{ padding: 20 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            companyName: "",
            companyAddress: {
              addressLine1: "",
              addressLine2: "",
              city: "",
              state: "",
              pincode: "",
            },
            gstNumber: "",
            contactNumber: "",
            email: "",
          }}
        >
          <Title level={3}>Company Address</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="company_name"
                label="Company Name"
                rules={[
                  { required: true, message: "Please enter the company name" },
                ]}
              >
                <Input placeholder="Enter company name" />
              </Form.Item>
            </Col>
          </Row>
          <div className="w-1/2">
          <Form.Item label="Company Address">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name={["company_address", "line1"]}
                  rules={[{ required: true, message: "Please enter Address Line 1" }]}
                >
                  <Input placeholder="Enter Address Line 1" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name={["company_address", "line2"]}>
                  <Input placeholder="Enter Address Line 2 (optional)" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name={["company_address", "city"]}
                  rules={[{ required: true, message: "Please enter the city" }]}
                >
                  <Input placeholder="Enter city" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={["company_address", "state"]}
                  rules={[
                    {
                      required: true,
                      message: "Please select the state or union territory",
                    },
                  ]}
                >
                  <Select placeholder="Select state or union territory">
                    {indianStatesAndUTs.map((state) => (
                      <Option key={state} value={state}>
                        {state}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={["company_address", "pincode"]}
                  rules={[{ required: true, message: "Please enter the pincode" }]}
                >
                  <Input placeholder="Enter pincode" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gstin"
                label="GST Number"
                rules={[
                  { required: true, message: "Please enter the GST number" },
                ]}
              >
                <Input placeholder="Enter GST number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contact_number"
                label="Contact Number"
                rules={[
                  { required: true, message: "Please enter the contact number" },
                ]}
              >
                <Input placeholder="Enter contact number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
          </div>
        </Form>
        
      </div>
    </Spin>
  );
};

export default CompanyAddressSetting;
