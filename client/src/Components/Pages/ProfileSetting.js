import React from 'react';
import { Form, Input, Upload, Button, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const ProfileSettings = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log('Form values:', values);
    // Handle form submission logic here
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        companyName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="companyName"
            label="Company Name"
            rules={[{ required: true, message: 'Please enter the company name' }]}
          >
            <Input placeholder="Enter company name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="companyLogo"
            label="Company Logo"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Please upload the company logo' }]}
          >
            <Upload
              name="logo"
              listType="picture"
              beforeUpload={() => false} // Prevent automatic upload
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="addressLine1"
            label="Address Line 1"
            rules={[{ required: true, message: 'Please enter Address Line 1' }]}
          >
            <Input placeholder="Enter Address Line 1" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="addressLine2"
            label="Address Line 2"
          >
            <Input placeholder="Enter Address Line 2 (optional)" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: 'Please enter the city' }]}
          >
            <Input placeholder="Enter city" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="state"
            label="State"
            rules={[{ required: true, message: 'Please enter the state' }]}
          >
            <Input placeholder="Enter state" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="pincode"
            label="Pincode"
            rules={[{ required: true, message: 'Please enter the pincode' }]}
          >
            <Input placeholder="Enter pincode" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default ProfileSettings;
