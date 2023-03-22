import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ImageUpload from './ImageUpload';
import './App.css'; // Keep this line

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogout = () => {
    setLoggedIn(false);
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
          <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <Login onLogin={() => setLoggedIn(true)} />} />
          <Route path="/register" element={loggedIn ? <Navigate to="/" /> : <Register />} />
          <Route path="/" element={loggedIn ? <ImageUpload onLogout={handleLogout} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
