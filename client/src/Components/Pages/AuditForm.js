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
  Spin,
} from "antd";
import AdminDashboard from "../Layout/AdminDashboard";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import dayjs from "dayjs";
import { useAuth } from "../Context/AuthContext";
import { useLocation } from "react-router-dom";

const { Title, Text } = Typography;

const AuditForm = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [modalAction, setModalAction] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [auditData, setAuditData] = useState({});
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [comment, setComment] = useState(""); // State to capture comments
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { user } = useAuth();

  const getStatusColor = (status) => {
    switch (status) {
      case "assigned":
        return "bg-yellow-100 text-yellow-800 rounded-full";
      case "submitted":
        return "bg-green-100 text-green-800 rounded-full";
      case "approved":
        return "bg-green-100 text-green-800 rounded-full";
      case "draft":
        return "bg-yellow-100 text-yellow-800 rounded-full";
      case "modified":
        return "bg-red-100 text-red-800 rounded-full";
      case "in-progress":
        return "bg-blue-100 text-blue-800 rounded-full";
      default:
        return "bg-gray-100 text-gray-800 rounded-full";
    }
  };

  const handleDownload = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(
        `/api/auditor/generateAuditReport/${params.audit_id}`,
        {
          responseType: "blob", // Specify the response is a file (PDF)
        }
      );

      console.log("This is the response");

      // Create a Blob from the PDF Stream
      const file = new Blob([response.data], { type: "application/pdf" });

      // Create a link element
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);

      // Set the file name for the download
      link.download = "audit-report.pdf";

      // Append the link to the body and trigger a click event to download the file
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the audit report:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleModalOk = async () => {
    try {
      const status = modalAction === "approve" ? "approved" : "modified";
      const payload = {
        status,
        userId: user._id, // Replace with actual user ID
      };

      // Include the comment if the action is "reject"
      if (status === "modified") {
        payload.comment = comment;
      }

      const response = await axios.put(
        `/api/auditor/updateStatusHistoryByAuditId/${params.audit_id}`,
        payload
      );

      if (response.data.success) {
        message.success(
          `${
            modalAction.charAt(0).toUpperCase() + modalAction.slice(1)
          } successfully!`
        );
        setApprovalModalVisible(false);
        setComment(""); // Clear comment after submission
        fetchAudit(); // Refresh data
        navigate("/submittedForApproval");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Failed to update the status.");
    }
  };

  const handleModalCancel = () => {
    setApprovalModalVisible(false);
    setComment(""); // Reset comment on cancel
  };

  const handleStartedDate = async () => {
    try {
      // Call the update function
      const result = await axios.put(
        `/api/auditor/updateStartedDate/${params.audit_id}`
      );

      message.success("Audit Started");
      const firstSegment = location.pathname.split("/").filter(Boolean)[0]; // 'draft', 'assigned-audit', etc.

      // Ensure the path is absolute by using `/`
      navigate(`/${firstSegment}/audit-form/audit-report/${params.audit_id}`);
    } catch (error) {
      // Handle errors and update the status message
      message.error("Failed to update audit start date.");
      console.error(error);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await axios.put(
        `/api/auditor/updateStatusHistoryByAuditId/${params.audit_id}`,
        {
          status: "submitted",
        }
      );

      if (response.status === 200) {
        console.log("Status updated successfully:", response.data);
        message.success("Submitted sucessfully!");
        navigate("/draft");
        // Optionally, add any additional actions here, such as updating the UI or notifying the user
      } else {
        console.error("Failed to update status. Response:", response);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const showApprovalModal = (action) => {
    setModalAction(action);
    setApprovalModalVisible(true);
  };

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

  useEffect(() => {
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
        fetchAudit();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Failed to update audit.");
    }
  };

  const handleApproveButton = () => {
    showApprovalModal("approve");
  };

  const handleModifyButton = () => {
    showApprovalModal("modified");
  };

  // Split the pathname by '/' and filter out any empty strings
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Extract the first segment, which will be the first meaningful part
  const firstSegment = pathSegments[0];

  // console.log("this is the first segment", firstSegment);

  const handleViewAndModify = () => {
    // Get the first segment of the current pathname
    const firstSegment = location.pathname.split("/").filter(Boolean)[0]; // 'draft', 'assigned-audit', etc.

    // Determine the target path based on the first segment
    const targetPath =
      firstSegment === "assigned-audit"
        ? `/${firstSegment}/audit-report/${params.audit_id}`
        : `/${firstSegment}/audit-form/updateAuditReport/${params.audit_id}`;

    // Navigate to the target path
    navigate(targetPath);
  };

  const handleEditButton = () => {
    setIsEditable(true);
  };

  const handleSubmitButton = () => {
    form.submit(); // Trigger form submission
  };

  //Hiding and showing
  const isApprovedOrSubmitted =
    firstSegment === "approved" || firstSegment === "submittedForApproval";

  const isDraftSubmit =
    firstSegment === "draft" ||
    (firstSegment === "modified" && user?.role === "AUDITOR");

  const shouldRenderViewModifyButton =
    firstSegment === "draft" ||
    firstSegment === "modified" ||
    firstSegment === "assigned-audit";

  const isViewModifyButtonDisabled = firstSegment === "assigned-audit";

  const viewModifyButtonStyles = {
    backgroundColor: isViewModifyButtonDisabled ? "#d9d9d9" : "#009688",
    borderColor: isViewModifyButtonDisabled ? "#d9d9d9" : "#009688",
    color: isViewModifyButtonDisabled ? "#8c8c8c" : "#fff",
  };

  const isUserAuditor = user?.role === "AUDITOR";

  // Check if the user role is 'Auditor' and firstSegment is 'assigned_audit'
  const shouldShowStartAuditButton =
    isUserAuditor && firstSegment === "assigned-audit";

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
                    <Input placeholder="#PROP 0001" disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Location" name="location">
                    <Input placeholder="Porur" disabled={!isEditable} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Audit Number" name="audit_number">
                    <Input placeholder="02" disabled />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <div className="flex mt-4">
                    <div>
                      <h1 className="mr-5 ">Audit Date:</h1>
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
                {isApprovedOrSubmitted && (
                  <>
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: "#009688",
                        borderColor: "#009688",
                        color: "#fff",
                      }}
                      onClick={handleViewAndModify}
                    >
                      View
                    </Button>
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: "#009688",
                        borderColor: "#009688",
                        color: "#fff",
                      }}
                      onClick={handleDownload}
                      loading={loading}
                      disabled={loading}
                    >
                      Download Report
                    </Button>
                  </>
                )}

                {shouldShowStartAuditButton && (
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#009688",
                      borderColor: "#009688",
                    }}
                    onClick={handleStartedDate}
                  >
                    Start Audit
                  </Button>
                )}
                {shouldRenderViewModifyButton && (
                  <Button
                    type="primary"
                    style={viewModifyButtonStyles}
                    onClick={
                      !isViewModifyButtonDisabled
                        ? handleViewAndModify
                        : undefined
                    }
                    disabled={isViewModifyButtonDisabled}
                  >
                    View/Modify
                  </Button>
                )}
                {isDraftSubmit && (
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#009688",
                      borderColor: "#009688",
                      color: "#fff",
                    }}
                    onClick={handleStatusUpdate}
                  >
                    Submit
                  </Button>
                )}
                {user?.role &&
                  firstSegment === "submittedForApproval" &&
                  (user.role === "SUPER_ADMIN" ||
                    user.role === "AUDIT_ADMIN") && (
                    <>
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: "#009688",
                          borderColor: "#009688",
                          color: "#fff",
                        }}
                        onClick={handleApproveButton}
                      >
                        Approve
                      </Button>
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: "#009688",
                          borderColor: "#009688",
                          color: "#fff",
                        }}
                        onClick={handleModifyButton}
                      >
                        Modify
                      </Button>
                    </>
                  )}
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
                          <Text type="secondary">
                            {auditData?.started_at
                              ? moment(auditData.started_at).format(
                                  "DD/MM/YYYY HH:mm"
                                )
                              : "N/A"}
                          </Text>
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
                          <Text type="secondary">
                            {auditData?.started_at
                              ? moment(auditData.started_at).format(
                                  "DD/MM/YYYY HH:mm"
                                )
                              : "N/A"}
                          </Text>
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
                                  Last Edited
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
                              {/* Conditional rendering based on 'rejected' or 'approved' status */}
                              {statusHistory.status === "modified" ||
                              statusHistory.status === "approved" ? (
                                <>
                                  <Text className="font-medium">
                                    {statusHistory.userName}
                                  </Text>
                                  <br />
                                  {/* Show comment only for rejected status */}
                                  {statusHistory.status === "modified" && (
                                    <Text className="font-medium text-red-600">
                                      {statusHistory.comment}
                                    </Text>
                                  )}
                                  <br />
                                </>
                              ) : null}
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
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          footer={null} // Custom footer implementation
          centered // Center the modal vertically
          className="w-full sm:w-96"
        >
          {/* Modal Title */}
          <div className="text-center pb-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-black">
              {modalAction === "approve"
                ? "Approve Audit"
                : "Enter Modification Reason"}
            </h2>
          </div>

          {/* Rejection Form (conditional) */}
          {modalAction === "modified" && (
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please provide a comment.",
                },
              ]}
              className="mt-4"
            >
              <Input.TextArea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment here..."
                rows={4}
              />
            </Form.Item>
          )}

          {/* Confirmation Message */}
          <p className="text-center text-gray-600 mt-4">
            Are you sure you want to{" "}
            <span className="font-semibold text-black">
              {modalAction === "approve" ? "approve" : "modify"}
            </span>{" "}
            this audit?
          </p>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            {/* Cancel Button */}
            <Button onClick={handleModalCancel}>Cancel</Button>

            {/* Approve/Reject Button */}
            <Button
              type="primary"
              onClick={handleModalOk}
              danger={modalAction === "modify"} // Use Ant Design's "danger" style for rejection
            >
              {modalAction === "approve" ? "Approve" : "Modify"}
            </Button>
          </div>
        </Modal>
      </div>
    </AdminDashboard>
  );
};

export default AuditForm;
