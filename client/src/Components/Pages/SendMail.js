import React, { useState } from "react";
import { Modal, Input, Button, Typography, Form, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import axios from "axios";

const SendMailModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const defaultFormLink = "http://localhost:3000/client-onboarding";
  const [formLink, setFormLink] = useState(defaultFormLink);

  // Function to copy the form link
  const copyFormLink = () => {
    navigator.clipboard.writeText(formLink);
    toast.success("Link copied to clipboard");
  };

  const handleSend = async () => {
    try {
      const formData = await form.validateFields();
      const { mailId, message } = formData;

      const response = await axios.post("/sendFormlink", {
        to: mailId,
        message: message,
        formLink: formLink,
      });

      console.log("Response:", response);
      toast.success("Form link sent successfully");
    } catch (error) {
      console.error("Error sending form link:", error);
      toast.error("Failed to send form link");
    }
  };

  return (
    <Modal
      title="Send Mail"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} onFinish={handleSend} layout="vertical">
        <Form.Item
          name="mailId"
          label={
            <Typography.Text className="text-gray-600 font-semibold">
              Mail ID
            </Typography.Text>
          }
          rules={[{ required: true, message: "Please input mail ID" }]}
        >
          <Input placeholder="Mail ID" />
        </Form.Item>
        <Form.Item
          name="message"
          label={
            <Typography.Text className="text-gray-600 font-semibold">
              Custom Message
            </Typography.Text>
          }
          rules={[{ required: true, message: "Please input custom message" }]}
        >
          <Input.TextArea
            placeholder="Custom Message"
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>
        <Form.Item
          name="formLink"
          label={
            <Typography.Text className="text-gray-600 font-semibold">
              Client Onboarding Form Link
            </Typography.Text>
          }
          rules={[{ message: "Please input form link" }]}
        >
          <Input
    
            placeholder="Client Onboarding Form Link"
            defaultValue={defaultFormLink}
            onChange={(e) => setFormLink(e.target.value)}
            addonAfter={
              <Button icon={<CopyOutlined />} onClick={copyFormLink} />
            }
          />
        </Form.Item>
        <div className="flex justify-center">
          <Button type="primary" htmlType="submit" className="mr-6">
            Send Mail
          </Button>
          <Button
            className="border-primary  text-primary border-2 font-semibold"
             onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default SendMailModal;
