import {
  Form,
  Input,
  Select,
  TimePicker,
  Checkbox,
  Button,
  Modal,
  message,
} from "antd";
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const { Option } = Select;

const UpdteWorkLog = ({ visible, handleOk, handleUpdateCancel, workLogId }) => {
  const [form] = Form.useForm();
  const [workType, setWorkType] = useState("");
  const [auditors, setAuditors] = useState([]);
  const { user } = useAuth();
  const location = useLocation();
  const firstSegment = location.pathname.split("/").filter(Boolean)[0];
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchAuditors = useCallback(() => {
    axios
      .get("/api/auditor/getAuditAdmins")
      .then((response) => {
        if (response.data.success) {
          setAuditors(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching auditors:", error));
  }, []);

  const fetchWorkLog = useCallback(() => {
    if (!workLogId) return;
    setLoading(true);
    axios
      .get(`/api/worklogs/getWorkLogById/${workLogId}`)
      .then((response) => {
        if (response.status === 200) {
          const workLog = response.data.workLog;
          form.setFieldsValue({
            userId: workLog.userId || "",
            workType: workLog.workType || "",
            startTime: workLog.startTime ? dayjs(workLog.startTime) : null,
            endTime: workLog.endTime ? dayjs(workLog.endTime) : null,
            description: workLog.description || "",
            reason: workLog.reason || "",
            paidLeave: workLog.paidLeave || false,
            sickLeave: workLog.sickLeave || false,
          });
          setWorkType(workLog.workType);
        }
      })
      .catch((error) => {
        console.error("Error fetching work log:", error);
        message.error("Failed to fetch work log details.");
      })
      .finally(() => setLoading(false));
  }, [workLogId, form]);

  useEffect(() => {
    if (visible) {
      fetchAuditors();
      fetchWorkLog();
      setIsEditing(false);
    }
  }, [visible, fetchAuditors, fetchWorkLog]);

  const onFinish = async (values) => {
    if (values.startTime && values.endTime) {
      if (dayjs(values.startTime).isAfter(dayjs(values.endTime))) {
        message.error("Start time should be less than end time");
        return;
      }
    }
    try {
      const data = {
        userId: firstSegment === "admin-work-log" ? values.userId : user._id,
        workType: values.workType,
        startTime: values.startTime
          ? dayjs(values.startTime).toISOString()
          : null,
        endTime: values.endTime ? dayjs(values.endTime).toISOString() : null,
        description: values.description || "",
        reason: values.reason || "",
        paidLeave: values.paidLeave || false,
        sickLeave: values.sickLeave || false,
      };
      const response = await axios.put(
        `/api/worklogs/updateWorkLogById/${workLogId}`,
        data
      );
      if (response.status === 200) {
        message.success("Work log updated successfully");
        handleOk();
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        message.error(
          "You do not have permission to update this work log. Please request an admin to update it."
        );
      } else {
        console.error("Error updating work log:", error);
        message.error("Failed to update work log.");
      }
    }
  };

  return (
    <Modal
      title="Update Work Log"
      open={visible}
      onCancel={() => {
        form.resetFields();
        handleUpdateCancel();
      }}
      footer={null}
    >
      <div className="flex justify-end mb-4">
        {!isEditing && (
          <Button type="primary" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {firstSegment === "admin-work-log" && (
          <Form.Item
            name="userId"
            label="Select Auditor"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select User" disabled={!isEditing}>
              {auditors.map((auditor) => (
                <Option key={auditor._id} value={auditor._id}>
                  {auditor.userName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item
          name="workType"
          label="Work Type"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select Work Type"
            onChange={setWorkType}
            disabled={!isEditing}
          >
            <Option value="audit">Audit Work</Option>
            <Option value="wfh">WFH</Option>
            <Option value="office">Office</Option>
            <Option value="onDuty">On Duty</Option>
            <Option value="absent">Absent</Option>
          </Select>
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: workType !== "absent" }]}
          >
            <TimePicker
              use12Hours
              format="h:mm A"
              className="w-full"
              disabled={!isEditing || workType === "absent"}
            />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="End Time"
            rules={[{ required: workType !== "absent" }]}
          >
            <TimePicker
              use12Hours
              format="h:mm A"
              className="w-full"
              disabled={!isEditing || workType === "absent"}
            />
          </Form.Item>
        </div>
        <Form.Item name="description" label="Description">
          <Input.TextArea
            rows={3}
            placeholder="Enter description"
            disabled={!isEditing || workType === "absent"}
          />
        </Form.Item>
        {workType === "absent" && (
          <>
            <Form.Item
              name="reason"
              label="Reason"
              rules={[{ required: true }]}
            >
              <Input.TextArea
                rows={2}
                placeholder="Enter reason for absence"
                disabled={!isEditing}
              />
            </Form.Item>
            <div className="flex gap-4">
              <Form.Item name="paidLeave" valuePropName="checked">
                <Checkbox disabled={!isEditing}>Paid Leave</Checkbox>
              </Form.Item>
              <Form.Item name="sickLeave" valuePropName="checked">
                <Checkbox disabled={!isEditing}>Sick Leave</Checkbox>
              </Form.Item>
            </div>
          </>
        )}
        {isEditing && (
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Update
            </Button>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UpdteWorkLog;
