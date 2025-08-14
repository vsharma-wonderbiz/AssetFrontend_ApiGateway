import React from "react";
import TreeNode from "./Treenode";

const RenderTress=({treeData ,onSuccess})=>{

  console.log("the data getting ",treeData);  
    return(
        <>
        {treeData && treeData.length > 0 && (
            <ul className="tree-view">
              {treeData.map((node) => (
                <TreeNode key={node.id} node={node} onSuccess={onSuccess} />
              ))}
            </ul>
          )}
        </>
    )
}

export default RenderTress;