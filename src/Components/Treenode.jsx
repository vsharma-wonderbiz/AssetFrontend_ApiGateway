
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';


const TreeNode = ({ node, onSuccess }) => {
  const[Open,SetOpen]=useState(false);

  const CopyID=(e)=>{
    navigator.clipboard.writeText(node.id);
    toast.success("copy the id")
    console.log(node.id);
  }

  const HandleDelete= async ()=>{
    
    SetOpen(!Open);
    console.log(Open);
  }

  const Delete= async ()=>{
  try{
      const res=await axios.delete(`https://localhost:7285/api/asset/${node.id}`)
      toast.success(`Node with id ${node.id} deleted`);
      console.log(node.id)
      onSuccess();
    }catch(error){
      console.log(node.id)
      toast.error(error.response.data.message);
    }
  }

  return (
      <div>
    <li className="ml-4">
      <div className="assetn-name flex items-center py-2 px-3 text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition duration-200">
        <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
        {node.name}
       <ContentCopyIcon
          className="ml-[10px] !text-[16px]"
        onClick={CopyID} 
              />
        <DeleteIcon className="!text-[16px]" onClick={HandleDelete}/>
      </div>
      {node.children && node.children.length > 0 && (
        <ul className="ml-4 border-l-2 border-gray-200 pl-4">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} onSuccess={onSuccess}/>
          ))}
        </ul>
      )}
    </li>
     <Dialog open={Open} onClose={() => SetOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete asset with ID:<strong>{node.id}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => SetOpen(false)}>Cancel</Button>
          <Button color="error" onClick={Delete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TreeNode;
