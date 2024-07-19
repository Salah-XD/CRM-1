import React, { useState, useEffect } from "react";
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
import moment from "moment";
import axios from "axios";
import "../css/GenerateProposalModal.css";

const { Option } = Select;

const GenerateProposalModal = ({ visible, onOk, onCancel, enquiryId }) => {
  const [items, setItems] = useState([]);
  const [proposal_date, setProposalDate] = useState(moment());
  const [proposal_number, setProposalNumber] = useState("");
  const [outlets, setOutlets] = useState([]);
  const [businessDetails, setBusinessDetails] = useState({
    businessName: "",
    address: "",
    pincode: "",
    gstNumber: "",
    contactPersonName: "",
    contactPersonNumber: "",
  });

  useEffect(() => {
    if (visible) {
      const newProposalNumber = `PROP-${Math.floor(Math.random() * 100000)}`;
      setProposalNumber(newProposalNumber);
      setProposalDate(moment());

      const fetchOutlets = async () => {
        try {
          const response = await axios.get(
            `/api/proposal/getOutletDetailsById/${enquiryId}`
          );
          setOutlets(response.data);
        } catch (error) {
          console.error("Error fetching outlets", error);
        }
      };

      const fetchBusinessDetails = async () => {
        try {
          const response = await axios.get(
            `/api/proposal/getBusinessDetailsByEnquiryId/${enquiryId}`
          );
          setBusinessDetails(response.data);
        } catch (error) {
          console.error("Error fetching business details", error);
        }
      };

      fetchOutlets();
      fetchBusinessDetails();
    }
  }, [visible]);

 const handleGenerate = async () => {
   const formData = new FormData();
   formData.append("proposal_date", proposal_date.format("YYYY-MM-DD"));
   formData.append("proposal_number", proposal_number);
   formData.append("enquiryId", enquiryId);
   formData.append("items", JSON.stringify(items)); // Append items as a JSON string
   formData.append("subTotal", subTotal);
   formData.append("tax", tax);
   formData.append("total", total);
   

   // Log form data to console
   for (let pair of formData.entries()) {
     console.log(`${pair[0]}: ${pair[1]}`);
   }

   try {
     const response = await axios.post(
       "/api/proposal/createProposalAndOutlet",
       formData,
       {
         headers: {
           "Content-Type": "multipart/form-data",
         },
       }
     );
     if (response.status === 200) {
       // Assuming onOk will handle what to do after a successful response
       onOk();
     } else {
       console.error("Failed to generate proposal", response.data);
     }
   } catch (error) {
     console.error("Error generating proposal", error);
   }
 };




  const addItem = () => {
    setItems([
      ...items,
      {
        outletId: "",
        foodHandlers: 0,
        manDays: 0,
        unitCost: 0,
        discount: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((item, i) => i !== index);
    setItems(newItems);
  };

  const calculateManDays = (foodHandlers) => {
    if (foodHandlers <= 50) return 0.5;
    if (foodHandlers <= 100) return 1;
    if (foodHandlers <= 300) return 1.5;
    if (foodHandlers <= 600) return 2;
    if (foodHandlers <= 1000) return 2.5;
    return 3;
  };

  const handleInputChange = (index, field, value) => {
    const newItems = [...items];
    if (field === "outletId") {
      const selectedOutlet = outlets.find((outlet) => outlet._id === value);
      const manDays = calculateManDays(
        selectedOutlet ? selectedOutlet.foodHandlers : 0
      );
      newItems[index] = {
        ...newItems[index],
        outletId: value,
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
    const total = subTotal + tax;
    return { subTotal, tax, total };
  };

  const { subTotal, tax, total } = calculateTotals();

  const columns = [
    {
      title: "Outlet name",
      dataIndex: "outletId",
      render: (text, record, index) => (
        <Select
          value={text}
          onChange={(value) => handleInputChange(index, "outletId", value)}
          className="w-full"
          style={{ width: 120 }}
        >
          {outlets.map((outlet) => (
            <Option key={outlet._id} value={outlet._id}>
              {outlet.branch_name}
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
    {
      title: "Action",
      dataIndex: "action",
      render: (_, __, index) => (
        <Button onClick={() => removeItem(index)} type="link" danger>
          Remove
        </Button>
      ),
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
                value={businessDetails.name}
              />
            </Form.Item>
            <Form.Item label="Proposal date" className="flex-1" size="large">
              <DatePicker
                className="w-full"
                value={proposal_date}
                onChange={(date) => setProposalDate(date)}
                disabled
              />
            </Form.Item>
            <Form.Item label="Proposal number" className="flex-1">
              <Input
                disabled
                placeholder="Auto Generated"
                className="w-full p-2 border border-gray-300 rounded"
                value={proposal_number}
                readOnly
              />
            </Form.Item>
          </div>

          <Form.Item label="FBO Address">
            <Input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={`${businessDetails.address?.line1 || ""}${
                businessDetails.address?.line2
                  ? " " + businessDetails.address.line2
                  : ""
              }`}
            />
          </Form.Item>
          <Form.Item>
            <Input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={`${businessDetails.address?.city || ""}${
                businessDetails.address?.city && businessDetails.address?.state
                  ? `, ${businessDetails.address.state}`
                  : ""
              }`}
            />
          </Form.Item>

          <div className="flex space-x-4">
         <Form.Item label="Pincode" className="flex-1">
  <Input
    type="text"
    className="w-full p-2 border border-gray-300 rounded"
    value={businessDetails.address?.pincode || ""}
  />
</Form.Item>


            <Form.Item label="GST Number" className="flex-1">
              <Input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={businessDetails.gst_number}
              />
            </Form.Item>
          </div>
          <div className="flex space-x-4">
            <Form.Item label="Contact Person Name" className="flex-1">
              <Input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={businessDetails.contact_person}
              />
            </Form.Item>
            <Form.Item label="Contact Person Number" className="flex-1">
              <Input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={businessDetails.phone}
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
              + Add New Row
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
              <div className="text-sm font-medium">Tax (9%):</div>
              <div className="text-sm font-medium">
                {tax.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Total:</div>
              <div className="text-sm font-medium">
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
      </Form>
    </Modal>
  );
};

export default GenerateProposalModal;
