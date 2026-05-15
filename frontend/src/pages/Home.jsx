import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import HeroSlider from '../component/HeroSlider'; // Import the HeroSlider component
import ProductSlider from '../component/ProductSlider'; // Import the ProductSlider component
import { fetchBooks } from '../features/books/bookActions'; // Assuming this path
import { resetBookState } from '../features/books/bookSlice'; // Corrected import path for resetBookState

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { books } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks());
    return () => dispatch(resetBookState());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Slider Section */}
      <HeroSlider />

      <div className="container mx-auto px-4 py-16">
        {/* Call to Action / Login/Register Section */}
        <div className="text-center mb-16">
          {user ? (
            <Link 
              to={user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'} 
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-lg"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-lg">
                Login
              </Link>
              <Link to="/register" className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300 shadow-lg">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Features Section (Original Content) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <h3 className="font-bold text-xl mb-2 text-gray-800">Digital Inventory</h3>
            <p className="text-gray-600">Real-time tracking of book availability and quantity.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <h3 className="font-bold text-xl mb-2 text-gray-800">Instant Issuing</h3>
            <p className="text-gray-600">Quickly issue books to students with automated due dates.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
            <h3 className="font-bold text-xl mb-2 text-gray-800">Fine Tracking</h3>
            <p className="text-gray-600">Automatic fine calculation for overdue returns.</p>
          </div>
        </div>

        {/* Featured Books Section (Product Slider) */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">Featured Books</h2>
          <ProductSlider products={books} />
        </section>

        {/* System Statistics Section (New) */}
        <section className="bg-blue-700 text-white p-10 rounded-lg shadow-xl text-center">
          <h2 className="text-4xl font-bold mb-6">Our Library at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-5xl font-extrabold">{books.length}</p>
              <p className="text-lg">Books in Collection</p>
            </div>
            <div>
              <p className="text-5xl font-extrabold">1200+</p>
              <p className="text-lg">Registered Users</p>
            </div>
            <div>
              <p className="text-5xl font-extrabold">150+</p>
              <p className="text-lg">New Books This Month</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
