import React, { useState, useEffect } from "react";
import { Form, Input, Button, Spin, Typography, message } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";

const { Title } = Typography;

const MailSettingForm = () => {
  const [formValues, setFormValues] = useState({
    proposal_email: "",
    agreement_email: "",
    invoice_email: "",
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
      message.success(`${name.replace("_", " ")} updated successfully`);
    } catch (error) {
      console.error(`Failed to update ${name}`, error);
      message.error(`Failed to update ${name}`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px" }}>
       <Spin spinning={isFetching}>
       {!isFetching && ( <Form layout="vertical">
          <Title level={3}>Account Mail Settings</Title>

          <div className="my-4">
            <Form.Item label="Proposal Mail Message" name="proposal_email">
              <CKEditor
                editor={ClassicEditor}
                data={formValues.proposal_email}
                onChange={(event, editor) =>
                  handleEditorChange("proposal_email", event, editor)
                }
              />
            </Form.Item>
            <Button
              type="primary"
              onClick={() => handleSave("proposal_email")}
              style={{ marginTop: "10px", marginRight: "10px" }}
            >
              Save Proposal Message
            </Button>
          </div>
          <div className="my-4">
            <Form.Item label="Agreement Mail Message" name="agreement_email">
              <CKEditor
                editor={ClassicEditor}
                data={formValues.agreement_email}
                onChange={(event, editor) =>
                  handleEditorChange("agreement_email", event, editor)
                }
              />
            </Form.Item>
            <Button
              type="primary"
              onClick={() => handleSave("agreement_email")}
              style={{ marginTop: "10px", marginRight: "10px" }}
            >
              Save Agreement Message
            </Button>
          </div>
          <Form.Item label="Invoice Mail Message" name="invoice_email">
            <CKEditor
              editor={ClassicEditor}
              data={formValues.invoice_email}
              onChange={(event, editor) =>
                handleEditorChange("invoice_email", event, editor)
              }
            />
          </Form.Item>
          <Button
            type="primary"
            onClick={() => handleSave("invoice_email")}
            style={{ marginTop: "10px" }}
          >
            Save Invoice Message
          </Button>
        </Form>)}
        </Spin>
    </div>
  );
};

export default MailSettingForm;
