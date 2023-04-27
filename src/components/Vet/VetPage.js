import React from 'react';
import { Link } from 'react-router-dom';

/**
 * The vet page, contains links to the tagging page and image upload page
 * @param {Function} onLogout - Callback function to handle user logout.
 * @param {string} userEmail - The email address of the currently logged in user.
 * @returns {JSX.Element} the vet page component
 */
const VetPage = ({ onLogout, userEmail }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Vet Dashboard</h2>
      <p>Welcome, {userEmail}</p>
      <div>
        <Link to={`/tagging-page`}>
          <button className="app-button">Tagging Page</button>
        </Link>
        <br></br>
        <Link to={`/image-upload`}>
          <button className="app-button">Image Upload Page</button>
        </Link>
      </div>
      <button onClick={onLogout} className="Logout-button">Logout</button>
    </div>
  );
};

export default VetPage;
