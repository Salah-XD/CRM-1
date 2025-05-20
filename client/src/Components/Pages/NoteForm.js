import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin, Typography } from 'antd';
import axios from 'axios';

const NoteForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const { Title } = Typography;

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/setting/getSetting');
        form.setFieldsValue(response.data);
      } catch (error) {
        message.error('Failed to fetch settings');
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, [form]);

  // Modified handleUpdate function to accept the note type
  const handleUpdate = async (noteType) => {
    try {
      // Validate only the field corresponding to the noteType
      const values = await form.validateFields([noteType]);
      setLoading(true);
      await axios.post('/api/setting/updateSetting', values);
      message.success(`${noteType === 'proposal_note' ? 'Proposal' : 'Invoice'} note updated successfully`);
    } catch (error) {
      message.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={isFetching}>
      <div style={{ padding: 20 }}>
        <Form form={form} layout="vertical" initialValues={{ proposal_note: '', invoice_note: '' }}>
          <Title level={3}>Note Setting</Title>

          {/* Proposal Note Field */}
          <Form.Item
            label="Proposal Note"
            name="proposal_note"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter the proposal note' }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item>
            {/* Save button for Proposal Note */}
            <Button type="primary" onClick={() => handleUpdate('proposal_note')}>
              Save Proposal Note
            </Button>
          </Form.Item>

          {/* Invoice Note Field */}
          <Form.Item
            label="Invoice Note"
            name="invoice_note"
            className="w-1/2"
            rules={[{ required: true, message: 'Please enter the invoice note' }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item>
            {/* Save button for Invoice Note */}
            <Button type="primary" onClick={() => handleUpdate('invoice_note')}>
              Save Invoice Note
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};

export default NoteForm;
