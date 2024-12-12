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
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../Layout/ConfirmationModal";
import { useAuth } from "../Context/AuthContext";
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

function AuditReport() {
  const [currentStep, setCurrentStep] = useState(0);
  const [auditItems, setAuditItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileLists, setFileLists] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [fssaiNumber, setFssaiNumber] = useState("");
  const [fssaiFile, setFssaiFile] = useState(null);
  const [form] = Form.useForm();
  const { user } = useAuth();

  console.log("this is the user",user);

  const handleSubmit = () => {
    setIsModalVisible(true);
  };

  const handleSaveAsDraft = () => {
    setStatus("draft");
    setIsModalVisible(false);
    handleFormSubmit();
  };

  const handleSubmitFinal = () => {
    setStatus("submitted");
    setIsModalVisible(false);
    handleFormSubmit();
  };

  const goBack = () => {
    navigate(-1); 
  };




  useEffect(() => {
    const fetchAuditItems = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "/api/auditor/fetchLabelsWithQuestions"
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



  const handleChange = (index, { fileList: newFileList }) => {
    // Process the files before setting them in the state
    newFileList = newFileList.map((file) => {
      if (file.originFileObj) {
        file.url = URL.createObjectURL(file.originFileObj); 
      }
      return file;
    });

    // Update the file list for the current question
    setFileLists((prev) => ({
      ...prev,
      [index]: newFileList, // Store file list for specific question index
    }));
  };

  const handleBeforeUpload = (file) => {
    const isValidType = file.type === "image/jpeg" || file.type === "image/png";
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
          setCurrentStep(currentStep + 1);
        })
        .catch((errorInfo) => {
          // Handle validation failure
          console.log("Validation failed:", errorInfo);
        });
    } else {
      // For other steps, directly move to the next step
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => setCurrentStep(currentStep - 1);




  const onFinish = (values) => {
    // Update state with submitted values
    setFssaiNumber(values.fssaiLicense);
    setFssaiFile(values.mediaUpload);

    // Notify the user and proceed to the next step
    message.success("FSSAI License submitted successfully!");
    console.log("Submitted Values:", values);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isAllowedType =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/svg+xml" ||
        file.type === "application/zip";
      if (!isAllowedType) {
        message.error("Only .jpg, .png, .svg, and .zip files are allowed.");
        return Upload.LIST_IGNORE;
      }
      const isSizeValid = file.size / 1024 / 1024 < 2;
      if (!isSizeValid) {
        message.error("File size must be smaller than 2MB.");
        return Upload.LIST_IGNORE;
      }
      return isAllowedType && isSizeValid;
    },
  };

  const handleRemoveImage = (questionId) => {
    setFileLists((prevFileLists) => {
      const updatedFileLists = { ...prevFileLists };
      delete updatedFileLists[questionId];
      return updatedFileLists;
    });
  };

  const handleFormSubmit = async (values, questions, params) => {
    const auditId = params.audit_id;

    try {
      const formData = new FormData();

      // Map through the questions and structure the response
      const responsesWithIds = questions.map((question, index) => {
        const response = values.responses?.[currentStep]?.[index] || {};
        const file = response.file?.[0]?.originFileObj || null; // Extract the uploaded file object

        if (file) {
          formData.append("files", file); // Append file to FormData
        }

        return {
          questionId: question.questionId,
          comment: response.comment || "", 
          marks: response.selectedMark || 0, 
          file: file ? file.name : "", 
        };
      });

      // Add the structured JSON data to FormData
      formData.append(
        "data",
        JSON.stringify({
          auditId: auditId, // Include the audit_id
          responses: responsesWithIds, // Include the mapped response data
          status: "rejected",
        })
      );

      // Make Axios POST request to save the data
      const response = await axios.post(
        "/api/auditor/saveAuditResponses",
        formData, // Send FormData instead of JSON
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Questions submitted successfully!");

      navigate(-1);
    } catch (error) {
      console.error("Error submitting responses:", error);
      message.error("Failed to submit responses. Please try again.");
    }
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
            ]}
          >
            <Input.OTP formatter={(str) => str.toUpperCase()} />
          </Form.Item>
        </div>
        <div className="flex justify-center w-[300px] mx-auto">
          <Form.Item
            name="mediaUpload"
            label="Media Upload"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload.Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Drag your file(s) here, or click to browse
              </p>
              <p className="ant-upload-hint">
                Max 2 MB files are allowed. Only support .jpg, .png, .svg, and
                .zip files.
              </p>
            </Upload.Dragger>
          </Form.Item>
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

  const renderQuestionsUI = (questions, params, status) => (
    <Form
      layout="vertical"
      form={form}
      onFinish={(values) => handleFormSubmit(values, questions, params, status)}
    >
      {questions?.map((question, index) => (
        <div key={index} className="mt-8 p-6 rounded-lg shadow-lg bg-white">
          <div className="ml-2 border text-center rounded-lg p-2 w-[10%]">
            <label className="text-md text-gray-800">
              Mark: {question.mark}
            </label>
          </div>
          <p className="text-gray-800 text-lg p-2">{question.description}</p>
          <div className="mt-4 flex items-center justify-around">
            <Form.Item
              name={["responses", currentStep, index, "comment"]}
              className="mt-2 w-1/2 "
            >
              <TextArea rows={3} placeholder="Comments..." />
            </Form.Item>

            <Form.Item name={["responses", currentStep, index, "selectedMark"]}>
              <Select placeholder="Select mark" style={{ width: 120 }}>
                {Array.from({ length: question.mark + 1 }, (_, idx) => (
                  <Option key={idx} value={idx}>
                    {idx}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {/* Upload Image */}
            <Form.Item
              name={["responses", currentStep, index, "file"]}
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
  );

  return (
    <AdminDashboard>
      <div className="p-8">
        <div className="flex justify-center mb-5">
          <h1 className="text-xl font-medium">Audit Reports</h1>
        </div>

        <Steps current={currentStep}>
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
              {auditItems[currentStep]?.title}
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
              {currentStep < auditItems.length - 1 && (
                <Button
                  type="link"
                  icon={<ArrowRightOutlined />}
                  onClick={next}
                >
                  Next
                </Button>
              )}

              {/* Submit Button (Only shown on the last step) */}
              {currentStep === auditItems.length - 1 && (
                <Button type="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              )}
            </div>
          </div>
        )}

        {auditItems[currentStep]?.title === "FSSAI liscence"
          ? renderFssaiUI()
          : renderQuestionsUI(auditItems[currentStep]?.questions, params)}
      </div>

      <ConfirmationModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleSubmitFinal}
        onSaveAsDraft={handleSaveAsDraft}
      />
    </AdminDashboard>
  );
}

export default AuditReport;
