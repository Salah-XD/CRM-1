import React, { useState } from "react";
import { Steps, Button, Input, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import AdminDashboard from "../Layout/AdminDashboard";

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

function AuditReport() {
  const [currentStep, setCurrentStep] = useState(0);

  const auditItems = [
    {
      title: "Design & Facilities",
      description: "The design of food premises provides adequate working space; permit maintenance & cleaning to prevent the entry of dirt, dust & pests",
      mark: 2,
    },
    {
      title: "Hygiene & Safety",
      description: "Adequate hygiene and safety practices are maintained.",
      mark: 1,
    },
    // Add more items as needed
  ];

  const next = () => setCurrentStep(currentStep + 1);
  const prev = () => setCurrentStep(currentStep - 1);

  return (
    <AdminDashboard>
      <div className="p-8">
        <div className="flex justify-center mb-5">
          <h1 className="text-xl font-medium">Audits Details</h1>
        </div>

        <Steps current={currentStep}>
          {auditItems.map((item, index) => (
            <Step key={index} title={item.title} />
          ))}
        </Steps>

        <div className="mt-8 p-6 rounded-lg shadow-lg bg-white">
          <h2 className="text-lg font-semibold">{auditItems[currentStep].title}</h2>
          <p>{auditItems[currentStep].description}</p>

          <div className="mt-4">
            <label>Mark: {auditItems[currentStep].mark}</label>
            <TextArea rows={4} placeholder="Comments..." className="mt-2" />

            <div className="flex items-center mt-4">
              <Select placeholder="Select mark" className="mr-4">
                <Option value="0">0</Option>
                <Option value="1">1</Option>
                <Option value="2">2</Option>
              </Select>

              <Upload>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button onClick={prev} disabled={currentStep === 0}>
            Back
          </Button>
          {currentStep < auditItems.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {currentStep === auditItems.length - 1 && (
            <Button type="primary">Submit</Button>
          )}
        </div>
      </div>
    </AdminDashboard>
  );
}

export default AuditReport;
