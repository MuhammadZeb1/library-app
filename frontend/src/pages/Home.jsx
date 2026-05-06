import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
        Smart Library Management System
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        Manage books, track issues, and calculate fines effortlessly. 
        Whether you are a student or an administrator, everything you need is right here.
      </p>

      <div className="space-x-4">
        {user ? (
          <Link 
            to={user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'} 
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
              Login
            </Link>
            <Link to="/register" className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
              Register
            </Link>
          </>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-xl mb-2">Digital Inventory</h3>
          <p className="text-gray-500">Real-time tracking of book availability and quantity.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-xl mb-2">Instant Issuing</h3>
          <p className="text-gray-500">Quickly issue books to students with automated due dates.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-xl mb-2">Fine Tracking</h3>
          <p className="text-gray-500">Automatic fine calculation for overdue returns.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;