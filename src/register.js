import React, { useState } from 'react';
import './App.css';
import logo from './logo.svg';
import { useHistory } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { name, email, password } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Move to the Subscriber page

  };

  return (
      <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
                 <p>
            Your on pocket vet assistent
         </p>
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={email} onChange={handleChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={password} onChange={handleChange} />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
      </header>
  );
};


export default Register;
