import React, { useState } from "react";
import { Modal, DatePicker, Button, Typography, Space } from "antd";
import moment from "moment";

const { Title, Text } = Typography;

const AuditDateModal = ({ auditorName, visible, onCancel, onConfirm }) => {
  const [auditDate, setAuditDate] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleDateChange = (date) => {
    console.log("Selected date:", date ? date.format("DD/MM/YYYY") : null);
    setAuditDate(date); // Update the auditDate state
  };

  const handleContinue = () => {
    if (auditDate) {
      setIsConfirmed(true);
    }
  };

  const handleConfirmContinue = () => {
    if (auditDate) {
      onConfirm(auditDate); // Pass the selected date to the parent
    }
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      onCancel={onCancel}
      centered
      width={400}
    >
      {!isConfirmed ? (
        <>
          <Title level={4}>Assigned Auditor - {auditorName}</Title>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div className="flex justify-around p-4">
              <p className="text-gray-600 font-medium">
                Choose the Audit Date:
              </p>
              <DatePicker
                value={auditDate} // Bind the DatePicker value to auditDate state
                onChange={handleDateChange}
                format={"DD/MM/YYYY"}
                style={{ width: "40%" }}
                placeholder="Select Date"
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button
                onClick={onCancel}
                style={{ borderColor: "#E0E0E0", color: "#8c8c8c" }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleContinue}
                disabled={!auditDate} // Disable if no date is selected
              >
                Continue
              </Button>
            </div>
          </Space>
        </>
      ) : (
        <>
          <Title level={4}>Confirm your selection</Title>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div className="flex flex-col justify-center">
              <Text className="ml-auto mr-auto py-2">
                <strong>Auditor name:</strong> {auditorName}
              </Text>
              <Text className="ml-auto mr-auto">
                <strong>Audit date:</strong>{" "}
                {auditDate ? moment(auditDate).format("DD/MM/YYYY") : "Not selected"}
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button
                onClick={() => setIsConfirmed(false)}
                style={{ borderColor: "#E0E0E0", color: "#8c8c8c" }}
              >
                Back
              </Button>
              <Button type="primary" onClick={handleConfirmContinue}>
                Confirm
              </Button>
            </div>
          </Space>
        </>
      )}
    </Modal>
  );
};

export default AuditDateModal;
