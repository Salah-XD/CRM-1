import React, { useState } from 'react';
import { DatePicker, Button, Table, Modal, Typography, Tag, Space, Card, Calendar, Badge, Form, Input, Select } from 'antd';
import { CalendarOutlined, DownloadOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const WorkLog = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      employee: 'John Doe',
      task: 'Client Meeting',
      date: '2024-09-01',
      status: 'Completed',
      notes: 'Discussed new project requirements.',
    },
    {
      key: '2',
      employee: 'Jane Smith',
      task: 'Follow-up Call',
      date: '2024-09-02',
      status: 'Pending',
      notes: 'Waiting for client feedback.',
    },
  ]);

  const filteredData = dateRange.length === 2
    ? dataSource.filter((log) => {
        const logDate = dayjs(log.date);
        return logDate.isBetween(dayjs(dateRange[0]), dayjs(dateRange[1]), 'day', '[]');
      })
    : dataSource;

  const columns = [
    { title: 'Employee', dataIndex: 'employee', key: 'employee' },
    { title: 'Task', dataIndex: 'task', key: 'task' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => (
        <Tag color={status === 'Completed' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    { 
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" icon={<InfoCircleOutlined />} onClick={() => handleViewDetails(record)}>Details</Button>
      ),
    },
  ];

  const handleViewDetails = (record) => {
    setSelectedLog(record);
    setIsModalVisible(true);
  };

  const handleExport = () => {
    console.log('Exporting Data...');
  };

  const dateCellRender = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    const logsForDay = dataSource.filter((log) => log.date === formattedDate);

    return (
      <ul className="events">
        {logsForDay.map((log) => (
          <li key={log.key}>
            <Badge status={log.status === 'Completed' ? 'success' : 'warning'} text={log.task} />
          </li>
        ))}
      </ul>
    );
  };

  const handleDateSelect = (value) => {
    setSelectedDate(value.format('YYYY-MM-DD'));
    setIsAddModalVisible(true);
  };

  const handleAddLog = (values) => {
    const newLog = {
      key: String(dataSource.length + 1),
      ...values,
      date: selectedDate,
    };
    setDataSource([...dataSource, newLog]);
    setIsAddModalVisible(false);
  };

  return (
    <Card className="shadow-xl p-8 rounded-lg">
      <Space className="flex justify-between mb-6">
        <Title level={3}><CalendarOutlined /> Work Log Management</Title>
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>Export Data</Button>
      </Space>

      <Space className="mb-6">
        <Text>Select Date Range:</Text>
        <RangePicker onChange={(dates) => setDateRange(dates)} />
      </Space>

      <Calendar dateCellRender={dateCellRender} className="mb-6" onSelect={handleDateSelect} />

      <Table dataSource={filteredData} columns={columns} pagination={{ pageSize: 5 }} />

      <Modal
        title="Work Log Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedLog && (
          <div>
            <Title level={5}>{selectedLog.task}</Title>
            <Text strong>Employee:</Text> {selectedLog.employee} <br />
            <Text strong>Date:</Text> {selectedLog.date} <br />
            <Text strong>Status:</Text> <Tag color={selectedLog.status === 'Completed' ? 'green' : 'orange'}>{selectedLog.status}</Tag> <br />
            <Text strong>Notes:</Text> {selectedLog.notes}
          </div>
        )}
      </Modal>

      <Modal
        title="Add Work Log"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddLog} layout="vertical">
          <Form.Item name="employee" label="Employee Name" rules={[{ required: true, message: 'Please enter employee name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="task" label="Task" rules={[{ required: true, message: 'Please enter task' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status' }]}>
            <Select>
              <Option value="Completed">Completed</Option>
              <Option value="Pending">Pending</Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Button type="primary" htmlType="submit">Add Log</Button>
        </Form>
      </Modal>
    </Card>
  );
};

export default WorkLog;