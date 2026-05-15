import React from "react";
import { Routes, Route } from "react-router-dom";

// Auth Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Dashboard & Book Management Pages
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import BookForm from "./pages/BookForm";
import MyBooks from "./pages/MyBooks";
import AdminIssues from "./pages/AdminIssues";
import AllIssues from "./pages/AllIssues";
import Navbar from "./pages/Navbar";

const App = () => {
  return (
    <>
    <Navbar/>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-borrowed-books" element={<MyBooks />} />
      <Route path="/admin/all-issues" element={<AdminIssues />} />
      {/* <Route path="/admin/all-issues" element={<AllIssues />} /> */}

      {/* Admin Protected Routes */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/add-book" element={<BookForm />} />
      {/* The :id allows the same form to fetch a specific book for editing */}
      <Route path="/admin/edit-book/:id" element={<BookForm />} />

      {/* Student Protected Routes */}
      <Route path="/student-dashboard" element={<StudentDashboard />} />
    </Routes>
    </>
  );
};

export default App;
