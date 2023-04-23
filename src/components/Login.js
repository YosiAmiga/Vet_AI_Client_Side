import React, { useState } from 'react';
import axios from 'axios';
import { SERVER_IP } from './App';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(SERVER_IP + ':5000/login', { email, password });
      if (response.data.success) {
        onLogin(email, response.data.user_type); // Pass user_type to the onLogin function
        alert('Logged in successfully.');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in.');
    }
  };

  return (
    <div>
      <form className='register-form' onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
