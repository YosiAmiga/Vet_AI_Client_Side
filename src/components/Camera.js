import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

/**
 * Camera component that allows the user to take pictures using the device's camera.
 *
 * @param {Object} props - Component props.
 * @param {function} props.onCapture - Callback function to be called when a picture is taken.
 * @param {string} props.userEmail - Email of the logged in user.
 * @param {function} props.onAutoCapture - Callback function to be called when a picture is automatically taken by the camera.
 * @returns {JSX.Element} - Camera component.
 */
const Camera = ({ userEmail, onAutoCapture }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const faceDetectionTimeout = useRef(null); // Add this line

  /**
   * Load the face detection models from the face-api.js library when the component mounts.
   */
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      //For more features:
      //await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      //await faceapi.nets.faceExpressionNet.loadFromUri('/models');
    };

    loadModels();
  }, []);

  /**
   * Detect faces in the camera stream using the face-api.js library and draw the detection results on a canvas.
   */
  const detectFace = async () => {
    if (!videoRef.current || !stream) return;

    const detections = await faceapi.detectSingleFace(videoRef.current);
    if (detections && videoRef.current) {
      const existingCanvas = document.getElementById('overlay');
      if (existingCanvas) existingCanvas.remove();

      const canvas = faceapi.createCanvasFromMedia(videoRef.current);
      canvas.id = 'overlay';
      canvas.className = 'overlay'; // Add this line to apply the CSS class
      videoRef.current.parentElement.appendChild(canvas);
      const displaySize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      //For more features:
      //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      //faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      // Capture the screenshot when the detection score is above 0.9
      if (detections.score >= 0.99) {
        handleAutoCapture();
      }
    }
  };

  /**
   * Start the face detection interval when the component mounts and stop it when the component unmounts or the camera stream is disabled.
   */
  useEffect(() => {
    if (stream) {
      const interval = setInterval(detectFace, 100);
      return () => {
        clearInterval(interval);
      };
    }
  }, [stream]);

  /**
   * Automatically capture a picture from the camera and call the `onAutoCapture` callback.
   */
  const handleAutoCapture = () => {
    if (faceDetectionTimeout.current) clearTimeout(faceDetectionTimeout.current);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const timestamp = new Date().toLocaleString('en-US').replace(/[/,:]/g, '-');
      const fileName = `${userEmail}_${timestamp}.jpeg`;
      onAutoCapture(new File([blob], fileName, { type: 'image/jpeg' }));
      disableStream();
    }, 'image/jpeg', 0.95);
  };
  
  /**
   * Enables or disables the camera stream based on the `cameraActive` state.
   */
  useEffect(() => {
    if (cameraActive) {
      enableStream();
    } else {
      disableStream();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive]);

  /**
   * @description Enables the camera stream by requesting access to the user's camera and setting the stream to the video element.
   * @returns {Promise<void>}
   */
  const enableStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error enabling camera stream:', error);
    }
  };

  /**
   * @description Disables the camera stream by stopping all tracks and setting the `stream` state to `null`.
   * @returns {void}
   */
  const disableStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
    {cameraActive && 
          <div className="video-container">
          <video ref={videoRef} autoPlay playsInline />
        </div>}
    <div>
      <button onClick={() => setCameraActive(!cameraActive)} style={{ marginRight: '8px', marginTop: '8px' }}>
        {cameraActive? 'Close Camera' : 'Open Camera'}
        </button>
      </div>
    </div>
  );
};

export default Camera;
