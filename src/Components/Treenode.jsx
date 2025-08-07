import React from "react";

const TreeNode = ({ node }) => {
  return (
    <li style={{color:"black"}}>
      <div className="assetn-name" >{node.name}</div>
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
