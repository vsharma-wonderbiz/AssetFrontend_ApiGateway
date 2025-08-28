import React, { useState } from "react";
import RenderTress from "./RenderTress";

const Search = ({ Data }) => {
  const treeData = Array.isArray(Data) ? Data : (Data && Data.children) || [];
  
  const [searchKeyword, setSearchKeyword] = useState("");
  const [resultNode, setResultNode] = useState(null);

  // Simplified function to convert string to lowercase
  const normalizeString = (str) => {
    return str.toLowerCase().trim();
  };

  // Recursive search function that searches through all levels
  const searchNode = (node, keyword) => {
    const nodeName = normalizeString(node.name);
    const searchKey = normalizeString(keyword);

    if (nodeName.includes(searchKey)) {
      return node; // Return original node, not modified
    }

    if (!node.children || node.children.length === 0) return null;

    // Search through all children recursively
    for (let child of node.children) {
      const found = searchNode(child, keyword);
      if (found) return found;
    }

    return null;
  };

  // Alternative: Search and return ALL matching nodes (not just first match)
  const searchAllNodes = (nodes, keyword) => {
    const results = [];
    
    const searchRecursive = (node, keyword) => {
      const nodeName = normalizeString(node.name);
      const searchKey = normalizeString(keyword);

      if (nodeName.includes(searchKey)) {
        results.push(node);
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach(child => searchRecursive(child, keyword));
      }
    };

    nodes.forEach(rootNode => searchRecursive(rootNode, keyword));
    return results;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      setResultNode(null);
      return;
    }

    // Option 1: Find first matching node (including nested ones)
    let foundNode = null;
    for (let rootNode of treeData) {
      foundNode = searchNode(rootNode, searchKeyword);
      if (foundNode) break;
    }
    
    // Option 2: Find ALL matching nodes (uncomment to use this instead)
    // const allMatches = searchAllNodes(treeData, searchKeyword);
    // setResultNode(allMatches.length > 0 ? allMatches : null);
    
    setResultNode(foundNode);
    console.log('Search result:', foundNode);
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
          <pre>{JSON.stringify(resultNode.name  , null, 2)}</pre>
        </div>
        // <RenderTress treeData={resultNode}/>
      )}
    </div>
  );
};

export default Search;