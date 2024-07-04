import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Dropdown, Menu } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  MoreOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { NavLink } from "react-router-dom";
import OutletForm from "./OutletForm";
import UpdateOutletForm from "./UpdateOutletForm";
import toast from "react-hot-toast";

const { confirm } = Modal;

const UpdateOutlet = ({ businessId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); // State for update modal visibility
  const [flattenedTableData, setFlattenedTableData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentOutletId, setCurrentOutletId] = useState(null); // State to store current outlet ID
  const navigate = useNavigate();
  const location = useLocation();
  const [selectionType, setSelectionType] = useState("checkbox");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 2,
    },
  });

  useEffect(() => {
    fetchData();
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setFlattenedTableData([]);
    }
  };

  const fetchData = () => {
    setLoading(true);
    const url = `/getOutletDetails/${businessId}`;

    axios
      .get(url, {
        params: {
          page: tableParams.pagination?.current,
          pageSize: tableParams.pagination?.pageSize,
        },
      })
      .then((response) => {
        const { data } = response;
        const { data: responseData, total } = data;

        const flattenedData = responseData.map((row, index) => ({
          ...row,
          key: `${row._id}`,
        }));
        setFlattenedTableData(flattenedData);

        setTableParams((prevState) => ({
          ...prevState,
          pagination: {
            ...prevState.pagination,
            total: total,
          },
        }));

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
  });

  const handleOk = () => {
    fetchData();
    setIsModalVisible(false);
    setIsUpdateModalVisible(false); // Close update modal
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsUpdateModalVisible(false); // Close update modal
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showUpdateModal = (outletId) => {
    setCurrentOutletId(outletId); // Set the current outlet ID
    setIsUpdateModalVisible(true);
  };

  const handleSubmit = () => {
    const formId = location.pathname.split("/")[2];

    if (location.pathname.startsWith("/client-onboarding") && formId) {
      navigate(`/client-success/${formId}`);
    } else {
      navigate("/");
      toast.success("Successfully Saved");
    }
  };

 const columns = [
    {
      title: "Branch Name",
      dataIndex: "branch_name",
      key: "branch_name",
    },
    {
      title: "FSSAI No",
      dataIndex: " fssai_license_number",
      key: " fssai_license_number",
    },
    {
      title: "No of Food Handlers",
      dataIndex: "no_of_food_handlers",
      key: "no_of_food_handlers",
    },
    {
      title: "Vertical of industry",
      dataIndex: "Vertical_of_industry",
      key: "Vertical_of_industry",
    },
    {
      title: "Contact Number",
      dataIndex: "contact_number",
      key: "contact_number",
    },
    {
      title: "Contact Person",
      dataIndex: "contact_person",
      key: "contact_person",
    },
    {
      title: "GST NO.",
      dataIndex: "gst_number",
      key: "gst_number",
    },
  
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (_, record) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <Button type="link" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const menu = (record) => (
    <Menu>
      <Menu.Item
        key="update"
        onClick={() => showUpdateModal(record._id)} // Pass outlet ID to showUpdateModal
      >
        View
      </Menu.Item>
    
    </Menu>
  );

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
      console.log("Selected rows:", selectedRows);
      console.log("Selected keys:", selectedRowKeys);
    },
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure you want to delete the selected outlets?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        const selectedIds = selectedRows.map((row) => row._id);
        axios
          .delete(`/deleteOutletFields`, { data: selectedIds })
          .then(() => {
            fetchData();
            setSelectedRowKeys([]);
            setSelectedRows([]);
            toast.success("Successfully Deleted");
          })
          .catch((error) => {
            console.error("Error deleting outlets:", error);
          });
      },
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center m-6">
        <h2 className="text-lg font-semibold">Outlet List</h2>
        <div className="space-x-2">
          <Button
            type="danger"
            shape="round"
            icon={<DeleteOutlined />}
            onClick={showDeleteConfirm}
            disabled={selectedRows.length === 0}
          >
            Delete
          </Button>
          <Button
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            onClick={showModal}
          >
            Add Outlet
          </Button>
        </div>
      </div>
      <div className="m-6">
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={flattenedTableData}
          rowKey={(record) => record.key}
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </div>

      <OutletForm
        businessId={businessId}
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        model={{ businessId }}
      />

      <UpdateOutletForm
        isModalVisible={isUpdateModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        outletId={currentOutletId} // Pass current outlet ID to UpdateOutletForm
        businessId={businessId}
      />

      <div className="fixed bottom-0 z-50 bg-white w-full py-4 px-6 flex justify-start shadow-top">
        <NavLink to="/">
          <Button className="border-primary  text- border-2 font-semibold">
            Cancel
          </Button>
        </NavLink>
        <Button
          type="primary"
          className="ml-6"
          htmlType="submit"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default UpdateOutlet;
