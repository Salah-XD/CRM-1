import React from 'react';
import { EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';

const AuditCard = ({
  status,
 auditorName,
  fboName,
  outletName,
  location,
  date,
  proposalNumber,
  auditNumber
}) => {
  // Function to determine the color of the status
  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
      case 'Submitted':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-sm bg-white rounded-lg shadow-lg p-4">
      {/* Status */}
      <span className={`px-2 py-1 text-sm font-semibold rounded ${getStatusColor(status)}`}>
        {status}
      </span>

      {/* Assigned to */}
    <p className="text-gray-500 text-sm mt-2">Assigned to {auditorName}</p>

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
        <div className='ml-2'>

        <span className="text-black  text-sm">#{proposalNumber}</span>
        </div>
      </div>

      {/* Proposal Number and Audit Number */}
      <div className="flex justify-between items-center mt-4">
      <div className="flex items-center">
          <CalendarOutlined className="text-gray-500 " />
          <span className="text-black  text-sm">{date}</span>
        </div>
      
        <span className="font-semibold">Audit no.{auditNumber}</span>
      </div>
    </div>
  );
};

export default AuditCard;
