import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import API from '../../api';

const GoogleLoginButton = () => {
  const { setUser } = useContext(AuthContext);

  const handleLogin = () => {
    window.location.href = API.defaults.baseURL + '/auth/google';
  };

  return (
    <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
