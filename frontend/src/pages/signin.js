// src/pages/Signin.js
import React, { useState,useContext,useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios'; // Import axios
import { UserContext } from "../context/UserContext";
const API_URL = process.env.REACT_APP_API_URL;
import '../styles/Auth.css'; // Importing the CSS file for styling

const Signin = () => {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();


  useEffect(()=>{
    const checkLoggedIn = ()=>{
        const token = localStorage.getItem('token');
        if(token){
            navigate('/home')
        }
    };
    checkLoggedIn();
  },[navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the backend
      const response = await axios.post(`${API_URL}/users/signin`, { username, password });

      // Handle success
      setSuccess('Signin successful');
      setUsername('');
      setPassword('');

      // Store JWT token in localStorage
      if(response.status===200){
        setUser(response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/home');
      } // Assuming the backend returns a token

      // Optionally, update user context if your backend returns user data
      // updateUser(response.data.user); // Assuming the backend returns user data

    } catch (error) {
      // Handle error
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="auth-container">
      <h2>Signin</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default Signin;
