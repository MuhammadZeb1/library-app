import React from 'react';

const BookFilter = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, selectedStatus, setSelectedStatus, categories }) => {

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Term */}
        <div>
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
            Search by Title or Author
          </label>
          <input
            type="text"
            id="searchTerm"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholder="e.g., The Lord of the Rings"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Availability Status
          </label>
          <select
            id="status"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BookFilter;
