import React, { useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, message, Spin } from "antd";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const { Option } = Select;

const AddProposal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [isClientSelected, setIsClientSelected] = useState(false);
  const [clients, setClients] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingOutlets, setLoadingOutlets] = useState(false);

  useEffect(() => {
    // Generate the proposal number on form initialization
    form.setFieldsValue({
      proposalNumber: uuidv4(),
    });

    // Fetch client names
    setLoadingClients(true);
    axios
      .get("/getAllBussinessName")
      .then((response) => {
        setClients(response.data.businesses);
        setLoadingClients(false);
      })
      .catch((error) => {
        message.error("Failed to fetch clients");
        setLoadingClients(false);
        console.error(error);
      });
  }, [form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Received values:", values);
        // Handle form submission
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  const handleClientChange = (value) => {
    setIsClientSelected(!!value);
    setOutlets([]);

    if (value) {
      setLoadingOutlets(true);
      // Fetch outlets for the selected client
      axios
        .get(`/getBranchNamesByBussinessId/${value}`)
        .then((response) => {
          setOutlets(response.data);
          setLoadingOutlets(false);
        })
        .catch((error) => {
          message.error("Failed to fetch outlets");
          setLoadingOutlets(false);
          console.error(error);
        });
    }
  };

  return (
    <Modal
      title="Proposal Preview"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          proposalDate: moment(),
          proposalNumber: uuidv4(),
        }}
      >
        <div className="flex justify-between">
          <div className="w-1/2">
            <Form.Item
              name="clientName"
              label="Client"
              rules={[{ required: true, message: "Please select a client" }]}
            >
              <Select
                placeholder="Client Name"
                onChange={handleClientChange}
                loading={loadingClients}
                notFoundContent={loadingClients ? <Spin size="small" /> : null}
              >
                {clients.map((client) => (
                  <Option key={client._id} value={client._id}>
                    {client.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div>
            <Form.Item name="proposalDate" label="Proposal Date">
              <DatePicker disabled />
            </Form.Item>
          </div>
        </div>

        <div className="w-1/2">
          <Form.Item
            name="outlet"
            label="Select outlet"
            rules={[{ required: true, message: "Please select an outlet" }]}
          >
            <Select
              placeholder="Search Outlet"
              disabled={!isClientSelected}
              loading={loadingOutlets}
              notFoundContent={loadingOutlets ? <Spin size="small" /> : null}
            >
              {outlets.map((outlet) => (
                <Option key={outlet._id} value={outlet._id}>
                  {outlet.branchName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Form.Item name="proposalNumber" label="Proposal Number">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="foodHandlers"
          label="No of food handlers"
          rules={[
            {
              required: true,
              message: "Please select the number of food handlers",
            },
          ]}
        >
          <Select placeholder="Select number of food handlers">
            <Option value="0-50">0 - 50</Option>
            <Option value="50-100">50 - 100</Option>
            <Option value="moreThan100">More than 100</Option>
          </Select>
        </Form.Item>

        <Form.Item name="location" label="Location">
          <Input placeholder="Location of selected outlet" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProposal;
