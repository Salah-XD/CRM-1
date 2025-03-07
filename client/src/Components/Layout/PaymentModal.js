import React from "react";
import { Modal, Button, Input, Upload, Form, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const PaymentModal = ({ visible, handleCancel,proposalId}) => {
  const [form] = Form.useForm();
  const { user } = useAuth();

 

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      

      formData.append("amountReceived", values.amountReceived);
      formData.append("referenceNumber", values.referenceNumber);
      formData.append("proposalId", proposalId);
      formData.append("auditor_id", user._id);
      
      // Append file (if uploaded)
      if (values.referenceDocument && values.referenceDocument.length > 0) {
        formData.append("referenceDocument", values.referenceDocument[0].originFileObj);
      }

      // Send data to backend
      const response = await axios.post("/api/payment/saveAuditorPayment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success(response.data.message);
      form.resetFields();
      handleCancel();
    } catch (error) {
      console.error("Error submitting payment:", error);
      message.error("Failed to save payment details");
    }
  };

  return (
    <Modal
      title="Payment Details"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical" name="paymentForm">
        <Form.Item
          name="amountReceived"
          label="Amount Received"
          rules={[{ required: true, message: "Please enter the amount received" }]}
        >
          <Input placeholder="Enter amount received" />
        </Form.Item>

        <Form.Item
          name="referenceNumber"
          label="Reference Number"
          rules={[{ required: true, message: "Please enter the reference number" }]}
        >
          <Input placeholder="Enter reference number" />
        </Form.Item>

        <Form.Item
          name="referenceDocument"
          label="Reference Document (PDF/Image)"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload beforeUpload={() => false} listType="picture">
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaymentModal;
