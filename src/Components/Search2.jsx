// import React, { useState } from "react";
// import RenderTress from "./RenderTress";

// const Search2 = ({ SearchTerm,SetSearchTerm }) => {


//   return (
//     <div className="max-w-md mx-auto">
//       <form>
//         <div className="relative mb-4">
//           <input
//             type="search"
//             className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
//             placeholder="Search..."
//             value={SearchTerm}
//             onChange={(e) => SetSearchTerm(e.target.value)}
//           />
//           <button
//             type="submit"
//             className="absolute end-2.5 bottom-2.5 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
//           >
//             Search
//           </button>
//         </div>
//       </form>

//       {/* {resultNode && (
//         <div className="p-4 border rounded-lg bg-gray-100">
//           <h3 className="font-bold">Search Result:</h3>
//           <pre>{JSON.stringify(resultNode.name  , null, 2)}</pre>
//         </div>
//         // <RenderTress treeData={resultNode}/>
//       )} */}
//     </div>
//   );
// };

// export default Search2;
import React from "react";
const Search2 = ({ SearchTerm, SetSearchTerm }) => (
  <div className="relative mb-6">
    {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
    <input
      type="text"
      placeholder="Search assets..."
      value={SearchTerm}
      onChange={(e) => SetSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
    />
  </div>
);

export default Search2