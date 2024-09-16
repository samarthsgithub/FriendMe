import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import axios from 'axios';
import FriendList from "../components/FriendList";
import FriendRecomm from "../components/FriendRecomm";
import PendingFriendList from "../components/PendingFriendList";
import SearchUser from "../components/SearchUser";
import Feed from "../components/Feed";
import { useNavigate } from 'react-router-dom';
import "../styles/home.css"; // Ensure this is the correct path to your CSS

function Home() {
  const { user, setUser } = useContext(UserContext);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTweetInput, setShowTweetInput] = useState(false);
  const [tweetText, setTweetText] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get("http://localhost:8000/users/me", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data);
        }else{
            navigate('/signin');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data', error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [setUser]);

  const handleLogout = () => {
    setUser(null);
    localStorage.clear('token');
    navigate('/signin');
  };

  const handleTweet = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post("http://localhost:8000/tweets/post-tweet", { content: tweetText }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTweetText('');
      setShowTweetInput(false);
      setFlashMessage('Your tweet has been posted');
      setTimeout(() => setFlashMessage(''), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error('Error posting tweet:', error);
    }
  };

  if (loading) return <div>Loading ...</div>;

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h1>FriendMe</h1>
        <div className="navbar-buttons">
          <button onClick={() => setShowProfilePopup(prev => !prev)}>Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
        {showProfilePopup && (
          <div className="profile-popup">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
      </nav>

      <div className="search-bar">
        <SearchUser />
      </div>

      {/* Add Tweet Button */}
      <div className="add-tweet-section">
        <button onClick={() => setShowTweetInput(prev => !prev)}>
          {showTweetInput ? 'Cancel' : 'Add a Tweet'}
        </button>
        {showTweetInput && (
          <div className="tweet-input-container">
            <textarea
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              placeholder="What's happening?"
            />
            <button onClick={handleTweet}>Post Tweet</button>
          </div>
        )}
      </div>

      {flashMessage && <div className="flash-message">{flashMessage}</div>}

      {/* Layout */}
      <div className="container">
        {/* Left Section - Pending Requests */}
        <div className="aside-section left">
          <h2>Pending Requests</h2>
          <PendingFriendList friendRequest={user.friendRequests} />
        </div>

        {/* Middle Section - Feed */}
        <div className="feed-section">
          <h2>Your Feed</h2>
          {/* <p>Post content or updates here.</p> */}
          {/* Additional feed functionalities to be implemented here */}
          <Feed/>
        </div>

        {/* Right Section - Friends and Recommendations */}
        <div className="aside-section right">
          <div className="friends-list">
            <h2>Your Friends</h2>
            <FriendList friends={user.Friends} />
          </div>
          <div className="recommend-friends">
            <FriendRecomm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
