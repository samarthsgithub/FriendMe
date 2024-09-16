import React from "react";
import axios from "axios";
import{useState,useEffect} from "react";
import '../styles/pendingFriend.css';
const API_URL = process.env.REACT_APP_API_URL;

function PendingFriendList({ friendRequest, onRequestHandled }) {

    const[pendingRequests, setPendingRequests] = useState(friendRequest);

    useEffect(()=>{
        setPendingRequests(friendRequest);
    },[friendRequest]);

    const acceptFriendRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_URL}/users/accept-request/${requestId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setPendingRequests(pendingRequests.filter(request=>request._id!==requestId));
        } catch (error) {
            console.error('Error handling friend request', error);
        }
    };

    const rejectFriendRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_URL}/users/reject-request/${requestId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setPendingRequests(pendingRequests.filter(request=>request._id!==requestId));
        } catch (error) {
            console.error('Error handling friend request', error);
        }
    };

    return (
        <div className="pending-friends">
            {pendingRequests.length > 0 ? (
                <ul>
                    {pendingRequests.map(request => (
                        <li key={request._id}>
                            {request.username}
                            <button className="accept-btn" onClick={() => acceptFriendRequest(request._id)}>Accept</button>
                            <button className="reject-btn" onClick={() => rejectFriendRequest(request._id)}>Reject</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No pending friend requests</p>
            )}
        </div>
    );
}

export default PendingFriendList;
