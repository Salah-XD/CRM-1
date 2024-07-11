import React, { useState } from "react";
import {
  Modal,
  DatePicker,
  Form,
  InputNumber,
  Input,
  Select,
  Checkbox,
  Button,
  Table,
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

  return (
    <>
      <Modal visible={visible} onCancel={onCancel} footer={null} width={800}>
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
                rowSelection={{
                  selectedRowKeys: selectedOutlets.map((outlet) => outlet.key),
                  onSelect: handleSelect,
                  onSelectAll: handleSelectAll,
                }}
              />
              <div className="text-center mt-4">
                <Button type="primary" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </>
          ) : (
            <Form layout="vertical">
              <div
                className="title text-center font-bold text-xl mb-5 title-div bg-blue-50"
                style={{ boxShadow: "0 4px 2px -2px lightgrey" }}
              >
                Generate Invoice
              </div>

              <div className="flex space-x-4">
                <Form.Item label="FBO name (Business Name)" className="flex-1">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </Form.Item>
              </div>
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
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </Form.Item>
              <Form.Item>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </Form.Item>
              <div className="flex space-x-4">
                <Form.Item label="Pincode" className="flex-1">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </Form.Item>
                <Form.Item label="Place Of Supply" className="flex-1">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </Form.Item>
              </div>
              <div className="flex space-x-4">
                <Form.Item label="Field Executie Name " className="flex-1">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </Form.Item>
                <Form.Item label="Team leader Name" className="flex-1">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </Form.Item>
              </div>
              <div className="my-4">
                <h3 className="text-lg font-semibold mb-2">Items table</h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border-b">Outlet name</th>
                      <th className="p-2 border-b">No of Food Handlers</th>
                      <th className="p-2 border-b">Man Days</th>
                      <th className="p-2 border-b">Unit Cost</th>
                      <th className="p-2 border-b">Discount</th>
                      <th className="p-2 border-b">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="p-2 border-b">
                          <Input value={item.outletName} className="w-full" />
                        </td>
                        <td className="p-2 border-b">
                          <InputNumber
                            min={0}
                            value={item.foodHandlers}
                            onChange={(value) =>
                              handleInputChange(index, "foodHandlers", value)
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="p-2 border-b">
                          <InputNumber
                            min={0}
                            value={item.manDays}
                            onChange={(value) =>
                              handleInputChange(index, "manDays", value)
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="p-2 border-b">
                          <InputNumber
                            min={0}
                            value={item.unitCost}
                            onChange={(value) =>
                              handleInputChange(index, "unitCost", value)
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="p-2 border-b">
                          <InputNumber
                            min={0}
                            value={item.discount}
                            onChange={(value) =>
                              handleInputChange(index, "discount", value)
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="p-2 border-b">
                          <InputNumber
                            min={0}
                            value={item.amount}
                            onChange={(value) =>
                              handleInputChange(index, "amount", value)
                            }
                            className="w-full"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                <Button type="primary" onClick={handleGenerate}>
                  Generate
                </Button>
              </div>
            </Form>
          )}
        </Form>
      </Modal>
      {showSendMailModal && (
        <GenerateSendMail
    onClose={() => setShowSendMailModal(false)}
     title="Generate Invoice"
    inputPlaceholder="Greeting from unavar"
    successMessage="Your custom success message"
    />)
      }

       </>
    
  );
};

export default GenerateProposalModal;
