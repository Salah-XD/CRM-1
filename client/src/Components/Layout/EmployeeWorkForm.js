import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Select, Table, InputNumber } from "antd";
import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;

const EmployeeWorkForm = () => {
  const [tasks, setTasks] = useState([]);

  const [form] = Form.useForm();

  const columns = [
    {
      title: "Proposal",
      dataIndex: "proposal",
      key: "proposal",
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
      key: "invoice",
    },
    {
      title: "Client Type",
      dataIndex: "clientType",
      key: "clientType",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
    },
    {
      title: "Billed Revenue",
      dataIndex: "billedRevenue",
      key: "billedRevenue",
    },
    {
      title: "Unbilled Revenue",
      dataIndex: "unbilledRevenue",
      key: "unbilledRevenue",
    },
    {
      title: "Month of Billing",
      dataIndex: "monthOfBilling",
      key: "monthOfBilling",
    },
    {
      title: "Total Value",
      dataIndex: "totalValue",
      key: "totalValue",
    },
    {
      title: "Man-Hours",
      dataIndex: "manHours",
      key: "manHours",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
  ];

  const addTask = (values) => {
    const { proposal, invoice, clientType, service, revenue, billedRevenue, unbilledRevenue, monthOfBilling, totalValue, manHours, remarks } = values;
    const newTask = {
      key: tasks.length + 1,
      proposal,
      invoice,
      clientType,
      service,
      revenue,
      billedRevenue,
      unbilledRevenue,
      monthOfBilling: moment(monthOfBilling).format("MMM YYYY"),
      totalValue,
      manHours,
      remarks,
    };
    setTasks([...tasks, newTask]);
    form.resetFields();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Work Done by Employee</h1>

      <div style={{ marginBottom: "20px" }}>
        {/* Basic Information Section */}
        <Form layout="vertical">
          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Item label="Date" name="date" rules={[{ required: true, message: "Please select a date!" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            

            <Form.Item label="Employee Name" name="employeeName" rules={[{ required: true, message: "Please select an employee!" }]}>
              <Select placeholder="Select Employee">
                <Option value="John Doe">John Doe</Option>
                <Option value="Jane Smith">Jane Smith</Option>
              </Select>
            </Form.Item>
<Form.Item label="Day Status" name="dayStatus" rules={[{ required: true, message: "Please select day status!" }]}>
  <Select
    placeholder="Select Day Status"
    onChange={(value) => {
      if (value === "Leave") {
        // Disable task fields
        form.setFieldsValue({
          proposal: null,
          invoice: null,
          clientType: null,
          service: null,
          revenue: null,
          billedRevenue: null,
          unbilledRevenue: null,
          monthOfBilling: null,
          totalValue: null,
          manHours: null,
        });
      }
    }}
  >
    <Option value="Work">Work</Option>
    <Option value="Leave">Leave</Option>
  </Select>
</Form.Item>

<Form.Item label="Leave Type" name="leaveType" dependencies={["dayStatus"]} shouldUpdate={(prev, curr) => prev.dayStatus !== curr.dayStatus}>
  {({ getFieldValue }) =>
    getFieldValue("dayStatus") === "Leave" ? (
      <Select placeholder="Select Leave Type">
        <Option value="Sick Leave">Sick Leave</Option>
        <Option value="Casual Leave">Casual Leave</Option>
        <Option value="Other">Other</Option>
      </Select>
    ) : null
  }
</Form.Item>

<Form.Item label="Reason for Leave" name="leaveReason" dependencies={["dayStatus"]} shouldUpdate={(prev, curr) => prev.dayStatus !== curr.dayStatus}>
  {({ getFieldValue }) =>
    getFieldValue("dayStatus") === "Leave" ? (
      <TextArea rows={3} placeholder="Enter reason for leave." />
    ) : null
  }
</Form.Item>

            

            <Form.Item label="Company Name" name="companyName" rules={[{ required: true, message: "Please select a company!" }]}>
              <Select placeholder="Select Company">
                <Option value="ABC Foods Pvt. Ltd.">ABC Foods Pvt. Ltd.</Option>
                <Option value="XYZ Retailers">XYZ Retailers</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </div>

      <div style={{ marginBottom: "20px" }}>
        {/* Task Details Section */}
        <h2>Task Details</h2>
        <Form form={form} layout="vertical" onFinish={addTask}>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Form.Item label="Proposal" name="proposal" >
              <Select
                placeholder="Search Proposal"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                <Option value="Proposal #12345">Proposal #12345</Option>
                <Option value="Proposal #67890">Proposal #67890</Option>
              </Select>
            </Form.Item>


            <Form.Item label="Invoice" name="invoice">
              <Input placeholder="Enter Invoice Number" />
            </Form.Item>

            <Form.Item label="Client Type" name="clientType" >
              <Select placeholder="Select Client Type">
                <Option value="MOU">MOU</Option>
                <Option value="Non-MOU">Non-MOU</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Description" name="description">
              <TextArea rows={3} placeholder="Enter the description" />
            </Form.Item>

            <Form.Item label="Service Provided" name="service" >
              <Select placeholder="Select Service">
                <Option value="Food Safety Audit">Food Safety Audit</Option>
                <Option value="Training">Training</Option>
                <Option value="Hygiene Rating">Hygiene Rating</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Revenue Generated" name="revenue" >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item label="Billed Revenue" name="billedRevenue" >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item label="Unbilled Revenue" name="unbilledRevenue" >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item label="Month of Billing" name="monthOfBilling" >
              <DatePicker picker="month" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="Total Parikshan Value" name="totalValue" >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item label="Total Man-Hours" name="manHours" >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item label="Remarks" name="remarks">
              <TextArea rows={3} placeholder="Enter remarks for this task." />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit">Add Task</Button>
        </Form>
      </div>

      {/* Task Summary Section */}
      <div style={{ marginTop: "20px" }}>
        <h2>Summary</h2>
        <Table dataSource={tasks} columns={columns} pagination={false} />

        <div style={{ marginTop: "20px" }}>
          <h3>Total Revenue: ₹{tasks.reduce((sum, task) => sum + task.revenue, 0)}</h3>
          <h3>Total Billed Revenue: ₹{tasks.reduce((sum, task) => sum + task.billedRevenue, 0)}</h3>
          <h3>Total Unbilled Revenue: ₹{tasks.reduce((sum, task) => sum + task.unbilledRevenue, 0)}</h3>
          <h3>Total Man-Hours: {tasks.reduce((sum, task) => sum + task.manHours, 0)}</h3>
        </div>
      </div>
    </div>
  );
};

export default EmployeeWorkForm;
