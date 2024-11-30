import React, { useState, useEffect } from "react";
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
  message,
} from "antd";
import { ArrowLeftOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import AdminDashboard from "../Layout/AdminDashboard";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

const { Title, Text } = Typography;

const AuditForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [auditData, setAuditData] = useState({});
  const [form] = Form.useForm();

  const getStatusColor = (status) => {
    switch (status) {
      case "assigned":
        return "bg-yellow-100 text-yellow-800 rounded-full";
      case "submitted":
        return "bg-green-100 text-green-800 rounded-full";
      case "draft":
        return "bg-yellow-100 text-yellow-800 rounded-full";
      case "rejected":
        return "bg-red-100 text-red-800 rounded-full";
      case "in-progress": // New status for blue color
        return "bg-blue-100 text-blue-800 rounded-full";
      default:
        return "bg-gray-100 text-gray-800 rounded-full";
    }
  };

  // Fetch audit details
  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const response = await axios.get(
          `/api/auditor/getAuditById/${params.audit_id}`
        );
        if (response.data.success) {
          setAuditData(response.data.data);
          form.setFieldsValue(response.data.data); // Populate form fields
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Failed to fetch audit details.");
      }
    };
    fetchAudit();
  }, [params.audit_id, form]);

  const onFinish = async (values) => {
    try {
      const response = await axios.put(
        `/api/auditor/updateAuditById/${params.audit_id}`,
        values
      );
      if (response.data.success) {
        message.success("Audit updated successfully!");
        setIsEditable(false);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Failed to update audit.");
    }
  };

  const handleViewAndModify = () => {
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

  const handleEditButton = () => {
    setIsEditable(true);
  };

  const handleSubmitButton = () => {
    form.submit(); // Trigger form submission
  };

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
              <div className="flex-1 text-center">
                <h4 className="text-xl font-medium">Audit Information</h4>
              </div>
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
              form={form}
              onFinish={onFinish}
              style={{
                background: "#fff",
                padding: "24px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ textAlign: "right" }}>
                {!isEditable ? (
                  <Button
                    type="link"
                    style={{ marginBottom: 16, textDecoration: "underline" }}
                    onClick={handleEditButton}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    style={{ padding: 4, marginBottom: 16 }}
                    onClick={handleSubmitButton}
                  >
                    Save
                  </Button>
                )}
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="FBO Name" name="fbo_name">
                    <Input
                      placeholder="Name comes here"
                      disabled={!isEditable}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Outlet Name" name="outlet_name">
                    <Input
                      placeholder="Name comes here"
                      disabled={!isEditable}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Proposal Number" name="proposal_number">
                    <Input placeholder="#PROP 0001" disabled={!isEditable} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Location" name="location">
                    <Input placeholder="Porur" disabled={!isEditable} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Audit Number" name="audit_number">
                    <Input placeholder="02" disabled={!isEditable} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Auditor Name" name="auditor_name">
                    <Input placeholder="Auditor Name" disabled={!isEditable} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <div className="flex mt-4">
                    <div>
                      <h1 className="mr-5 font-medium">Confirm Date:</h1>
                    </div>
                    <Form.Item
                      name="started_at"
                      getValueProps={(i) => ({ value: dayjs(i) })}
                      rules={[
                        {
                          required: true,
                          message: "Please select the start date!",
                        },
                      ]} // Optional validation
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        placeholder="Select date"
                        format="DD-MM-YYYY"
                        disabled={!isEditable} // Conditionally disable the field
                        allowClear={false}
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
                  onClick={handleViewAndModify}
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
            <div className="border mt-5">
              <div className="border p-4 bg-white">
                <Title level={4} style={{ textAlign: "center" }}>
                  Current Status
                </Title>
              </div>
              <div
                style={{
                  maxHeight: "500px", // Adjust container height
                  overflowY: "auto", // Enable vertical scrolling
                  padding: "24px",
                  backgroundColor: "#f6f9fc",
                  borderRadius: "8px",
                  scrollbarWidth: "thin", // For Firefox
                  scrollbarColor: "#888 #f6f9fc", // Custom scrollbar for Firefox
                }}
              >
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
                          <span
                            className={`px-2 py-1 text-sm font-semibold rounded ${getStatusColor(
                              "assigned"
                            )}`}
                          >
                            Assigned
                          </span>
                          <br />
                          <Text type="secondary">{auditData?.started_at}</Text>
                          <br />
                          <Text type="secondary">
                            {auditData?.status_changed_at}
                          </Text>
                        </>
                      ),
                    },
                    {
                      color: "blue",
                      children: (
                        <>
                          <span
                            className={`px-2 py-1 text-sm font-semibold rounded ${getStatusColor(
                              "in-progress"
                            )}`}
                          >
                            Started
                          </span>
                          <br />
                          <Text type="secondary">{auditData?.started_at}</Text>
                        </>
                      ),
                    },

                    ...(auditData?.modificationHistory?.length > 0
                      ? auditData.modificationHistory.map(
                          (modification, index) => ({
                            color: "blue",
                            children: (
                              <div key={index}>
                                <span
                                  className={`px-2 py-1 text-sm font-semibold rounded ${getStatusColor(
                                    "in-progress"
                                  )}`}
                                >
                                  Last Modify
                                </span>
                                <br />
                                <Text type="secondary">
                                  {moment(modification?.modifiedAt).format(
                                    "DD-MM-YYYY"
                                  )}{" "}
                                  {moment(modification?.modifiedAt).format(
                                    "HH:mm"
                                  )}
                                </Text>
                                <br />
                              </div>
                            ),
                          })
                        )
                      : []),

                    ...(auditData?.statusHistory?.length > 0
                      ? auditData.statusHistory.map((statusHistory, index) => ({
                          color: "Green",
                          children: (
                            <div key={index}>
                              <span
                                className={`px-2 py-1 text-sm font-semibold rounded ${getStatusColor(
                                  statusHistory.status
                                )}`}
                              >
                                {statusHistory.status.charAt(0).toUpperCase() +
                                  statusHistory.status.slice(1)}
                              </span>

                              <br />
                              <Text type="secondary">
                                {moment(statusHistory?.changedAt).format(
                                  "DD-MM-YYYY HH:mm"
                                )}
                              </Text>
                              <br />
                              {/* Conditional rendering based on 'rejected' status */}
                              {statusHistory.status === "rejected" && (
                                <>
                                  <Text className="font-medium">Khushi</Text>
                                  <br />
                                  <Text className="font-medium text-red-600">
                                    (statusHistory.comment)
                                  </Text>
                                  <br />
                                </>
                              )}
                            </div>
                          ),
                        }))
                      : []),
                  ]}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Modal
          visible={approvalModalVisible}
          footer={null}
          onCancel={handleModalCancel}
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
