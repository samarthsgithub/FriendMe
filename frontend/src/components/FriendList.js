import React from 'react';
import '../styles/friendList.css';

function FriendList({ friends }) {
    return (
        <div className="friend-list">
            {friends && friends.length > 0 ? (
                <ul>
                    {friends.map(friend => (
                        <li key={friend._id}>{friend.username}</li>
                    ))}
                </ul>
            ) : (
                <p>No friends to display</p>
            )}
        </div>
    );
}

export default FriendList;
