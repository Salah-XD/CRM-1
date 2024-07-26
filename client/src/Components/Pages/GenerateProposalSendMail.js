import React, { useState } from "react";
import { Modal, Button, Input, message, Form } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SuccessMail from "./SuccessMail";

const GenerateProposalSendMail = ({ visible, onClose, id,name,route,title}) => {
  const [mailSent, setMailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSendMail = () => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true);
        axios
          .post(`/api/${name}/${route}/${id}`, {
            to: values.email,
            message: values.message,
          })
          .then((response) => {
            setLoading(false);
            setMailSent(true);
            message.success("Mail sent successfully");
            onClose(); 
          })
          .catch((error) => {
            setLoading(false);
            message.error("Failed to send mail");
          });
      })
      .catch((errorInfo) => {
        console.error("Validate Failed:", errorInfo);
      });
  };

  const handleGoToAgreement = () => {
    navigate("/proposal");
  };

  const handleSuccessMailClose = () => {
    setMailSent(false);
    onClose(); // Close parent component
  };

  return (
    <>
      <Modal
        visible={visible}
        onCancel={onClose}
        footer={null}
        centered
        closable={true}
        className="acc-modal"
      >
        <div>
          <div
            className="text-center align-middle font-medium text-xl title-div bg-blue-50 p-4"
            style={{ boxShadow: "0 4px 2px -2px lightgrey" }}
          >
           {title}
          </div>

          <div className="px-12 py-4" style={{ backgroundColor: "#F6FAFB" }}>
            <div className="text-center font-medium text-xl mb-5 rounded-md">
              Send Mail
            </div>
            <p className="text-green-50 font-bold mb-4">
              Document generated successfully
            </p>
            <p className="text-gray-600 mb-4">
              Generated document can be accessed through the client link that
              will be sent to the client.
            </p>

            <Form form={form} layout="vertical">
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Please enter the email" }]}
              >
                <Input
                  type="email"
                  placeholder="Enter the Mail ID of client"
                  className="w-full p-2 border rounded mb-4"
                />
              </Form.Item>
              <p className="text-gray-500 mb-4">
                Note: This mail will be sent to CCs also. You can edit it in
                Settings.
              </p>
              <Form.Item
                name="message"
                rules={[
                  { required: true, message: "Please enter the message" },
                ]}
              >
                <Input.TextArea
                  className="w-full p-2 border rounded mb-4"
                  placeholder="Enter your message"
                  rows={4}
                />
              </Form.Item>
              <div className="flex justify-center">
                <Button
                  type="primary"
                  onClick={handleSendMail}
                  loading={loading}
                  className="mr-4"
                >
                  Send Mail
                </Button>
                <Button
                  onClick={handleGoToAgreement}
                  className="border border-buttonModalColor text-buttonModalColor bg-none p-2 rounded"
                >
                  Go to Proposal
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>

      {mailSent && (
        <SuccessMail
          visible={mailSent}
          email={form.getFieldValue("email")}
          title={title}
          onCloseSuccess={handleSuccessMailClose}
        />
      )}
    </>
  );
};

export default GenerateProposalSendMail;
