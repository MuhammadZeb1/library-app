import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyIssues, returnBookAction } from "../features/issues/issueActions.jsx";

const MyBooks = () => {
  const dispatch = useDispatch();
  const { issues, isLoading } = useSelector((state) => state.issues);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const pendingFine = issues?.reduce((total, issue) => {
    return total + (issue.fine > 0 && !issue.finePaid ? issue.fine : 0);
  }, 0) || 0;
  useEffect(() => {
    dispatch(fetchMyIssues());
  }, [dispatch]);

  const handleReturn = async (issueId) => {
    if (window.confirm("Are you sure you want to return this book?")) {
      await dispatch(returnBookAction(issueId));
      dispatch(fetchMyIssues()); // Refresh list
    }
  };

  // Filter logic
  const filteredIssues = issues?.filter((issue) => {
    const statusMatch =
      filterStatus === "All" || issue.status === filterStatus;
    const searchMatch =
      issue.book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.book?.author?.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  }) || [];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Borrowed Books</h1>
          <p className="text-gray-500 mt-1">Track your borrowed books, due dates, and any pending fines.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-lg shadow-sm">
            Total: {filteredIssues?.length || 0}
          </span>
          <span className="bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-sm">
            Pending Fine: Rs.{pendingFine}
          </span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search by Title or Author
            </label>
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all bg-white cursor-pointer"
            >
              <option value="All">All Books</option>
              <option value="Issued">Issued</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(filterStatus !== "All" || searchQuery) && (
          <button
            onClick={() => {
              setFilterStatus("All");
              setSearchQuery("");
            }}
            className="mt-4 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredIssues && filteredIssues.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 font-bold text-gray-700">Book</th>
                <th className="p-4 font-bold text-gray-700">Issue Date</th>
                <th className="p-4 font-bold text-gray-700">Due Date</th>
                <th className="p-4 font-bold text-gray-700">Fine</th>
                <th className="p-4 font-bold text-gray-700">Status</th>
                <th className="p-4 font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => (
                <tr key={issue._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={issue.book?.image ? `http://localhost:5000${issue.book.image}` : "https://via.placeholder.com/50"}
                        alt=""
                        className="w-12 h-16 object-cover rounded shadow-sm"
                      />
                      <div>
                        <p className="font-bold text-gray-800">{issue.book?.title || "Unknown Book"}</p>
                        <p className="text-xs text-gray-500">{issue.book?.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(issue.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-red-600 font-semibold">
                    Rs.{issue.fine || 0}
                    {issue.fine > 0 && !issue.finePaid && (
                      <div className="text-xs text-red-500 mt-1">Pending</div>
                    )}
                    {issue.finePaid && issue.fine > 0 && (
                      <div className="text-xs text-green-600 mt-1">Paid</div>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        issue.status === "Returned"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {issue.status !== "Returned" && (
                      <button
                        onClick={() => handleReturn(issue._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm transition-colors"
                      >
                        Return
                      </button>
                    )}
                    {issue.status === "Returned" && (
                      <span className="text-gray-400 text-sm italic">
                        Returned on {new Date(issue.returnDate).toLocaleDateString()}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl shadow-md text-center">
          <p className="text-xl text-gray-500">
            {searchQuery || filterStatus !== "All"
              ? "No books match your filters."
              : "You haven't borrowed any books yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyBooks;
