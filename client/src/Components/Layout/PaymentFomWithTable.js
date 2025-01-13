import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Table,
  notification,
  DatePicker,
} from "antd";

const { Option } = Select;

const ProposalManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock proposals data
  const proposals = [
    {
      id: "1",
      proposalnumber: "123",
      date: "12/12/2004",
      clientName: "ABC Pvt Ltd",
      location: "Hyderabad",
      service: "Hygiene Rating",
      emailId: "abc@example.com",
      auditorConveyance: "Car",
      outletCount: 5,
      proposalValue: 50000,
      actualAmount: 48000,
      auditDoneBy: "John Doe",
      auditDoneDate: "2024-08-10",
    },
    {
      proposalnumber: "123",
      date: "12/12/2004",
      id: "2",
      clientName: "XYZ Ltd",
      location: "Bangalore",
      service: "Eat Right",
      emailId: "xyz@example.com",
      auditorConveyance: "Train",
      outletCount: 8,
      proposalValue: 75000,
      actualAmount: 73000,
      auditDoneBy: "Jane Smith",
      auditDoneDate: "2024-08-15",
    },
  ];

  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      proposalNumber:"123",
      date:"12/12/2004",
      clientName: "ABC Pvt Ltd",
      location: "Hyderabad",
      service: "Hygiene Rating",
      emailId: "abc@example.com",
      auditorConveyance: "Car",
      outletCount: 5,
      proposalValue: 50000,
      actualAmount: 48000,
      auditDoneBy: "John Doe",
      auditDoneDate: "2024-08-10",
    },
    {
      key: "2",
      proposalNumber:"123",
      date:"12/12/2004",
      clientName: "XYZ Ltd",
      location: "Bangalore",
      service: "Eat Right",
      emailId: "xyz@example.com",
      auditorConveyance: "Train",
      outletCount: 8,
      proposalValue: 75000,
      actualAmount: 73000,
      auditDoneBy: "Jane Smith",
      auditDoneDate: "2024-08-15",
    },
  ]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleProposalChange = (proposalId) => {
    const selectedProposal = proposals.find(
      (proposal) => proposal.id === proposalId
    );

    if (selectedProposal) {
      form.setFieldsValue({
        clientName: selectedProposal.clientName,
        location: selectedProposal.location,
        service: selectedProposal.service,
        emailId: selectedProposal.emailId,
        auditorConveyance: selectedProposal.auditorConveyance,
        outletCount: selectedProposal.outletCount,
        proposalValue: selectedProposal.proposalValue,
        actualAmount: selectedProposal.actualAmount,
        auditDoneBy: selectedProposal.auditDoneBy,
        auditDoneDate: selectedProposal.auditDoneDate,
      });
    }
  };

  const handleSubmit = (values) => {
    const newRecord = {
      key: Date.now().toString(),
      clientName: values.clientName,
      location: values.location,
      service: values.service,
      emailId: values.emailId,
      auditorConveyance: values.auditorConveyance,
      outletCount: values.outletCount,
      proposalValue: values.proposalValue,
      actualAmount: values.actualAmount,
      auditDoneBy: values.auditDoneBy,
      auditDoneDate: values.auditDoneDate.format("YYYY-MM-DD"),
    };

    setDataSource((prevData) => [...prevData, newRecord]);
    notification.success({
      message: "Success",
      description: "New record added successfully!",
    });
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Proposal Number",
      dataIndex: "proposalNumber",
      key: "proposalNumber",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Email ID",
      dataIndex: "emailId",
      key: "emailId",
    },
    {
      title: "Auditor Conveyance",
      dataIndex: "auditorConveyance",
      key: "auditorConveyance",
    },
    {
      title: "Outlet Count",
      dataIndex: "outletCount",
      key: "outletCount",
    },
    {
      title: "Proposal Value",
      dataIndex: "proposalValue",
      key: "proposalValue",
    },
    {
      title: "Actual Amount",
      dataIndex: "actualAmount",
      key: "actualAmount",
    },
    {
      title: "Audit Done By",
      dataIndex: "auditDoneBy",
      key: "auditDoneBy",
    },
    {
      title: "Audit Done Date",
      dataIndex: "auditDoneDate",
      key: "auditDoneDate",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: "20px" }}
      >
        Add Record
      </Button>

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        style={{ marginBottom: "20px" }}
      />

      <Modal
        title="Add Record"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800} // Increased modal width
        bodyStyle={{ padding: "20px 40px" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <Form.Item
            label="Select Proposal"
            name="proposal"
            rules={[{ required: true, message: "Please select a proposal" }]}
          >
            <Select
              placeholder="Select a proposal"
              onChange={handleProposalChange}
            >
              {proposals.map((proposal) => (
                <Option key={proposal.id} value={proposal.id}>
                  {proposal.clientName} ({proposal.service})
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Client Information */}
          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Item
              label="Client Name"
              name="clientName"
              rules={[{ required: true, message: "Please enter client name" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Enter client name" />
            </Form.Item>

            <Form.Item
              label="Location"
              name="location"
              rules={[{ required: true, message: "Please enter location" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Enter location" />
            </Form.Item>
          </div>

          {/* Service and Email */}
          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Item
              label="Service"
              name="service"
              rules={[{ required: true, message: "Please select a service" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Select service">
                <Option value="Hygiene Rating">Hygiene Rating</Option>
                <Option value="Eat Right">Eat Right</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Email ID"
              name="emailId"
              rules={[{ required: true, message: "Please enter email ID" }]}
              style={{ flex: 1 }}
            >
              <Input type="email" placeholder="Enter email ID" />
            </Form.Item>
          </div>

          {/* Auditor Conveyance and Outlet Count */}
          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Item
              label="Auditor Conveyance"
              name="auditorConveyance"
              rules={[
                { required: true, message: "Please enter conveyance type" },
              ]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Enter conveyance type" />
            </Form.Item>

            <Form.Item
              label="Outlet Count"
              name="outletCount"
              rules={[{ required: true, message: "Please enter outlet count" }]}
              style={{ flex: 1 }}
            >
              <Input type="number" placeholder="Enter outlet count" />
            </Form.Item>
          </div>

          {/* Proposal Value and Actual Amount */}
          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Item
              label="Proposal Value"
              name="proposalValue"
              rules={[
                { required: true, message: "Please enter proposal value" },
              ]}
              style={{ flex: 1 }}
            >
              <Input type="number" placeholder="Enter proposal value" />
            </Form.Item>

            <Form.Item
              label="Actual Amount"
              name="actualAmount"
              rules={[
                { required: true, message: "Please enter actual amount" },
              ]}
              style={{ flex: 1 }}
            >
              <Input type="number" placeholder="Enter actual amount" />
            </Form.Item>
          </div>

          {/* Audit Details */}
          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Item
              label="Audit Done By"
              name="auditDoneBy"
              rules={[{ required: true, message: "Please enter auditor name" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Enter auditor name" />
            </Form.Item>

            <Form.Item
              label="Audit Done Date"
              name="auditDoneDate"
              rules={[{ required: true, message: "Please select audit date" }]}
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Save Record
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ProposalManagement;
