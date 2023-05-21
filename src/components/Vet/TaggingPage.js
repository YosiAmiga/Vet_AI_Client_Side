import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Camera from '../Camera';
import { SERVER_IP } from '../App';

/**
 * Tagging page for vets
 * @param {Function} onLogout - Callback function to handle user logout.
 * @param {string} userEmail - The email address of the currently logged in user.
 * @returns {JSX.Element} - A JSX element that has a camera component, a form to upload the selected file, and a form to tag the selected file.
 */
const TaggingPage = ({ onLogout, userEmail }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [tag, setTag] = useState(null);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const [petTypes, setPetTypes] = useState([]);
  const [selectedPetType, setSelectedPetType] = useState('');
  const [petPredictionTypes, setPetPredictionTypes] = useState([]);
  const [selectedPredictionType, setSelectedPredictionType] = useState('');

  /**
   * Handles the video capture event from the camera component. Sets the captured video blob to state and hides the camera component.
   */
    const handleVideoCapture = (file) => {
      setSelectedFile(file);
      setShowCamera(false);
    };

  /**
   * Handles the video capture event from the camera component. Sets the captured video blob to state and hides the camera component.
   * @param {*} blob 
   */
  const handleCapture = (blob) => {
    setSelectedFile(blob);
    setShowCamera(false);
  };

  /**
   * Handles the retake button click event. Sets the selected file to null and shows the camera component.
   */
  const handleRetake = () => {
    setSelectedFile(null);
  };

  /**
   * Handles the form submission event. Submits the selected file to the server for upload.
   * @param {*} event 
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
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
    console.log('newFile ', newFile );
    console.log('selectedPetType',selectedPetType);
    console.log('selectedPredictionType',selectedPredictionType);

    formData.append('image', newFile);
    formData.append('vet_email', userEmail);
    formData.append('tag', tag);
    formData.append('type', selectedPetType);
    formData.append('prediction', selectedPredictionType);

    try {
      const response = await axios.post(`${SERVER_IP}:5000/vet-upload`, formData);
      if (response.data.success) {
        alert('File uploaded and tagged successfully.');
      } else {
        alert('Error: ' + Object.keys(response.data)[0]);
      }
    } catch (error) {
      console.error('Error uploading and tagging file:', error);
      alert('Error uploading and tagging file.');
    }
  };

  /**
   * Initialize pet types from the server.
   */
    const initPetTypes = async () => {
      try {
        const response = await axios.post(SERVER_IP + ':5000/get-pet-types');
        setPetTypes(response.data);
      } catch (error) {
        console.error('Error in initPetTypes', error);
        alert('Error in initPetTypes');
      }
    };

    const processData = (data) => {
      const map = {};
    
      data.forEach(([petType, predictionType]) => {
        if (!map[petType]) {
          map[petType] = [];
        }
    
        map[petType].push(predictionType);
      });
    
      return map;
    };
  /**
   * Initialize pet prediction types from the server.
   */
      const initPetPredictionTypes = async () => {
        try {
          const response = await axios.post(SERVER_IP + ':5000/get-pet-prediction-types');
          const processedData = processData(response.data);
          setPetPredictionTypes(processedData);
        } catch (error) {
          console.error('Error in initPetTypes', error);
          alert('Error in initPetTypes');
        }
      };

  /**
   * Call initPetTypes when the component mounts
   */
    useEffect(() => {
      initPetTypes();
      initPetPredictionTypes();
    }, []);
  

    useEffect(() => {
      console.log('petPredictionTypes', petPredictionTypes);
    }, [petPredictionTypes]);

  return (
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
        <Camera onAutoCapture={handleCapture} userEmail={userEmail} onVideoCapture={(video) => setCapturedVideo(video)} />
      )}
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*, video/*"
          onChange={(event) => setSelectedFile(event.target.files[0])}
        />
        <select value={selectedPetType} onChange={(event) => {
          setSelectedPetType(event.target.value);
          const predictionTypes = petPredictionTypes[event.target.value];
          setSelectedPredictionType(predictionTypes ? predictionTypes[0] : '');
        }}>
          <option value="">Choose pet type...</option>
          {petTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <br></br>
        <select value={selectedPredictionType} onChange={(event) => setSelectedPredictionType(event.target.value)}>
          <option value="">Choose prediction type...</option>
          {selectedPetType && petPredictionTypes[selectedPetType].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

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
          <label style={{ color: 'green' }}>
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
