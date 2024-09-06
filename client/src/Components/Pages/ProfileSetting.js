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
import { UploadOutlined } from "@ant-design/icons";
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

const ProfileSettings = () => {
  const [form] = Form.useForm();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("/api/setting/getProfileSetting");
        console.log(response.data.profile);
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

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
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
        }}
      >
        <Title level={3}>Profile Setting</Title>
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
        <Form.Item label="Company Address">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={["company_address", "line1"]}
                rules={[
                  { required: true, message: "Please enter Address Line 1" },
                ]}
                className="w-1/2"
              >
                <Input placeholder="Enter Address Line 1" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name={["company_address", "line2"]} className="w-1/2">
                <Input placeholder="Enter Address Line 2 (optional)" />
              </Form.Item>
            </Col>
          </Row>
          <div className="w-1/2">
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
                  rules={[
                    { required: true, message: "Please enter the pincode" },
                  ]}
                >
                  <Input placeholder="Enter pincode" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
      </div>
    </Spin>
  );
};

export default ProfileSettings;
