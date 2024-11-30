import React from "react";
import { Form, Input, Upload, Button, Typography } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const FssiForm = () => {
  const onFinish = (values) => {
    console.log("Form Submitted:", values);
  };

  const uploadProps = {
    name: "file",
    maxCount: 1,
    accept: ".jpg,.png,.svg,.zip",
    beforeUpload: (file) => {
      const isAllowedSize = file.size / 1024 / 1024 < 2;
      if (!isAllowedSize) {
        alert("File size must be less than 2MB!");
      }
      return isAllowedSize || Upload.LIST_IGNORE;
    },
  };

  return (
    <div>
      <div className="text-lg text-gray-800 bg-white border mt-5 p-8 rounded-xl">
        The FSSAI license/Registration and Food Safety Display Board (FSDB) both
        are displayed at a prominent location.
        <br />
        (Note: The FSDBs are readable to both Food an Handlers and Custom.)
      </div>

      <Form layout="vertical" onFinish={onFinish} style={{ marginTop: "24px" }}>
        <div className="my-4">
          <h1 className="text-gray-800 text-lg">
            Submit your FSSAI LICENSE number:
          </h1>
        </div>
        <div className="flex  ">
          <div>
            <h1 className="font-medium text-lg mr-4"> FSSAI license number:</h1>
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
            <Input.Group compact>
              {[...Array(6)].map((_, index) => (
                <Input
                  key={index}
                  maxLength={1}
                  style={{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                    marginRight: "8px",
                  }}
                />
              ))}
            </Input.Group>
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
        <div  className="flex justify-center">
        <Text type="secondary" style={{ marginTop: "16px", display: "block" }}>
        Note: "Please provide your FSSAI license number. Without submitting it,
        you will not be able to proceed to the next section."
      </Text>
        </div>
{/*        
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
      </Form>
      
    </div>
  );
};

export default FssiForm;
