import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../features/auth/authActions.jsx'; // register comes from here
import { reset } from '../features/auth/authSlice.jsx';     // reset comes from here

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isError, message, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard');
    }
    dispatch(reset());
  }, [user, navigate, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Library Login</h2>
        {isError && <p className="text-red-500 mb-4 text-sm">{message}</p>}
        
        <input name="email" type="email" placeholder="Email" onChange={onChange} className="w-full p-2 mb-4 border rounded" required />
        <input name="password" type="password" placeholder="Password" onChange={onChange} className="w-full p-2 mb-6 border rounded" required />

        <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p className="mt-4 text-sm text-center">
          New here? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;