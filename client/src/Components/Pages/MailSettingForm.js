import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import axios from 'axios';

const MailSettingForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // State to handle the initial data loading

  useEffect(() => {
    // Fetch the initial form data
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/setting/getSetting/66c41b85dedfff785c08df21');
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
        setIsFetching(false); // Set fetching to false once data is loaded
      }
    };

    fetchSettings();
  }, [form]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();

      // Convert comma-separated string back to array
      values.proposal_cc = values.proposal_cc.split(',').map(email => email.trim());
      values.invoice_cc = values.invoice_cc.split(',').map(email => email.trim());
      values.agreement_cc = values.agreement_cc.split(',').map(email => email.trim());

      setLoading(true);
      await axios.put('/api/setting/updateSetting/66c41b85dedfff785c08df21', values);
      message.success('Settings updated successfully');
    } catch (error) {
      message.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={isFetching}> {/* Spin wraps the entire form and shows until isFetching is false */}
      <div style={{ padding: 20 }}>
        <Form form={form} layout="vertical" initialValues={{ proposal_email: '', invoice_email: '', agreement_email: '', proposal_cc: '', invoice_cc: '', agreement_cc: '' }}>
          
          <Form.Item
            label="Proposal Mail Message"
            name="proposal_email"
            className='w-1/2'
            rules={[{ required: true, message: 'Please enter the proposal email message' }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item
            label="Proposal CC Email(s)"
            name="proposal_cc"
            className='w-1/2'
            rules={[{ required: false }]}
          >
            <Input placeholder="Enter CC email(s), separated by commas" />
          </Form.Item>

          <Form.Item
            label="Agreement Mail Message"
            name="agreement_email"
            className='w-1/2'
            rules={[{ required: true, message: 'Please enter the agreement email message' }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item
            label="Agreement CC Email(s)"
            name="agreement_cc"
            className='w-1/2'
            rules={[{ required: false }]}
          >
            <Input placeholder="Enter CC email(s), separated by commas" />
          </Form.Item>

          <Form.Item
            label="Invoice Mail Message"
            name="invoice_email"
            className='w-1/2'
            rules={[{ required: true, message: 'Please enter the invoice email message' }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item
            label="Invoice CC Email(s)"
            name="invoice_cc"
            className='w-1/2'
            rules={[{ required: false }]}
          >
            <Input placeholder="Enter CC email(s), separated by commas" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleUpdate} >
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};

export default MailSettingForm;
