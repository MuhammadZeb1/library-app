import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import HeroSlider from '../component/HeroSlider';
import ProductSlider from '../component/ProductSlider';
import { fetchBooks } from '../features/books/bookActions';
import { resetBookState } from '../features/books/bookSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { books } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks());
    return () => dispatch(resetBookState());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <HeroSlider />

      <main className="mx-auto max-w-7xl px-6 py-16">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Smarter Library Management
            </span>
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              Manage books, issue records and fines from one professional dashboard.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              A complete school library solution built for students and administrators. Track inventory, automate due-date reminders, and keep fine collections transparent.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              {user ? (
                <Link
                  to={user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'}
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Automated Fine Tracking</h2>
              <p className="text-slate-600">The system calculates overdue fines automatically and alerts students with emails.</p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Inventory Intelligence</h2>
              <p className="text-slate-600">Monitor available stock, issued books, and library activity from a central dashboard.</p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Due Date Alerts</h2>
              <p className="text-slate-600">Automatic reminder emails help students return books on time and reduce fines.</p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Beautiful Reports</h2>
              <p className="text-slate-600">Clear charts and tables make tracking issues and fines simple for administrators.</p>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="rounded-3xl bg-slate-950 px-8 py-12 text-white shadow-2xl sm:px-12">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-2">
                <p className="text-3xl font-bold">{books.length || 0}</p>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Books in Collection</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold">1,200+</p>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Registered Users</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold">150+</p>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">New Books This Month</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-4xl font-semibold text-slate-900">Featured Books</h2>
              <p className="mt-3 max-w-2xl text-slate-600">Browse highlighted titles from the current library catalog. Updated automatically from the inventory.</p>
            </div>
          </div>
          <div className="mt-10">
            <ProductSlider products={books} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
