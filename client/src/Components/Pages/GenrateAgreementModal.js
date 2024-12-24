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
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import GenreateSuccessSendMailTableModal from "./GenreateSuccessSendMailTableModal";
import { useNavigate } from "react-router-dom";
import { set } from "lodash";

// Extend dayjs with customParseFormat
dayjs.extend(customParseFormat);

const GenerateAgreementModal = ({ visible, onOk, onCancel, proposalId }) => {
  const [selectedOutlets, setSelectedOutlets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agreementId, setAgreementId] = useState(null);
  const [showSendMailModal, setShowSendMailModal] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [agreements, setAgreements] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (visible) {
      setLoading(true);

      axios
        .get(`/api/agreement/getAgreementsByProposalId/${proposalId}`)
        .then((response) => {
          setAgreements(response.data.agreements);
        })
        .catch((error) => {
          setLoading(false);
        });

      axios
        .get(`/api/proposal/getOutletsByProposalId/${proposalId}`)
        .then((response) => {
          setOutlets(response.data);
          setIsFetching(false);
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
          });
        })
        .catch((error) => {
          console.error("Error fetching proposal data:", error);
        });
    }
  }, [proposalId, visible, form]);

  const handleViewAgreement = (agreementId) => {
    navigate(`/agreement/view-agreement/${agreementId}`); // Use navigate to redirect
  };
  const outletsColumns = [
    {
      title: "Outlet name",
      dataIndex: "outlet_name",
    },
    {
      title: "Service",
      dataIndex: "description",
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
    const fromDate = form.getFieldValue("from_date") || dayjs();
    console.log("this is the from Date", fromDate);
    if (value) {
      const toDate = fromDate.add(value, "months");
      form.setFieldsValue({ to_date: toDate });
    }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();

      const formData = form.getFieldsValue();
      formData.total_cost = totalAmount;
      formData.no_of_outlets = selectedOutlets.length;
      formData.proposalId = proposalId;
      formData.outlets = selectedOutlets;

      const response = await axios.post(
        "/api/agreement/createAgreement",
        formData
      );
      setAgreementId(response.data.data._id);
      setShowSendMailModal(true);

      message.success("Agreement generated successfully");

      setShowForm(false);

      form.resetFields();
    setAgreements([]);
    setSelectedOutlets([]);
      onOk();
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
    setSelectedOutlets([]);
    setShowForm(false);
    setAgreements([]);
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
        <Spin spinning={isFetching}>
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <div
              className="text-center align-middle font-medium text-xl bg-blue-50 p-4"
              style={{ boxShadow: "0 4px 2px -2px lightgrey" }}
            >
              Generate Agreement
            </div>
            {!showForm ? (
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
                    selectedRowKeys: selectedOutlets.map(
                      (outlet) => outlet._id
                    ),
                    onSelect: handleSelect,
                    onSelectAll: handleSelectAll,
                    getCheckboxProps: (record) => ({
                      disabled: record.is_agreement === true, // Disable if is_agreement is true
                    }),
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
                {agreements.length > 0 && (
                  <div className="mt-4">
                    <div className="text-center font-medium text-xl mb-5 rounded-md">
                      Generated Agreements
                    </div>
                    <ul className="agreement-list">
                      {agreements.map((agreement) => (
                        <li
                          key={agreement._id}
                          className="flex justify-around items-center mb-2"
                        >
                          <span>{agreement.fbo_name}</span>
                          <Button
                            type="link"
                            onClick={() => handleViewAgreement(agreement._id)}
                            className="text-blue-600"
                          >
                            View
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6" style={{ backgroundColor: "#F6FAFB" }}>
                <div className="text-center font-medium text-xl mb-5 rounded-md">
                  Document Preview
                </div>
                <Form.Item
                  label="FBO name (Business Name)"
                  name="fbo_name"
                  rules={[
                    { required: true, message: "Please enter FBO name!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="From date" name="from_date">
                    <DatePicker
                      value={form.getFieldValue("from_date") || dayjs()} // Sync with form state
                      format="DD/MM/YYYY"
                      className="w-full"
                      onChange={(date) =>
                        form.setFieldsValue({ from_date: date })
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="To date"
                    name="to_date"
                    rules={[
                      { required: true, message: "Please select to date!" },
                    ]}
                  >
                    <DatePicker
                      className="w-full"
                      format="DD/MM/YYYY"
                      disabled
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  label="Period (Months)"
                  name="period"
                  rules={[{ required: true, message: "Please enter period!" }]}
                >
                  <Input
                    type="number"
                    onChange={(e) => handlePeriodChange(e.target.value)} // Call handlePeriodChange
                  />
                </Form.Item>
                <Form.Item
                  label="FBO Address"
                  name="address"
                  rules={[
                    { required: true, message: "Please enter FBO address!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="No of Outlets" name="total_outlet">
                    <Input readOnly />
                  </Form.Item>
                  <Form.Item
                    label="Total Cost"
                    rules={[
                      { required: true, message: "Total cost is required!" },
                    ]}
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
        </Spin>
      </Modal>

      {showSendMailModal && (
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
      )}
    </>
  );
};

export default GenerateAgreementModal;
