import React, { useEffect, useState } from "react";
import { Form, Input, Button, Spin } from "antd";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateQuestionnairesForm = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState(null); // State to hold form data
  const [isUpdating, setIsUpdating] = useState(false); // State to manage update loading
  const location = useLocation();
  const [isEditable, setIsEditable] = useState(false);
  const [showUpdateButtons, setShowUpdateButtons] = useState(false);
  const { id } = useParams(); // Assuming you pass the ID in the route.
  const navigate = useNavigate();

  const innerDivClass =
    location.pathname === "/client-onboarding"
      ? "m-6 p-4 w-3/4 mx-auto"
      : "ml-6";

  const fetchFormData = async () => {
    try {
      const response = await axios.get(`/api/getQuestionaryByBusiness/${id}`);
      if (response.data?.success) {
        setFormData(response.data.data);
      } else {
        toast.error("Failed to fetch form data");
      }
    } catch (error) {
      toast.error("Error fetching form data");
      console.error("Error: ", error);
    }
  };

  // Fetch form data on mount or when id changes
  useEffect(() => {
    if (id) fetchFormData();
  }, [id]);

  // Update form values when formData changes
  useEffect(() => {
    if (formData) {
      form.setFieldsValue(formData);
    }
  }, [formData, form]);

  const handleFinish = async (values) => {
    console.log("Form values: ", values);
    setIsUpdating(true); // Set loading state to true
    try {
      const response = await axios.put(`/api/updateQuestionary/${id}`, values);
      if (response.data?.success) {
        toast.success("Data updated successfully");
        await fetchFormData(); // Refresh form data
        setIsEditable(false); // Disable editing after update
        setShowUpdateButtons(false); // Hide update buttons after update
      } else {
        toast.error("Failed to update data");
      }
    } catch (error) {
      toast.error("Error updating data");
      console.error("Error: ", error);
    } finally {
      setIsUpdating(false);
    }
  };


  const handleCancel = () => {
  
    
    // Disable editing and hide the update buttons
    setIsEditable(false);
    setShowUpdateButtons(false);
  };
  


  if (!formData) {
    return (
      <div className="flex justify-center">
        <Spin />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="h-full"
      >
        <div className={innerDivClass + " h-full"}>
          <div className="flex justify-between">
            <Form.Item
              className="w-1/2"
              name="existing_consultancy_name"
              label={
                <span className="text-gray-600 font-semibold">
                  Existing Consultancy Name
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter existing consultancy name",
                },
              ]}
            >
              <Input
                placeholder="Enter existing consultancy name"
                className="placeholder-gray-400 p-3 rounded-lg w-full"
                disabled={!isEditable} // Disable input based on isEditable state
              />
            </Form.Item>
            {!isEditable && (
              <div className="mr-5">
                <Button
                  type="primary"
                  onClick={() => {
                    setIsEditable(true);
                    setShowUpdateButtons(true);
                  }}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
          <Form.Item
            className="w-1/2"
            name="fostac_agency_name"
            label={
              <span className="text-gray-600 font-semibold">
                FOSTAC Agency Name
              </span>
            }
            rules={[
              { required: true, message: "Please enter FOSTAC agency name" },
            ]}
          >
            <Input
              placeholder="Enter FOSTAC agency name"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              disabled={!isEditable} // Disable input based on isEditable state
            />
          </Form.Item>
          <Form.Item
            className="w-1/2"
            name="other_certifications"
            label={
              <span className="text-gray-600 font-semibold">
                Any other certifications done? If Yes, mention the details.
              </span>
            }
          >
            <Input.TextArea
              placeholder="Enter certification details"
              className="placeholder-gray-400 p-3 rounded-lg w-full"
              rows={4}
              disabled={!isEditable} // Disable input based on isEditable state
            />
          </Form.Item>
        </div>
        <div
          className={`fixed bottom-0 z-50 bg-white w-full py-4 px-6 flex justify-start shadow-top transition-transform duration-500 ${
            showUpdateButtons
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <Form.Item>
            <Button type="primary" className="ml-6" htmlType="submit">
              Update
            </Button>
            <Button type="primary" className="ml-6" onClick={handleCancel} >
              Cancel
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default UpdateQuestionnairesForm;
