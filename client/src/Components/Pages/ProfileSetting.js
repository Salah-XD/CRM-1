import React, { useState, useEffect } from 'react';
import { Form, Input, Upload, Button, Row, Col, message ,Spin} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const ProfileSettings = () => {
  const [form] = Form.useForm();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    // Fetch profile data and populate the form
    const fetchProfileData = async () => {
      
      try {
        const response = await axios.get('/api/setting/getProfileSetting');
        console.log(response.data.profile);
        form.setFieldsValue(response.data.profile);
      } catch (error) {
        message.error('Failed to fetch profile settings.');
      }finally {
        setIsFetching(false);

      }
    };

    fetchProfileData();
  }, [form]);

  const handleSubmit = async (values) => {
    try {
      await axios.post('/api/setting/saveOrUpdateProfile', values);
      message.success('Profile settings saved successfully.');
    } catch (error) {
      message.error('Failed to save profile settings.');
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
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        companyName: '',
        companyAddress: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          pincode: '',
        },
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="company_name"
            label="Company Name"
            rules={[{ required: true, message: 'Please enter the company name' }]}
          >
            <Input placeholder="Enter company name" />
          </Form.Item>
        </Col>
        {/* <Col span={12}>
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
        </Col> */}
      </Row>
      <Form.Item label="Company Address">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name={['company_address', 'line1']}
              rules={[{ required: true, message: 'Please enter Address Line 1' }]}
              className="w-1/2"
            >
              <Input placeholder="Enter Address Line 1" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name={['company_address', 'line2']}
              className="w-1/2"
            >
              <Input placeholder="Enter Address Line 2 (optional)" />
            </Form.Item>
          </Col>
        </Row>
        <div className='w-1/2'>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name={['company_address', 'city']}
                rules={[{ required: true, message: 'Please enter the city' }]}
              >
                <Input placeholder="Enter city" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['company_address', 'state']}
                rules={[{ required: true, message: 'Please enter the state' }]}
              >
                <Input placeholder="Enter state" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['company_address', 'pincode']}
                rules={[{ required: true, message: 'Please enter the pincode' }]}
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
    </Spin>
  );
};

export default ProfileSettings;
