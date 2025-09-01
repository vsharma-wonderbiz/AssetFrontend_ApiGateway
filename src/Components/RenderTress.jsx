import React from "react";
import TreeNode from "./Treenode";

const RenderTress=({treeData , onSuccess,SearchTerm,setShowOverlay,setSelectedNode,setOverlayMode})=>{


  // console.log("the data getting ",treeData);  
    return(
        <>
        {treeData && treeData.length > 0 && (
            <ul className="tree-view">
              {treeData.map((node) => (
                <TreeNode key={node.id} 
                node={node}
                 onSuccess={onSuccess}
                  SearchTerm={SearchTerm}
                   setShowOverlay={setShowOverlay} 
                   setSelectedNode={setSelectedNode}
                   setOverlayMode={setOverlayMode}
                   />
              ))}
            </ul>
          )}
        </>
    )
}

export default RenderTress;