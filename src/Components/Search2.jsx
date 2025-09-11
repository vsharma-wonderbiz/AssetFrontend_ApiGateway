
import React from "react";
const Search2 = ({ SearchTerm, setSearchTerm }) => (
  <div className="relative mb-6">
    {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
    <input
      type="text"
      placeholder="Search assets..."
      value={SearchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
    />
  </div>
);

export default Search2