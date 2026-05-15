import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      
      {/* LEFT SIDE */}
      <div className="text-xl font-bold cursor-pointer">
        📚 Library System
      </div>

      {/* CENTER LINKS */}
      <div className="flex gap-5 items-center">
        
        <NavLink to="/" className="hover:underline">
          Home
        </NavLink>

        {!user && (
          <>
            <NavLink to="/login" className="hover:underline">
              Login
            </NavLink>

            <NavLink to="/register" className="hover:underline">
              Register
            </NavLink>
          </>
        )}

        {/* STUDENT LINKS */}
        {user?.role === "student" && (
          <>
            <NavLink to="/student-dashboard" className="hover:underline">
              Dashboard
            </NavLink>

            <NavLink to="/my-borrowed-books" className="hover:underline">
              My Books
            </NavLink>
          </>
        )}

        {/* ADMIN LINKS */}
        {user?.role === "admin" && (
          <>
            <NavLink to="/admin-dashboard" className="hover:underline">
              Admin Panel
            </NavLink>

            <NavLink to="/admin/add-book" className="hover:underline">
              Add Book
            </NavLink>

            <NavLink to="/admin/all-issues" className="hover:underline">
              Issues
            </NavLink>
          </>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div>
        {user ? (
          <button
            onClick={logoutHandler}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;