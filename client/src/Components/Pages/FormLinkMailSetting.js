import React, { useState, useEffect } from "react";
import { Form, Input, Button, Spin, Typography, message } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";

const { Title } = Typography;

const FormLinkMailSetting = () => {
  const [formValues, setFormValues] = useState({
    formlink_email: "",
  });

  const [isFetching, setIsFetching] = useState(true);
  const [loading,setLoading]=useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "/api/setting/getSetting/66c41b85dedfff785c08df21"
        );
        const settings = response.data;

        setFormValues({
          ...settings,
        });
      } catch (error) {
        console.error("Failed to fetch settings", error);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, []);

  const handleEditorChange = (name, event, editor) => {
    const data = editor.getData();
    setFormValues({ ...formValues, [name]: data });
  };

  const handleSave = async (name) => {
    try {
      const updatedValues = {
        [name]: formValues[name],
      };

      await axios.put(
        `/api/setting/updateSetting/66c41b85dedfff785c08df21`,
        updatedValues
      );
      message.success(`Form Link custom mail updated successfully`);
    } catch (error) {
      console.error(`Failed to update ${name}`, error);
      message.error(`Failed to update ${name}`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px" }}>
       <Spin spinning={isFetching}>
       {!isFetching && ( <Form layout="vertical">
          <Title level={3}>Form Link Mail Settings</Title>

          <Form.Item label="From Link Mail" name="formlink_email">
            <CKEditor
              editor={ClassicEditor}
              data={formValues.formlink_email}
              onChange={(event, editor) =>
                handleEditorChange("formlink_email", event, editor)
              }
            />
          </Form.Item>
          <Button
            type="primary"
            onClick={() => handleSave("formlink_email")}
            style={{ marginTop: "10px" }}
          >
            Save 
          </Button>
        </Form>)}
        </Spin>
    </div>
  );
};

export default FormLinkMailSetting;
