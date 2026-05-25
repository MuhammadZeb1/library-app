import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authActions";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());

    // Remove from localStorage
    localStorage.removeItem("user");

    // Navigate to login
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-slate-900"
        : "text-slate-500 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <span className="text-xl">📚</span>
          </div>

          <div>
            <NavLink
              to="/"
              className="text-xl font-semibold tracking-tight text-slate-900"
            >
              Library System
            </NavLink>

            <p className="text-xs text-slate-500">
              Modern lending, fine management, and dashboard analytics
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          {!user && (
            <>
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>

              <NavLink to="/register" className={navClass}>
                Register
              </NavLink>
            </>
          )}

          {user?.role === "student" && (
            <>
              <NavLink to="/student-dashboard" className={navClass}>
                Dashboard
              </NavLink>

              <NavLink to="/my-borrowed-books" className={navClass}>
                My Books
              </NavLink>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <NavLink to="/admin-dashboard" className={navClass}>
                Admin Panel
              </NavLink>

              <NavLink to="/admin/add-book" className={navClass}>
                Add Book
              </NavLink>

              <NavLink to="/admin/all-issues" className={navClass}>
                Issues
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-slate-600 md:inline">
                Signed in as {user.name}
              </span>

              <button
                onClick={logoutHandler}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;