import React, { useState } from 'react';
import { Form, Input, Select, Button, Steps, Upload, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const RenderQuestionsUI = ({ sections }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [fileLists, setFileLists] = useState({});

  const handleFormSubmit = (values, sectionIndex) => {
    setFormData((prevData) => ({
      ...prevData,
      [sectionIndex]: values.responses,
    }));
    console.log(`Form for Section ${sectionIndex + 1} submitted:`, values);
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, sections.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFinish = () => {
    // Merge all section data
    const mergedData = Object.values(formData).reduce(
      (acc, sectionData) => ({ ...acc, ...sectionData }),
      {}
    );
    console.log('Merged Data:', mergedData);
    alert('Merged Data has been printed in the console!');
  };

  const handleBeforeUpload = (file) => {
    // You can handle file validation here
    return false; // Prevents auto-upload
  };

  const handleChange = (questionId, info) => {
    const updatedFileLists = { ...fileLists };
    updatedFileLists[questionId] = info.fileList;
    setFileLists(updatedFileLists);
  };

  const handleRemoveImage = (questionId) => {
    const updatedFileLists = { ...fileLists };
    updatedFileLists[questionId] = [];
    setFileLists(updatedFileLists);
  };

  return (
    <div>
      {/* Steps Component */}
      <Steps current={currentStep} className="mb-8">
        {sections.map((section, index) => (
          <Steps.Step key={index} title={section.title} />
        ))}
      </Steps>

      {/* Current Section Form */}
      {sections.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          style={{ display: sectionIndex === currentStep ? 'block' : 'none' }}
        >
          <div className="mt-8 p-6 rounded-lg shadow-lg bg-white">
            <h2 className="text-lg font-bold text-gray-800">{section.title}</h2>
            <Form
              layout="vertical"
              onFinish={(values) => handleFormSubmit(values, sectionIndex)}
              initialValues={{
                responses: section.questions.reduce((acc, question) => {
                  acc[question.questionId] = {
                    comment: '',
                    selectedMark: undefined,
                    file: undefined,
                  };
                  return acc;
                }, {}),
              }}
            >
              {section.questions.map((question, questionIndex) => (
                <div
                  key={questionIndex}
                  className="mt-4 p-4 border rounded-lg bg-gray-50"
                >
                  <div className="ml-2 border text-center rounded-lg p-2 w-[10%]">
                    <label className="text-md text-gray-800">
                      Mark: {question.mark}
                    </label>
                  </div>
                  <p className="text-gray-800 text-lg p-2">
                    {question.description}
                  </p>

                  {/* Comment Field */}
                  <Form.Item
                    name={['responses', question.questionId, 'comment']}
                    label="Comments"
                  >
                    <TextArea placeholder="Enter your comments here..." rows={3} />
                  </Form.Item>

                  {/* Select Mark */}
                  <Form.Item
                    name={['responses', question.questionId, 'selectedMark']}
                    label="Select Mark"
                  >
                    <Select placeholder="Select a mark">
                      {Array.from({ length: question.mark + 1 }, (_, idx) => (
                        <Option key={idx} value={idx}>
                          {idx}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Upload Section */}
                  <Form.Item
                    name={['responses', question.questionId, 'file']}
                    valuePropName="file"
                    getValueFromEvent={(e) => e?.file}
                  >
                    {!fileLists[question.questionId]?.length && (
                      <Upload
                        beforeUpload={handleBeforeUpload}
                        fileList={fileLists[question.questionId] || []}
                        onChange={(info) => handleChange(question.questionId, info)}
                        showUploadList={false}
                      >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                      </Upload>
                    )}
                  </Form.Item>

                  {/* Image Preview */}
                  {fileLists[question.questionId]?.length > 0 && (
                    <div className="flex flex-col items-center">
                      <Image
                        src={fileLists[question.questionId][0]?.url}
                        alt="Preview"
                        width={100}
                        height={100}
                        style={{ objectFit: 'fit' }}
                      />
                      <Button
                        danger
                        className="mt-2"
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveImage(question.questionId)}
                      >
                        Remove Image
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {/* Form Submit Button */}
              <div className="flex justify-end mt-4">
                <Button type="primary" htmlType="submit">
                  Submit Section
                </Button>
              </div>
            </Form>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        {currentStep > 0 && (
          <Button type="default" onClick={handlePrev}>
            Previous
          </Button>
        )}
        {currentStep < sections.length - 1 ? (
          <Button type="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button type="primary" onClick={handleFinish}>
            Finish
          </Button>
        )}
      </div>
    </div>
  );
};

// Example Usage
const ExampleComponent = () => {
  const sections = [
    {
      title: 'Section 1',
      questions: [
        { questionId: '1', description: 'Question 1 Description', mark: 5 },
        { questionId: '2', description: 'Question 2 Description', mark: 3 },
      ],
    },
    {
      title: 'Section 2',
      questions: [
        { questionId: '3', description: 'Question 3 Description', mark: 4 },
      ],
    },
    {
      title: 'Section 3',
      questions: [
        { questionId: '4', description: 'Question 4 Description', mark: 5 },
      ],
    },
  ];

  return (
    <div className="p-8">
      <RenderQuestionsUI sections={sections} />
    </div>
  );
};

export default ExampleComponent;
