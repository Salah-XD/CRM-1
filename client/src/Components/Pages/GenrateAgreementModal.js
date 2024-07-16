import React, { useState, useEffect } from "react";
import { Modal, Form, Table, Button, Input, DatePicker } from "antd";
import moment from "moment";
import "tailwindcss/tailwind.css"; // Ensure Tailwind CSS is configured properly
import GenerateSendMail from "./GenerateSendMail"; // Adjust path as necessary

const GenerateAgreementModal = ({ visible, onOk, onCancel }) => {
  const [selectedOutlets, setSelectedOutlets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showSendMailModal, setShowSendMailModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0); // State to hold total amount

  useEffect(() => {
    // Initialize form fields or any other necessary effects
  }, []);

  const outlets = [
    {
      key: "1",
      name: "Outlet 1",
      foodHandlers: 50,
      manDays: 0.5,
      unitCost: 8000,
      amount: 4000,
    },
    {
      key: "2",
      name: "Outlet 2",
      foodHandlers: 100,
      manDays: 1,
      unitCost: 8000,
      amount: 8000,
    },
    {
      key: "3",
      name: "Outlet 3",
      foodHandlers: 75,
      manDays: 1,
      unitCost: 8000,
      amount: 8000,
    },
    {
      key: "4",
      name: "Outlet 4",
      foodHandlers: 45,
      manDays: 0.5,
      unitCost: 8000,
      amount: 4000,
    },
  ];

  const columns = [
    {
      title: "Outlet name",
      dataIndex: "name",
    },
    {
      title: "No of Food Handlers",
      dataIndex: "foodHandlers",
    },
    {
      title: "Man Days",
      dataIndex: "manDays",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) =>
        amount.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
        }),
    },
  ];

  const handleSelect = (record, selected) => {
    const updatedSelectedOutlets = selected
      ? [...selectedOutlets, record]
      : selectedOutlets.filter((outlet) => outlet.key !== record.key);
    setSelectedOutlets(updatedSelectedOutlets);

    // Calculate total amount
    const total = updatedSelectedOutlets.reduce((acc, outlet) => {
      const selectedOutlet = outlets.find((o) => o.key === outlet.key);
      return selectedOutlet ? acc + selectedOutlet.amount : acc;
    }, 0);
    setTotalAmount(total);
  };

  const handleSelectAll = (selected, selectedRows) => {
    setSelectedOutlets(selected ? selectedRows : []);

    // Calculate total amount
    const total = selectedRows.reduce((acc, outlet) => {
      const selectedOutlet = outlets.find((o) => o.key === outlet.key);
      return selectedOutlet ? acc + selectedOutlet.amount : acc;
    }, 0);
    setTotalAmount(total);
  };

  const handleNext = () => {
    setShowForm(true);
  };

  const handleGenerate = () => {
    onCancel(); // Close the GenerateAgreementModal
    setShowSendMailModal(true); // Show the GenerateSendMail modal
  };

  return (
    <>
      <Modal
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={800}
        className="acc-modal"
      >
        <Form layout="vertical">
          <div
            className="text-center align-middle font-medium text-xl bg-blue-50 p-4"
            style={{ boxShadow: "0 4px 2px -2px lightgrey" }}
          >
            Generate Agreement
          </div>
          {!showForm ? (
            <>
              <div className="p-6" style={{ backgroundColor: "#F6FAFB" }}>
                <div className="text-center font-medium text-xl mb-5 rounded-md">
                  Select outlets
                </div>
                <Table
                  dataSource={outlets}
                  columns={columns}
                  pagination={false}
                  rowClassName="text-left"
                  rowSelection={{
                    selectedRowKeys: selectedOutlets.map(
                      (outlet) => outlet.key
                    ),
                    onSelect: handleSelect,
                    onSelectAll: handleSelectAll,
                  }}
                />
                <div className="text-center mt-4">
                  <Button
                    className="bg-buttonModalColor text-white rounded"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-6" style={{ backgroundColor: "#F6FAFB" }}>
                <div className="text-center font-medium text-xl mb-5 rounded-md">
                  Document Preview
                </div>
                <Form.Item label="FBO name (Business Name)">
                  <Input
                    value="Prefilled from Client Data (Edit option enabled)"
                    readOnly
                  />
                </Form.Item>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="From date">
                    <DatePicker className="w-full" />
                  </Form.Item>
                  <Form.Item label="To date">
                    <DatePicker className="w-full" />
                  </Form.Item>
                </div>
                <Form.Item label="FBO Address">
                  <Input
                    value="Prefilled from Client Data (Edit option enabled)"
                    readOnly
                  />
                </Form.Item>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="No of Outlets">
                    <Input
                      value={`${selectedOutlets.length} (from previous selection)`}
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item label="Total Cost">
                    <Input
                      value={`₹${totalAmount.toLocaleString("en-IN")}`}
                      readOnly
                    />
                  </Form.Item>
                </div>
                <div className="text-center mt-4">
                  <button
                    className="bg-buttonModalColor px-4 py-2 text-white rounded"
                   // onClick={}
                  >
                    Generate
                  </button>
                </div>
              </div>
            </>
          )}
        </Form>
      </Modal>

      {showSendMailModal && (
        <GenerateSendMail
          onClose={() => setShowSendMailModal(false)}
          title="Generate Aggrement"
          inputPlaceholder="Greeting from unavar"
          successMessage="Your custom success message"
        />
      )}
    </>
  );
};

export default GenerateAgreementModal;
