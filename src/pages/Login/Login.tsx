import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      // Simulate generating a token with an expiration time
      const mockToken = btoa(
        JSON.stringify({
          sub: credentials.username, // subject of the token
          exp: Date.now() + 5 * 60 * 1000 // token expiration (current time + 5 minutes)
        })
      );
      login(mockToken);
      navigate('/characters', { replace: true });
    } else {
      alert('Please enter username and password');
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit}>
        <div className="login-logo">
          <img
            src="https://download.logo.wine/logo/Star_Wars/Star_Wars-Logo.wine.png"
            alt="Star Wars Logo"
          />
        </div>
        <h2>Login</h2>
        <div className="login-input">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
          />
        </div>
        <div className="login-input">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <span
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? 'Hide' : 'Show'}
        </span>
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
