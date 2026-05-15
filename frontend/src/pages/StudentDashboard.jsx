import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchBooks } from "../features/books/bookActions.jsx";
import { issueBookAction, fetchMyIssues } from "../features/issues/issueActions.jsx";
import StudentBookFilter from "../component/StudentBookFilter.jsx"; // Import the new filter component

const StudentDashboard = () => {
  const dispatch = useDispatch();

  const { books, isLoading } = useSelector((state) => state.books);
  const { issues } = useSelector((state) => state.issues);

  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Helper to check if book is already borrowed
  const isAlreadyBorrowed = (bookId) => {
    if (!issues) return false;
    return issues.some(
      (issue) => 
        (issue.book?._id === bookId || issue.book === bookId) && 
        issue.status === "Issued"
    );
  };

  /*
  =====================================
  FETCH DATA ON LOAD
  =====================================
  */
  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchMyIssues()); // CRITICAL: Fetch user's issues to know what's already borrowed
  }, [dispatch]);

  /*
  =====================================
  BORROW BOOK HANDLER
  =====================================
  */
  const handleBorrow = async (bookId) => {
    if (loadingId === bookId) return;

    setLoadingId(bookId);
    const result = await dispatch(issueBookAction(bookId));
    
    // If successful, refresh issues to update button state
    if (!result.error) {
        dispatch(fetchMyIssues());
        dispatch(fetchBooks()); // Also refresh books to update "available" count
    }
    
    setLoadingId(null);
  };

  // Get unique categories for the filter dropdown
  const categories = useMemo(() => {
    return [...new Set(books.map((book) => book.category))];
  }, [books]);

  // Apply filters to books using useMemo for performance optimization
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearchTerm =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || book.category === selectedCategory;

      return matchesSearchTerm && matchesCategory;
    });
  }, [books, searchTerm, selectedCategory]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Books</h1>

      {/* Student Book Filter Component */}
      <StudentBookFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {isLoading ? (
        <p className="text-lg font-medium">Loading books...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => {
              const borrowed = isAlreadyBorrowed(book._id);
              
              return (
                <div
                  key={book._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-blue-500"
                >
                  {/* IMAGE */}
                  <div className="h-60 bg-gray-100">
                    <img
                      src={
                        book.image
                          ? `http://localhost:5000${book.image}`
                          : "https://via.placeholder.com/300x250?text=No+Image"
                      }
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800">
                      {book.title}
                    </h3>

                    <p className="text-gray-600 italic">by {book.author}</p>

                    <div className="mt-4 flex justify-between items-center">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {book.category}
                      </span>

                      <span
                        className={`font-bold ${
                          book.available > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {book.available > 0
                          ? `${book.available} Available`
                          : "Out of Stock"}
                      </span>
                    </div>

                    {/* BORROW BUTTON - Logic Updated */}
                    <button
                      onClick={() => handleBorrow(book._id)}
                      disabled={book.available === 0 || borrowed || loadingId === book._id}
                      className={`mt-4 w-full py-2 rounded font-semibold transition-all ${
                        borrowed
                          ? "bg-green-100 text-green-700 cursor-default border border-green-200"
                          : book.available === 0
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      }`}
                    >
                      {loadingId === book._id ? (
                        "Processing..."
                      ) : borrowed ? (
                        "✓ Already Borrowed"
                      ) : book.available === 0 ? (
                        "Out of Stock"
                      ) : (
                        "Request to Borrow"
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-4 text-gray-500">
              No books found matching your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
