import { useContext, useEffect } from 'react';
import GoogleLoginButton from '../components/Auth/GoogleLoginButton';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <GoogleLoginButton />
    </div>
  );
};

export default Login;
