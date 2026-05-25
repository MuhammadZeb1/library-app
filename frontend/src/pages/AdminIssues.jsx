import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllIssues, payFineAction, deleteIssueAction } from '../features/issues/issueActions.jsx';
import IssueFilter from '../component/IssueFilter.jsx'; // Import the new filter component

const AdminIssues = () => {
  const dispatch = useDispatch();
  const { issues, isLoading } = useSelector((state) => state.issues);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [fineStatus, setFineStatus] = useState('all');
  const [payingId, setPayingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const totalPendingFine = issues?.reduce(
    (total, issue) => total + (issue.fine > 0 && !issue.finePaid ? issue.fine : 0),
    0
  ) || 0;

  const totalCollectedFine = issues?.reduce(
    (total, issue) => total + (issue.finePaid ? issue.paidAmount : 0),
    0
  ) || 0;

  const totalOverdueIssues = issues?.filter(
    (issue) => issue.status === 'Issued' && issue.fine > 0
  ).length || 0;

  const handlePayFine = async (issueId) => {
    setPayingId(issueId);
    await dispatch(payFineAction(issueId));
    await dispatch(fetchAllIssues());
    setPayingId(null);
  };

  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm('Delete this issue record permanently?')) return;
    setDeletingId(issueId);
    await dispatch(deleteIssueAction(issueId));
    await dispatch(fetchAllIssues());
    setDeletingId(null);
  };

  useEffect(() => {
    dispatch(fetchAllIssues());
  }, [dispatch]);

  // Apply filters to issues using useMemo for performance optimization
  const filteredIssues = useMemo(() => {
    return issues.filter((record) => {
      const matchesSearchTerm =
        record.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.book?.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || record.status === selectedStatus;

      const matchesFineStatus =
        fineStatus === 'all' ||
        (fineStatus === 'paid' && record.finePaid) ||
        (fineStatus === 'unpaid' && !record.finePaid && record.fine > 0);

      return matchesSearchTerm && matchesStatus && matchesFineStatus;
    });
  }, [issues, searchTerm, selectedStatus, fineStatus]);

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Library Logs (All Issues)</h1>
          <p className="text-gray-500 mt-2">Review issued books, current fines, and admin actions.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm uppercase tracking-wide text-gray-500">Pending Fine</p>
            <p className="text-2xl font-bold text-red-600">Rs.{totalPendingFine}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm uppercase tracking-wide text-gray-500">Collected Fine</p>
            <p className="text-2xl font-bold text-purple-600">Rs.{totalCollectedFine}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm uppercase tracking-wide text-gray-500">Overdue Records</p>
            <p className="text-2xl font-bold text-orange-600">{totalOverdueIssues}</p>
          </div>
        </div>
      </div>
      
      {/* Issue Filter Component */}
      <IssueFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        fineStatus={fineStatus}
        setFineStatus={setFineStatus}
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left">Student</th>
              <th className="p-4 text-left">Book Title</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Due Date</th>
              <th className="p-4 text-left">Fine</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.length > 0 ? (
              filteredIssues.map((record) => (
                <tr key={record._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{record.student?.name} <br/> <span className="text-xs text-gray-500">{record.student?.email}</span></td>
                  <td className="p-4">{record.book?.title}</td>
                  <td className="p-4">
                     <span className={record.status === 'Returned' ? 'text-green-600' : 'text-orange-600'}>
                      {record.status}
                     </span>
                  </td>
                  <td className="p-4 font-mono">{new Date(record.dueDate).toLocaleDateString()}</td>
                  <td className="p-4 text-red-600 font-bold">
                    <div>${record.fine || 0}</div>
                    {!record.finePaid && record.fine > 0 && (
                      <button
                        onClick={() => handlePayFine(record._id)}
                        disabled={payingId === record._id}
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                      >
                        {payingId === record._id ? "Processing..." : "Mark Paid"}
                      </button>
                    )}
                    {record.finePaid && record.paidAmount > 0 && (
                      <div className="text-xs text-green-600 mt-2">Paid</div>
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDeleteIssue(record._id)}
                      disabled={deletingId === record._id}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      {deletingId === record._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No issues found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminIssues;
