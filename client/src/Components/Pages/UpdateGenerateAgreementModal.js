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
import dayjs from "dayjs";

const UpdateGenerateAgreementModal = ({
  visible,
  onOk,
  onCancel,
  proposalId,
  agreementIds,
}) => {
  const [selectedOutlets, setSelectedOutlets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agreementId, setAgreementId] = useState(null); // Initialize as null
  const [showSendMailModal, setShowSendMailModal] = useState(false);
  const [disableOutlets, setdisableOutlet] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      setLoading(true);

      // Fetch outlets by proposal ID
      axios
        .get(`/api/proposal/getOutletsByProposalId/${proposalId}`)
        .then((response) => {
          const outletsData = response.data.map((outlet) => ({
            ...outlet,
            _id: outlet._id || outlet.id, // Ensure _id exists, fallback to id if needed
          }));

          console.log("Fetched outlets:", outletsData); // Debug log
          setOutlets(outletsData); // Initialize outlets with the correct _id field
          setLoading(false);
        })
        .catch((error) => {
          message.error("Failed to fetch outlets");
          setLoading(false);
        });

      // Fetch agreement data by agreement ID
      axios
        .get(`/api/agreement/getAgreementById/${agreementIds}`)
        .then((response) => {
          const { address, fbo_name, from_date, period, outlets } =
            response.data;

          console.log("Fetched agreement outlets:", outlets); // Debug log
          setSelectedOutlets(outlets); // Directly set the selected outlets

          // Console log selected outlets
          console.log("Selected outlets:", outlets);

          // Set form values
          form.setFieldsValue({
            fbo_name,
            address,
            period,
            from_date: moment(from_date),
            to_date: moment(from_date).add(period, "months"),
            total_outlet: outlets.length, // Set the total number of outlets
          });

          calculateTotalAmount(outlets); // Calculate the total amount based on the selected outlets
        })
        .catch((error) => {
          console.error("Error fetching agreement data:", error);
          message.error("Error fetching agreement data");
        });

      
    }

    const fetchFilteredAgreement = async () => {
      try {
        const response = await axios.get(`/api/proposal/getFilteredAgreements/${agreementIds}`);
        if (response.data.success) {
          setdisableOutlet(response.data.outletIds);
        } 
      } catch (err) {
        console.error("Error is fetching the profile state");
      } 
    };

    fetchFilteredAgreement();

  }, [proposalId, visible, form]);

  const outletsColumns = [
    {
      title: "Outlet name",
      dataIndex: "outlet_name",
    },
    {
      title: "Description",
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
      formData.proposalId = proposalId;
      formData.outlets = selectedOutlets;

      const response = await axios.put(
        `/api/agreement/updateAgreement/${agreementIds}`,
        formData
      );
      setAgreementId(response.data.data._id);
      setShowForm(false);

      message.success("Agreement updated successfully");
      onCancel();
      form.resetFields();
      onOk();
    } catch (error) {
      console.error("Error updating agreement:", error);
      message.error("Error updating agreement");
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
    setSelectedOutlets([]);
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
            Update Agreement
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
                  selectedRowKeys: selectedOutlets.map((outlet) => outlet._id), // Ensure this maps the correct keys
                  onSelect: handleSelect,
                  onSelectAll: handleSelectAll,
                  getCheckboxProps: (record) => ({
                    disabled: disableOutlets.includes(record._id), // Disable rows if record._id exists in disableOutlets
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="From date"
                  name="from_date"
                  getValueProps={(i) => ({ value: dayjs(i) })}
                  rules={[
                    { required: true, message: "Please select from date!" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select date"
                    format="DD-MM-YYYY"
                    allowClear={false}
                  />
                </Form.Item>
                <Form.Item
                  label="To date"
                  name="to_date"
                  rules={[
                    { required: true, message: "Please select to date!" },
                  ]}
                >
                  <DatePicker className="w-full" format="DD-MM-YYYY" disabled />
                </Form.Item>
              </div>
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
              <div className="flex justify-center">
                <Button
                  htmlType="submit"
                  className="bg-buttonModalColor text-white rounded"
                >
                  Update
                </Button>
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default UpdateGenerateAgreementModal;
