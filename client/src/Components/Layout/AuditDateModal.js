import React, { useState } from "react";
import { Modal, DatePicker, Button, Typography, Space } from "antd";
import moment from "moment";

const { Title, Text } = Typography;

const AuditDateModal = ({ auditorName, visible, onCancel, onConfirm, auditorId }) => {
  const [auditDate, setAuditDate] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleDateChange = (date) => {
    setAuditDate(date);
  };

  const handleContinue = () => {
    if (auditDate) {
      setIsConfirmed(true);
    }
  };

  const handleConfirmContinue = () => {
    if (onConfirm && auditDate) {
      // Merge current time with the selected audit date
      const mergedDate = moment(auditDate).set({
        hour: moment().hour(),
        minute: moment().minute(),
        second: moment().second(),
        millisecond: moment().millisecond(),
      });

      // Pass the merged date to the parent component
      onConfirm({ auditDate: mergedDate, auditorId });
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
              <p className="text-gray-600 font-medium">Choose the Audit Date:</p>
              <DatePicker
                value={auditDate}
                onChange={handleDateChange}
                format={"DD/MM/YYYY"}
                style={{ width: "40%" }}
                placeholder="Select Date"
              />
            </div>
            <div className="flex justify-between w-full">
              <Button
                onClick={onCancel}
                style={{ borderColor: "#E0E0E0", color: "#8c8c8c" }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleContinue}
                disabled={!auditDate}
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
            <div className="flex flex-col items-center">
              <Text>
                <strong>Auditor name:</strong> {auditorName}
              </Text>
              <Text>
                <strong>Audit date:</strong>{" "}
                {auditDate ? moment(auditDate).format("DD/MM/YYYY") : "Not selected"}
              </Text>
            </div>
            <div className="flex justify-between w-full">
              <Button
                onClick={() => setIsConfirmed(false)}
                style={{ borderColor: "#E0E0E0", color: "#8c8c8c" }}
              >
                Back
              </Button>
              <Button
                type="primary"
                onClick={handleConfirmContinue}
                disabled={!auditDate}
              >
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
