import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Assuming CSS is in App.css

const DeleteForm = ({ onSuccess }) => {
  const [nodeId, setNodeId] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
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

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    // Comment out axios for testing; uncomment for backend use
    
    try {
      await axios.delete(`https://localhost:7285/api/asset/${nodeId}`);
      alert('Node deleted successfully!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error deleting node:', error);
      alert('Failed to delete node!');
    }
    
    alert('Node deletion validated successfully!');
    setNodeId('');
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
      </div>
    </div>
  );
};

export default DeleteForm;