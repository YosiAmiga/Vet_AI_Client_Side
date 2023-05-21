import React, { useState } from 'react';
import axios from 'axios';
import { SERVER_IP } from '../App';
/**
 * The Register component renders a form for registering a new user. It takes an onRegister callback function as a prop to handle the register event.
 * @returns {JSX.Element} - A JSX element that renders a register form.
 */
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Handles the form submission event. Sends a POST request to the server to register a new user.
   * @param {*} event - The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(SERVER_IP + ':5000/register', { email, password });
      if (response.data.success) {
        alert('Registration successful. You can now log in.');
      } else {
        alert(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Error during registration.');
    }
  };  

  return (
    <div>
      <form className='register-form' onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
