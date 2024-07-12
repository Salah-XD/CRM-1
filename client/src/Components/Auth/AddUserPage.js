import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Select, Typography, Form, message } from "antd";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

const AddUserPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post("/auth/registerUser", {
        userName:values.userName,
        userId: values.userId,
        password: values.password,
        role: values.role,
      });

      if (response.data.success) {
        message.success("User added successfully!");
        navigate("/dashboard");
      } else {
        message.error("Failed to add user.");
      }
    } catch (error) {
      message.error("Some error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
        <Title level={3} className="text-gray-600 font-semibold">
          Add New User
        </Title>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="User Name"
            name="userName"
            rules={[{ required: true, message: "Please input the user Name!" }]}
          >
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="User Name"
            />
          </Form.Item>
          <Form.Item
            label="User ID"
            name="userId"
            rules={[{ required: true, message: "Please input the user ID!" }]}
          >
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ID"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input the password!" }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select
              value={role}
              onChange={(value) => setRole(value)}
              placeholder="Select Role"
            >
              <Option value="SUPER_ADMIN">Super Admin</Option>
              <Option value="ACCOUNT_ADMIN">Account Admin</Option>
              <Option value="AUDIT_ADMIN">Audit Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Add User
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddUserPage;
