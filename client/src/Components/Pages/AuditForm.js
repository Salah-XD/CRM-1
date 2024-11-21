import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Typography,
  Timeline,
  Row,
  Col,
  Modal,
} from "antd";
import { ArrowLeftOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import AdminDashboard from "../Layout/AdminDashboard";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Text } = Typography;

const AuditForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  const onFinish = (values) => {
    console.log("Form values:", values);
  };

  const handleViewAndModfiy = () => {
    navigate(`/audit-report/${params.audit_id}`);
  };

  const handleModalOk = () => {
    console.log(`${modalAction} action confirmed`);
    setApprovalModalVisible(false);
  };

  const handleModalCancel = () => {
    console.log("Action canceled");
    setApprovalModalVisible(false);
  };

  const showApprovalModal = (action) => {
    setModalAction(action);
    setApprovalModalVisible(true);
  };

  const handleEditButton=()=>{
    setIsEditable(true);
  }

  const handleSubmitButton=()=>{
    setIsEditable(false);
  }
  return (
    <AdminDashboard>
      <div
        style={{
          padding: "24px",
          backgroundColor: "#f6f9fc",
          minHeight: "100vh",
        }}
      >
        <Row gutter={16} justify="center">
          <Col xs={24} md={16} lg={12}>
            <div className="flex items-center p-5 justify-between">
              {/* Center-aligned label */}
              <div className="flex-1 text-center">
                <h4 className="text-xl font-medium">Audit Information</h4>
              </div>

              {/* Right-aligned button */}
              <div>
                <Button
                  style={{ padding: 4, marginBottom: 16 }}
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
              </div>
            </div>

            <Form
              layout="vertical"
              onFinish={onFinish}
              style={{
                background: "#fff",
                padding: "24px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ textAlign: "right" }}>
               {!isEditable?( <Button
                  type="link"
                  style={{ marginBottom: 16, textDecoration: "underline" }}
                  onClick={handleEditButton}
                >
                  Edit
                </Button>):(
                <Button
                  style={{ padding: 4, marginBottom: 16 }}
                  onClick={handleSubmitButton}
                >
             Save
                </Button>)}
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="FBO Name"
                    className="font-medium"
                    name="fboName"
                  >
                    <Input
                      placeholder="Name comes here"
                      className="font-normal"
                      disabled={!isEditable}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Outlet Name"
                    className="font-medium"
                    name="outletName"
                  >
                    <Input
                      placeholder="Name comes here"
                      className="font-normal"
                      disabled={!isEditable}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Proposal Number"
                    className="font-medium"
                    name="proposalNumber"
                  >
                    <Input placeholder="#PROP 0001" className="font-normal"  disabled={!isEditable} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Location"
                    className="font-medium"
                    name="location"
                  >
                    <Input placeholder="Porur" className="font-normal"  disabled={!isEditable} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Audit Number"
                    className="font-medium"
                    name="auditNumber"
                  >
                    <Input placeholder="02" className="font-normal"  disabled={!isEditable} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Auditor Name"
                    className="font-medium"
                    name="auditorName"
                  >
                    <Input placeholder="Auditor Name" className="font-normal"   disabled={!isEditable}/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                <div className="flex mt-4">
                <div>
                  <h1 className="mr-5 font-medium">Confirm Date:</h1>
                  {/* <Text className="text-xs" type="secondary">Change the date, if you need</Text> */}
                </div>

                <Form.Item name="date">
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select date"
                    disabled={!isEditable}
                  />
                </Form.Item>
              </div>
                </Col>
              </Row>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: "24px",
                }}
              >
                <Button
                  type="primary"
                  style={{ backgroundColor: "#009688", borderColor: "#009688" }}
                  onClick={handleViewAndModfiy}
                >
                  View/modify
                </Button>
                <Button
                  type="primary"
                  style={{ backgroundColor: "#009688", borderColor: "#009688" }}
                  onClick={() => showApprovalModal("Approve")}
                >
                  Approve
                </Button>
                <Button
                  type="primary"
                  style={{ backgroundColor: "#009688", borderColor: "#009688" }}
                  onClick={() => showApprovalModal("Reject")}
                >
                  Reject
                </Button>
              </div>
            </Form>
          </Col>
          <Col xs={30} md={8} lg={6}>
            <div className="border mt-12">
              <div className="border p-4 bg-white">
                <Title level={4} style={{ textAlign: "center" }}>
                  Current Status
                </Title>
              </div>
              <Timeline
                style={{
                  padding: "24px",
                  backgroundColor: "#f6f9fc",
                  borderRadius: "8px",
                }}
                items={[
                  {
                    color: "orange",
                    children: (
                      <>
                        <Text strong>Assigned</Text>
                        <br />
                        <Text type="secondary">Date & Time</Text>
                      </>
                    ),
                  },
                  {
                    color: "blue",
                    children: (
                      <>
                        <Text strong>Started</Text>
                        <br />
                        <Text type="secondary">Date & Time</Text>
                      </>
                    ),
                  },
                  {
                    color: "purple",
                    children: (
                      <>
                        <Text strong>Last modify</Text>
                        <br />
                        <Text type="secondary">Date & Time</Text>
                      </>
                    ),
                  },
                  {
                    color: "green",
                    children: (
                      <>
                        <Text strong>Submitted</Text>
                        <br />
                        <Text type="secondary">Date & Time</Text>
                      </>
                    ),
                  },
                ]}
              />
            </div>
          </Col>
        </Row>

        {/* Approval Modal */}
        <Modal
          visible={approvalModalVisible}
          footer={null} // Disable default footer
          onCancel={() => setApprovalModalVisible(false)}
        >
          <div className="flex items-center mb-4">
            <ExclamationCircleFilled className="text-yellow-500 text-3xl mr-2" />
            <p className="text-lg font-semibold text-gray-800">
              Are you sure you want to {modalAction} this client?
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="primary"
              onClick={handleModalOk}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Confirm
            </Button>
            <Button
              type="default"
              onClick={handleModalCancel}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Cancel
            </Button>
          </div>
        </Modal>
      </div>
    </AdminDashboard>
  );
};

export default AuditForm;
