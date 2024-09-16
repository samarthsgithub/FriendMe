import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/friendRecomm.css'

function FriendRecomm() {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/users/recommend-friends', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRecommendations(response.data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecommendations();
    }, []);

    return (
        <div className="friend-recomm">
            <h2>Recommended Friends</h2>
            {recommendations.length > 0 ? (
                <ul>
                    {recommendations.map(user => (
                        <li key={user._id}>{user.username}</li>
                    ))}
                </ul>
            ) : (
                <p>No recommendations available</p>
            )}
        </div>
    );
}

export default FriendRecomm;
