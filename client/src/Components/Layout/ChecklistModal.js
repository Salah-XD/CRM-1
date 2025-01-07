import React, { useState, useEffect } from "react";
import { Modal, Select, Button, Spin, message } from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const ChecklistModal = ({ visible, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [value, setValue] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (visible) {
      fetchCategories();
    }
  }, [visible]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "/api/auditor/fetchAllChecklistCategories"
      );
      setCategories(response.data);
    } catch (error) {
      message.error("Failed to fetch checklist categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setButtonDisabled(!value);

    // Find and console the selected category's name
    const selectedCategoryName = categories.find(
      (category) => category._id === value
    )?.name;
    setValue(selectedCategoryName);
  };

  const handleStart = async () => {
    try {
      const payload = {
        audit_id: params.audit_id, // Assuming `params.audit_id` is defined somewhere in your component
        checkListId: selectedCategory, // Use the selected category ID
      };

      // Call the update function
      const result = await axios.put("/api/auditor/updateStartedDate", payload);

      message.success("Audit Started");
      const firstSegment = location.pathname.split("/").filter(Boolean)[0]; // 'draft', 'assigned-audit', etc.

      // Ensure the path is absolute by using `/`
      navigate(`/${firstSegment}/audit-form/audit-report/?audit_id=${ params.audit_id}&checklistId=${selectedCategory}&category=${value}`);

      // Handle the start button click action here
      console.log("Starting with category:", selectedCategory);
      console.log("Starting with category:", value);
      onClose(); // Close the modal after starting
    } catch (error) {
      // Handle errors and update the status message
      message.error("Failed to update audit start date.");
      console.error(error);
    }
  };

  return (
    <Modal
      title="Select Checklist Category"
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {loading ? (
        <Spin tip="Loading categories..." />
      ) : (
        <>
          <Select
            placeholder="Select a category"
            style={{ width: "100%" }}
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            {categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
          <div style={{ marginTop: 20 }}>
            <Button
              type="primary"
              onClick={handleStart}
              disabled={buttonDisabled}
            >
              Start
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ChecklistModal;
