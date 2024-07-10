import React, { useState, useEffect, useMemo } from "react";
import { Modal, Form, Checkbox, Table, Button, Input, DatePicker } from "antd";
import "tailwindcss/tailwind.css";
import moment from "moment";
import GenerateSendMail from "./GenerateSendMail"; 


const GenerateAgreementModal = ({ visible, onOk, onCancel }) => {
  const [selectedOutlets, setSelectedOutlets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showSendMailModal, setShowSendMailModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      fromDate: moment("01/12/2021", "DD/MM/YYYY"),
      toDate: moment("01/12/2021", "DD/MM/YYYY"),
    });
  }, [form]);

  const outlets = useMemo(
    () => [
      {
        key: "1",
        outletName: "Outlet 1",
        foodHandlers: 50,
        manDays: 0.5,
        amount: 4000,
      },
      {
        key: "2",
        outletName: "Outlet 2",
        foodHandlers: 100,
        manDays: 1,
        amount: 8000,
      },
      {
        key: "3",
        outletName: "Outlet 3",
        foodHandlers: 75,
        manDays: 1,
        amount: 8000,
      },
      {
        key: "4",
        outletName: "Outlet 4",
        foodHandlers: 45,
        manDays: 0.5,
        amount: 4000,
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        title: (
          <Checkbox
            indeterminate={
              selectedOutlets.length > 0 &&
              selectedOutlets.length < outlets.length
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
            checked={selectedOutlets.length === outlets.length}
          />
        ),
        dataIndex: "key",
        render: (key) => (
          <Checkbox
            checked={selectedOutlets.includes(key)}
            onChange={() => handleSelectOutlet(key)}
          />
        ),
      },
      { title: "Outlet name", dataIndex: "outletName" },
      { title: "No of Food Handlers", dataIndex: "foodHandlers" },
      { title: "Man Days", dataIndex: "manDays" },
      {
        title: "Amount",
        dataIndex: "amount",
        render: (amount) =>
          amount.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          }),
      },
    ],
    [selectedOutlets, outlets]
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOutlets(outlets.map((outlet) => outlet.key));
    } else {
      setSelectedOutlets([]);
    }
  };

  const handleSelectOutlet = (key) => {
    setSelectedOutlets((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleNext = () => {
    setShowForm(true);
  };

  const handleGenerate = () => {
    onCancel(); // Close the GenerateProposalModal
    setShowSendMailModal(true); // Show the GenerateSendMail modal
  };

  return (
    <>
      <Modal
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={800}
        title="Generate Agreement"
      >
        <Form layout="vertical" form={form}>
          {!showForm ? (
            <>
              <div className="text-center font-bold text-xl mb-5 bg-blue-50 p-2 rounded-md shadow-sm">
                Select outlets
              </div>
              <Table
                dataSource={outlets}
                columns={columns}
                pagination={false}
                rowClassName="text-left"
              />
              <div className="text-center mt-4">
                <Button type="primary" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </>
          ) : (
            <>
              <Form.Item label="FBO name (Business Name)">
                <Input
                  value="Prefilled from Client Data (Edit option enabled)"
                  readOnly
                />
              </Form.Item>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="From date" name="fromDate">
                  <DatePicker format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item label="To date" name="toDate">
                  <DatePicker format="DD/MM/YYYY" />
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
                    value={`₹${selectedOutlets
                      .reduce(
                        (total, key) =>
                          total +
                          outlets.find((outlet) => outlet.key === key).amount,
                        0
                      )
                      .toLocaleString("en-IN")}`}
                    readOnly
                  />
                </Form.Item>
              </div>
              <div className="text-center mt-4">
                <Button type="primary" onClick={handleGenerate}>
                  Generate
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal>

      {showSendMailModal && (
        <GenerateSendMail onClose={() => setShowSendMailModal(false)} />
      )}
    </>
  );
};

export default GenerateAgreementModal;
