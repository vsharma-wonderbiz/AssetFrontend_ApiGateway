import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import '../App.css'; // Assuming CSS is in App.css
import { toast } from 'react-toastify';
const DeleteForm = ({ onSuccess }) => {
  const [nodeId, setNodeId] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete,setConfirmDelete]=useState(false);

  const validateForm = () => {
    if(nodeId.trim()==='' || nodeId==null){
      setError("please enter a id");
      return false;
    }
    if (!/^[0-9]+$/.test(nodeId)) {
      setError('ID must be a non-negative integer');
      return false;
    }
    setError('');
    return true;
  };

  const handleChange = (e) => {
    
    setNodeId(e.target.value);
    setError('');
   
    
  };

  const handleSubmit =  (e) => {
    // e.preventDefault();
    // if (!validateForm()) {
    //   return;
    // }
    // // Comment out axios for testing; uncomment for backend use
    
    // try {
    //   await axios.delete(`https://localhost:7285/api/asset/${nodeId}`);
    //   toast.success("Node deleted successfully!")
    //   if (onSuccess) {
    //     onSuccess();
    //   }
    // } catch (error) {
    //   console.error('Error deleting node:', error);
    //   toast.error(error.response.data.message);
    // }
    
    // alert('Node deletion validated successfully!');
    console.log(confirmDelete)
  
     setConfirmDelete(true);
  };

 const HandleDelet = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {
    const res = await axios.delete(`https://localhost:7285/api/asset/${nodeId}`);
    toast.success("Node Deleted Successfully");
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error('Error deleting node:', error);
    toast.error(error.response?.data?.message || "Error deleting node");
  } finally {
    setConfirmDelete(false);
  }
};

  return (
    <div className="form-container">
      <h2>Delete Asset</h2>
      <div>
        <div className="form-group">
          <label htmlFor="id">ID *</label>
          <input
            type="text"
            name="id"
            id="id"
            value={nodeId}
            onChange={handleChange}
            className={error ? 'input-error' : ''}
            required
          />
          <p className="error-message">{error}</p>
        </div>
        <button className="submit-button" onClick={handleSubmit}>
          Delete
        </button>
        <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete asset with ID:<strong>{nodeId}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button color="error" onClick={HandleDelet}>Delete</Button>
        </DialogActions>
      </Dialog>

      </div>
    </div>
  );
};

export default DeleteForm;