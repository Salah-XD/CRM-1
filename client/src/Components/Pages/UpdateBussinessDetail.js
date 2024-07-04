import React, { useEffect, useState } from "react";
import { Form, Input, Select, Spin, Button } from "antd";
import { useNavigate, useLocation, useParams, NavLink } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const { Option } = Select;

const UpdateBusinessDetail = ({ loading, setLoading, setBusinessId }) => {
  const [initialValues, setInitialValues] = useState(null);
  const [isEditable, setIsEditable] = useState(false); // State to manage editability
  const [showUpdateButtons, setShowUpdateButtons] = useState(false); // State to manage visibility of update buttons
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    let isMounted = true;

    const fetchBusinessData = async () => {
      try {
        console.log(`Fetching data for business ID: ${id}`);

        const response = await axios.get(`/getBusinessDataById/${id}`);
        console.log(response.data?.success);
        if (response.data?.success && isMounted) {
          const businessData = response.data.data;
          setBusinessId(businessData._id);
          console.log(response.data.data);

          setInitialValues({
            name: businessData.name,
            contact_person: businessData.contact_person,
            fssai_license_number: businessData.fssai_license_number,
            phone: businessData.phone,
            email: businessData.email,
            gst_number: businessData.gst_number,
            type_of_industry: businessData.type_of_industry,
            vertical_of_industry: businessData.Vertical_of_industry,
            "address.line1": businessData.address?.line1 || "",
            "address.line2": businessData.address?.line2 || "",
            "address.city": businessData.address?.city || "",
            "address.state": businessData.address?.state || "",
            "address.pincode": businessData.address?.pincode || "",
          });
        } else {
          toast.error("Failed to fetch business data");
          console.error("Response data: ", response.data);
        }
      } catch (error) {
        toast.error("Error fetching business data");
        console.error("Error: ", error);
      }
    };

    if (id) fetchBusinessData();

    return () => {
      isMounted = false;
    };
  }, [id, setBusinessId]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true); // Start loading
      const requestData = { ...values };
      const idFromPath = location.pathname.split("/").pop();
      if (idFromPath && idFromPath !== "update-business") {
        requestData._id = idFromPath;
      }

      let response;
      if (requestData._id || requestData.form_id) {
        response = await axios.put("/updateClientData", requestData);
      }

      if (response.data?.success) {
        toast.success("Business data updated successfully");
        navigate("/"); // Optionally navigate to another page after success
      } else {
        toast.error("An Error Occurred");
        console.error("Update response: ", response.data);
      }
    } catch (error) {
      toast.error("Error updating business data");
      console.error("Error: ", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (!initialValues) {
    return (
      <div className="flex justify-center">
        <Spin />
      </div>
    );
  }

  return (
    <div>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        <div className="m-6">
          <div className="flex justify-between">
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
                disabled={!isEditable}
              />
            </Form.Item>

            {!isEditable && (
              <Button
                type="primary"
                onClick={() => {
                  setIsEditable(true);
                  setShowUpdateButtons(true);
                }}
              >
                Edit
              </Button>
            )}
          </div>

          <Form.Item
            name="contact_person"
            className="w-1/2"
            label={
              <span className="text-gray-600 font-semibold">
                Contact Person Name
              </span>
            }
            rules={[
              { required: true, message: "Please enter contact person name" },
            ]}
          >
            <Input
              placeholder="Enter your contact person name"
              className="placeholder-gray-400 p-3 rounded-lg"
              disabled={!isEditable}
            />
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
              { required: true, message: "Please enter FSSAI License Number" },
            ]}
          >
            <Input
              placeholder="Enter your License Number"
              className="placeholder-gray-400 p-3 rounded-lg"
              disabled={!isEditable}
            />
          </Form.Item>
          <Form.Item
            name="phone"
            className="w-1/4"
            label={
              <span className="text-gray-600 font-semibold">Phone Number</span>
            }
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input
              placeholder="Enter your phone number"
              className="placeholder-gray-400 p-3 rounded-lg"
              disabled={!isEditable}
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
          >
            <Input
              placeholder="Enter your email address"
              className="placeholder-gray-400 p-3 rounded-lg"
              disabled={!isEditable}
            />
          </Form.Item>
          <Form.Item
            className="w-1/4"
            label={
              <span className="text-gray-600 font-semibold">GST Number</span>
            }
            name="gst_number"
            rules={[{ required: true, message: "Please enter GST number" }]}
          >
            <Input
              placeholder="Enter your GST number"
              className="placeholder-gray-400 p-3 rounded-lg"
              disabled={!isEditable}
            />
          </Form.Item>
          <Form.Item
            name="vertical_of_industry"
            className="w-1/4"
            label={
              <span className="text-gray-600 font-semibold">
                Vertical of Industry
              </span>
            }
            rules={[{ required: true, message: "Please select business type" }]}
          >
            <Select
              placeholder="Select Industry Vertical"
              size={"large"}
              disabled={!isEditable}
            >
              <Option value="Star hotel">Star hotel</Option>
              <Option value="Ethnic restaurant">Ethnic restaurant</Option>
              <Option value="QSR">QSR</Option>
              <Option value="Industrial catering">Industrial catering</Option>
              <Option value="Meat Retail">Meat Retail</Option>
              <Option value="Sweet Retail">Sweet Retail</Option>
              <Option value="Bakery">Bakery</Option>
              <Option value="Others">Others</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="type_of_industry"
            className="w-1/4"
            label={
              <span className="text-gray-600 font-semibold">
                Type of Industry
              </span>
            }
          >
            <Select
              placeholder="Select Type of Industry"
              disabled={!isEditable}
              size="large"
            >
              <Option value="Catering">Catering</Option>
              <Option value="Meat">Meat</Option>
              <Option value="Sweet">Sweet</Option>
              <Option value="Bakery">Bakery</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={<span className="text-gray-600 font-semibold">Address</span>}
            name="address.line1"
            className="w-1/2"
            rules={[{ required: true, message: "Please enter address line 1" }]}
          >
            <Input
              placeholder="Line 1"
              className="placeholder-gray-400 p-3 rounded-lg"
              disabled={!isEditable}
            />
          </Form.Item>
          <Form.Item name="address.line2" className="w-1/2">
            <Input
              placeholder="Line 2(Optional)"
              className="placeholder-gray-400 p-3 rounded-lg"
              disabled={!isEditable}
            />
          </Form.Item>
          <div className="flex justify-between w-1/2">
            <Form.Item
              name="address.city"
              rules={[{ required: true, message: "Please enter city" }]}
              className="w-full mr-2"
            >
              <Input
                placeholder="City"
                className="placeholder-gray-400 p-3 rounded-lg w-full"
                disabled={!isEditable}
              />
            </Form.Item>
            <Form.Item
              name="address.state"
              rules={[{ required: true, message: "Please enter state" }]}
              className="w-full mr-2"
            >
              <Input
                placeholder="State"
                className="placeholder-gray-400 p-3 rounded-lg w-full"
                disabled={!isEditable}
              />
            </Form.Item>
            <Form.Item
              name="address.pincode"
              rules={[{ required: true, message: "Please enter pincode" }]}
              className="w-full"
            >
              <Input
                placeholder="Pincode"
                className="placeholder-gray-400 p-3 rounded-lg w-full"
                disabled={!isEditable}
              />
            </Form.Item>
          </div>
        </div>
        <div
          className={`sticky bottom-0 z-50 bg-white w-full py-4 px-6 flex justify-start shadow-top transition-transform duration-500 ${
            showUpdateButtons
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <Form.Item>
            <NavLink to="/client-profile">
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
    </div>
  );
};

export default UpdateBusinessDetail;
