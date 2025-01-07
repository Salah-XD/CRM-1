import React, { useState, useEffect } from "react";
import {
  Steps,
  Button,
  Input,
  Select,
  Upload,
  message,
  Form,
  Typography,
  Image,
  Spin,
} from "antd";
import {
  UploadOutlined,
  InboxOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import AdminDashboard from "../Layout/AdminDashboard";
import axios from "axios";
import { useNavigate, useParams,useSearchParams  } from "react-router-dom";
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

function AuditReport() {
  const [currentStep, setCurrentStep] = useState(0);
  const [auditItems, setAuditItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileLists, setFileLists] = useState([]);
  const [fssaiNumber, setFssaiNumber] = useState("");
  const [fssaiFile, setFssaiFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [sections, setSections] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searchParams] = useSearchParams();
  const audit_id = searchParams.get("audit_id");
  const checklistId = searchParams.get("checklistId");
  const category = searchParams.get("category");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  





  const handleFileChange = ({ fileList: newFileList }) => {
    const file = newFileList[0]?.originFileObj;

    // Generate preview if a file is uploaded
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null); // Clear preview if no file
    }

    setFileList(newFileList); // Update file list
  };

  const handleRemove = () => {
    setFileList([]); // Clear file list
    setPreviewUrl(null); // Clear image preview
  };

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/auditor/fetchLabelsWithQuestions/${checklistId}`
        );
        setSections(data);
      } catch (error) {
        message.error("Failed to fetch section data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("i am submitted ");
        console.log("Form values:", values);
        handleNextFormSubmit(values, currentStep);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });

    handleFormSubmit("draft");
  };

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchAuditItems = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/auditor/fetchLabelsWithQuestions//${checklistId}`
        );
        console.log(data);
        setAuditItems(data);
      } catch (error) {
        message.error("Failed to fetch audit data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAuditItems();
  }, []);

  const handleChange = (questionId, info) => {
    const updatedFileLists = { ...fileLists };
    // Store the file and generate a preview URL
    const file = info.file.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedFileLists[questionId] = [
          {
            url: reader.result, // Use FileReader result as URL
          },
        ];
        setFileLists(updatedFileLists);
      };
      reader.readAsDataURL(file); // Read the file as data URL
    } else {
      updatedFileLists[questionId] = [];
      setFileLists(updatedFileLists);
    }
  };

  const handleRemoveImage = (questionId) => {
    const updatedFileLists = { ...fileLists };
    updatedFileLists[questionId] = [];
    setFileLists(updatedFileLists);
  };

  const handleBeforeUpload = (file) => {
    const isValidType = file.type === "image/jpg" || file.type === "image/png";
    const isValidSize = file.size / 1024 / 1024 < 2; // Limit file size to 2MB

    if (!isValidType) {
      message.error("Only JPEG and PNG images are allowed.");
      setFileLists([]);
      return false;
    }

    if (!isValidSize) {
      message.error("File size must be less than 2MB.");
      setFileLists([]);
      return false;
    }

    return true;
  };

  const next = () => {
    if (currentStep === 0) {
      // Trigger FSSAI form submission if on the first step
      form
        .validateFields() // Validate fields before proceeding
        .then((values) => {
          console.log("Validation successful:", values); // Optional: Log validated values
          onFinish(values); // Manually call the onFinish handler
          setCurrentStep(currentStep + 1); // Move to the next step after validation
        })
        .catch((errorInfo) => {
          // Handle validation failure
          console.log("Validation failed:", errorInfo);
        });
    } else {
      // For other steps, trigger form submission for the current section
      form
        .validateFields()
        .then((values) => {
          console.log("this is the value", values);
          handleNextFormSubmit(values, currentStep);
          setCurrentStep(currentStep + 1); // Move to the next step after submission
        })
        .catch((errorInfo) => {
          // Handle validation failure
          console.log("Validation failed:", errorInfo);
        });
    }
  };

  const prev = () => setCurrentStep(currentStep - 1);

  const onFinish = (values) => {
    // Log the FSSAI License number
    setFssaiNumber(values.fssaiLicense);

    // Log the uploaded file (if any)
    if (fileList.length > 0) {
      setFssaiFile(fileList[0].originFileObj);
    }
  };

  const handleFormSubmit = async (status) => {
    try {
      setLoading(true);
      const responses = [];

      // Loop through the formData to extract responses
      Object.entries(formData.responses).forEach(
        ([questionId, questionData]) => {
          // Default handling for other questions
          const file = questionData.file ? questionData.file : null;
          const response = {
            questionId,
            comment: questionData.comment || "",
            marks: questionData.selectedMark || 0,
            file: file ? file.name : "",
          };
          responses.push(response);
        }
      );

      // Prepare FormData for the submission
      const form = new FormData();
      form.append(
        "data",
        JSON.stringify({
          auditId: audit_id, // Example auditId
          responses,
          status: status, // Add status
          fssai_number: fssaiNumber,
          fssai_file: fssaiFile ? fssaiFile.name : "",
        })
      );

      // Append the response files to the FormData
      responses.forEach((response) => {
        const file = formData.responses[response.questionId]?.file;
        if (file && file.originFileObj) {
          const fileObject = file.originFileObj;
          form.append("files", fileObject, file.name);
        }
      });

      // If fssai_file exists, append it directly (no need for .originFileObj)
      if (fssaiFile) {
        form.append("files", fssaiFile, fssaiFile.name);
      }

      // Send the FormData using Axios
      const response = await axios.post(
        "/api/auditor/saveAuditResponses",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure the request is set to multipart
          },
        }
      );

      message.success("Questions submitted successfully!");
      setLoading(false);
      navigate("/assigned-audit");
    } catch (error) {
      console.error("Error submitting responses:", error);
      message.error("Failed to submit responses. Please try again.");
    }
  };

  const handleNextFormSubmit = (values) => {
    const updatedData = { ...formData };
    updatedData.responses = values.responses; // Assuming you want to keep the responses updated
    setFormData(updatedData);
  };

  const renderFssaiUI = () => (
    <div>
      <div className="text-lg text-gray-800 bg-white border mt-5 p-8 rounded-xl">
        The FSSAI license/Registration and Food Safety Display Board (FSDB) both
        are displayed at a prominent location.
        <br />
        (Note: The FSDBs are readable to both Food Handlers and Customers.)
      </div>

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        style={{ marginTop: "24px" }}
      >
        <div className="my-4">
          <h1 className="text-gray-800 text-lg">
            Submit your FSSAI LICENSE number:
          </h1>
        </div>
        <div className="flex">
          <div>
            <h1 className="font-medium text-lg mr-4">FSSAI license number:</h1>
          </div>
          <Form.Item
            name="fssaiLicense"
            rules={[
              {
                required: true,
                message: "Please enter your FSSAI License No.",
              },
              {
                pattern: /^[0-9]{14}$/,
                message:
                  "FSSAI License No. must be exactly 14 numeric characters.",
              },
            ]}
          >
            <Input maxLength={14} formatter={(value) => value.toUpperCase()} />
          </Form.Item>
        </div>

        <div className="flex justify-center w-[300px] mx-auto">
          {fileList.length === 0 ? (
            // Show upload option when no file is uploaded
            <Form.Item
              name="mediaUpload"
              label="Media Upload"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            >
              <Upload.Dragger
                accept=".jpg,.png,.svg"
                maxCount={1}
                fileList={fileList} // Controlled fileList
                onChange={handleFileChange}
                listType="text" // Removes the default image preview UI
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Drag your file(s) here, or click to browse
                </p>
                <p className="ant-upload-hint">
                  Max 2 MB files are allowed. Only support .jpg, .png, and .svg
                  files.
                </p>
              </Upload.Dragger>
            </Form.Item>
          ) : (
            // Show custom image preview and remove button when a file is uploaded
            <div className="flex flex-col items-center">
              {previewUrl && (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={200}
                  style={{ marginBottom: "16px", borderRadius: "8px" }}
                  preview={{
                    mask: "Click to preview",
                  }}
                />
              )}
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleRemove}
              >
                Remove
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Text
            type="secondary"
            style={{ marginTop: "16px", display: "block" }}
          >
            Note: "Please provide your FSSAI license number. Without submitting
            it, you will not be able to proceed to the next section."
          </Text>
        </div>
      </Form>
    </div>
  );

  const renderQuestionsUI = () => (
    <>
      {sections.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          style={{
            display: sectionIndex === currentStep - 1 ? "block" : "none",
          }} // Ensure correct step
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={(values) => handleNextFormSubmit(values, sectionIndex)}
            initialValues={{
              responses: section.questions.reduce((acc, question) => {
                acc[question.questionId] = {
                  comment: "",
                  selectedMark: undefined,
                };
                return acc;
              }, {}),
            }}
          >
            {section.questions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="mt-8 p-6 rounded-lg shadow-lg bg-white"
              >
                <div className="ml-2 border text-center rounded-lg p-2 w-[10%]">
                  <label className="text-md text-gray-800">
                    Mark: {question.mark}
                  </label>
                </div>
                <p className="text-gray-800 text-lg p-2">
                  {question.description}
                </p>
                <div className="mt-4 flex items-center justify-around">
                  {/* Comment Field */}
                  <Form.Item
                    name={["responses", question.questionId, "comment"]}
                    className="mt-2 w-1/2 "
                  >
                    <TextArea rows={3} placeholder="Observation..." />
                  </Form.Item>

                  {/* Select Mark */}
                  <Form.Item
                    name={["responses", question.questionId, "selectedMark"]}
                  >
                    <Select placeholder="Select a mark" style={{ width: 120 }}>
                      {question.mark === 2
                        ? [
                            // Generate options for 0, 1, 2
                            <Option key="N/A" value="N/A">
                              N/A
                            </Option>,
                            ...Array.from({ length: 3 }, (_, idx) => (
                              <Option key={idx} value={idx}>
                                {idx}
                              </Option>
                            )),
                          ]
                        : question.mark === 4
                        ? [
                            // Generate options for 0 and 4
                            <Option key="N/A" value="N/A">
                              N/A
                            </Option>,
                            ...[0, 4].map((value) => (
                              <Option key={value} value={value}>
                                {value}
                              </Option>
                            )),
                          ]
                        : null}
                    </Select>
                  </Form.Item>

                  {/* Upload Section */}
                  <Form.Item
                    name={["responses", question.questionId, "file"]}
                    valuePropName="file"
                    getValueFromEvent={(e) => e?.file}
                  >
                    {!fileLists[question.questionId]?.length && (
                      <Upload
                        beforeUpload={handleBeforeUpload}
                        fileList={fileLists[question.questionId] || []}
                        onChange={(info) =>
                          handleChange(question.questionId, info)
                        }
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
                        style={{ objectFit: "fit" }}
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
              </div>
            ))}
          </Form>
        </div>
      ))}
    </>
  );

  return (
    <AdminDashboard> 
      <div className="p-8">
        <div className="flex justify-center mb-5">
          <h1 className="text-xl font-medium">Audit Reports  <span>({category})</span> </h1>
        </div>

        <Steps current={currentStep}>
          <Step title="FSSAI License" />
          {auditItems.map((item, index) => (
            <Step key={index} title={item.title} />
          ))}
        </Steps>

        {loading ? (
          <div className="flex justify-center mt-8">
            <Spin size="medium" />
          </div>
        ) : (
          <div className="flex justify-between mt-8">
            <h2 className="text-lg text-gray-600">
              {currentStep === 0
                ? "FSSAI License"
                : auditItems[currentStep - 1]?.title}
            </h2>
            <div>
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={prev}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              {/* Home Button (HomeOutlined) */}
              <Button
                type="link"
                onClick={goBack}
                icon={<HomeOutlined />}
              ></Button>
              {/* Next Button (ArrowRightOutlined) */}
              {currentStep < auditItems.length && (
                <Button
                  type="link"
                  icon={<ArrowRightOutlined />}
                  onClick={next}
                >
                  Next
                </Button>
              )}

              {/* Submit Button (Only shown on the last step) */}
              {currentStep === auditItems.length && (
                <Button type="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              )}
            </div>
          </div>
        )}

        {currentStep === 0
          ? renderFssaiUI()
          : renderQuestionsUI(auditItems[currentStep - 1]?.questions, params)}
      </div>
    </AdminDashboard>
  );
}

export default AuditReport;
