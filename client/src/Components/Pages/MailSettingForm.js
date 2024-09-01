import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';

const MailSettingForm = () => {
  const [formValues, setFormValues] = useState({
    proposal_email: '',
    agreement_email: '',
    invoice_email: '',
  });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/setting/getSetting/66c41b85dedfff785c08df21');
        const settings = response.data;

        setFormValues({
          ...settings,
        });
      } catch (error) {
        console.error('Failed to fetch settings', error);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleEditorChange = (name, event, editor) => {
    const data = editor.getData();
    setFormValues({ ...formValues, [name]: data });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updatedValues = {
        ...formValues
      };

      await axios.put('/api/setting/updateSetting/66c41b85dedfff785c08df21', updatedValues);
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings', error);
      alert('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', }}>
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label className='my-4'>Proposal Mail Message</label>
            <CKEditor
              editor={ClassicEditor}
              data={formValues.proposal_email}
              onChange={(event, editor) => handleEditorChange('proposal_email', event, editor)}
            />
          </div>

          
          

          <div style={{ marginBottom: '20px' }}>
            <label>Agreement Mail Message</label>
            <CKEditor
              editor={ClassicEditor}
              data={formValues.agreement_email}
              onChange={(event, editor) => handleEditorChange('agreement_email', event, editor)}
            />
          </div>
         

          <div style={{ marginBottom: '20px' }}>
            <label>Invoice Mail Message</label>
            <CKEditor
              editor={ClassicEditor}
              data={formValues.invoice_email}
              onChange={(event, editor) => handleEditorChange('invoice_email', event, editor)}
            />
          </div>
          

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </form>
      )}
    </div>
  );
};

export default MailSettingForm;
