import React, { useState } from 'react';
import axios from 'axios';
import Camera from './Camera';

/**
 * Renders a component for uploading images. Allows the user to select an image file or capture an image with their camera.
 * @param {Function} onLogout - Callback function to handle user logout.
 * @param {string} userEmail - The email address of the currently logged in user.
 * @returns {JSX.Element} - A JSX element that renders an image preview, a camera component, and a form to upload the selected file.
 */
const ImageUpload = ({ onLogout, userEmail }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCamera, setShowCamera] = useState(true);

  /**
   * Sets the selected file to the captured image blob and hides the camera component.
   * @param {Blob} blob - The blob of the captured image.
   * @returns {void}
   */
  const handleCapture = (blob) => {
    setSelectedFile(blob);
    setShowCamera(false);
  };

  /**
   * Removes the selected file from state to allow the user to retake the image.
   * @returns {void}
   */
  const handleRetake = () => {
    setSelectedFile(null);
  };

  /**
   * Submits the selected file to the server for upload.
   * @param {Event} event - The form submission event.
   * @returns {Promise<void>}
   */
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
        <Camera onAutoCapture={handleCapture} userEmail={userEmail} />
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
