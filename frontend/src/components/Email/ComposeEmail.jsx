import { useState } from 'react';
import API from '../../api';
import { CopilotTextarea } from '@copilotkit/react-textarea';

const ComposeEmail = () => {
  const [formData, setFormData] = useState({
    recipients: '',
    subject: '',
    body: '',
    attachments: []
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    Object.keys(formData).forEach(key => {
      formDataObj.append(key, formData[key]);
    });
    API.post('/emails', formDataObj).then(response => {
      console.log('Email sent', response.data);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        type="text"
        name="recipients"
        placeholder="Recipients"
        value={formData.recipients}
        onChange={handleChange}
        className="block w-full p-2 mb-2 border"
      />
      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={formData.subject}
        onChange={handleChange}
        className="block w-full p-2 mb-2 border"
      />
      <CopilotTextarea
        name="body"
        value={formData.body}
        onChange={(value) => setFormData({ ...formData, body: value })}
        className="block w-full p-2 mb-2 border"
      />
      <input
        type="file"
        name="attachments"
        multiple
        onChange={(e) => setFormData({ ...formData, attachments: e.target.files })}
        className="block w-full p-2 mb-2 border"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Send</button>
    </form>
  );
};

export default ComposeEmail;
