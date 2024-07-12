import React, { useState } from "react";
import {
  Modal,
  DatePicker,
  Form,
  InputNumber,
  Input,
  Button,
  Table,
  Select
} from "antd";
import "../css/GenerateProposalModal.css";
import GenerateSendMail from "./GenerateSendMail";

const { Option } = Select;

const GenerateProposalModal = ({ visible, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const [showForm, setShowForm] = useState(false);
  const [showSendMailModal, setShowSendMailModal] = useState(false);
  const [selectedOutlets, setSelectedOutlets] = useState([]);
  const [items, setItems] = useState([]);

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

  const handleSelect = (record, selected) => {
    const updatedSelectedOutlets = selected
      ? [...selectedOutlets, record]
      : selectedOutlets.filter((outlet) => outlet.key !== record.key);
    setSelectedOutlets(updatedSelectedOutlets);
  };

  const handleSelectAll = (selected, selectedRows) => {
    setSelectedOutlets(selected ? selectedRows : []);
  };

  const handleNext = () => {
    const selectedItems = selectedOutlets.map((outlet) => ({
      outletName: outlet.name,
      foodHandlers: outlet.foodHandlers,
      manDays: outlet.manDays,
      unitCost: outlet.unitCost,
      discount: 0,
      amount: outlet.amount,
    }));
    setItems(selectedItems);
    setShowForm(true);
  };

  const handleGenerate = () => {
    onCancel(); // Close the GenerateProposalModal
    setShowSendMailModal(true); // Show the GenerateSendMail modal
  };

  const handleInputChange = (index, field, value) => {
    const newItems = [...items];
    if (field === "outletName") {
      const selectedOutlet = outlets.find((outlet) => outlet.name === value);
      newItems[index] = {
        ...newItems[index],
        outletName: value,
        foodHandlers: selectedOutlet ? selectedOutlet.foodHandlers : 0,
        manDays: selectedOutlet ? selectedOutlet.manDays : 0,
        unitCost: selectedOutlet ? selectedOutlet.unitCost : 0,
      };
    } else {
      newItems[index][field] = value;
    }
    if (field !== "amount") {
      newItems[index].amount =
        newItems[index].foodHandlers *
          newItems[index].manDays *
          newItems[index].unitCost -
        newItems[index].discount;
    }
    setItems(newItems);
  };

  const calculateTotals = () => {
    const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subTotal * 0.09;
    const total = subTotal + 2 * tax;
    return { subTotal, tax, total };
  };

  const { subTotal, tax, total } = calculateTotals();

  const outletsColumns = [
    {
      title: "Outlet Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "No of Food Handlers",
      dataIndex: "foodHandlers",
      key: "foodHandlers",
    },
    {
      title: "Man Days",
      dataIndex: "manDays",
      key: "manDays",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        amount.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
        }),
    },
  ];

  const itemsColumns = [
    {
      title: "Outlet name",
      dataIndex: "outletName",
      key: "outletName",
      render: (_, item, index) => (
        <Input
          value={item.outletName}
          onChange={(e) =>
            handleInputChange(index, "outletName", e.target.value)
          }
          className="w-full"
        />
      ),
    },
    {
      title: "No of Food Handlers",
      dataIndex: "foodHandlers",
      key: "foodHandlers",
      render: (_, item, index) => (
        <InputNumber
          min={0}
          value={item.foodHandlers}
          onChange={(value) => handleInputChange(index, "foodHandlers", value)}
          className="w-full"
        />
      ),
    },
    {
      title: "Man Days",
      dataIndex: "manDays",
      key: "manDays",
      render: (_, item, index) => (
        <InputNumber
          min={0}
          value={item.manDays}
          onChange={(value) => handleInputChange(index, "manDays", value)}
          className="w-full"
        />
      ),
    },
    {
      title: "Unit Cost",
      dataIndex: "unitCost",
      key: "unitCost",
      render: (_, item, index) => (
        <InputNumber
          min={0}
          value={item.unitCost}
          onChange={(value) => handleInputChange(index, "unitCost", value)}
          className="w-full"
        />
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (_, item, index) => (
        <InputNumber
          min={0}
          value={item.discount}
          onChange={(value) => handleInputChange(index, "discount", value)}
          className="w-full"
        />
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) =>
        amount.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
        }),
    },
  ];

  return (
    <>
      <Modal
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={800}
        className="acc-modal"
      >
        <Form layout="vertical" form={form}>
          <div
            className="text-center align-middle font-medium text-xl bg-blue-50 p-4"
            style={{ boxShadow: "0 4px 2px -2px lightgrey" }}
          >
            Generate invoice
          </div>
          {!showForm ? (
            <>
              <div className="p-6" style={{ backgroundColor: "#F6FAFB" }}>
                <div className="text-center font-medium text-xl mb-5 rounded-md">
                  Select outlets
                </div>
                <Table
                  dataSource={outlets}
                  columns={outletsColumns}
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
                  <button
                    className="bg-buttonModalColor px-4 py-2 text-white rounded"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6" style={{ backgroundColor: "#F6FAFB" }}>
              <div className="text-center font-medium text-xl mb-5 rounded-md">
                Invoice Details
              </div>
              <Form layout="vertical">
                <Form.Item label="FBO name (Business Name)" className="flex-1">
                  <Input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </Form.Item>
                <div className="flex space-x-4">
                  <Form.Item
                    label="Proposal date"
                    className="flex-1"
                    size="large"
                  >
                    <DatePicker className="w-full" />
                  </Form.Item>
                  <Form.Item
                    label="Proposal number(Order Ref No.)"
                    className="flex-1"
                  >
                    <Input
                      placeholder="Auto Generated"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </Form.Item>
                  <Form.Item label="Invoice number" className="flex-1">
                    <Input
                      placeholder="Auto Generated"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </Form.Item>
                </div>
                <Form.Item label="FBO Address">
                  <Input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </Form.Item>
                <div className="flex space-x-4">
                  <Form.Item label="Pincode" className="flex-1">
                    <Input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </Form.Item>
                  <Form.Item label="Place Of Supply" className="flex-1">
                    <Input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </Form.Item>
                </div>
                <div className="flex space-x-4">
                  <Form.Item label="Field Executie Name " className="flex-1">
                    <Input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </Form.Item>
                  <Form.Item label="Team leader Name" className="flex-1">
                    <Input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </Form.Item>
                </div>
              </Form>
              <div className="my-4">
                <h3 className="text-lg font-semibold mb-2">Items table</h3>
                <Table
                  dataSource={items}
                  columns={itemsColumns}
                  pagination={false}
                  rowClassName="text-left"
                />
              </div>
              <div className="my-4 p-4 border rounded w-1/2 ml-auto bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Sub Total:</div>
                  <div className="text-sm font-medium">
                    {subTotal.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">CGST [9%]:</div>
                  <div className="text-sm font-medium">
                    {(tax * 0.09).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">SGST [9%]:</div>
                  <div className="text-sm font-medium">
                    {(tax * 0.09).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-bold">Total:</div>
                  <div className="text-lg font-bold">
                    {total.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <button
                  className="bg-buttonModalColor px-4 py-2 text-white rounded"
                  onClick={handleGenerate}
                >
                  Generate
                </button>
              </div>
            </div>
          )}
        </Form>
      </Modal>
      {showSendMailModal && (
        <GenerateSendMail
          onClose={() => setShowSendMailModal(false)}
          title="Generate Invoice"
          inputPlaceholder="Greeting from unavar"
          successMessage="Your custom success message"
        />
      )}
    </>
  );
};

export default GenerateProposalModal;
