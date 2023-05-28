import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

/**
 * Camera component that allows the user to take pictures using the device's camera.
 *
 * @param {Object} props - Component props.
 * @param {function} props.onCapture - Callback function to be called when a picture is taken.
 * @param {string} props.userEmail - Email of the logged in user.
 * @param {function} props.onAutoCapture - Callback function to be called when a picture is automatically taken by the camera.
 * @returns {JSX.Element} - Camera component.
 */
const Camera = ({ userEmail, onAutoCapture, onVideoCapture }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const faceDetectionTimeout = useRef(null); // Add this line
  const [autoCaptureActive, setAutoCaptureActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [capturedVideo, setCapturedVideo] = useState(null);

  /**
   * Load the face detection models from the face-api.js library when the component mounts.
   */
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      // await faceapi.nets.faceExpressionNet.loadFromUri('/models');
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

    const detections = await faceapi
    .detectSingleFace(videoRef.current)
    // .withFaceExpressions();
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
      // faceapi.draw.drawFaceExpressions(canvas, resizedDetections); // Draw the face expressions
      console.log('In detect face autoCaptureActive:', autoCaptureActive);
      if (autoCaptureActive && detections.score >= 0.99) {
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
  }, [stream,autoCaptureActive]);

  /**
   * Automatically capture a picture from the camera and call the `onAutoCapture` callback.
   */
  const handleAutoCapture = () => {
    if (faceDetectionTimeout.current) clearTimeout(faceDetectionTimeout.current);
    if (!autoCaptureActive) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const timestamp = new Date().toLocaleString('en-US').replace(/[/,:]/g, '-');
      const fileName = `${userEmail}&${timestamp}.jpeg`;
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
      disableStream();
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
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };
  
  /**
   * @description Starts recording a video from the camera stream.
   * @returns {void}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
   */
  const startRecording = () => {
    const options = { mimeType: 'video/webm;codecs=vp9' };
    const mediaRecorder = new MediaRecorder(stream, options);
    const chunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const timestamp = new Date().toLocaleString('en-US').replace(/[/,:]/g, '-');
      const fileName = `${userEmail}&${timestamp}.mp4`;
      blob.name = fileName;
      setCapturedVideo(blob);
      setMediaRecorder(null);
      onVideoCapture(blob);
    };

    mediaRecorder.start(1000);
    setMediaRecorder(mediaRecorder);
    setIsRecording(true);
  };

  /**
   * @description Stops recording a video from the camera stream.
   * @returns {void}
   */
  const stopRecording = async () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setCameraActive(false);
  
      // Convert WebM to MP4 using ffmpeg
      const ffmpeg = createFFmpeg({ log: true });
      await ffmpeg.load();
      const webmFileName = 'input.webm';
      const mp4FileName = 'output.mp4';
      await ffmpeg.write(webmFileName, await fetchFile(capturedVideo));
      await ffmpeg.transcode(webmFileName, mp4FileName);
      const mp4Data = ffmpeg.read(mp4FileName);
      const mp4Blob = new Blob([mp4Data.buffer], { type: 'video/mp4' });
      mp4Blob.name = "mp4Blob name";

      // Convert the MP4 Blob to a File object
      const timestamp = new Date().toLocaleString('en-US').replace(/[/,:]/g, '-');
      const fileName = `${userEmail}&${timestamp}.jpeg`;
      const mp4File = new File([mp4Blob], fileName, { type: 'video/mp4' });
      mp4File.name = fileName;
      console.log('mp4File name :', mp4File.name);
      // Update the capturedVideo state and call onVideoCapture with the MP4 File
      setCapturedVideo(mp4File);
      onVideoCapture(mp4File);
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
        {cameraActive && (
          <>
            <button className= {autoCaptureActive ? "Logout-button" : "app-button"}  onClick={() => setAutoCaptureActive(!autoCaptureActive)} style={{ marginRight: '8px', marginTop: '8px' }}>
              {autoCaptureActive ? 'Stop Auto Snapshot' : 'Automatic Face Snapshot'}
            </button>
            {!isRecording ? (
              <button className="app-button" onClick={startRecording} style={{ marginTop: '8px' }}>
                Start Recording
              </button>
            ) : (
              <button className="Logout-button" onClick={stopRecording} style={{ marginTop: '8px' }}>
                Stop Recording
              </button>
            )}
          </>
        )}
      </div>
      {capturedVideo && (
        <div>
          <video
            src={URL.createObjectURL(capturedVideo)}
            controls
            style={{ marginTop: '8px' }}
          ></video>
          <button onClick={() => setCapturedVideo(null)} className="app-button" style={{ marginTop: '8px' }}>
            Retake
          </button>
        </div>
      )}
    </div>
  );
};

export default Camera;
