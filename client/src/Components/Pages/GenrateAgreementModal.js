import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Table,
  Button,
  Input,
  DatePicker,
  message,
  Spin,
} from "antd";
import moment from "moment";
import axios from "axios";
import GenreateSuccessSendMailTableModal from "./GenreateSuccessSendMailTableModal";

const GenerateAgreementModal = ({ visible, onOk, onCancel, proposalId }) => {
  const [selectedOutlets, setSelectedOutlets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agreementId, setAgreementId] = useState(null); // Initialize as null
  const [showSendMailModal, setShowSendMailModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      setLoading(true);
      axios
        .get(`/api/proposal/getOutletsByProposalId/${proposalId}`)
        .then((response) => {
          setOutlets(response.data);
          setLoading(false);
        })
        .catch((error) => {
          message.error("Failed to fetch outlets");
          setLoading(false);
        });

      axios
        .get(`/api/invoice/getProposalById/${proposalId}`)
        .then((response) => {
          const { address, fbo_name } = response.data;
          form.setFieldsValue({
            fbo_name,
            address: `${address.line1} ${address.line2}`,
            from_date: moment(), // Set today's date as default
          });
        })
        .catch((error) => {
          console.error("Error fetching proposal data:", error);
        });
    }
  }, [proposalId, visible, form]);

  const outletsColumns = [
    {
      title: "Outlet name",
      dataIndex: "outlet_name",
    },
    {
      title: "No of Food Handlers",
      dataIndex: "no_of_food_handlers",
    },
    {
      title: "Man Days",
      dataIndex: "man_days",
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
      : selectedOutlets.filter((outlet) => outlet._id !== record._id);
    setSelectedOutlets(updatedSelectedOutlets);
    calculateTotalAmount(updatedSelectedOutlets);
    form.setFieldsValue({
      total_outlet: updatedSelectedOutlets.length,
    });
  };

  const handleSelectAll = (selected, selectedRows) => {
    const validSelectedRows = selected
      ? selectedRows.filter(
          (row) => row && row.amount !== undefined && row.amount !== null
        )
      : [];
    setSelectedOutlets(validSelectedRows);
    calculateTotalAmount(validSelectedRows);
    form.setFieldsValue({
      total_outlet: validSelectedRows.length,
    });
  };

  const calculateTotalAmount = (selectedOutlets) => {
    const total = selectedOutlets.reduce((sum, outlet) => {
      if (outlet && outlet.amount !== undefined && outlet.amount !== null) {
        return sum + outlet.amount;
      } else {
        return sum;
      }
    }, 0);
    setTotalAmount(total);
  };

  const handlePeriodChange = (value) => {
    const fromDate = form.getFieldValue("from_date");
    if (fromDate && value) {
      const toDate = moment(fromDate).add(value, "months");
      form.setFieldsValue({ to_date: toDate });
    }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();

      const formData = form.getFieldsValue();
      formData.total_cost = totalAmount;
      formData.no_of_outlets = selectedOutlets.length;
      onOk();
      const response = await axios.post("/api/agreement/createAgreement", formData);
      setAgreementId(response.data.data._id);
      console.log(response.data.data._id);
      setShowSendMailModal(true);
   
      message.success("Agreement generated successfully");
    } catch (error) {
      console.error("Error saving agreement:", error);
      message.error("Error generating agreement");
    }
  };

  const handleNext = () => {
    setShowForm(true);
    form.setFieldsValue({
      total_outlet: selectedOutlets.length,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    onCancel();
  };

  const handleOk = () => {
    setShowSendMailModal(false);
  };

  return (
    <>
    <Modal
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      className="acc-modal"
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <div
          className="text-center align-middle font-medium text-xl bg-blue-50 p-4"
          style={{ boxShadow: "0 4px 2px -2px lightgrey" }}
        >
          Generate Agreement
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Spin size="small" />
          </div>
        ) : !showForm ? (
          <div className="p-6" style={{ backgroundColor: "#F6FAFB" }}>
            <div className="text-center font-medium text-xl mb-5 rounded-md">
              Select outlets
            </div>
            <Table
              dataSource={outlets}
              columns={outletsColumns}
              pagination={false}
              rowKey={(record) => record._id}
              rowSelection={{
                selectedRowKeys: selectedOutlets.map((outlet) => outlet._id),
                onSelect: handleSelect,
                onSelectAll: handleSelectAll,
              }}
            />
            <div className="text-center mt-4">
              <Button
                className="bg-buttonModalColor text-white rounded"
                onClick={handleNext}
                disabled={selectedOutlets.length === 0}
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6" style={{ backgroundColor: "#F6FAFB" }}>
            <div className="text-center font-medium text-xl mb-5 rounded-md">
              Document Preview
            </div>
            <Form.Item
              label="FBO name (Business Name)"
              name="fbo_name"
              rules={[{ required: true, message: "Please enter FBO name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
                label="Period (Months)"
                name="period"
                rules={[{ required: true, message: "Please enter period!" }]}
              >
                <Input
                  type="number"
                  onChange={(e) => handlePeriodChange(e.target.value)}
                />
              </Form.Item>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           
              <Form.Item
                label="From date"
                name="from_date"
                rules={[
                  { required: true, message: "Please select from date!" },
                ]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
              <Form.Item
                label="To date"
                name="to_date"
                rules={[{ required: true, message: "Please select to date!" }]}
              >
                <DatePicker className="w-full" disabled />
              </Form.Item>
            </div>
            <Form.Item
              label="FBO Address"
              name="address"
              rules={[{ required: true, message: "Please enter FBO address!" }]}
            >
              <Input />
            </Form.Item>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="No of Outlets" name="total_outlet">
                <Input readOnly />
              </Form.Item>
              <Form.Item
                label="Total Cost"
                rules={[{ required: true, message: "Total cost is required!" }]}
              >
                <Input
                  value={`₹${totalAmount.toLocaleString("en-IN")}`}
                  readOnly
                />
              </Form.Item>
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
        )}
      </Form>
    </Modal>
         <GenreateSuccessSendMailTableModal
         onClose={() => setShowSendMailModal(false)}
         id={agreementId}
         onOk={handleOk}
         title="Generate Agreement"
         name="agreement"
         route="generateagreement"
         visible={showSendMailModal}
          buttonTitle="Go to Agreement"
       />
       </>
  );
};

export default GenerateAgreementModal;
