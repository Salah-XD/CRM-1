import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Spin} from "antd";
import {
  NavLink,
  useNavigate,
  useLocation,
  useParams,
 
} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import AdminDashboard from "../Layout/AdminDashboard";

const { Option } = Select;

const UpdateBusinessDetail = ({ form, loading }) => {
  const [initialValues, setInitialValues] = useState(
  ""
  );
  const navigate = useNavigate();
  const location = useLocation();
  const { formId, id } = useParams();

useEffect(() => {
  // Fetch existing business data if formId or id is present
  const fetchBusinessData = async () => {
    try {
      let response;
      if (formId) {
        response = await axios.get(`/getBusinessDataByFormId/${formId}`);
      } else if (id) {
        response = await axios.get(`/getBusinessDataById/${id}`);
      }

      if (response.data?.success) {
        const businessData = response.data.data;
        console.log("Fetched business data:", businessData);

        // Set initial values state
        setInitialValues({
          name: businessData.name,
          contact_person: businessData.contact_person,
          business_type: businessData.business_type,
          fssai_license_number: businessData.fssai_license_number,
          phone: businessData.phone,
          email: businessData.email,
          gst_number: businessData.gst_number,
          "address.line1": businessData.address.line1,
          "address.line2": businessData.address.line2,
          "address.city": businessData.address.city,
          "address.state": businessData.address.state,
          "address.pincode": businessData.address.pincode,
        });
      } else {
        toast.error("Failed to fetch business data");
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
      toast.error("Error fetching business data");
    }
  };

  if (formId || id) {
    fetchBusinessData();
  }
}, [formId, id]);




const handleSubmit = async (values) => {
  try {
    const requestData = { ...values };

    // Extract id from the URL path if present
    const idFromPath = location.pathname.split("/").pop();
    if (idFromPath && idFromPath !== "update-business") {
      requestData._id = idFromPath; // Send id as _id
    }

    // If formId is present in the URL parameters, send it as form_id
    if (formId) {
      requestData.form_id = formId;
    }


    let response;
    if (requestData._id || requestData.form_id) {
      // Update existing business data
      response = await axios.put("/updateClientData", requestData);
    }

    if (response.data?.success) {
      toast.success("Business data updated successfully");
      if (requestData.added_by === "Client Form") {
        // Handle client form navigation if needed
      } else {
        navigate("/success"); // Or some other route
      }
    } else {
      toast.error("An Error Occurred");
    }
  } catch (error) {
    console.error("Error updating business data:", error);
    toast.error("Error updating business data");
  }
};



  return (
    <div className="">
   
    
        {initialValues ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={initialValues} // Set initial values from state
          >
            <div className="m-6">
              <Form.Item
                className="w-1/2"
                name="name"
                label={
                  <span className="text-gray-600 font-semibold">FBO Name</span>
                }
                rules={[
                  { required: true, message: "Please enter business name" },
                ]}
              >
                <Input
                  placeholder="Enter your Business Name"
                  className="placeholder-gray-400 p-3 rounded-lg w-full"
                />
              </Form.Item>
              <Form.Item
                name="contact_person"
                className="w-1/2"
                label={
                  <span className="text-gray-600 font-semibold">
                    Contact Person Name
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter contact person name",
                  },
                ]}
              >
                <Input
                  placeholder="Enter your contact person name"
                  className="placeholder-gray-400 p-3 rounded-lg"
                />
              </Form.Item>
              <Form.Item
                name="business_type"
                className="w-1/4"
                label={
                  <span className="text-gray-600 font-semibold">
                    Business Type
                  </span>
                }
                rules={[
                  { required: true, message: "Please select business type" },
                ]}
              >
                <Select placeholder="Select Business Type">
                  <Option value="Restaurant">Restaurant</Option>
                  <Option value="Temple">Temple</Option>
                  <Option value="Hotel">Hotel</Option>
                  <Option value="Canteen">Canteen</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label={
                  <span className="text-gray-600 font-semibold">
                    FSSAI License Number
                  </span>
                }
                className="w-1/4"
                name="fssai_license_number"
                rules={[
                  {
                    required: true,
                    message: "Please enter FSSAI License Number",
                  },
                ]}
              >
                <Input
                  placeholder="Enter your License Number"
                  className="placeholder-gray-400 p-3 rounded-lg"
                />
              </Form.Item>
              <Form.Item
                name="phone"
                className="w-1/4"
                label={
                  <span className="text-gray-600 font-semibold">
                    Phone Number
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input
                  placeholder="Enter your phone number"
                  className="placeholder-gray-400 p-3 rounded-lg"
                />
              </Form.Item>
              <Form.Item
                className="w-1/2"
                label={
                  <span className="text-gray-600 font-semibold">Email ID</span>
                }
                name="email"
                rules={[
                  { required: true, message: "Please enter email ID" },
                  { type: "email", message: "Please enter a valid email ID" },
                ]}
                required
              >
                <Input
                  placeholder="Enter your email address"
                  className="placeholder-gray-400 p-3 rounded-lg"
                />
              </Form.Item>
              <Form.Item
                className="w-1/4"
                label={
                  <span className="text-gray-600 font-semibold">
                    GST Number
                  </span>
                }
                name="gst_number"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="Enter your GST number"
                  className="placeholder-gray-400 p-3 rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-600 font-semibold">Address</span>
                }
                name="address.line1"
                className="w-1/2"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="Line 1"
                  className="placeholder-gray-400 p-3 rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="address.line2"
                className="w-1/2"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="Line 2"
                  className="placeholder-gray-400 p-3 rounded-lg"
                />
              </Form.Item>
              <div className="flex justify-between w-1/2">
                <Form.Item
                  name="address.city"
                  rules={[{ required: true }]}
                  className="w-full mr-2"
                >
                  <Input
                    placeholder="City"
                    className="placeholder-gray-400 p-3 rounded-lg w-full"
                  />
                </Form.Item>

                <Form.Item
                  name="address.state"
                  rules={[{ required: true }]}
                  className="w-full mr-2"
                >
                  <Input
                    placeholder="State"
                    className="placeholder-gray-400 p-3 rounded-lg w-full"
                  />
                </Form.Item>

                <Form.Item
                  name="address.pincode"
                  rules={[{ required: true }]}
                  className="w-full"
                >
                  <Input
                    placeholder="Pincode"
                    className="placeholder-gray-400 p-3 rounded-lg w-full"
                  />
                </Form.Item>
              </div>
            </div>

            <div className="sticky bottom-0 z-50 bg-white w-full py-4 px-6 flex justify-start shadow-top">
              <Form.Item>
                <NavLink to="/">
                  <Button className="border-primary text-primary border-2 font-semibold">
                    Cancel
                  </Button>
                </NavLink>
                <Button
                  type="primary"
                  className="ml-6"
                  htmlType="submit"
                  loading={loading}
                >
                  Update
                </Button>
              </Form.Item>
            </div>
          </Form>
        ) : (
          <div className="flex justify-center">
            <Spin />
          </div>
        )}

    </div>
  );
};

export default UpdateBusinessDetail;
