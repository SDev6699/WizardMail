import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api';
import { getEmailById } from '../../utils/indexedDB';

const EmailView = () => {
  const { id } = useParams();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const fetchEmail = async () => {
      let emailData = await getEmailById(id);
      if (!emailData) {
        const { data } = await API.get(`/emails/${id}`);
        emailData = data;
      }
      setEmail(emailData);
    };

    fetchEmail();
  }, [id]);

  if (!email) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2>{email.subject}</h2>
      <div>From: {email.sender}</div>
      <div dangerouslySetInnerHTML={{ __html: email.htmlBody || email.body }} />
    </div>
  );
};

export default EmailView;
