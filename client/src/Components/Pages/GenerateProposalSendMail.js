import React, { useState, useEffect } from "react";
import { Modal, Button, Input, message, Form } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SuccessMail from "./SuccessMail";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const GenerateProposalSendMail = ({
  visible,
  onClose,
  id,
  name,
  route,
  title,
  buttonTitle,
}) => {
  const [mailSent, setMailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [ccmail, setCcmail] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (visible) {
      if (name == "proposal") {
        axios
          .get("/api/setting/getSetting/66c41b85dedfff785c08df21")
          .then((response) => {
            setCcmail(response.data.proposal_cc);
            // Initialize the message field with the fetched data
            form.setFieldsValue({ message: response.data.proposal_email });
          })
          .catch((error) => {
            console.error("Failed to fetch setting data:", error);
          });
      } else if (name == "invoice") {
        axios
          .get("/api/setting/getSetting/66c41b85dedfff785c08df21")
          .then((response) => {
            setCcmail(response.data.invoice_cc);
            // Initialize the message field with the fetched data
            form.setFieldsValue({ message: response.data.invoice_email });
          })
          .catch((error) => {
            console.error("Failed to fetch setting data:", error);
          });
      } else {
        axios
          .get("/api/setting/getSetting/66c41b85dedfff785c08df21")
          .then((response) => {
            setCcmail(response.data.agreement_cc);
            // Initialize the message field with the fetched data
            form.setFieldsValue({ message: response.data.agreement_email });
          })
          .catch((error) => {
            console.error("Failed to fetch setting data:", error);
          });
      }
    }
  }, [visible]);

  const handleGoTo = () => {
    if (buttonTitle == "Go to Proposal") {
      navigate("/proposal");
    } else if (buttonTitle == "Go to Invoice") {
      navigate("/invoice");
    } else {
      navigate("/agreement");
    }
  };

  const handleSuccessMailClose = () => {
    setMailSent(false);
  };

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
            {/* <p className="text-green-50 font-bold mb-4">
              Document generated successfully
            </p> */}

            <Form form={form} layout="vertical">
              <Form.Item
                label="Mail ID"
                name="email"
                rules={[{ required: true, message: "Please enter the email" }]}
              >
                <Input
                  type="email"
                  placeholder="Enter the Mail ID of client"
                  className="w-full p-2 border rounded mb-4"
                />
              </Form.Item>

              <p className="text-gray-600 ">CC's Mails:</p>
              {ccmail.length > 0 && (
                <p className="text-gray-600 mb-4">
                  {ccmail.map((email, index) => (
                    <span key={index} className="text-blue-600">
                      {email}
                      {index < ccmail.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              )}
              <p className="text-gray-600 mb-4">
                Note: This mail will be sent to CCs also. You can edit in
                Settings.
              </p>
              <Form.Item
                label="Message"
                name="message"
                rules={[
                  { required: true, message: "Please enter the message" },
                ]}
              >
                <CKEditor
                  editor={ClassicEditor}
                  data={form.getFieldValue("message") || ""}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    form.setFieldsValue({ message: data });
                  }}
                />
              </Form.Item>
              <div className="flex justify-center">
                <Button
                  type="primary"
                  onClick={handleSendMail}
                  loading={loading}
                  className="mr-4 border border-buttonModalColor text-white bg-buttonModalColor rounded px-6 py-4 flex items-center justify-center"
                >
                  Send Mail
                </Button>
                <button
                  onClick={handleGoTo}
                  className="border border-buttonModalColor text-buttonModalColor bg-none p-1 rounded"
                >
                  {buttonTitle}
                </button>
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
