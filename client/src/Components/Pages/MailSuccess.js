import React from "react";

const MailSuccess = ({ onClose, email }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-xl font-bold mb-4">Generate Agreement</h2>
        <div className="text-center mb-4">
          <img
            src="/path/to/checkmark.png"
            alt="Success"
            className="mx-auto mb-2"
          />
          <p className="text-green-500 font-bold">Mail Sent to</p>
          <p className="text-gray-600">{email}</p>
        </div>
        <div className="text-center mt-4">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MailSuccess;
