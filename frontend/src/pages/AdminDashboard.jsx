import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  fetchBooks,
  deleteBook,
} from "../features/books/bookActions.jsx";

import { resetBookState } from "../features/books/bookSlice.jsx";

import BookFilter from "../component/BookFilter.jsx"; // Import the new filter component

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { books, isLoading, isError, message } = useSelector(
    (state) => state.books
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchBooks());

    return () => dispatch(resetBookState());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this book permanently?")) {
      dispatch(deleteBook(id));
    }
  };

  // Get unique categories for the filter dropdown
  const categories = useMemo(() => {
    return [...new Set(books.map((book) => book.category))];
  }, [books]);

  // Apply filters to books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearchTerm =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || book.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "available" && book.available > 0) ||
        (selectedStatus === "out_of_stock" && book.available === 0);

      return matchesSearchTerm && matchesCategory && matchesStatus;
    });
  }, [books, searchTerm, selectedCategory, selectedStatus]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your library inventory and books
          </p>
        </div>

        <Link
          to="/admin/add-book"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition duration-300 font-medium"
        >
          + Add New Book
        </Link>
      </div>

      {/* Error Message */}
      {isError && (
        <div className="bg-red-100 border border-red-300 text-red-600 p-4 rounded-lg mb-6">
          {message}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg font-medium text-gray-600">
            Loading inventory...
          </p>
        </div>
      ) : (
        <>
          {/* Book Filter Component */}
          <BookFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            categories={categories}
          />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">
              <h3 className="text-gray-500 text-sm font-medium">
                Total Books
              </h3>

              <p className="text-3xl font-bold text-gray-800 mt-2">
                {filteredBooks.length}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
              <h3 className="text-gray-500 text-sm font-medium">
                Available Books
              </h3>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {filteredBooks.reduce(
                  (acc, book) => acc + book.available,
                  0
                )}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500">
              <h3 className="text-gray-500 text-sm font-medium">
                Out of Stock
              </h3>

              <p className="text-3xl font-bold text-red-500 mt-2">
                {
                  filteredBooks.filter((book) => book.available === 0)
                    .length
                }
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Book
                    </th>

                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Category
                    </th>

                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Stock
                    </th>

                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="p-4 text-center text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBooks.map((book) => (
                    <tr
                      key={book._id}
                      className="border-b hover:bg-gray-50 transition duration-200"
                    >
                      {/* Book Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              book.image
                                ? `http://localhost:5000${book.image}`
                                : "https://via.placeholder.com/80x100?text=No+Image"
                            }
                            alt={book.title}
                            className="w-16 h-20 rounded-lg object-cover shadow-sm border"
                          />

                          <div>
                            <h2 className="font-bold text-gray-800 text-lg">
                              {book.title}
                            </h2>

                            <p className="text-gray-500 text-sm">
                              {book.author}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          {book.category}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="p-4 font-semibold text-gray-700">
                        {book.available} / {book.quantity}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {book.available > 0 ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            Available
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/admin/edit-book/${book._id}`}
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(book._id)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {filteredBooks.length === 0 && (
                <div className="text-center py-16">
                  <h2 className="text-2xl font-bold text-gray-700">
                    No Books Found
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Adjust your filters or add a new book to inventory.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
