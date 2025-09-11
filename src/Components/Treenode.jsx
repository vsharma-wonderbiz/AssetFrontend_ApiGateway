import React, { useEffect, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { useNavigate } from "react-router-dom";

const TreeNode = ({ node, SearchTerm, onSuccess, isRoot = false,setShowOverlay,setSelectedNode,setOverlayMode,userRole,token }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [AddSignal,setAddSignal] = useState(false);
  const [DisplaySignals,setDisplaySignals] = useState(false);
  const navigate=useNavigate();
  const [dragdata,setDragdata]=useState();

  // console.log(SearchTerm)
  const hasMatch=(node.name?.toLowerCase()  || "").includes(SearchTerm?.toLowerCase());
  const childMatch=node.children?.some(child=>
    child.name.toLowerCase().includes(SearchTerm?.toLowerCase())
  )

  // console.log(hasMatch);
  // console.log(childMatch);
  const [expanded, setExpanded] = useState(false); 

  useEffect(()=>{
    if(SearchTerm && (hasMatch || childMatch)){
      setExpanded(true);
    }else{
      setExpanded(false)
    }
  },[SearchTerm]);

  const nodename = node.name;

  
  const parts = SearchTerm && SearchTerm.trim()
    ? nodename.split(new RegExp(`(${SearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi"))
    : [nodename];

  const copyID = () => {
    navigator.clipboard.writeText(node.id);
    toast.success("Copied ID: " + node.id);
  };

 
  const handleDelete = async () => {
  try {
    // console.log("Deleting with token:", token);

    const res = await fetch(`https://localhost:7285/api/Asset/${node.id}`, {
      method: "DELETE",
      credentials:'include'
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Delete failed: ${res.status} - ${errorText}`);
    }

    toast.success(`Deleted node: ${node.name}`);
    // window.location.reload();
    setOpenDialog(false);

    if (onSuccess) await onSuccess();
  } catch (err) {
    console.error("Delete error:", err);
    toast.error("Failed to delete node");
  }
};
 
  const { show } = useContextMenu({ id: `menu_${node.id}` });

  const handleRightClick = (e) => {
    if (!e) return; 
    e.preventDefault(); 
    e.stopPropagation(); 
    show({
      event: e,
      position: { x: e.clientX, y: e.clientY }
    });
  };


  const handleAddSignal = () => {
    setShowOverlay(true);
     setOverlayMode("add");   
    setSelectedNode(node);
  
  };

  const handleDisplaySignals=()=>{
    // console.log(node);
      navigate("/display-signals",{state:node})
  }
    
 const handleDragStart = (e, nodeId) => {
  console.log("Dargging id",nodeId)
  e.dataTransfer.setData("assetId", nodeId);

  const dragIcon = document.createElement("div");
  dragIcon.style.width = "100px";
  dragIcon.style.height = "20px";
  dragIcon.style.background = "lightblue";
  dragIcon.style.display = "flex";
  dragIcon.style.justifyContent = "center";
  dragIcon.style.alignItems = "center";
  dragIcon.innerText = "Dragging...";
  document.body.appendChild(dragIcon);

  e.dataTransfer.setDragImage(dragIcon, 50, 10);

  setTimeout(() => document.body.removeChild(dragIcon), 0);
};

const allowDrop=(e)=>{
   e.preventDefault();
}
//  console.log(dragdata);  
const handleDrop=(e,nodeId)=>{
  console.log("Dropping the id",nodeId);
  e.dataTransfer.setData("parentAssetID",nodeId)
}


  return (
    <li className={`ml-4 mb-2`}>
      <div
        className={`flex items-center justify-between py-2 px-4 rounded-lg cursor-pointer transition-colors ${
          isRoot ? "bg-blue-50 w-full hover:bg-blue-100" : "bg-gray-50 hover:bg-gray-100"
        }`}
        onClick={() => setExpanded(!expanded)}
        onContextMenu={handleRightClick}
        draggable={true}
        onDragOver={allowDrop}
        onDragStart={(e)=>handleDragStart(e, node.id)}
        onDrop={(e)=>handleDrop(e,node.id)}
      >
        <div className="flex items-center space-x-2">
          {node.children && node.children.length > 0 && (
            expanded ? <ExpandMore className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          {parts.map((part, index) =>
            SearchTerm && SearchTerm.trim() && part.toLowerCase() === SearchTerm.toLowerCase() ? (
              <span key={index} className="bg-yellow-300 font-bold">{part}</span>
            ) : (
              <span key={index}>{part}</span>
            )
          )}
        </div>

        <div className="flex items-center space-x-2">
          {userRole === "Admin" && (
  <div className="flex items-center gap-2">
    <ContentCopyIcon
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        copyID();
      }}
      title="Copy ID"
    />

    <DeleteIcon
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        setOpenDialog(true);
      }}
      title="Delete"
    />
  </div>
)}
        </div>
      </div>

     
      <Menu id={`menu_${node.id}`}>
        {userRole==="Admin" ?<Item onClick={handleAddSignal}>Add Signal</Item>:<div></div>}
         
         <Item onClick={handleDisplaySignals}>Display Signals</Item>
      </Menu>

      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "<strong>{node.name}</strong>"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      
      {expanded && node.children && node.children.length > 0 && (
        <ul className={`ml-6 border-l-2 border-gray-200 pl-4`}>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              SearchTerm={SearchTerm}
              onSuccess={onSuccess}
              isRoot={false}
              setSelectedNode={setSelectedNode}
              setShowOverlay={setShowOverlay}
              setOverlayMode={setOverlayMode}
              userRole={userRole}
              token={token}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;