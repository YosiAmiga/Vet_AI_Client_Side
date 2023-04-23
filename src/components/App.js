import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ImageUpload from './ImageUpload';
import './App.css';
import PetOwner from './Pet/PetOwner';
import VetPage from './Vet/VetPage';
import TaggingPage from './Vet/TaggingPage';
export const SERVER_IP = 'http://localhost';
//export const SERVER_IP = 'http://10.0.0.14';
//export const SERVER_IP = 'http://147.235.220.189';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userType, setUserType] = useState(null);

  /**
   * login handler, sets the state of the app to logged in
   * @param {*} email 
   * @param {*} userType 
   */
  const handleLogin = (email, userType) => {
    setLoggedIn(true);
    setUserEmail(email);
    setUserType(userType);
  };

  /**
   * logout handler, sets the state of the app to logged out
   */
  const handleLogout = () => {
    setLoggedIn(false);
    setUserEmail('');
  };

  return (
    <Router>
      <div className="App-header">
        <h1>Cat Pain Detector</h1>
        {!loggedIn && (
          <nav>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </nav>
        )}
        <Routes>
          <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={loggedIn ? <Navigate to="/" /> : <Register />} />
          <Route path="/" element={ loggedIn ? userType === "vet" 
          ? <VetPage onLogout={handleLogout} userEmail={userEmail} />
          : <PetOwner onLogout={handleLogout} userEmail={userEmail} />
          : <Navigate to="/login" />}/>          
          <Route path="/image-upload" element={loggedIn ? <ImageUpload onLogout={handleLogout} userEmail={userEmail}/> : <Navigate to="/login" />} />
          <Route path="/tagging-page" element={loggedIn ? <TaggingPage onLogout={handleLogout} userEmail={userEmail} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
