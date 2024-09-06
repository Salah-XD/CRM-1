import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin,Typography } from 'antd';
import axios from 'axios';

const NoteForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // State to handle the initial data loading

  const { Title } = Typography;

  useEffect(() => {
    // Fetch the initial form data
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/setting/getSetting/66c41b85dedfff785c08df21');
        form.setFieldsValue(response.data);
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
        <Form form={form} layout="vertical" initialValues={{ proposalNote: '', invoiceNote: '' }}>
        <Title level={3}>Note Setting</Title>
          <Form.Item
            label="Proposal Note"
            name="proposal_note"
            className='w-1/2'
            rules={[{ required: true, message: 'Please enter the proposal note' }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item
            label="Invoice Note"
            name="invoice_note"
            className='w-1/2'
            rules={[{ required: true, message: 'Please enter the invoice note' }]}
          >
            <Input.TextArea rows={6} />
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

export default NoteForm;
