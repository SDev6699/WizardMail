import { createContext, useState, useEffect } from 'react';
import API, { socket } from '../api';
import { getEmails, saveEmails } from '../utils/indexedDB';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      const storedEmails = await getEmails();
      setEmails(storedEmails);
      if (user) {
        const { data } = await API.get('/emails');
        saveEmails(data);
        setEmails(data);
      }
    };

    fetchEmails();
  }, [user]);

  useEffect(() => {
    API.get('/checkAuth')
      .then(response => {
        if (response.data.authenticated) {
          setUser(response.data.user);
        }
      })
      .catch(error => {
        console.error('Auth check error:', error);
      });
  }, []);

  useEffect(() => {
    socket.on('new-email', async (email) => {
      const updatedEmails = [email, ...emails];
      console.log(updatedEmails);
      setEmails(updatedEmails);
      await saveEmails(updatedEmails);
    });
  }, [emails]);

  return (
    <AuthContext.Provider value={{ user, setUser, emails }}>
      {children}
    </AuthContext.Provider>
  );
};
