import React, { useEffect, useState } from "react";
import { Modal, Table, Typography, Button, message } from "antd";
import axios from "axios";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = Modal;

const LeaveManagementModal = ({ visible, onClose, userId }) => {
  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);

  // Fetch leave data when modal is opened
  useEffect(() => {
    if (visible && userId) {
      fetchLeaveData();
    }
  }, [visible, userId]);

  const fetchLeaveData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/leaves/getLeaveData/${userId}`);
      setLeaveData(response.data);
    } catch (error) {
      message.error("Failed to fetch leave data.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    confirm({
      title: "Approve Leave Request?",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to approve this leave request?",
      okText: "Approve",
      cancelText: "Cancel",
      onOk: async () => {
        setApproving(true);
        try {
          await axios.post(`/api/leaves/approveLeave/${userId}`);
          message.success("Leave approved successfully.");
          fetchLeaveData(); // Refresh data after approval
        } catch (error) {
          message.error("Failed to approve leave.");
        } finally {
          setApproving(false);
        }
      },
    });
  };

  return (
    <Modal
      title="Leave Management"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose} disabled={approving}>
          Close
        </Button>,
        <Button
          key="approve"
          type="primary"
          loading={approving}
          onClick={handleApprove}
        >
          Approve
        </Button>,
      ]}
      width={700}
      centered
    >
      <Typography.Title level={5}>Non LOP Leaves Available</Typography.Title>
      <Table
        bordered
        size="small"
        loading={loading}
        pagination={false}
        columns={[
          { title: "Leave Type", dataIndex: "type", key: "type" },
          { title: "This Month", dataIndex: "thisMonth", key: "thisMonth" },
          { title: "Overall", dataIndex: "overall", key: "overall" },
        ]}
        dataSource={[
          {
            key: "1",
            type: "Sick",
            thisMonth: leaveData?.sickLeaveThisMonth || 0,
            overall: leaveData?.sickLeaveOverall || 0,
          },
          {
            key: "2",
            type: "Casual",
            thisMonth: leaveData?.casualLeaveThisMonth || 0,
            overall: leaveData?.casualLeaveOverall || 0,
          },
        ]}
      />

      <Typography.Title level={5} style={{ marginTop: 20 }}>
        Total Leaves Taken
      </Typography.Title>
      <Table
        bordered
        size="small"
        loading={loading}
        pagination={false}
        columns={[
          { title: "Leave Type", dataIndex: "type", key: "type" },
          { title: "This Month", dataIndex: "thisMonth", key: "thisMonth" },
          { title: "Overall", dataIndex: "overall", key: "overall" },
        ]}
        dataSource={[
          {
            key: "1",
            type: "LOP",
            thisMonth: leaveData?.lopThisMonth || 0,
            overall: leaveData?.lopOverall || 0,
          },
          {
            key: "2",
            type: "Sick",
            thisMonth: leaveData?.sickTakenThisMonth || 0,
            overall: leaveData?.sickTakenOverall || 0,
          },
          {
            key: "3",
            type: "Casual",
            thisMonth: leaveData?.casualTakenThisMonth || 0,
            overall: leaveData?.casualTakenOverall || 0,
          },
        ]}
      />
    </Modal>
  );
};

export default LeaveManagementModal;
