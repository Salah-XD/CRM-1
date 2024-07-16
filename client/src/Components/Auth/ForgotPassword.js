import React, { useState } from "react";
import axios from "axios";
import { Input, Button, Typography, Form, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import "../css/login.css";

const { Title } = Typography;

const ForgotPasswordPage = () => {
  const [userId, setUserId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
     setLoading(true);
    try {
      // Call API to send OTP
      await axios.post("/api/auth/forgotPassword", { userId });
      setOtpSent(true);
      message.success("OTP sent successfully!");
    }  catch (error) {
    if (error.response && error.response.status === 404) {
      message.error("User not found");
    } else {
      message.error("Failed to send OTP. Please try again.");
    } 
  }finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      // Call API to verify OTP
      const response = await axios.post("/api/auth/verifyOtp", {
        userId,
        otp,
      });
      const { token } = response.data;
      localStorage.setItem("resetToken", token);
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
      const token = localStorage.getItem("resetToken");
      if (!token) {
        message.error("Unauthorized. Please verify OTP again.");
        return;
      }
      // Call API to reset password
      await axios.post(
        "/auth/setNewPassword",
        { userId, newPassword },
        { headers: { Authorization: `${token}` } }
      );
      message.success("Password reset successfully!");
      localStorage.removeItem("resetToken");
      navigate("/");
    } catch (error) {
      message.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full ml-5 flex max-w-sm py-3">
        <img src="logo.png" alt="Company Logo" className="h-12 w-12" />

        <label className="text-400 ml-3 text-2xl font-semibold">
          Unavar Admin Dashboard
        </label>
      </div>
      <div className="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
        <div className="flex items-center mb-4">
          <Title level={3} className="text-gray-600 font-semibold">
            Forgot Password
          </Title>
        </div>
        {!otpSent ? (
          <Form layout="vertical" onFinish={handleSendOtp}>
            <Form.Item
              label="User ID"
              name="userId"
              rules={[
                { required: true, message: "Please input your user ID!" },
              ]}
            >
              <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your User ID"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-BlueGlobal"
                loading={loading}
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
        <Link to="/">
          <Button type="default" className="mt-4 w-full">
            Back to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
