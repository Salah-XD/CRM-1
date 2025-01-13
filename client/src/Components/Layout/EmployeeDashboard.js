import React, { useState } from "react";
import { Table, Button, Modal, Row, Col, Descriptions } from "antd";

const DemoEmployeeData = [
  {
    key: "1",
    name: "John Doe",
    company: "ABC Foods Pvt. Ltd.",
    tasksSubmitted: 5,
    totalRevenue: "₹50,000",
    totalManHours: 120,
    leavesAvailable: 10,
    leavesTaken: 3,
    pendingLeave: 7,
    permissionHours: 8,
    restrictedHolidaysTaken: 2,
    totalPayableManDays: 112,
    workFromHomeDays: 5,
    lop: 3,
    lastSubmissionDate: "01/09/2025",
    taskDetails: [
      {
        date: "01/09/2025",
        proposal: "Proposal #12345",
        invoice: "INV-00123",
        clientType: "MOU",
        service: "Food Safety Audit",
        revenue: "₹10,000",
        manHours: 20,
        remarks: "Completed food safety audit",
      },
      {
        date: "02/09/2025",
        proposal: "Proposal #12346",
        invoice: "INV-00124",
        clientType: "Non-MOU",
        service: "Training",
        revenue: "₹8,000",
        manHours: 18,
        remarks: "Provided employee training",
      },
      {
        date: "03/09/2025",
        proposal: "Proposal #12347",
        invoice: "INV-00125",
        clientType: "MOU",
        service: "Hygiene Rating",
        revenue: "₹12,000",
        manHours: 25,
        remarks: "Completed hygiene rating",
      },
    ],
  },
  {
    key: "2",
    name: "Jane Smith",
    company: "XYZ Retailers",
    tasksSubmitted: 3,
    totalRevenue: "₹30,000",
    totalManHours: 90,
    leavesAvailable: 12,
    leavesTaken: 4,
    pendingLeave: 8,
    permissionHours: 5,
    restrictedHolidaysTaken: 1,
    totalPayableManDays: 85,
    workFromHomeDays: 4,
    lop: 2,
    lastSubmissionDate: "02/09/2025",
    taskDetails: [
      {
        date: "01/09/2025",
        proposal: "Proposal #12348",
        invoice: "INV-00126",
        clientType: "MOU",
        service: "Audit",
        revenue: "₹5,000",
        manHours: 10,
        remarks: "Completed audit",
      },
      {
        date: "02/09/2025",
        proposal: "Proposal #12349",
        invoice: "INV-00127",
        clientType: "Non-MOU",
        service: "Hygiene",
        revenue: "₹7,000",
        manHours: 15,
        remarks: "Provided hygiene inspection",
      },
    ],
  },
];

const EmployeeDashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const showModal = (employee) => {
    setSelectedEmployee(employee);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedEmployee(null);
  };

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Tasks Submitted",
      dataIndex: "tasksSubmitted",
      key: "tasksSubmitted",
    },
    {
      title: "Total Revenue",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
    },
    {
      title: "Total Man-Hours",
      dataIndex: "totalManHours",
      key: "totalManHours",
    },
    {
      title: "Leaves Available",
      dataIndex: "leavesAvailable",
      key: "leavesAvailable",
    },
    {
      title: "Leaves Taken",
      dataIndex: "leavesTaken",
      key: "leavesTaken",
    },
    {
      title: "Pending Leave",
      dataIndex: "pendingLeave",
      key: "pendingLeave",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => showModal(record)}>
          View Tasks
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={DemoEmployeeData}
        pagination={{ pageSize: 5 }}
        rowKey="key"
        search={{
          placeholder: "Search by name or company",
          
        }}
      />

      {selectedEmployee && (
        <Modal
          title={`Task Details for ${selectedEmployee.name}`}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
        >
          <Descriptions bordered>
            <Descriptions.Item label="Company">
              {selectedEmployee.company}
            </Descriptions.Item>
            <Descriptions.Item label="Total Revenue">
              {selectedEmployee.totalRevenue}
            </Descriptions.Item>
            <Descriptions.Item label="Total Man-Hours">
              {selectedEmployee.totalManHours}
            </Descriptions.Item>
            <Descriptions.Item label="Leaves Available">
              {selectedEmployee.leavesAvailable}
            </Descriptions.Item>
            <Descriptions.Item label="Leaves Taken">
              {selectedEmployee.leavesTaken}
            </Descriptions.Item>
            <Descriptions.Item label="Pending Leave">
              {selectedEmployee.pendingLeave}
            </Descriptions.Item>
            <Descriptions.Item label="Permission Hours">
              {selectedEmployee.permissionHours}
            </Descriptions.Item>
            <Descriptions.Item label="Restricted Holidays Taken">
              {selectedEmployee.restrictedHolidaysTaken}
            </Descriptions.Item>
            <Descriptions.Item label="Total Payable Man-Days">
              {selectedEmployee.totalPayableManDays}
            </Descriptions.Item>
            <Descriptions.Item label="Work From Home Days">
              {selectedEmployee.workFromHomeDays}
            </Descriptions.Item>
            <Descriptions.Item label="LOP (Loss of Pay)">
              {selectedEmployee.lop}
            </Descriptions.Item>
          </Descriptions>

          <h3>Task List</h3>
          <Table
            columns={[
              { title: "Date", dataIndex: "date", key: "date" },
              { title: "Proposal", dataIndex: "proposal", key: "proposal" },
              { title: "Invoice", dataIndex: "invoice", key: "invoice" },
              {
                title: "Client Type",
                dataIndex: "clientType",
                key: "clientType",
              },
              { title: "Service", dataIndex: "service", key: "service" },
              { title: "Revenue", dataIndex: "revenue", key: "revenue" },
              { title: "Man-Hours", dataIndex: "manHours", key: "manHours" },
              { title: "Remarks", dataIndex: "remarks", key: "remarks" },
            ]}
            dataSource={selectedEmployee.taskDetails}
            pagination={false}
          />
        </Modal>
      )}
    </>
  );
};

export default EmployeeDashboard;
