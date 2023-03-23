import React, { useState, useEffect, useRef } from 'react';

const Camera = ({ onCapture, userEmail, }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

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

  const enableStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error enabling camera stream:', error);
    }
  };

  const disableStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const timestamp = new Date().toLocaleString('en-US').replace(/[/,:]/g, '-');
      const fileName = `${userEmail}_${timestamp}.jpeg`;
      onCapture(new File([blob], fileName, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.95);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {cameraActive && <video ref={videoRef} autoPlay playsInline />}
      <div>
        <button onClick={() => setCameraActive(!cameraActive)} style={{ marginRight: '8px', marginTop: '8px' }}>
          {cameraActive ? 'Close Camera' : 'Open Camera'}
        </button>
        {cameraActive && (
          <button onClick={handleCapture} style={{ marginLeft: '8px', marginTop: '8px' }}>
            Capture
          </button>
        )}
      </div>
    </div>
  );
};

export default Camera;
