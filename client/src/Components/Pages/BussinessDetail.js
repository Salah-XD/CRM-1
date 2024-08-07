import React, { useState, forwardRef, useImperativeHandle,useEffect} from "react";
import { Form, Input,  Checkbox,message } from "antd";
import {  useLocation } from "react-router-dom";

const BusinessDetail = forwardRef(({ data, onChange,onSubmit,loading }, ref) => {
  const [form] = Form.useForm();
  const location = useLocation();
 const [isGstEnabled, setIsGstEnabled] = useState(data.enable_gst ?? true);

   useEffect(() => {
     form.setFieldsValue(data);
     setIsGstEnabled(data.enable_gst ?? true);
   }, [data, form]);


  useImperativeHandle(ref, () => ({
    submit: () =>
      new Promise((resolve, reject) => {
        form
          .validateFields()
          .then((values) => {

              if (location.pathname === "/client-onboarding") {
                values.status = "pending";
                values.added_by = "Client Form";
              } else {
                values.added_by = "Manual";
                values.status = "approved";
              }
            onChange(values);
            resolve(values);
          })
          .catch(reject);
      }),
  }));


const handleFinish = (values) => {
  onChange(values); 
};

  const handleGstCheckboxChange = (e) => {
    setIsGstEnabled(e.target.checked);
    if (!e.target.checked) {
      form.setFieldsValue({ gst_number: "" });
    }
  };

  const handleSubmit = async (values) => {
    
    onSubmit(values);
  };

  const industryOptions = [
    "Catering",
    "Manufacturing",
    "Trade and retail",
    "Transportation",
  ];

  const verticalOptions = [
    "Sweet Shop",
    "Meat Retail",
    "Hub",
    "Market",
    "General Manufacturing",
    "Meat & Meat Processing",
    "Dairy Processing",
    "Catering",
    "Transportation",
    "Storage/Warehouse",
    "Institute Canteen",
    "Industrial Canteen",
    "Temple Kitchen",
  ];

  const innerDivClass =
    location.pathname === "/client-onboarding"
      ? "m-6 p-4 w-3/4 mx-auto"
      : "ml-6";

  const baseDivClass =
    location.pathname === "/client-onboarding" ? "ml-16" : "margin";

  return (
    <div className="w-full">
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <div className={innerDivClass}>
          <Form.Item
            className="w-1/2"
            name="name"
            label={
              <span className="text-gray-600 font-semibold">FBO Name</span>
            }
            rules={[{ required: true, message: "Please enter business name" }]}
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
              { required: true, message: "Please enter contact person name" },
            ]}
          >
            <Input
              placeholder="Enter your contact person name"
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
          >
            <Input
              placeholder="Enter your email address"
              className="placeholder-gray-400 p-3 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="phone"
            className="w-1/4"
            label={
              <span className="text-gray-600 font-semibold">Phone Number</span>
            }
            rules={[
              { required: true, message: "Please enter phone number" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Phone number must be 10 digits",
              },
            ]}
          >
            <Input
              placeholder="Enter your phone number"
              className="placeholder-gray-400 p-3 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            className="w-1/4"
            name="enable_gst"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox onChange={handleGstCheckboxChange}>
              <span className="text-gray-600 font-semibold">
                Do you have GST Number?
              </span>
            </Checkbox>
          </Form.Item>
          <Form.Item
            name="gst_number"
            className="w-1/4"
            label={
              <span className="text-gray-600 font-semibold">GST Number</span>
            }
            rules={[
              {
                required: isGstEnabled,
                message: "Please enter GST number",
              },
              {
                pattern: /^[A-Za-z0-9]{14}$/,
                message: "GST number must be 14 alphanumeric characters",
              },
            ]}
          >
            <Input
              placeholder="Enter your GST number"
              className="placeholder-gray-400 p-3 rounded-lg"
              disabled={!isGstEnabled}
            />
          </Form.Item>

          <Form.Item
            name="type_of_industry"
            className="w-1/4"
            label={
              <span className="text-gray-600 font-semibold">
                Type of Industry
              </span>
            }
            rules={[
              { required: false, message: "Please select industry type" },
            ]}
          >
            <Checkbox.Group>
              <div className="flex flex-col">
                {industryOptions.map((option) => (
                  <Checkbox key={option} value={option} className="mb-2">
                    {option}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            name="vertical_of_industry"
            className="w-1/4"
            label={
              <span className="text-gray-600 font-semibold">
                Vertical of Industry
              </span>
            }
            rules={[
              { required: false, message: "Please select industry vertical" },
            ]}
          >
            <Checkbox.Group>
              <div className="flex flex-col">
                {verticalOptions.map((option) => (
                  <Checkbox key={option} value={option} className="mb-2">
                    {option}
                  </Checkbox>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            label={
              <span className="text-gray-600 font-semibold">
                Registered Address
              </span>
            }
            name={["address", "line1"]}
            className="w-1/2"
            rules={[
              { required: false, message: "Please enter Address Line 1" },
            ]}
          >
            <Input
              placeholder="Line 1"
              className="placeholder-gray-400 p-3 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name={["address", "line2"]}
            className="w-1/2"
            rules={[
              { required: false, message: "Please enter Address Line 2" },
            ]}
          >
            <Input
              placeholder="Line 2 (Optional)"
              className="placeholder-gray-400 p-3 rounded-lg"
            />
          </Form.Item>
          <div className="flex justify-between w-1/2">
            <Form.Item
              name={["address", "city"]}
              rules={[{ required: false, message: "Please enter city" }]}
              className="w-full mr-2"
            >
              <Input
                placeholder="City"
                className="placeholder-gray-400 p-3 rounded-lg w-full"
              />
            </Form.Item>
            <Form.Item
              name={["address", "state"]}
              rules={[{ required: false, message: "Please enter state" }]}
              className="w-full mr-2"
            >
              <Input
                placeholder="State"
                className="placeholder-gray-400 p-3 rounded-lg w-full"
              />
            </Form.Item>
            <Form.Item
              name={["address", "pincode"]}
              rules={[{ required: false, message: "Please enter pincode" }]}
              className="w-full"
            >
              <Input
                placeholder="Pincode"
                className="placeholder-gray-400 p-3 rounded-lg w-full"
              />
            </Form.Item>
          </div>
        </div>

        {/* <div className="sticky bottom-0 z-50 bg-white w-full py-4 px-6 flex justify-start shadow-top">
          <div className={baseDivClass}>
            <Form.Item>
              <NavLink to="/client-profile">
                <Button className="border-primary text-border-2 font-semibold">
                  Cancel
                </Button>
              </NavLink>
              <Button
                type="primary"
                className="ml-6"
                htmlType="submit"
                loading={loading}
              >
                Save
              </Button>
            </Form.Item>
          </div>
        </div> */}
      </Form>
    </div>
  );
});

export default BusinessDetail;
