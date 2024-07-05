import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Checkbox, Space, Divider } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import { NavLink } from "react-router-dom";
import OutletForm from "./OutletForm";
import toast from "react-hot-toast";


const { confirm } = Modal;

const OutletDetail = ({ businessId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flattenedTableData, setFlattenedTableData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [selectionType, setSelectionType] = useState("checkbox");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 4,
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

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setFlattenedTableData([]);
    }
  };

  const fetchData = () => {
    setLoading(true);

    // Construct the URL with the businessId included in the path
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

        // Extract the data and total count from the server response
        const { data: responseData, total } = data;

        const flattenedData = responseData.map((row, index) => ({
          ...row,
          key: `${row._id}-${index}`, // Combine _id with index for a unique key
        }));
        setFlattenedTableData(flattenedData);

        // Update the pagination total with the total count of items from the server response
        setTableParams((prevState) => ({
          ...prevState,
          pagination: {
            ...prevState.pagination,
            total: total, // Set the total count from the server response
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
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    // Extract the formId from the pathname
    const formId = location.pathname.split("/")[2]; // Assuming the formId is the third segment of the pathname

    // Perform form submission logic here
    // Check if the current route is "client-onboarding"
    if (location.pathname.startsWith("/client-onboarding")) {
      navigate(`/client-success`);
    } else {
      navigate("/");
      toast.success("Succesfully Saved");
    }
  };

  const columns = [
    {
      title: "outlet Name",
      dataIndex: "outlet_name",
      key: "outlet_name",
    },
    {
      title: "FSSAI No",
      dataIndex: "fssai_license_number",
      key: "fssai_license_number",
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
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
      // console.log("Selected rows:", selectedRows); // Log selected rows to console
      // console.log("Selected keys:", selectedRowKeys); // Log selected rows to console
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
            fetchData(); // Fetch updated data after deletion
            setSelectedRowKeys([]); // Clear selected row keys
            setSelectedRows([]); // Clear selected rows
            toast.success("Successfully Deleted");
          })
          .catch((error) => {
            console.error("Error deleting outlets:", error);
          });
      },
    });
  };

  const container = location.pathname === "/client-onboarding" ? "w-3/4 mx-auto " : " ";

   const bottomButton =
     location.pathname === "/client-onboarding" ? "ml-16 " : " ";
  return (
    <>
      <div className={container}>
        <div className="flex justify-between items-center m-6">
          <h2 className="text-lg font-semibold">Outlet List</h2>
          <div className="space-x-2">
            <Space wrap>
              <Button
                onClick={showDeleteConfirm}
                icon={<DeleteOutlined />}
                disabled={selectedRowKeys.length === 0}
                shape="round"
              >
                Delete
              </Button>
            </Space>
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
          model={{ businessId }} // Pass businessId as prop to OutletForm through model prop
        />
      </div>
      <div className="fixed bottom-0 z-50 bg-white w-full py-4 px-6 flex justify-start shadow-top">
        <div className={bottomButton}>
          <NavLink to="/client-profile">
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
    </>
  );
};

export default OutletDetail;
