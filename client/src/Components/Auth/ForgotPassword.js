import React, { useState } from "react";
import { Input, Button, Typography, Form, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "../css/login.css";

const { Title } = Typography;

const ForgotPasswordPage = () => {
  const [userID, setUserID] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      // Call API to send OTP
      setOtpSent(true);
      message.success("OTP sent successfully!");
    } catch (error) {
      message.error("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      // Call API to verify OTP
      setOtpVerified(true);
      message.success("OTP verified successfully!");
    } catch (error) {
      message.error("Invalid OTP. Please try again.");
    }
  };

  const handleSubmit = async () => {
    try {
      if (newPassword !== confirmPassword) {
        message.error("Passwords do not match!");
        return;
      }
      // Call API to reset password
      message.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      message.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
        <div className="flex items-center mb-4">
          {/* <Link to="/login">
            <ArrowLeftOutlined className="text-lg cursor-pointer mr-2" />
          </Link> */}
          <Title level={3} className="text-gray-600 font-semibold">
            Forgot Password
          </Title>
        </div>
        {!otpSent ? (
          <Form layout="vertical" onFinish={handleSendOtp}>
            <Form.Item
              label="User ID"
              name="userID"
              rules={[
                { required: true, message: "Please input your user id!" },
              ]}
            >
              <Input
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                placeholder="Enter your User ID"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-BlueGlobal"
              >
                Send OTP
              </Button>
            </Form.Item>
          </Form>
        ) : !otpVerified ? (
          <Form layout="vertical" onFinish={handleVerifyOtp}>
            <Form.Item
              label="OTP"
              name="otp"
              rules={[{ required: true, message: "Please input the OTP!" }]}
            >
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-BlueGlobal"
              >
                Verify OTP
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please input your new password!" },
              ]}
            >
              <Input.Password
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
              />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
              ]}
            >
              <Input.Password
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-BlueGlobal"
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        )}
        <Link to="/login">
          <Button type="default" className="mt-4 w-full">
            Back to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
