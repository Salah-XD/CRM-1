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
  message,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import GenreateSuccessSendMailTableModal from "./GenreateSuccessSendMailTableModal";
import "../css/GenerateProposalModal.css";

const { Option } = Select;
const { TextArea } = Input;

const GenerateProposalModal = ({ visible, onOk, onCancel, enquiryId }) => {
  const [form] = Form.useForm();
  const [outletItem, setItems] = useState([
    {
      outletId: "",
      outlet_name: "",
      no_of_food_handlers: 0,
      man_days: 0,
      unit_cost: 0,
      discount: 0,
      amount: 0,
    },
  ]);
  const [proposal_date, setProposalDate] = useState(moment());
  const [proposal_number, setProposalNumber] = useState("");
  const [outlets, setOutlets] = useState([]);
  const [initialValuesLoaded, setInitialValuesLoaded] = useState(false);
  const [showSendMailModal, setShowSendMailModal] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [total, setTotal] = useState(0);
  const [email, setEmail] = useState(0);
  const [prosposalId, setPropsalId] = useState();
const [auditors, setAuditors] = useState([]);


  const handleCancel = () => {
    setItems([]);
    setItems([
      {
        outletId: "",
        outlet_name: "",
        no_of_food_handlers: 0,
        man_days: 0,
        unit_cost: 0,
        discount: 0,
        amount: 0,
      },
    ]);
    setSubTotal(0);
    setSgst(0);
    setCgst(0);
    setTotal(0);
    onCancel();
  };

  useEffect(() => {
    if (visible) {
      setProposalDate(moment());

      const fetchProposalNumber = async () => {
        try {
          const response = await axios.get(
            "/api/proposal/genrateProposalNumber"
          );
          setProposalNumber(response.data);
          form.setFieldsValue({
            proposal_number: response.data.proposal_number,
          });
        } catch (error) {
          console.error("Error in fetching proposal Number", error);
        }
      };

      const fetchOutlets = async () => {
        try {
          const response = await axios.get(
            `/api/proposal/getOutletDetailsById/${enquiryId}`
          );
          const outletData = response.data;
          setOutlets(outletData);

          // Set items state with fetched data
          setItems(
            outletData.map((outlet) => ({
              outletId: outlet._id || "",
              outlet_name: outlet.branch_name || "",
              no_of_food_handlers: outlet.no_of_food_handlers || 0,
              man_days: 0,
              unit_cost: outlet.unit_cost || 0,
              discount: 0,
              amount: 0,
            }))
          );
        } catch (error) {
          console.error("Error fetching outlets", error);
        }
      };

      const fetchBusinessDetails = async () => {
        try {
          const response = await axios.get(
            `/api/proposal/getBusinessDetailsByEnquiryId/${enquiryId}`
          );
          const businessData = response.data;

          setEmail(businessData.email);

          const addressLine1 = businessData.address?.line1 || "";
          const addressLine2 = businessData.address?.line2 || "";

          // Concatenate addressLine1 with addressLine2 if either one exists
          const line1 = [addressLine1, addressLine2].filter(Boolean).join(", ");

          const city = businessData.address?.city || "";
          const state = businessData.address?.state || "";

          // Concatenate city and state if both exist
          const line2 = [city, state].filter(Boolean).join(", ");

          form.setFieldsValue({
            fbo_name: businessData.name,
            address: {
              line1: line1,
              line2: line2,
            },
            pincode: businessData.address?.pincode || "",
            gst_number: businessData.gst_number,
            contact_person: businessData.contact_person,
          });
          setInitialValuesLoaded(true);
        } catch (error) {
          console.error("Error fetching business details", error);
        }
      };

      const fetchAllAuditors = async () => {
        try {
          const response = await axios.get("/api/auditor/getAllAuditors"); // Adjust the endpoint as needed
          setAuditors(response.data);
        } catch (error) {
          console.error("Error fetching auditors:", error);
        }
      };

      fetchOutlets();
      fetchProposalNumber();
      fetchBusinessDetails();
      fetchAllAuditors();
    }
  }, [visible, enquiryId, form]);

  const handleSubmit = async () => {
    try {
      // Validate form fields before submission
      await form.validateFields();

      // Collect form values
      const formData = form.getFieldsValue();

      // Prepare data to send
      const proposalData = {
        ...formData,
        enquiryId: enquiryId,
        proposal_date: proposal_date.format("YYYY-MM-DD"),
        outlets: outletItem,
        email: email,
      };

      // Make POST request to server
      const response = await axios.post(
        "/api/proposal/createProposalAndOutlet",
        proposalData
      );
      onOk();
      setPropsalId(response.data.proposal._id);
      // console.log(response.data.proposal._id);
      setShowSendMailModal(true);

      message.success("Proposal generated successfully!");
    } catch (error) {
      message.error("Failed to generate proposal.");
    }
  };

  const addItem = () => {
    setItems((prevItems) => {
      const newItems = [
        ...prevItems,
        {
          outletId: "",
          outlet_name: "",
          no_of_food_handlers: 0,
          man_days: 0,
          unit_cost: 0,
          discount: 0,
          amount: 0,
        },
      ];
      calculateTotals(newItems);
      return newItems;
    });
  };

  const removeItem = (index) => {
    const newItems = outletItem.filter((item, i) => i !== index);
    setItems(newItems);
  };

  const calculateManDays = (foodHandlers) => {
    // console.log("i executed with f", foodHandlers);
    if (foodHandlers <= 50) return 0.5;
    if (foodHandlers <= 100) return 1;
    if (foodHandlers <= 300) return 1.5;
    if (foodHandlers <= 600) return 2.5;
    if (foodHandlers <= 1000) return 3;
    return 3;
  };

  const calculateStorageManDays = (area) => {
    //  console.log("i executed with A", area);
    if (area < 15000) return 0.5;
    if (area >= 15000 && area <= 50000) return 1;
    if (area > 50000) return 1.5;
    return 0;
  };

  const calculateVehicleManDays = (noOfVehicles) => {
    //  console.log("i executed with v", noOfVehicles);
    if (noOfVehicles <= 2) return 0.5;
    if (noOfVehicles >= 3 && noOfVehicles <= 5) return 1;
    if (noOfVehicles >= 6 && noOfVehicles <= 7) return 1.5;
    if (noOfVehicles >= 8 && noOfVehicles <= 10) return 2;
    return 2;
  };

  const handleInputChange = (index, field, value) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const currentItem = newItems[index];

      if (field === "outletId") {
        if (value === "others") {
          newItems[index] = {
            ...currentItem,
            outletId: value,
            outlet_name: "Others",
            no_of_food_handlers: 0,
            man_days: 0,
            unit_cost: 0,
            discount: 0,
            amount: 0,
          };
        } else {
          const selectedOutlet = outlets.find((outlet) => outlet._id === value);
          newItems[index] = {
            ...currentItem,
            outletId: value,
            outlet_name: selectedOutlet ? selectedOutlet.branch_name : "",
            no_of_food_handlers: selectedOutlet
              ? selectedOutlet.no_of_food_handlers
              : 0,
            man_days: 0,
            unit_cost: 0,
            discount: 0,
            amount: 0,
          };
        }
      } else if (field === "service") {
        newItems[index] = {
          ...currentItem,
          service: value,
        };

        // Recalculate man_days based on selected service type
        if (value === "no_of_food_handlers") {
          newItems[index].man_days = calculateManDays(
            newItems[index].no_of_food_handlers
          );
        } else if (value === "vehicle") {
          newItems[index].man_days = calculateVehicleManDays(
            newItems[index].no_of_food_handlers
          );
        } else if (value === "area") {
          newItems[index].man_days = calculateStorageManDays(
            newItems[index].no_of_food_handlers
          );
        }
      } else {
        newItems[index] = {
          ...currentItem,
          [field]: value,
        };

        // Recalculate man_days if relevant field changes
        if (field === "no_of_food_handlers") {
          const service = newItems[index].service || "No of Food Handlers";
          if (service === "no_of_food_handlers") {
            newItems[index].man_days = calculateManDays(value);
          } else if (service === "vehicle") {
            newItems[index].man_days = calculateVehicleManDays(value);
          } else if (service === "area") {
            newItems[index].man_days = calculateStorageManDays(value);
          }
        }
      }

      // Recalculate amount
      if (field === "quantity" || field === "unit_cost") {
        newItems[index].amount =
          newItems[index].quantity * newItems[index].unit_cost;
      }

      // Recalculate totals
      calculateTotals(newItems);

      return newItems;
    });
  };

  const calculateTotals = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      setSubTotal(0);
      setSgst(0);
      setCgst(0);
      setTotal(0);
      return;
    }

    // Calculate subtotal by summing up all amounts
    const calculatedSubTotal = items.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );

    const calculatedIgst = calculatedSubTotal * 0.09;
    const calculatedCgst = calculatedSubTotal * 0.09;
    const calculatedTotal =
      calculatedSubTotal + calculatedIgst + calculatedCgst;

    setSubTotal(calculatedSubTotal);
    setSgst(calculatedIgst);
    setCgst(calculatedCgst);
    setTotal(calculatedTotal);
  };

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
          <Option value="others">Others</Option>
          {outlets.map((outlet) => (
            <Option key={outlet._id} value={outlet._id}>
              {outlet.branch_name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text, record, index) => {
        const isOthers = record.outletId === "others";
        return isOthers ? (
          <Input
            value={text}
            onChange={(e) =>
              handleInputChange(index, "description", e.target.value)
            }
            className="w-full"
          />
        ) : (
          <Select
            value={text}
            className="w-full"
            style={{ width: 120 }}
            onChange={(value) => handleInputChange(index, "description", value)}
          >
            <Option value="TPA">TPA</Option>
            <Option value="Hygiene Rating">Hygiene Rating</Option>
            <Option value="ER Station">ER Station</Option>
            <Option value="ER Fruit and Vegetable Market">
              ER Fruit and Vegetable Market
            </Option>
            <Option value="ER Hub">ER Hub</Option>
            <Option value="ER Campus">ER Campus</Option>
            <Option value="ER Worship Place">ER Worship Place</Option>
          </Select>
        );
      },
    },
    {
      title: "Service",
      dataIndex: "service",
      render: (text, record, index) => {
        const isOthers = record.outletId === "others";
        return isOthers ? (
          <Input
            value={text}
            onChange={(e) =>
              handleInputChange(index, "service", e.target.value)
            }
            className="w-full"
          />
        ) : (
          <Select
            value={text}
            className="w-full"
            style={{ width: 120 }}
            onChange={(value) => handleInputChange(index, "service", value)}
          >
            <Option value="no_of_food_handlers">Food Handlers</Option>
            <Option value="vehicle">Vehicle</Option>
            <Option value="area">Area</Option>
          </Select>
        );
      },
    },
    {
      title: "Man Days",
      dataIndex: "man_days",
      render: (text, record, index) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => handleInputChange(index, "man_days", value)}
          className="w-full"
        />
      ),
    },
    {
      title: "QTY",
      dataIndex: "quantity",
      render: (text, record, index) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => handleInputChange(index, "quantity", value)}
          className="w-full"
        />
      ),
    },
    {
      title: "Unit Cost(₹) ",
      dataIndex: "unit_cost",
      render: (text, record, index) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => handleInputChange(index, "unit_cost", value)}
          className="w-full"
        />
      ),
    },
    {
      title: "Amount(₹)",
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
        <Button
          onClick={() => removeItem(index)}
          type="link"
          danger
          icon={<DeleteOutlined />}
        />
      ),
    },
  ];

  const handleOk = () => {
    setShowSendMailModal(false);
  };

  return (
    <>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        style={{ padding: "0 !important" }}
        className="acc-modal"
      >
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
          <div
            className="text-center align-middle font-medium text-xl title-div bg-blue-50 p-7"
            style={{ boxShadow: "0 4px 2px -2px lightgrey" }}
          >
            Generate Proposal
          </div>
          <div
            className="px-8 pt-4 pb-8"
            style={{ backgroundColor: "#F6FAFB" }}
          >
            <div className="text-center font-medium text-xl mb-5 rounded-md">
              Document Preview
            </div>
            <div className="flex space-x-4">
              <Form.Item
                label="FBO name (Business Name)"
                name="fbo_name"
                className="flex-1"
                rules={[
                  {
                    required: true,
                    message: "Please input the business name!",
                  },
                ]}
              >
                <Input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </Form.Item>
              <Form.Item label="Proposal date" className="flex-1" size="large">
                <DatePicker className="w-full" value={proposal_date} disabled />
              </Form.Item>
              <Form.Item
                label="Proposal number"
                name="proposal_number"
                className="flex-1"
              >
                <Input
                  placeholder="Auto Generated"
                  className="w-full p-2 border border-gray-300 rounded"
                  readOnly
                />
              </Form.Item>
            </div>
            <Form.Item label="Address">
              <Input.Group>
                <Form.Item
                  name={["address", "line1"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input the address line 1!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </Form.Item>
                <Form.Item name={["address", "line2"]}>
                  <Input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
            <div className="flex space-x-4">
              <Form.Item
                label="Pincode"
                name="pincode"
                className="flex-1"
                rules={[
                  { required: true, message: "Please input the pincode!" },
                ]}
              >
                <Input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </Form.Item>
              <Form.Item
                label="GST Number"
                name="gst_number"
                className="flex-1"
                rules={[
                  { required: true, message: "Please input the GST number!" },
                ]}
              >
                <Input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </Form.Item>
            </div>
            <div className="flex space-x-4">
              <Form.Item
                label="Contact Person Name"
                name="contact_person"
                className="flex-1"
                rules={[
                  {
                    required: true,
                    message: "Please input the contact person name!",
                  },
                ]}
              >
                <Input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </Form.Item>
              <Form.Item
                label="Contact Person Number"
                name="phone"
                className="flex-1"
                rules={[
                  {
                    required: true,
                    message: "Please input the contact person number!",
                  },
                ]}
              >
                <Input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </Form.Item>
            </div>
            <Form.Item
              name="assigned_auditor"
              label="Assigned Auditor"
              rules={[{ required: true, message: "Please select an auditor!" }]}
            >
              <Select placeholder="Select an auditor">
                {auditors.map((auditor) => (
                  <Option key={auditor._id} value={auditor._id}>
                    {auditor.auditor_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div>
              <Form.Item label="Note" name="note" className="flex-1">
                <TextArea
                  className="w-full p-2 border border-gray-300 rounded"
                  defaultValue="This is note"
                />
              </Form.Item>
            </div>

            <div className="my-4">
              <h3 className="text-lg font-semibold mb-2">Items table</h3>
              <Table
                dataSource={outletItem}
                columns={columns}
                pagination={false}
              />
              <button
                type="button"
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
                <div className="text-sm font-medium">IGST (9%):</div>
                <div className="text-sm font-medium">
                  {sgst.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">CGST (9%):</div>
                <div className="text-sm font-medium">
                  {cgst.toLocaleString("en-IN", {
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
                htmlType="submit"
              >
                Generate
              </button>
            </div>
          </div>
        </Form>
      </Modal>

      <GenreateSuccessSendMailTableModal
        onClose={() => setShowSendMailModal(false)}
        id={prosposalId}
        onOk={handleOk}
        title="Generate Proposal"
        name="proposal"
        route="generateProposal"
        visible={showSendMailModal}
      />
    </>
  );
};

export default GenerateProposalModal;
