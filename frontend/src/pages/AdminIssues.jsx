import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllIssues } from '../features/issues/issueActions.jsx';
import IssueFilter from '../component/IssueFilter.jsx'; // Import the new filter component

const AdminIssues = () => {
  const dispatch = useDispatch();
  const { issues, isLoading } = useSelector((state) => state.issues);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [fineStatus, setFineStatus] = useState('all');

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
        (fineStatus === 'paid' && record.fine === 0) || // Assuming fine of 0 means paid
        (fineStatus === 'unpaid' && record.fine > 0);

      return matchesSearchTerm && matchesStatus && matchesFineStatus;
    });
  }, [issues, searchTerm, selectedStatus, fineStatus]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Library Logs (All Issues)</h1>
      
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
                  <td className="p-4 text-red-600 font-bold">${record.fine}</td>
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
