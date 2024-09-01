import React, { useState, useEffect } from "react";
import {
  Modal,
  DatePicker,
  Form,
  Input,
  Table,
  message,
  Select,
  Button,
} from "antd";
import axios from "axios";
import "../css/GenerateProposalModal.css";
import GenreateSuccessSendMailTableModal from "./GenreateSuccessSendMailTableModal";
import moment from "moment";

const { Option } = Select;

const UpdateGenerateInvoiceModal = ({ visible, onOk, onCancel, proposalId }) => {
  const [form] = Form.useForm();
  const [showSendMailModal, setShowSendMailModal] = useState(false);
  const [selectedOutlets, setSelectedOutlets] = useState([]);
  const [items, setItems] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState([]);
  const [InvoiceId, setInvoiceId] = useState([]);
  const [initialValuesLoaded, setInitialValuesLoaded] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState(moment());
  const [phone, setPhone] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (visible) {
      setInvoiceDate(moment());

   
      // Fetch outlets when the modal is visible
    axios
    .get(`/api/proposal/getOutletsByProposalId/${proposalId}`)
    .then((response) => {
      setOutlets(response.data.map((outlet) => {
        const _id=outlet._id
        const type_of_industry = outlet.type_of_industry || "";
        const unit = outlet.unit || 0;
        const man_days = outlet.man_days || 0;
        const quantity = outlet.quantity || 0;
        const unit_cost = outlet.unit_cost || 0;
        const description= outlet.description || 0;

        // Calculate amount based on quantity, unit cost, and man_days
        const amount = outlet.amount || 0;

        let postfix = "";
        switch (type_of_industry) {
          case "Transportation":
            postfix = "VH";
            break;
          case "Catering":
            postfix = "FH";
            break;
          case "Trade and Retail":
            postfix = "Sq ft";
            break;
          case "Manufacturing":
            postfix = "PD/Line";
            break;
          default:
            postfix = ""; // or any default value
        }

        return {
          outletId: outlet._id || "",
          outlet_name: outlet.outlet_name || "",
          type_of_industry,
          unit,
          man_days,
          quantity,
          description,
          unit_cost,
          amount,
          _id,
          service: `${unit} ${postfix}`
        };
      }));
    })
    .catch((error) => {
      console.error("Error fetching outlets:", error);
    });
      // Fetch proposal data to initialize the form
      axios
        .get(`/api/invoice/getProposalById/${proposalId}`)
        .then((response) => {
          const {
            address,
            fbo_name,
            proposal_date,
            proposal_number,
            pincode,
            phone,
            email,
          } = response.data;
          console.log(email);
          setEmail(email);
          setPhone(phone);
          form.setFieldsValue({
            address,
            fbo_name,
            proposal_date: proposal_date ? moment(proposal_date) : null,
            proposal_number,
            pincode,
          });
          setInitialValuesLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching proposal data:", error);
        });

      // Fetch invoice number
      const fetchInvoiceId = async () => {
        try {
          const response = await axios.get(
            "/api/invoice/generateInvoiceNumber"
          );
          setInvoiceNumber(response.data.invoice_number);
        } catch (error) {
          console.error("Error fetching InvoiceId", error);
        }
      };

      fetchInvoiceId();
    }
  }, [visible, proposalId, form]);

  const handleCancel = () => {
    onCancel();
    form.resetFields();
    setItems([]);
    setOutlets([]);
    setSelectedOutlets([]);
   
  };

  const handleSelect = (record, selected) => {
    const updatedSelectedOutlets = selected
      ? [...selectedOutlets, record]
      : selectedOutlets.filter((outlet) => outlet._id !== record._id);
    setSelectedOutlets(updatedSelectedOutlets);
  };

  const handleSelectAll = (selected, selectedRows) => {
    const validSelectedRows = selectedRows.filter((row) => row && row._id);
    setSelectedOutlets(selected ? validSelectedRows : []);
  };

  const handleNext = () => {
    const selectedItems = selectedOutlets.map((outlet) => {
      let postfix = "";

      switch (outlet.type_of_industry) { // assuming record refers to outlet
        case "Transportation":
          postfix = "VH";
          break;
        case "Catering":
          postfix = "FH";
          break;
        case "Trade and Retail":
          postfix = "Sq ft";
          break;
        case "Manufacturing":
          postfix = "PD/Line";
          break;
        default:
          postfix = ""; // or any default value
      }

      return {
        _id: outlet._id,
        outlet_name: outlet.outlet_name,
        description: outlet.description,
        man_days: outlet.man_days,
        unit_cost: outlet.unit_cost,
        quantity: outlet.quantity,
        discount: outlet.discount,
        amount: outlet.amount,
        service: outlet.unit + " " + postfix // Assuming 'unit' is a property of the outlet object
      };
    });

    setItems(selectedItems);
  
  };


  const handleSubmit = async () => {
    try {
      // Validate the form fields
      await form.validateFields();

      // Collect form values
      const formData = form.getFieldsValue();

      // Prepare the data to be sent
      const invoiceData = {
        ...formData,
        proposalId,
        outlets: items,
        invoice_number: invoiceNumber,
        invoice_date: invoiceDate,
        email: email,
        phone: phone,
      };

      // Send the request and wait for the response
      const response = await axios.post(
        "/api/invoice/createInvoice",
        invoiceData
      );

      // Check if the response is successful based on status code
      if (response.status === 201 && response.data && response.data.data) {
        message.success("Invoice generated successfully");
        form.resetFields();
   
        onCancel();
        setInvoiceId(response.data.data._id);
        setShowSendMailModal(true);
      } else {
        message.error("Failed to generate invoice");
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      message.error(
        `Error generating invoice: ${error.response?.data?.message || error.message
        }`
      );
    }
  };
  const calculateTotals = () => {
 
    const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
    //console.log("Sub total is"+subTotal);
    const tax = subTotal * 0.09;
    const total = subTotal + 2 * tax;
    return { subTotal, tax, total };
  };
  

  const { subTotal, tax, total } = calculateTotals();

  const outletsColumns = [
    {
      title: "Outlet Name",
      dataIndex: "outlet_name",
      key: "outlet_name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Man Days",
      dataIndex: "man_days",
      key: "man_days",
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
      dataIndex: "outlet_name",
      key: "outlet_name",
      render: (value) => <span className=" block">{value}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (value) => <span className=" block">{value}</span>,
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      render: (value) => <span className=" block">{value}</span>,
    },
    {
      title: "Man Days",
      dataIndex: "man_days",
      key: "man_days",
      render: (value) => <span className=" block">{value}</span>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "",
      render: (value) => <span className=" block">{value}</span>,
    },
    {
      title: "Unit Cost",
      dataIndex: "unit_cost",
      key: "unit_cost",
      render: (value) => <span className=" block">{value}</span>,
    },

    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span className=" block">
          {amount.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}
        </span>
      ),
    },
  ];
  const statesAndUTs = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry",
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
        width={900}
        className="acc-modal"
      >
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
          <div
            className="text-center align-middle font-medium text-xl bg-blue-50 p-7"
            style={{ boxShadow: "0 4px 2px -2px lightgrey" }}
          >
            Generate Invoice
          </div>
          
            <div className="p-6" style={{ backgroundColor: "#F6FAFB" }}>
              <div className="text-center font-medium text-xl mb-5 rounded-md">
                Invoice Details
              </div>
              <Form.Item
                label="FBO name (Business Name)"
                name="fbo_name"
                className="flex-1"
                rules={[{ required: true, message: "Please enter FBO name!" }]}
              >
                <Input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </Form.Item>
              <div className="flex space-x-4">
                <Form.Item
                  label="Invoice date"
                  className="flex-1"
                  size="large"
                  rules={[
                    { required: true, message: "Please select invoice date!" },
                  ]}
                >
                  {" "}

                  <DatePicker value={invoiceDate} className="w-full" />
                </Form.Item>
                <Form.Item
                  label="Proposal number (Order Ref No.)"
                  className="flex-1"
                  name="proposal_number"
                  rules={[
                    { required: true, message: "Proposal number is required!" },
                  ]}
                >
                  <Input
                    placeholder="Auto Generated"
                    className="w-full p-2 border border-gray-300 rounded"
                    readOnly
                  />
                </Form.Item>
                <Form.Item
                  label="Invoice number"
                  className="flex-1"
                  rules={[
                    { required: true, message: "Invoice number is required!" },
                  ]}
                >
                  <Input
                    value={invoiceNumber}
                    placeholder="Auto Generated"
                    className="w-full p-2 border border-gray-300 rounded"
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
                        message: "Please enter address line 1!",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </Form.Item>
                  <Form.Item
                    name={["address", "line2"]}
                    rules={[
                      {
                        required: true,
                        message: "Please enter address line 2!",
                      },
                    ]}
                  >
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
                  rules={[{ required: true, message: "Please enter pincode!" }]}
                >
                  <Input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </Form.Item>
                <Form.Item
                  name="place_of_supply"
                  label="Place of Supply"
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Please select place of supply!",
                    },
                  ]}
                >
                  <Select placeholder="Select place of supply">
                    {statesAndUTs.map((state) => (
                      <Option key={state} value={state}>
                        {state}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="flex space-x-4">
                <Form.Item
                  label="Field Executive Name"
                  name="field_executive_name"
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Please enter field executive name!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </Form.Item>
                <Form.Item
                  label="Team Leader Name"
                  name="team_leader_name"
                  className="flex-1"
                  rules={[
                    {
                      required: true,
                      message: "Please enter team leader name!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </Form.Item>
              </div>
              <div className="my-4">
                <h3 className="text-lg font-semibold mb-2">Items Table</h3>
                <Table
                  dataSource={items}
                  columns={itemsColumns}
                  pagination={false}
                  rowKey={(item) => item.outlet_name}
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
                    {(tax ).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">SGST [9%]:</div>
                  <div className="text-sm font-medium">
                    {(tax).toLocaleString("en-IN", {
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
        onClose={() => {
          setShowSendMailModal(false);
          setSelectedOutlets([]);
        }}
        id={InvoiceId}
        onOk={handleOk}
        title="Generate Invoice"
        name="invoice"
        route="generateInvoice"
        visible={showSendMailModal}
        buttonTitle="Go to Invoice"
      />
    </>
  );
};

export default UpdateGenerateInvoiceModal;
