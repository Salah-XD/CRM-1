import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Button, Spin } from "antd";
import axios from "axios";

const { Option } = Select;

const EnquiryForm = ({
  visible,
  onClose,
  handleOkEnquiryModel,
  enquiryId,
}) => {
  const [form] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/getAllBussinessName");
        setClients(response.data.businesses);
      } catch (error) {
        console.error("Error fetching client names:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEnquiry = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/enquiry/getEnquiryById/${enquiryId}`);
        form.setFieldsValue(response.data);
      } catch (error) {
        console.error("Error fetching enquiry:", error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchClients();
      if (enquiryId) {
        fetchEnquiry();
      }
    }
  }, [visible, enquiryId]);

  const handleSubmit = async (values) => {
    try {
      let response;
      if (enquiryId) {
        response = await axios.put(
          `/api/enquiry/updateEnquiryById/${enquiryId}`,
          values
        );
      } else {
        response = await axios.post("/api/enquiry/saveEnquiryForm", values);
      }
      //console.log("Response:", response.data);
      handleOkEnquiryModel();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      title={enquiryId ? "Update Enquiry" : "Add Enquiry"}
      onCancel={onClose}
      footer={[
        <div className="flex justify-center">
          <div className="flex justify-between space-x-2">
            <Button key="cancel" onClick={onClose}>
              Cancel
            </Button>
            <Button key="submit" type="primary" onClick={() => form.submit()}>
              {enquiryId ? "Update" : "Add"}
            </Button>
          </div>
        </div>,
      ]}
    >
      {loading ? (
        <div className="text-center align-center">
          <Spin />
        </div>
      ) : (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="business"
            label="Select FBO (FBO Business Name)"
            rules={[{ required: true, message: "Please select a client" }]}
          >
            <Select placeholder="Select a client">
              {clients.map((client) => (
                <Option key={client._id} value={client._id}>
                  {client.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="service"
            label="Select the service for enquiry"
            rules={[{ required: true, message: "Please select a service" }]}
          >
            <Select placeholder="Select a service">
              <Option value="TPA">TPA</Option>
              <Option value="Hygiene Rating">Hygiene Rating</Option>
              <Option value="ER Station">ER Station</Option>
              <Option value="ER Fruit and Vegetable Market">
                ER Fruit and Vegetable Market
              </Option>
              <Option value="ER Hub">ER Hub</Option>
              <Option value="ER Campus">ER Campus</Option>
              <Option value="ER Worship Place">ER Worship Place</Option>
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EnquiryForm;
