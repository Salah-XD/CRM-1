import React from "react";
import AdminHeader from "../Layout/AdminHeader";
import { Link } from "react-router-dom";
import { CheckCircleOutlined } from "@ant-design/icons";

function ClientOnboardingSuccess() {
  return (
    <div>
      <AdminHeader />
      <div className="mt-8 flex flex-col items-center">
        <CheckCircleOutlined className="text-green-500 text-6xl mb-4" />
        <p className="text-lg font-semibold text-center mb-4">
          Your response has been saved successfully.
        </p>
        <Link to="/client-onboarding" className="text-blue-500 underline">
          Fill New Form
        </Link>
      </div>
    </div>
  );
}

export default ClientOnboardingSuccess;
