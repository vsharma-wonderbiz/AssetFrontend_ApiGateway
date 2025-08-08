import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const AddForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    parentAssetId: '',
  });
  const [errors, setErrors] = useState({
    id: '',
    name: '',
    parentAssetId: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { id: '', name: '', parentAssetId: '' };

    // Validate ID: Must be a non-negative integer
    if (!/^[0-9]+$/.test(formData.id)) {
      newErrors.id = 'ID must be a non-negative integer';
      isValid = false;
    }

    // Validate Name: Only alphanumeric characters, max 30 characters
    if (!/^[a-zA-Z0-9\s]*$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters, numbers, and spaces';
      isValid = false;
    } else if (formData.name.trim().length > 30) {
      newErrors.name = 'Name must not exceed 30 characters';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
      isValid = false;
    }

    // Validate Parent Asset ID: Must be empty or a non-negative integer
    if (formData.parentAssetId && !/^[0-9]+$/.test(formData.parentAssetId)) {
      newErrors.parentAssetId = 'Parent Asset ID must be a non-negative integer or empty';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for the field being edited
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const payload = {
        id: Number(formData.id),
        name: formData.name,
        parentAssetId: formData.parentAssetId
          ? Number(formData.parentAssetId)
          : null,
      };
      await axios.post('https://localhost:7285/api/asset', payload);
      alert('Data submitted successfully!');

      if (onSuccess) {
        onSuccess(); // Refresh hierarchy in parent
      }

      setFormData({ id: '', name: '', parentAssetId: '' });
      setErrors({ id: '', name: '', parentAssetId: '' });
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit data!');
    }
  };

  return (
    <div className="form-container">
      <h2>Add Asset</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">ID</label>
          <input
            type="text"
            name="id"
            id="id"
            value={formData.id}
            onChange={handleChange}
            className={errors.id ? 'input-error' : ''}
            required
          />
          {errors.id && <p className="error-message">{errors.id}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
            maxLength={30}
            required
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="parentAssetId">Parent Asset ID (Optional)</label>
          <input
            type="text"
            name="parentAssetId"
            id="parentAssetId"
            value={formData.parentAssetId}
            onChange={handleChange}
            className={errors.parentAssetId ? 'input-error' : ''}
          />
          {errors.parentAssetId && <p className="error-message">{errors.parentAssetId}</p>}
        </div>
        <button type="submit">Add Asset</button>
      </form>
    </div>
  );
};

export default AddForm;