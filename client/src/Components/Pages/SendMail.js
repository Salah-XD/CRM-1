import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Typography, Form, message } from "antd";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import axios from "axios";

const SendMailModal = ({ visible, onCancel, onCloseMainModal }) => {
  const [form] = Form.useForm();
  const [defaultFormLink, setDefaultFormLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const generateFormLink = () => {
    const currentURL = window.location.href;
    const baseURL = currentURL.split("/").slice(0, 3).join("/");
    const newFormLink = `${baseURL}/client-onboarding`;
    setDefaultFormLink(newFormLink);
    form.setFieldsValue({ formLink: newFormLink });
  };

  useEffect(() => {
    if (visible) {
      generateFormLink();
    }
  }, [visible]);

  const copyFormLink = () => {
    navigator.clipboard.writeText(defaultFormLink);
    toast.success("Link copied to clipboard");
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    onCancel();
  };

  const handleSend = async () => {
    try {
      setLoading(true);

      const formData = await form.validateFields();
      const { mailId, message } = formData;
      const formLink = formData.formLink || defaultFormLink;

      const response = await axios.post("/api/sendFormlink", {
        to: mailId,
        message: message,
        formLink: formLink,
      });

      setSentTo(mailId);
      generateFormLink();
      console.log("Response:", response);
      setSuccessModalVisible(true);
      message.success("Form link sent successfully");
    } catch (error) {
      console.error("Error sending form link:", error);
      message.error("Failed to send form link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
          >
            <Input
              placeholder="Client Onboarding Form Link"
              value={defaultFormLink}
              readOnly
              addonAfter={
                <Button icon={<CopyOutlined />} onClick={copyFormLink} />
              }
            />
          </Form.Item>
          <div className="flex justify-center">
            <Button
              type="primary"
              htmlType="submit"
              className="mr-6"
              loading={loading}
            >
              Send Mail
            </Button>
            <Button
              className="border-primary text-primary border-2 font-semibold"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
        visible={successModalVisible}
        onCancel={handleSuccessModalClose}
        footer={null}
      >
        <div className="flex items-center justify-center">
          <CheckOutlined className="text-green-500 text-4xl" />
        </div>
        <div className="text-center mb-4">
          <Typography.Text strong>Mail Sent To:</Typography.Text>
          <Typography.Text className="block my-2">{sentTo}</Typography.Text>
        </div>
        <div className="text-center mb-4">
          <Typography.Text strong>
            Copy formlink:{" "}
            <Typography.Link
              href={defaultFormLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(defaultFormLink);
                message.success("Form link copied to clipboard");
              }}
            >
              {defaultFormLink}
            </Typography.Link>
          </Typography.Text>
        </div>
      </Modal>
    </>
  );
};

export default SendMailModal;
