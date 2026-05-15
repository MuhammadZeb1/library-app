import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllIssues } from "../features/issues/issueActions.jsx";

const AllIssues = () => {
  const dispatch = useDispatch();
  const { issues, isLoading } = useSelector((state) => state.issues);
  console.log("issuses",issues)

  useEffect(() => {
    dispatch(fetchAllIssues());
  }, [dispatch]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Issue Records (Admin)</h1>
        <div className="flex gap-4">
            <span className="bg-white border px-4 py-2 rounded-lg shadow-sm text-sm">
                Total Issues: <span className="font-bold">{issues?.length || 0}</span>
            </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : issues && issues.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-4 font-bold">Student</th>
                <th className="p-4 font-bold">Book Details</th>
                <th className="p-4 font-bold">Issue Date</th>
                <th className="p-4 font-bold">Due Date</th>
                <th className="p-4 font-bold">Fine</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {issues.map((issue) => (
                <tr key={issue._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{issue.student?.name || "N/A"}</div>
                    <div className="text-xs text-gray-500">{issue.student?.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-blue-600">{issue.book?.title || "Deleted Book"}</div>
                    <div className="text-xs text-gray-500">{issue.book?.author} | {issue.book?.category}</div>
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-gray-600">
                    {new Date(issue.dueDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={issue.fine > 0 ? "text-red-600 font-bold" : "text-gray-500"}>
                        ${issue.fine || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      issue.status === "Returned" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {issue.status}
                    </span>
                    {issue.status === "Returned" && (
                        <div className="text-[10px] text-gray-400 mt-1 italic">
                            Ret: {new Date(issue.returnDate).toLocaleDateString()}
                        </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl shadow-md text-center">
          <p className="text-xl text-gray-500">No issue records found.</p>
        </div>
      )}
    </div>
  );
};

export default AllIssues;
