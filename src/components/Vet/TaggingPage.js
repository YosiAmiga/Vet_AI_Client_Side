import React, { useState } from 'react';
import axios from 'axios';
import Camera from '../Camera';
import { SERVER_IP } from '../App';

const TaggingPage = ({ onLogout, userEmail }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [tag, setTag] = useState(null);

  const handleCapture = (blob) => {
    setSelectedFile(blob);
    setShowCamera(false);
  };

  const handleRetake = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const timestamp = new Date().toLocaleString('en-US').replace(/[/,:]/g, '-');
    const fileName = `${userEmail}_${timestamp}.jpeg`;
  
    const formData = new FormData();
    formData.append('image', selectedFile, fileName);
    formData.append('vet_email', userEmail);
    formData.append('tag', tag);
  
    console.log(formData);
  
    try {
      await axios.post(`${SERVER_IP}:5000/vet-upload`, formData);
      alert('File uploaded and tagged successfully.');
    } catch (error) {
      console.error('Error uploading and tagging file:', error);
      alert('Error uploading and tagging file.');
    }
  };
  

  return(
    <div style={{ textAlign: 'center' }}>
      <h2>Tagging Page</h2>
      {selectedFile ? (
        <>
          <img className="preview-image" src={URL.createObjectURL(selectedFile)} alt="Selected file" />
          <div style={{ margin: '10px' }}>
            <button onClick={handleRetake}>Retake</button>
          </div>
        </>
      ) : (
        <Camera onAutoCapture={handleCapture} userEmail={userEmail} />
      )}
      <form className='register-form' onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setSelectedFile(event.target.files[0])}
        />
        <div>
          <label style={{ color: 'red' }}> 
            <input
              type="radio"
              value="Pain"
              checked={tag === 'Pain'}
              onChange={(e) => setTag(e.target.value)}
            />
            Pain
          </label>
          <label style={{ color: 'green'}}>
            <input
              type="radio"
              value="No Pain"
              checked={tag === 'No Pain'}
              onChange={(e) => setTag(e.target.value)}
            />
            No Pain
          </label>
        </div>
        <button type="submit" disabled={!selectedFile || !tag} className="app-button" style={{ opacity: (!selectedFile || !tag) ? 0.5 : 1 }}>Submit</button>
      </form>
      <button className="Logout-button" onClick={onLogout}>Logout</button>
    </div>
  );
};

export default TaggingPage;
