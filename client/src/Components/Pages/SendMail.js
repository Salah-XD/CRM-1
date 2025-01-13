import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Button,
  Typography,
  Spin,
  Form,
  message as antdMessage, 
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const SendMailModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [defaultFormLink, setDefaultFormLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [customMessage, setCustomMessage] = useState(""); // State for CKEditor content

  const generateFormLink = () => {
    const currentURL = window.location.href;
    const baseURL = currentURL.split("/").slice(0, 3).join("/");
    const newFormLink = `${baseURL}/client-onboarding`;
    setDefaultFormLink(newFormLink);
    form.setFieldsValue({ formLink: newFormLink });
  };

  const fetchCustomMessage = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "api/setting/getSetting/66c41b85dedfff785c08df21"
      );
      const formLinkEmail = response.data.formlink_email;
      if (formLinkEmail) {
        setCustomMessage(formLinkEmail); // Set the fetched custom message into CKEditor
      }
    } catch (error) {
      console.error("Error fetching custom message:", error);
      antdMessage.error("Failed to fetch custom message.");
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      generateFormLink();
      fetchCustomMessage(); // Fetch custom message when the modal is visible
    }
  }, [visible]);

  const copyFormLink = () => {
    navigator.clipboard.writeText(defaultFormLink);
    toast.success("Link copied to clipboard");
  };

  const handleSend = async () => {
    try {
      setLoading(true);

      const formData = await form.validateFields();
      const { mailId } = formData;
      const formLink = formData.formLink || defaultFormLink;

      if (!customMessage) {
        throw new Error("Custom message is required");
      }

      const response = await axios.post("/api/sendFormlink", {
        to: mailId,
        message: customMessage, // Use the CKEditor content here
        formLink: formLink,
      });

      // Pass the form link to the parent
      if (onSuccess) {
        onCancel();
        onSuccess(mailId, formLink);
      }
    } catch (error) {
      console.error("Error sending form link:", error);
      antdMessage.error("Mail not sent. Some error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
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
          rules={[{ required: true, message: "Please input custom message" }]}>
          <CKEditor
            editor={ClassicEditor}
            data={customMessage} // Set CKEditor initial data
            config={{
              toolbar: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "|",
                "undo",
                "redo",
              ],
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setCustomMessage(data); // Update CKEditor content state
            }}
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
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
    </Spin>
  );
};

export default SendMailModal;
