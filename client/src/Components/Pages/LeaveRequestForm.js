import React, { useState } from "react";
import { Modal, Form, DatePicker, Checkbox, Input, Button, message } from "antd";
import axios from "axios";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const LeaveRequestForm = ({ visible, onClose, auditorId }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const response = await axios.post("/api/leaves/requestLeave", {
        auditorId,
        fromDate: values.dates[0].format("YYYY-MM-DD"),
        toDate: values.dates[1].format("YYYY-MM-DD"),
        leaveType: values.leaveType,
        reason: values.reason,
      });

      message.success("Leave request submitted successfully.");
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Failed to submit leave request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Request Leave"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Date Range Picker */}
        <Form.Item name="dates" label="Leave Duration" rules={[{ required: true, message: "Please select leave dates." }]}>
          <RangePicker />
        </Form.Item>

        {/* Leave Type Checkboxes */}
        <Form.Item
          name="leaveType"
          label="Leave Type"
          rules={[{ required: true, message: "Please select at least one leave type." }]}
        >
          <Checkbox.Group>
            <Checkbox value="sickLeave">Sick Leave</Checkbox>
            <Checkbox value="casualLeave">Casual Leave</Checkbox>
          </Checkbox.Group>
        </Form.Item>

        {/* Reason Input */}
        <Form.Item name="reason" label="Reason" rules={[{ required: true, message: "Please enter a reason." }]}>
          <TextArea rows={3} />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} block>
            Apply
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LeaveRequestForm;
