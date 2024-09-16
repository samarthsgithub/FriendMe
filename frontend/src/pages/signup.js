// src/pages/Signup.js
import React, { useState,useContext,useEffect} from 'react';
import axios from 'axios'; // Import axios
import {useNavigate} from "react-router-dom";
import { UserContext } from "../context/UserContext";
const API_URL = process.env.REACT_APP_API_URL;
import '../styles/Auth.css'; // Importing the CSS file for styling

const Signup = () => {
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

//   const { updateUser } = useUser(); // Get updateUser function from context
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
      const response = await axios.post(`${API_URL}/users/signup`, { email, username, password });

      // Handle success
      setSuccess(response.data.message); // Assuming the backend returns a message
      setEmail('');
      setUsername('');
      setPassword('');

      // Update user context
      if(response.status===201){
      setUser(response.data);
      navigate('/signin');
      }
    //   updateUser(response.data.user); // Assuming the backend returns user data
    } catch (error) {
      // Handle error
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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
        <button type="submit">Sign Up</button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default Signup;
