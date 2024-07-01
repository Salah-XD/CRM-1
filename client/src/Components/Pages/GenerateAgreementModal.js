import React, { useState } from "react";
import { Modal, Table, Checkbox, Button } from "antd";

const GenerateAgreementModal = ({ visible, onCancel }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const dataSource = [
    {
      key: "1",
      outletName: "Outlet 1",
      foodHandlers: 50,
      manDays: 0.5,
      cost: "₹4000",
    },
    {
      key: "2",
      outletName: "Outlet 2",
      foodHandlers: 100,
      manDays: 1,
      cost: "₹8000",
    },
    {
      key: "3",
      outletName: "Outlet 3",
      foodHandlers: 75,
      manDays: 1,
      cost: "₹8000",
    },
    {
      key: "4",
      outletName: "Outlet 4",
      foodHandlers: 45,
      manDays: 0.5,
      cost: "₹4000",
    },
  ];

  const columns = [
    {
      title: <Checkbox onChange={onSelectAllChange} />,
      dataIndex: "checkbox",
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.key)}
          onChange={() => onSelectChange(record.key)}
        />
      ),
    },
    {
      title: "Outlet Name",
      dataIndex: "outletName",
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
      title: "Cost",
      dataIndex: "cost",
    },
  ];

  const onSelectChange = (key) => {
    let newSelectedRowKeys = [...selectedRowKeys];
    if (newSelectedRowKeys.includes(key)) {
      newSelectedRowKeys = newSelectedRowKeys.filter((k) => k !== key);
    } else {
      newSelectedRowKeys.push(key);
    }
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedRowKeys(dataSource.map((item) => item.key));
    } else {
      setSelectedRowKeys([]);
    }
  };

  return (
    <Modal
      title="Generate Agreement"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="next" type="primary">
          Next
        </Button>,
      ]}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
      />
    </Modal>
  );
};

export default GenerateAgreementModal;
