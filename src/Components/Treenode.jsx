
// import axios from "axios";
// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
// import DeleteIcon from '@mui/icons-material/Delete';


// const TreeNode = ({ node, onSuccess,SearchTerm }) => {
//   const[Open,SetOpen]=useState(false);

//   const nodename=node.name;
//  const lowername=nodename.toLowerCase();


//  const parts=lowerSearch ? nodename.split(new RegExp(`${SearchTerm}`,"gi")):[nodename]; 

//   const CopyID=(e)=>{
//     navigator.clipboard.writeText(node.id);
//     toast.success("copy the id")
//     console.log(node.id);
//   }

//   const HandleDelete= async ()=>{
    
//     SetOpen(!Open);
//     console.log(Open);
//   }

//   const Delete= async ()=>{
//   try{
//       const res=await axios.delete(`https://localhost:7285/api/asset/${node.id}`)
//       toast.success(`Node with id ${node.id} deleted`);
//       console.log(node.id)
//       onSuccess();
//     }catch(error){
//       console.log(node.id)
//       toast.error(error.response.data.message);
//     }
//   }

//   return (
//       <div>
//     <li className="ml-4">
//       <div className="assetn-name flex items-center py-2 px-3 text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition duration-200">
//         <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
//         {node.name}
//        <ContentCopyIcon
//           className="ml-[10px] !text-[16px]"
//         onClick={CopyID} 
//               />
//         <DeleteIcon className="!text-[16px]" onClick={HandleDelete}/>
//       </div>
//       {node.children && node.children.length > 0 && (
//         <ul className="ml-4 border-l-2 border-gray-200 pl-4">
//           {node.children.map((child) => (
//             <TreeNode key={child.id} node={child} onSuccess={onSuccess}/>
//           ))}
//         </ul>
//       )}
//     </li>
//      <Dialog open={Open} onClose={() => SetOpen(false)}>
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent>
//           Are you sure you want to delete asset with ID:<strong>{node.id}</strong>?
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => SetOpen(false)}>Cancel</Button>
//           <Button color="error" onClick={Delete}>Delete</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default TreeNode;

// import React, { useState } from "react";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { toast } from "react-toastify";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

// const TreeNode = ({ node, SearchTerm, onDelete }) => {
//   const [openDialog, setOpenDialog] = useState(false);

//   const nodename = node.name;

//   // Split node name into parts for highlighting
//   const parts = SearchTerm && SearchTerm.trim()
//     ? nodename.split(new RegExp(`(${SearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi"))
//     : [nodename];

//   // Copy node ID to clipboard
//   const copyID = () => {
//     navigator.clipboard.writeText(node.id);
//     toast.success("Copied ID: " + node.id);
//   };

//   // Handle delete with API call
//   const handleDelete = async () => {
//     try {
//       const res = await fetch(`https://localhost:7285/api/Asset/delete/${node.id}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) throw new Error("Failed to delete node");

//       toast.success(`Deleted node: ${node.name}`);
//       onDelete(node.id); // Remove node from tree in parent
//       setOpenDialog(false);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete node");
//     }
//   };

//   return (
//     <li className="ml-4">
//       <div className="asset-name flex items-center py-2 px-3 text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition duration-200">
//         <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>

//         {/* Highlight matching parts */}
//         {parts.map((part, index) =>
//           SearchTerm && SearchTerm.trim() && part.toLowerCase() === SearchTerm.toLowerCase() ? (
//             <span key={index} className="bg-yellow-300 font-bold">{part}</span>
//           ) : (
//             <span key={index}>{part}</span>
//           )
//         )}

//         <ContentCopyIcon className="ml-2 cursor-pointer" onClick={copyID} />
//         <DeleteIcon className="ml-2 cursor-pointer" onClick={() => setOpenDialog(true)} />
//       </div>

//       {/* Confirmation Dialog */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           Are you sure you want to delete "<strong>{node.name}</strong>"?
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
//           <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Render children recursively */}
//       {node.children && node.children.length > 0 && (
//         <ul className="ml-4 border-l-2 border-gray-200 pl-4">
//           {node.children.map((child) => (
//             <TreeNode key={child.id} node={child} SearchTerm={SearchTerm} onDelete={onDelete} />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// export default TreeNode;




// import React, { useState } from "react";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { toast } from "react-toastify";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

// const TreeNode = ({ node, SearchTerm, onSuccess }) => {
//   const [openDialog, setOpenDialog] = useState(false);

//   const nodename = node.name;

//   // Split node name into parts for highlighting
//   const parts = SearchTerm && SearchTerm.trim()
//     ? nodename.split(new RegExp(`(${SearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi"))
//     : [nodename];

//   const copyID = () => {
//     navigator.clipboard.writeText(node.id);
//     toast.success("Copied ID: " + node.id);
//   };

//   // Delete node and refresh tree
//   const handleDelete = async () => {
//     try {
//       const res = await fetch(`https://localhost:7285/api/Asset/${node.id}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) throw new Error("Failed to delete node");

//       toast.success(`Deleted node: ${node.name}`);
//       setOpenDialog(false);

//       // Refetch updated tree from backend
//       if (onSuccess) {
//         await onSuccess();
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete node");
//     }
//   };

//   return (
//     <li className="ml-4">
//       <div className="asset-name flex items-center py-2 px-3 text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition duration-200">
//         <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>

//         {/* Highlight matching parts */}
//         {parts.map((part, index) =>
//           SearchTerm && SearchTerm.trim() && part.toLowerCase() === SearchTerm.toLowerCase() ? (
//             <span key={index} className="bg-yellow-300 font-bold">{part}</span>
//           ) : (
//             <span key={index}>{part}</span>
//           )
//         )}

//         <ContentCopyIcon className="ml-2 cursor-pointer" onClick={copyID} />
//         <DeleteIcon className="ml-2 cursor-pointer" onClick={() => setOpenDialog(true)} />
//       </div>

//       {/* Confirmation Dialog */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           Are you sure you want to delete "<strong>{node.name}</strong>"?
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
//           <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Render children recursively */}
//       {node.children && node.children.length > 0 && (
//         <ul className="ml-4 border-l-2 border-gray-200 pl-4">
//           {node.children.map((child) => (
//             <TreeNode key={child.id} node={child} SearchTerm={SearchTerm} onSuccess={onSuccess} />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// export default TreeNode;
















// --------------------------------------kfhaifhajadz--------------------------------

import React, { useEffect, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { ChevronRight, ExpandMore } from "@mui/icons-material";

const TreeNode = ({ node, SearchTerm, onSuccess, isRoot = false }) => {
  const [openDialog, setOpenDialog] = useState(false);

  console.log(SearchTerm)
  const hasMatch=(node.name?.toLowerCase()  || "").includes(SearchTerm?.toLowerCase());
  const childMatch=node.children?.some(child=>
    child.name.toLowerCase().includes(SearchTerm?.toLowerCase())
  )

  console.log(hasMatch);
  console.log(childMatch);
  const [expanded, setExpanded] = useState(false); // For collapsing children

  useEffect(()=>{
    if(SearchTerm && (hasMatch || childMatch)){
      setExpanded(true);
    }else{
      setExpanded(false)
    }
  },[SearchTerm]);

  const nodename = node.name;

  // Highlight search term
  const parts = SearchTerm && SearchTerm.trim()
    ? nodename.split(new RegExp(`(${SearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi"))
    : [nodename];

    // console.log(parts)

  const copyID = () => {
    navigator.clipboard.writeText(node.id);
    toast.success("Copied ID: " + node.id);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`https://localhost:7285/api/Asset/${node.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete node");

      toast.success(`Deleted node: ${node.name}`);
      setOpenDialog(false);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete node");
    }
  };

  return (
    <li className={`ml-4 mb-2`}>
      <div
        className={`flex items-center justify-between py-2 px-4 rounded-lg cursor-pointer transition-colors ${
          isRoot ? "bg-blue-50 w-full hover:bg-blue-100" : "bg-gray-50 hover:bg-gray-100"
        }`}
        onClick={() => setExpanded(!expanded)}
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
          <ContentCopyIcon className="cursor-pointer" onClick={(e) => { e.stopPropagation(); copyID(); }} />
          <DeleteIcon className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setOpenDialog(true); }} />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "<strong>{node.name}</strong>"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Render children recursively */}
      {expanded && node.children && node.children.length > 0 && (
        <ul className={`ml-6 border-l-2 border-gray-200 pl-4`}>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              SearchTerm={SearchTerm}
              onSuccess={onSuccess}
              isRoot={false}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;


