import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, message, Spin, Typography } from "antd";
import axios from "axios";

const { Title } = Typography;

const BankDetailsSetting = () => {
  const [form] = Form.useForm();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await axios.get("/api/setting/getTheBankDetails");
        console.log("API Response:", response.data); // Debugging: Check the response structure
        if (response.data && response.data.bankDetail) {
          form.setFieldsValue(response.data.bankDetail); // Update this line based on the API structure
        } else {
          message.warning("No bank details found to populate.");
        }
      } catch (error) {
        console.error("Error fetching bank details:", error);
        message.error("Failed to fetch bank details.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchBankDetails();
  }, [form]);

  const handleSubmit = async (values) => {
    try {
      await axios.post("/api/setting/saveAndUpdateBankDetail", values);
      message.success("Bank details saved successfully.");
    } catch (error) {
      message.error("Failed to save bank details.");
    }
  };

  return (
    <Spin spinning={isFetching}>
      <div style={{ padding: 20 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            bank_name: "",
            branch_name: "",
            account_number: "",
            ifsc_code: "",
            account_holder_name: "",
            additional_details: "",
          }}
        >
          <Title level={3}>Bank Details Setting</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="bank_name"
                label="Bank Name"
                rules={[{ required: true, message: "Please enter the bank name" }]}
              >
                <Input placeholder="Enter bank name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="branch_name"
                label="Branch Name"
                rules={[{ required: true, message: "Please enter the branch name" }]}
              >
                <Input placeholder="Enter branch name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="account_number"
                label="Account Number"
                rules={[{ required: true, message: "Please enter the account number" }]}
              >
                <Input placeholder="Enter account number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ifsc_code"
                label="IFSC Code"
                rules={[{ required: true, message: "Please enter the IFSC code" }]}
              >
                <Input placeholder="Enter IFSC code" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="account_holder_name"
                label="Account Holder Name"
                rules={[{ required: true, message: "Please enter the account holder name" }]}
              >
                <Input placeholder="Enter account holder name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};

export default BankDetailsSetting;
