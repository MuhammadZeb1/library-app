import React from 'react';

const IssueFilter = ({ searchTerm, setSearchTerm, selectedStatus, setSelectedStatus, fineStatus, setFineStatus }) => {

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter Issues</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Term */}
        <div>
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
            Search by Student or Book Title
          </label>
          <input
            type="text"
            id="searchTerm"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholder="e.g., John Doe or React Basics"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Issue Status
          </label>
          <select
            id="status"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Issued">Issued</option>
            <option value="Returned">Returned</option>
          </select>
        </div>

        {/* Fine Status Filter */}
        <div>
          <label htmlFor="fineStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Fine Status
          </label>
          <select
            id="fineStatus"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            value={fineStatus}
            onChange={(e) => setFineStatus(e.target.value)}
          >
            <option value="all">All Fine Statuses</option>
            <option value="paid">Fine Paid</option>
            <option value="unpaid">Fine Unpaid</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default IssueFilter;
