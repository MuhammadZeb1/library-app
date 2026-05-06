import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../features/auth/authActions.jsx'; // register comes from here
import { reset } from '../features/auth/authSlice.jsx';     // reset comes from here

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'student'
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSuccess, isError, message, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess) {
      alert("Registration Successful! Please Login.");
      navigate('/login');
    }
    dispatch(reset());
  }, [isSuccess, navigate, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        {isError && <p className="text-red-500 mb-4 text-sm">{message}</p>}
        
        <input name="name" type="text" placeholder="Full Name" onChange={onChange} className="w-full p-2 mb-4 border rounded" required />
        <input name="email" type="email" placeholder="Email" onChange={onChange} className="w-full p-2 mb-4 border rounded" required />
        <input name="password" type="password" placeholder="Password" onChange={onChange} className="w-full p-2 mb-4 border rounded" required />
        
        <select name="role" onChange={onChange} className="w-full p-2 mb-6 border rounded">
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        <p className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;