// import React from "react";

// const TreeNode = ({ node }) => {
//   return (
//     <li style={{color:"black"}}>
//       <div className="assetn-name" >{node.name}</div>
//       {node.children && node.children.length > 0 && (
//         <ul>
//           {node.children.map((child) => (
//             <TreeNode key={child.id} node={child} />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// export default TreeNode;

import React from "react";

const TreeNode = ({ node }) => {
  return (
    <li className="ml-4">
      <div className="assetn-name flex items-center py-2 px-3 text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition duration-200">
        <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
        {node.name}
      </div>
      {node.children && node.children.length > 0 && (
        <ul className="ml-4 border-l-2 border-gray-200 pl-4">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
