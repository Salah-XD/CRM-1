import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin, Typography } from 'antd';
import axios from 'axios';

const MailSettingCC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const { Title } = Typography;

  useEffect(() => {
    // Fetch the initial form data
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/setting/getSetting');
        const settings = response.data;
        // Join array of emails into a string separated by commas for display in input fields
        settings.proposal_cc = settings.proposal_cc?.join(', ') || '';
        settings.invoice_cc = settings.invoice_cc?.join(', ') || '';
        settings.agreement_cc = settings.agreement_cc?.join(', ') || '';
        form.setFieldsValue(settings);
      } catch (error) {
        message.error('Failed to fetch settings');
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, [form]);

  const handleUpdate = async (fieldName) => {
    try {
      const values = await form.validateFields([fieldName]);

      // Convert comma-separated string back to array
      const updatedField = {
        [fieldName]: values[fieldName].split(',').map(email => email.trim()),
      };

      setLoading(true);
      await axios.post('/api/setting/updateSetting', updatedField);
      message.success(`${fieldName.replace('_cc', '')} CC updated successfully`);
    } catch (error) {
      message.error(`Failed to update ${fieldName}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={isFetching}>
      <div style={{ padding: 20 }}>
        <Form form={form} layout="vertical" initialValues={{ proposal_cc: '', invoice_cc: '', agreement_cc: '' }}>
          <Title level={3}>CC's Mail Setting</Title>

          <div className="my-4">
          <Form.Item
            label="Proposal CC Email(s)"
            name="proposal_cc"
            className='w-1/2'
            rules={[{ required: false }]}
          >
            <Input.TextArea rows={4} placeholder="Enter CC email(s), separated by commas" />
          </Form.Item>
          <Button type="primary" onClick={() => handleUpdate('proposal_cc')}>
            Save Proposal CC
          </Button>
          </div>

 
          <div className="my-4">
          <Form.Item
            label="Agreement CC Email(s)"
            name="agreement_cc"
            className='w-1/2'
            rules={[{ required: false }]}
          >
            <Input.TextArea rows={4} placeholder="Enter CC email(s), separated by commas" />
          </Form.Item>
          <Button type="primary" onClick={() => handleUpdate('agreement_cc')}>
            Save Agreement CC
          </Button>
</div>

          <Form.Item
            label="Invoice CC Email(s)"
            name="invoice_cc"
            className='w-1/2'
            rules={[{ required: false }]}
          >
            <Input.TextArea rows={4} placeholder="Enter CC email(s), separated by commas" />
          </Form.Item>
          <Button type="primary" onClick={() => handleUpdate('invoice_cc')}>
            Save Invoice CC
          </Button>
 
        </Form>
      
      </div>
    </Spin>
  );
};

export default MailSettingCC;
