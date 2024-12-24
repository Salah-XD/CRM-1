import React, { useState } from "react";
import { Modal, Button, Input, message } from "antd";
import { CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";

const GenerateSendMail = ({
  onClose,
  title,
  inputPlaceholder,
  successMessage,
  visible
}) => {
  const [mailSent, setMailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSendMail = () => {
    // Simulate mail sending logic here
    setMailSent(true);
    message.success(successMessage || "Mail sent successfully");
  };

  const handleClose = () => {
    setMailSent(false);
    onClose(); // Call the onClose prop to close the modal or handle as needed
  };

  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      footer={null}
      centered
      closable={false}
      width={600}
      className="acc-modal"
    >
      <div>
        <div
          className="text-center align-middle font-medium text-xl title-div bg-blue-50 p-4"
          style={{ boxShadow: "0 4px 2px -2px lightgrey" }}
        >
          {title}
        </div>
        {mailSent ? (
          <div className="p-10 " style={{ backgroundColor: "#F6FAFB" }}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircleOutlined
                  className="text-green-500"
                  style={{ fontSize: "48px" }}
                />
              </div>
              <p className="text-green-500 mb-4">Mail Sent to {email}</p>
              <Button
                onClick={handleClose}
                type="text"
                className="absolute top-0 right-0 m-4"
              >
                <CloseOutlined
                  className="text-gray-600 hover:text-gray-800"
                  style={{ fontSize: "24px" }}
                />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div
              className="px-12 py-4  "
              style={{ backgroundColor: "#F6FAFB" }}
            >
              <div className="text-center font-medium text-xl mb-5 rounded-md">
                Send Mail
              </div>
              <p className="text-green-50  font-bold mb-4">
                Document generated successfully
              </p>
              <p className="text-gray-600 mb-4">
                Generated document can be accessed through the client link that
                will be sent to the client.
              </p>

              <Input
                type="email"
                placeholder={inputPlaceholder || "Enter the Mail ID of client"}
                className="w-full p-2 border rounded mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-gray-500 mb-4">
                Note: This mail will be sent to CCs also. You can edit it in
                Settings.
              </p>
              <Input.TextArea
                className="w-full p-2 border rounded mb-4"
                defaultValue={inputPlaceholder}
                rows={4}
              />
              <div className="flex justify-center">
                <button
                  onClick={handleSendMail}
                  className="bg-buttonModalColor text-white text-center p-2 rounded mr-4" // Added mr-2 here
                >
                  Send Mail
                </button>
                <button
                  onClick={onClose}
                  className="border border-buttonModalColor text-buttonModalColor bg-none p-2 rounded"
                >
                  Go to Agreement
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default GenerateSendMail;
