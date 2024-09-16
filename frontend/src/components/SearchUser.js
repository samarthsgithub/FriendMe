
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/searchUser.css';
const API_URL = process.env.REACT_APP_API_URL;

function SearchUser() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${API_URL}/users/search?username=${searchTerm}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleCancel = () => {
        setSearchResults([]);
        setSearchTerm('');
    };

    const sendFriendRequest = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${API_URL}/users/send-request/${userId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Friend request sent!');
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    return (
        <div className="search-user-container">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search users by username"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">Search</button>
                {searchResults.length > 0 && (
                    <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                )}
            </form>

            {searchResults.length > 0 && (
                <div className="search-results-container">
                    <ul className="search-results">
                        {searchResults.map(user => (
                            <li key={user._id} className="search-result-item">
                                <span className="username">{user.username}</span>
                                <button className="send-request-button" onClick={() => sendFriendRequest(user._id)}>Send Friend Request</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchUser;




