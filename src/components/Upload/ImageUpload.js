import React, { useState } from 'react';
import axios from 'axios';
import Camera from './Camera';
import { SERVER_IP } from '../App.js';
import { useLocation } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

/**
 * Renders a component for uploading images. Allows the user to select an image file or capture an image with their camera.
 * @param {Function} onLogout - Callback function to handle user logout.
 * @param {string} userEmail - The email address of the currently logged in user.
 * @returns {JSX.Element} - A JSX element that renders an image preview, a camera component, and a form to upload the selected file.
 */
const ImageUpload = ({ onLogout, userEmail}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const pet = location?.state || '';

  /**
   * Handles the video capture event from the camera component. Sets the captured video blob to state and hides the camera component.
   */
  const handleVideoCapture = (file) => {
    setSelectedFile(file);
    setShowCamera(false);
  };
  
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
    setCapturedVideo(null);
  };

  /**
   * Submits the selected file to the server for upload.
   * @param {Event} event - The form submission event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    const timestamp = new Date().toLocaleString('en-US').replace(/[/,:]/g, '-');
    let extension;
    if (selectedFile.type.startsWith('image/')) {
      extension = '.jpeg';
    } else {
      extension = '.mp4';
    }
    const newName = `${userEmail}&${timestamp}${extension}`;
    const newFile = new File([selectedFile], newName, { type: selectedFile.type });
    formData.append('file', newFile);
    if(pet !== '') formData.append('pet_id', pet.pet_id);
    try {
      const response = await axios.post(SERVER_IP + ':5000/upload', formData);
      alert('File uploaded successfully. Emotion is: ' + response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
    finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Upload File</h2>
      {loading ? (
                <div className="wheel-and-hamster">
                <div className="wheel"></div>
                <div className="hamster">
                  <div className="hamster__head">
                    <div className="hamster__ear"></div>
                    <div className="hamster__ear"></div>
                    <div className="hamster__eye"></div>
                    <div className="hamster__nose"></div>
                  </div>
                  <div className="hamster__body">
                    <div className="hamster__limb--fr"></div>
                    <div className="hamster__limb--fl"></div>
                    <div className="hamster__limb--br"></div>
                    <div className="hamster__limb--bl"></div>
                    <div className="hamster__tail"></div>
                  </div>
                </div>
                <div className="spoke"></div>
              </div>
      ) : (
        <>
          {selectedFile ? (
            selectedFile.type.startsWith('image/') ? (
              <>
                <img className="preview-image" src={URL.createObjectURL(selectedFile)} alt="Selected file" />
                <div style={{ margin: '10px' }}>
                  <button onClick={handleRetake} className="app-button">Retake</button>
                </div>
              </>
            ) : (
              <>
                <video
                  src={URL.createObjectURL(selectedFile)}
                  controls
                  style={{ marginTop: '8px' }}
                ></video>
                <div style={{ margin: '10px' }}>
                  <button onClick={handleRetake} className="app-button">Retake</button>
                </div>
              </>
            )
          ) : (
            <Camera onAutoCapture={handleCapture} userEmail={userEmail} onVideoCapture={handleVideoCapture} />
          )}
          <form className='register-form' onSubmit={handleSubmit}>
            <input type="file" accept="image/*,video/*" onChange={(event) => setSelectedFile(event.target.files[0]) } />
            <button type="submit" className="app-button" disabled={!selectedFile || loading}>Upload</button>
          </form>
          <button onClick={onLogout} className="Logout-button">Logout</button>
        </>
      )}
    </div>
  );
  
};

export default ImageUpload;
