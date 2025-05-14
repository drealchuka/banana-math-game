import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import goBananasLogo from './go-bananas.png'; // Import the PNG image


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      if (response.status === 200) {
        navigate('/game', { state: { username } });
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('Invalid credentials');
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post('http://localhost:3001/reset-password', { username: forgotUsername, newPassword });
      if (response.status === 200) {
        setMessage('Password reset successfully. You can now log in with your new password.');
        setShowForgotPassword(false);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('Error resetting password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="company-logo">
        <img src={goBananasLogo} alt="Go Bananas Logo" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
        <h1>
          <span className="welcome-text">Welcome</span> to the Ultimate Banana Game!
        </h1>
        <p>Join us on an exciting journey filled with fun and challenges! Don't miss out on this adventure.</p>
      </div>
      <div className="login-right">
        <h2>Login</h2>
        <p>Welcome! Login to get an amazing Banana game experience.</p>
        <input
          type="text"
          placeholder="User Name"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="remember-me">
          <input type="checkbox" id="rememberMe" />
          <label htmlFor="rememberMe">Remember me</label>
        </div>
        <button className="login-button" onClick={handleLogin}>Login</button>
        <p className="login-links">
          New User? <span className="signup-link" onClick={goToRegister}>Signup</span> | <span className="forgot-password" onClick={() => setShowForgotPassword(!showForgotPassword)}>Forgot your password?</span>
        </p>

        {showForgotPassword && (
          <div className="forgot-password-section">
            <input
              type="text"
              placeholder="Enter your username"
              className="login-input"
              value={forgotUsername}
              onChange={(e) => setForgotUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter new password"
              className="login-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="login-button" onClick={handleResetPassword}>Reset Password</button>
          </div>
        )}
        <p className="message">{message}</p>
      </div>
    </div>
  );
}

export default Login;
