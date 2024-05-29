import React, { useState, useEffect } from "react";
import { Modal, Form, Input, message, Spin } from "antd";
import axios from "axios";
import "../css/outletForm.css"; // Import the custom CSS


const UpdateOutletForm = ({
  isModalVisible,
  handleOk,
  handleCancel,
  outletId,
  businessId,
}) => {
  const [form] = Form.useForm();
  const [ownership, setOwnership] = useState("yes");
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    const fetchOutletDetails = async () => {
      try {
        const response = await axios.get(
          `/getParticularOutletDetails/${outletId}`
        );
        const outlet = response.data;

        // Set initial ownership state based on fetched data
        setOwnership(outlet.private_owned ? "yes" : "no");

        // Set initial values for the form
        form.setFieldsValue({
          branch_name: outlet.branch_name,
          private_owned: outlet.private_owned ? "yes" : "no",
          ...outlet.private_details,
          address: outlet.private_details?.address,
        });

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching outlet details:", error);
        message.error(
          "Failed to fetch outlet details. Please try again later."
        );
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    if (outletId) {
      fetchOutletDetails();
    } else {
      setLoading(false); // If no outletId, set loading to false immediately
    }
  }, [outletId, form]);

  const handleOwnershipChange = (e) => {
    setOwnership(e.target.value);
  };

 const handleSubmit = async () => {
   try {
     // Validate form fields and get values
     const values = await form.validateFields();
     // Include business ID in the outlet data
     const outletData = { ...values, business: businessId };

     // Check if outletId is present to determine create or update
     if (outletId) {
       // Update existing outlet
       await axios.put(`/updateOutlet/${outletId}`, outletData);
       message.success("Outlet data updated successfully");
     } else {
       // Create new outlet
       await axios.post("/saveOutlet", outletData);
       message.success("Outlet data saved successfully");
     }

     // Handle success actions
     handleOk();
     form.resetFields();
   } catch (error) {
     // Check if the error is from form validation
     if (error.name === "ValidationError") {
       console.error("Validation error:", error);
       message.error("Please correct the validation errors.");
     } else {
       // Log the error and show a generic error message
       console.error("Error saving outlet data:", error);
       message.error("Failed to save outlet data. Please try again later.");
     }
   }
 };


  const isDisabled = (fieldName) =>
    ownership === "no" && fieldName !== "private_owned";

  return (
    <Modal
      className="h-80vh overflow-hidden"
      title={
        <span className="text-xl">
          {outletId ? "View/Edit Outlet" : "Add Outlet"}
        </span>
      }
      visible={isModalVisible}
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spin size="large" />
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">Branch Name</span>
            }
            name="branch_name"
            rules={[{ required: true, message: "Please enter branch name" }]}
          >
            <Input
              placeholder="Enter the name of the branch"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">
                Is the branch/outlet owned by others?
              </span>
            }
            name="private_owned"
          >
            <div className="flex space-x-4">
              <label className="custom-radio">
                <input
                  type="radio"
                  value="yes"
                  checked={ownership === "yes"}
                  onChange={handleOwnershipChange}
                />
                <span
                  className={`radio-btn ${
                    ownership === "yes" ? "radio-checked" : ""
                  }`}
                ></span>
                Yes
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  value="no"
                  checked={ownership === "no"}
                  onChange={handleOwnershipChange}
                />
                <span
                  className={`radio-btn ${
                    ownership === "no" ? "radio-checked" : ""
                  }`}
                ></span>
                No
              </label>
            </div>
          </Form.Item>

          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">
                Outlet Owned By
              </span>
            }
            name="name"
            rules={[
              {
                required: !isDisabled("name"),
                message: "Please enter owner's name",
              },
            ]}
          >
            <Input
              placeholder="Franchiser’s GST Registered Name"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={isDisabled("name")}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">GST Number</span>
            }
            name="gst_number"
            rules={[
              {
                required: !isDisabled("gst_number"),
                message: "Please enter GST number",
              },
            ]}
          >
            <Input
              placeholder="Enter GST number"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={isDisabled("gst_number")}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">
                Primary Contact Number
              </span>
            }
            name="primary_contact_number"
            rules={[
              {
                required: !isDisabled("primary_contact_number"),
                message: "Please enter primary contact number",
              },
            ]}
          >
            <Input
              placeholder="Enter primary contact number"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={isDisabled("primary_contact_number")}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-600 font-semibold">Email</span>}
            name="email"
            rules={[
              { required: !isDisabled("email"), message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              placeholder="Enter email"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={isDisabled("email")}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-600 font-semibold">Address</span>}
            name={["address", "line1"]}
            rules={[
              {
                required: !isDisabled("line1"),
                message: "Please enter address line 1",
              },
            ]}
          >
            <Input
              placeholder="Enter address line 1"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={isDisabled("line1")}
            />
          </Form.Item>

          <Form.Item name={["address", "line2"]}>
            <Input
              placeholder="Enter address line 2 (optional)"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={isDisabled("line2")}
            />
          </Form.Item>

          <div className="flex justify-between">
            <Form.Item
              name={["address", "city"]}
              className="w-1/3 mr-2"
              rules={[
                { required: !isDisabled("city"), message: "Please enter city" },
              ]}
            >
              <Input
                placeholder="Enter city"
                className="placeholder-gray-400 p-3 rounded-lg w-full"
                disabled={isDisabled("city")}
              />
            </Form.Item>

            <Form.Item
              name={["address", "state"]}
              className="w-1/3 mr-2"
              rules={[
                {
                  required: !isDisabled("state"),
                  message: "Please enter state",
                },
              ]}
            >
              <Input
                placeholder="Enter state"
                className="placeholder-gray-400 p-3 rounded-lg w-full"
                disabled={isDisabled("state")}
              />
            </Form.Item>

            <Form.Item
              name={["address", "pincode"]}
              className="w-1/3"
              rules={[
                {
                  required: !isDisabled("pincode"),
                  message: "Please enter pincode",
                },
              ]}
            >
              <Input
                placeholder="Enter pincode"
                className="placeholder-gray-400 p-3 rounded-lg w-full"
                disabled={isDisabled("pincode")}
              />
            </Form.Item>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default UpdateOutletForm;
