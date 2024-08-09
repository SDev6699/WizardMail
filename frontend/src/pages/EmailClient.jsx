import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import EmailList from '../components/Email/EmailList';
import EmailView from '../components/Email/EmailView';
import ComposeEmail from '../components/Email/ComposeEmail';
import { Routes, Route, useNavigate } from 'react-router-dom';
import API from '../api';
import { saveEmails } from '../utils/indexedDB';

const EmailClient = () => {
  const { user, emails, setEmails } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const loadMoreEmails = async () => {
    const { data } = await API.get(`/emails?page=${page + 1}`);
    setPage(page + 1);
    setEmails(prevEmails => [...prevEmails, ...data]);
    saveEmails(data); // Save fetched emails to IndexedDB
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<EmailList emails={emails} loadMoreEmails={loadMoreEmails} />} />
            <Route path="/email/:id" element={<EmailView />} />
            <Route path="/compose" element={<ComposeEmail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default EmailClient;
