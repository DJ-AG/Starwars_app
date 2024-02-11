import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import './Login.css';

// Define the Login component
const Login = () => {
  // Define state for credentials and navigation
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  // Handle change in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
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
      // Call login function with the mock token
      login(mockToken);
      // Navigate to characters page after successful login
      navigate('/characters', { replace: true });
    } else {
      // Alert user if username or password is missing
      alert('Please enter username and password');
    }
  };

  // Render the login form
  return (
    <div className="container">
      <div className="form-container">
        <div className="logo">
          <img
            src="https://download.logo.wine/logo/Star_Wars/Star_Wars-Logo.wine.png"
            alt="Star Wars Logo"
          />
        </div>
        <h1>LOGIN</h1>
        {/* Form for user login */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          {/* Input field for username */}
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          {/* Input field for password */}
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
          {/* Button to submit login */}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        {/* Prompt for users without an account */}
        <p>
          Don't have an account? No worries! You can log in with any credentials
          – enjoy exploring!
        </p>
      </div>
    </div>
  );
};

// Export the Login component as default
export default Login;
