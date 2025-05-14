import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3001/register', { username, password });
      setMessage(response.data.message);

      if (response.status === 201) {
        setTimeout(() => {
          navigate('/login');
        }, 1000); // Redirect to login page after a short delay
      }


    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setMessage(`Registration failed: ${error.response.data.message || error.response.status}`);
      } else if (error.request) {
        // Request was made but no response was received
        setMessage('Registration failed: No response from server');
      } else {
        // Something else happened while setting up the request
        setMessage(`Registration failed: ${error.message}`);
      }
      console.error('Error:', error);
    }
  };
  


  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          className="register-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="register-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="register-button" onClick={handleRegister}>Register</button>
        <p className="message">{message}</p>
      </div>
    </div>
  );
}

export default Register;