import React from "react";
import { EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const AuditCard = ({
  status,
  auditorName,
  fboName,
  outletName,
  location,
  date,
  proposalNumber,
  auditNumber,
  id,
  route,
  customer_type,
  service
}) => {
  const navigate = useNavigate();

  if(service==="Hygiene Rating") service="HR";
  
  if(service==="ER Fruit and Vegetable Market") service="EF & VM";

  const handleClick = () => {
    navigate(`/${route}/audit-form/${id}`);
  };

  // Function to determine the color of the status
  const getStatusColor = (status) => {
    switch (status) {
      case "assigned":
        return "bg-yellow-100 text-yellow-800";
      case "submitted":
      case "approved":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "modified":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };



  // Function to determine the border color based on the service
  const getBorderColor = (customer_type) => {
    switch (customer_type) {
      case "MOU":
        return "border-green-500";
      case "Non-MOU":
        return "border-blue-500";
      default:
        return "border-gray-300";
    }
  };

  return (
    <div
      className={`audit-card p-4 md:w-72 bg-white shadow-lg rounded-lg cursor-pointer hover:shadow-xl transition-shadow duration-200 border-2 ${getBorderColor(
        customer_type
      )}`}
      onClick={handleClick}
    >
      {/* Status */}
      <span
        className={`px-2 py-1 text-sm font-semibold rounded ${getStatusColor(
          status
        )}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>

      <div className="flex justify-between">
        {/* Assigned to */}
        <p className="text-gray-500 text-sm mt-2">Assigned to {auditorName}</p>
        <p className="text-gray-500 text-sm mt-2">Service: {service}</p>
      </div>

      {/* FBO Name */}
      <h3 className="text-lg font-bold mt-2">{fboName}</h3>

      {/* Outlet Name */}
      <p className="text-gray-500 font-medium text-sm">{outletName}</p>

      {/* Location and Date */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <EnvironmentOutlined className="text-gray-500 mr-2" />
          <span className="text-black text-sm">{location}</span>
        </div>
        <div className="ml-2">
          <span className="text-black text-sm">#{proposalNumber}</span>
        </div>
      </div>

      {/* Proposal Number and Audit Number */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <CalendarOutlined className="text-gray-500 " />
          <span className="text-black text-sm">{date}</span>
        </div>
        <span className="font-semibold">Audit no. {auditNumber}</span>
      </div>
    </div>
  );
};

export default AuditCard;
