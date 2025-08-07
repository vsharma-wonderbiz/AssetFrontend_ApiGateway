import React, { useState } from 'react';
import axios from 'axios'; // make sure axios is installed

const AddForm = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    parentId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 👇 Replace with your actual API URL
      const response = await axios.post('http://localhost:7285/api/asset', formData);
      console.log('Success:', response.data);
      alert("Data submitted successfully!");
    } catch (error) {
      console.error('Error submitting data:', error);
      alert("Failed to submit data!");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: 'auto' }}>
      <h2>Add Asset</h2>
      <div>
        <label>ID:</label>
        <input type="text" name="id" value={formData.id} onChange={handleChange} required />
      </div>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Parent ID:</label>
        <input type="text" name="parentId" value={formData.parentId} onChange={handleChange} />
      </div>
      <button type="submit" style={{ marginTop: '10px' }}>Add</button>
    </form>
  );
};

export default AddForm;
