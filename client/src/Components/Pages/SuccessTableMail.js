import React from "react";
import { Modal, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import "../css/GenerateProposalModal.css";

const SuccessTableMail = ({ visible, email, title, onCloseSuccess}) => {
  return (
    <Modal
      visible={visible}
      onCancel={onCloseSuccess}
      footer={null}
      className="acc-modal"
      centered
    >
      <div>
        <div
          className="text-center align-middle font-medium text-xl title-div p-4 bg-blue-50"
          style={{ boxShadow: "0 4px 2px -2px lightgrey" }}
        >
          {title}
        </div>
        <div className="p-12" style={{ backgroundColor: "#F6FAFB" }}>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircleOutlined
                className="text-green-500"
                style={{ fontSize: "60px" }}
              />
            </div>
            <p className="text-xl">Mail Sent to</p>{" "}
            <p className="text-green-500 my-4 text-xl"> {email}</p>
            <Button
              onClick={onCloseSuccess}
              type="text"
              className="absolute top-0 right-0 m-4"
            ></Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessTableMail;
