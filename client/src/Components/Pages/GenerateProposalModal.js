import React, { useState } from "react";
import {
  Modal,
  DatePicker,
  Form,
  InputNumber,
  Input,
  Select,
  Table,
  Button,
} from "antd";
import "../css/GenerateProposalModal.css";

const { Option } = Select;

const GenerateProposalModal = ({ visible, onOk, onCancel }) => {
 const [items, setItems] = useState([
   {
     outletName: "Outlet 1",
     foodHandlers: 50,
     manDays: 0.5,
     unitCost: 8000,
     discount: 0,
     amount: 4000,
   },
   {
     outletName: "Outlet 3",
     foodHandlers: 100,
     manDays: 1,
     unitCost: 8000,
     discount: 0,
     amount: 8000,
   },
 ]);

 const outlets = [
   {
     name: "Outlet 1",
     foodHandlers: 50,
     unitCost: 8000,
   },
   {
     name: "Outlet 2",
     foodHandlers: 70,
     unitCost: 7500,
   },
   {
     name: "Outlet 3",
     foodHandlers: 100,
     unitCost: 8000,
   },
 ];

 const addItem = () => {
   setItems([
     ...items,
     {
       outletName: "",
       foodHandlers: 0,
       manDays: 0,
       unitCost: 0,
       discount: 0,
       amount: 0,
     },
   ]);
 };

 const calculateManDays = (foodHandlers) => {
   if (foodHandlers <= 50) return 4;
   if (foodHandlers <= 100) return 0.5;
   if (foodHandlers <= 300) return 1;
   if (foodHandlers <= 600) return 1.5;
   if (foodHandlers <= 1000) return 2.5;
   return 3;
 };

 const handleInputChange = (index, field, value) => {
   const newItems = [...items];
   if (field === "outletName") {
     const selectedOutlet = outlets.find((outlet) => outlet.name === value);
     const manDays = calculateManDays(
       selectedOutlet ? selectedOutlet.foodHandlers : 0
     );
     newItems[index] = {
       ...newItems[index],
       outletName: value,
       foodHandlers: selectedOutlet ? selectedOutlet.foodHandlers : 0,
       manDays,
       unitCost: selectedOutlet ? selectedOutlet.unitCost : 0,
     };
   } else {
     newItems[index][field] = value;
     if (field === "foodHandlers") {
       newItems[index].manDays = calculateManDays(value);
     }
   }
   newItems[index].amount =
     newItems[index].foodHandlers *
       newItems[index].manDays *
       newItems[index].unitCost -
     newItems[index].discount;
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
      dataIndex: "outletName",
      render: (text, record, index) => (
        <Select
          value={text}
          onChange={(value) => handleInputChange(index, "outletName", value)}
          className="w-full"
        >
          {outlets.map((outlet) => (
            <Option key={outlet.name} value={outlet.name}>
              {outlet.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "No of Food Handlers",
      dataIndex: "foodHandlers",
      render: (text, record, index) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => handleInputChange(index, "foodHandlers", value)}
          className="w-full"
        />
      ),
    },
    {
      title: "Man Days",
      dataIndex: "manDays",
      render: (text, record, index) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => handleInputChange(index, "manDays", value)}
          className="w-full"
        />
      ),
    },
    {
      title: "Unit Cost",
      dataIndex: "unitCost",
      render: (text, record, index) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => handleInputChange(index, "unitCost", value)}
          className="w-full"
        />
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (text, record, index) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => handleInputChange(index, "discount", value)}
          className="w-full"
        />
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text) =>
        text.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
        }),
    },
  ];

  return (
    <Modal
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
      width={800}
      style={{ padding: "0 !important" }}
      className="acc-modal"
    >
      <Form layout="vertical">
        <div
          className="text-center align-middle font-medium text-xl title-div bg-blue-50 p-7"
          style={{ boxShadow: "0 4px 2px -2px lightgrey" }}
        >
          Generate Proposal
        </div>
        <div className="p-8" style={{ backgroundColor: "#F6FAFB" }}>
          <div className="flex space-x-4">
            <Form.Item label="FBO name (Business Name)" className="flex-1">
              <Input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </Form.Item>
            <Form.Item label="Proposal date" className="flex-1" size="large">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item label="Proposal number" className="flex-1">
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
          <Form.Item>
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
            <Form.Item label="GST Number" className="flex-1">
              <Input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </Form.Item>
          </div>
          <div className="flex space-x-4">
            <Form.Item label="Contact Person Name" className="flex-1">
              <Input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </Form.Item>
            <Form.Item label="Contact Person Number" className="flex-1">
              <Input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </Form.Item>
          </div>
          <div className="my-4">
            <h3 className="text-lg font-semibold mb-2">Items table</h3>
            <Table dataSource={items} columns={columns} pagination={false} />
            <button
              onClick={addItem}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              + Add New row
            </button>
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

          <div className="text-center">
            <button
              className="px-4 py-2 bg-buttonModalColor text-white  rounded "
              onClick={onOk}
            >
              Generate
            </button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default GenerateProposalModal;
