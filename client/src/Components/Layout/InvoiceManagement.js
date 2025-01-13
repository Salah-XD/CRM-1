import React, { useState } from 'react';
import { Form, Input, Button, Table, InputNumber, Select, DatePicker, message } from 'antd';
import moment from 'moment';

const { Option } = Select;

const InvoiceManagement = () => {
  const [form] = Form.useForm();
  const [invoices, setInvoices] = useState([]);

  // Columns for the table
  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('DD.MM.YYYY'),
    },
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Work Done',
      dataIndex: 'workDone',
      key: 'workDone',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `₹ ${amount}`,
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
    },
  ];

  // Handle form submission
  const onFinish = (values) => {
    const newInvoice = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
      totalAmount: values.unitCost * values.quantity,
    };

    setInvoices([...invoices, newInvoice]);
    message.success('Invoice added successfully!');
    form.resetFields();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Invoice Management</h2>

      {/* Invoice Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ date: moment() }}
      >
        <Form.Item
          label="Invoice Number"
          name="invoiceNumber"
          rules={[{ required: true, message: 'Please enter the invoice number!' }]}
        >
          <Input placeholder="Enter Invoice Number" />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Please select the date!' }]}
        >
          <DatePicker format="DD.MM.YYYY" />
        </Form.Item>

        <Form.Item
          label="Client Name"
          name="clientName"
          rules={[{ required: true, message: 'Please enter the client name!' }]}
        >
          <Input placeholder="Enter Client Name" />
        </Form.Item>

        <Form.Item
          label="Work Done"
          name="workDone"
          rules={[{ required: true, message: 'Please enter the work done!' }]}
        >
          <Input placeholder="Enter Work Description" />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: 'Please enter the quantity!' }]}
        >
          <InputNumber placeholder="Enter Quantity" min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Unit Cost"
          name="unitCost"
          rules={[{ required: true, message: 'Please enter the unit cost!' }]}
        >
          <InputNumber placeholder="Enter Unit Cost" min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Payment Status"
          name="paymentStatus"
          rules={[{ required: true, message: 'Please select the payment status!' }]}
        >
          <Select placeholder="Select Payment Status">
            <Option value="Paid">Paid</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Overdue">Overdue</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Invoice
          </Button>
        </Form.Item>
      </Form>

      {/* Invoice Table */}
      <Table columns={columns} dataSource={invoices} rowKey="invoiceNumber" style={{ marginTop: '20px' }} />
    </div>
  );
};

export default InvoiceManagement;
