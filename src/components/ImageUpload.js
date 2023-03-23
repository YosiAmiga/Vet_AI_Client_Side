import React, { useState } from 'react';
import axios from 'axios';
import Camera from './Camera';

const ImageUpload = ({ onLogout, userEmail }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCamera, setShowCamera] = useState(true);

  const handleCapture = (blob) => {
    setSelectedFile(blob);
    setShowCamera(false);
  };

  const handleRetake = () => {
    setSelectedFile(null);
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
    <div style={{ textAlign: 'center' }}>
      <h2>Upload Image</h2>
      {selectedFile ? (
        <>
          <img className="preview-image" src={URL.createObjectURL(selectedFile)} alt="Selected file" />
          <div style={{ margin: '10px' }}>
            <button onClick={handleRetake} className="app-button">Retake</button>
          </div>
        </>
      ) : (
        <Camera onCapture={handleCapture} userEmail={userEmail} />
      )}
      <form className='register-form' onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={(event) => setSelectedFile(event.target.files[0]) } />
        <button type="submit" className="app-button" disabled={!selectedFile}>Upload</button>
      </form>
      <button onClick={onLogout} className="Logout-button">Logout</button>
    </div>
  );
};

export default ImageUpload;
