import React, { useState } from "react";

const GenerateSendMail = ({ onClose }) => {
  const [mailSent, setMailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSendMail = () => {
    // Simulate mail sending logic here
    setMailSent(true);
  };

  const handleClose = () => {
    setMailSent(false);
    onClose(); // Call the onClose prop to close the modal or handle as needed
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        &#8203;
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white p-6">
            <h2 className="text-xl font-bold mb-4">Generate Agreement</h2>
            {mailSent ? (
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-green-500">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                </div>
                <p className="text-green-500 mb-4">Mail Sent to {email}</p>
                <button
                  onClick={handleClose}
                  className="text-gray-600 hover:text-gray-800 absolute top-0 right-0 m-4"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <p className="text-green-500 mb-4">
                  Document generated successfully
                </p>
                <p className="text-gray-600 mb-4">
                  Generated document can be accessed through the below client
                  link, which will be sent to the client as well.
                </p>
                <input
                  type="text"
                  readOnly
                  value="https://example.com/document-link"
                  className="w-full p-2 border rounded mb-4"
                />
                <input
                  type="email"
                  placeholder="Enter the Mail ID of client"
                  className="w-full p-2 border rounded mb-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-gray-500 mb-4">
                  Note: This mail will be sent to CCs also. You can edit it in
                  Settings.
                </p>
                <textarea
                  className="w-full p-2 border rounded mb-4"
                  defaultValue="Greetings from Unavar FSS!\nClick the attached link to download the Agreement. Upload the Signed copy in the same link.\nLink given below:"
                />
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="bg-gray-500 text-white p-2 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendMail}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Send Mail
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateSendMail;
