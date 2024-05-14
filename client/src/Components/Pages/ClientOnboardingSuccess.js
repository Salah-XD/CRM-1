import React from "react";
import AdminHeader from "../Layout/AdminHeader";
import { Link, useLocation } from "react-router-dom";
import { CheckCircleOutlined } from "@ant-design/icons";

function ClientOnboardingSuccess() {
  const location = useLocation();
  const formLink = `${location.origin}/client-onboarding`;

  return (
    <div>
      <AdminHeader />
      <div className="mt-8 flex flex-col items-center">
        <CheckCircleOutlined className="text-green-500 text-6xl mb-4" />
        <p className="text-lg font-semibold text-center mb-4">
          Your response has been saved successfully.
        </p>
        <div className="flex items-center">
          <p className="text-gray-600">
            In case of any issues, you can update the form by clicking this
          </p>
          <Link to={formLink} className="text-blue-500 ml-1 underline">
            Client onboarding form
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ClientOnboardingSuccess;
