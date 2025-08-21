import React, { useState } from "react";

const Search = ({ treeData }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [resultNode, setResultNode] = useState(null);

  // Recursive search function
  const searchNode = (node, keyword) => {
    if (node.name.toLowerCase().includes(keyword.toLowerCase())) {
      return node; // return node with all children
    }
    if (!node.children || node.children.length === 0) return null;

    for (let child of node.children) {
      const found = searchNode(child, keyword);
      if (found) return found;
    }

    return null;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchKeyword) return;

    let foundNode = null;
    let root=Array.isArray(treeData)? treeData:[treeData]
    for (let rootNode of root) {
      foundNode = searchNode(rootNode, searchKeyword);
      if (foundNode) break;
    }
    setResultNode(foundNode);
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSearch}>
        <div className="relative mb-4">
          <input
            type="search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="absolute end-2.5 bottom-2.5 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
          >
            Search
          </button>
        </div>
      </form>

      {resultNode && (
        <div className="p-4 border rounded-lg bg-gray-100">
          <h3 className="font-bold">Search Result:</h3>
          <pre>{JSON.stringify(resultNode, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Search;
