import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/feed.css";

function Feed() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetchTweets = async () => {
        const token =  localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/tweets/feed', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTweets(response.data);
      } catch (error) {
        console.error('Error fetching tweets:', error);
      }
    };

    fetchTweets();
  }, []);

  return (
    <div className="feed">
      {/* <h2>Your Feed</h2> */}
      {tweets.length === 0 ? (
        <p>No tweets to display.</p>
      ) : (
        <ul>
          {tweets.map(tweet => (
            <li key={tweet._id} className="tweet-item">
              <p><strong>{tweet.user.username}</strong></p>
              <p>{tweet.content}</p>
              <p><small>{new Date(tweet.createdAt).toLocaleString()}</small></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Feed;
