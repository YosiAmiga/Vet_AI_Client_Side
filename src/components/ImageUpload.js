import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ onLogout }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('http://localhost:5000/upload', formData);
      alert('File uploaded successfully.');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <form className='register-form' onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" className="app-button">Upload</button>
      </form>
      <button onClick={onLogout} className="app-button">Logout</button>
    </div>
  );
  
};

export default ImageUpload;
