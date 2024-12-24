import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { Form, Input, Button } from "antd";
import { useLocation } from "react-router-dom";

const QuestionnairesForm = forwardRef(
  ({ data, onChange, onSubmit, loading }, ref) => {
    const [form] = Form.useForm();
    const location = useLocation();

    const innerDivClass =
      location.pathname === "/client-onboarding"
        ? "m-6 p-4 w-3/4 mx-auto"
        : "ml-6";

    // Set form fields based on data when component mounts or data changes
    useEffect(() => {
      if (data) {
        form.setFieldsValue(data);
      }
    }, [data, form]);


    
    useImperativeHandle(ref, () => ({
      submit: () =>
        new Promise((resolve, reject) => {
          form
            .validateFields()
            .then((values) => {
              onChange(values);
              resolve(values);
            })
            .catch(reject);
        }),
    }));

    const handleFinish = (values) => {
      // Handle form submission
      console.log("Form values: ", values);
      onSubmit(values); // Trigger the submit handler
    };

    return (
      <div className="min-h-screen">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="h-full"
        >
          <div className={innerDivClass + " h-full"}>
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
              />
            </Form.Item>
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
              />
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  }
);

export default QuestionnairesForm;
