import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { friendsAPI } from "../api";

export default function Friends(){
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const myFriends = await friendsAPI.getAllFriends();
      setFriends(Array.isArray(myFriends) ? myFriends : []);
    } catch (error) {
      console.error("Error loading friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (window.confirm("Are you sure you want to remove this friend?")) {
      try {
        await friendsAPI.removeFriend(friendId);
        loadFriends();
      } catch (error) {
        console.error("Error removing friend:", error);
      }
    }
  };
    
  return (
    <div className="container">
      <div className="card">
        <button onClick={() => navigate("/profile")} className="back-button">
          ← Back
        </button>

        <div className="top-actions">
          <button
            onClick={() => navigate("/friend-requests")}
            className="btn-action btn-outline"
          >
            View Requests
          </button>
          <button
            onClick={() => navigate("/friend-search")}
            className="btn-action btn-black"
          >
            + Find Friends
          </button>
        </div>

        <div className="form-header">
          <h2 className="form-title">My Friends</h2>
          <p className="subtitle">{friends.length} Connections</p>
        </div>

        <div className="events-list">
          {loading ? (
            <p className="empty-state">Loading friends...</p>
          ) : friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend.id} className="event-card card-flex">
                <div className="user-info">
                  <h3>{friend.first_name} {friend.last_name || ''}</h3>
                  <p className="user-email">{friend.email}</p>
                </div>
                <button
                  onClick={() => handleRemoveFriend(friend.id)}
                  className="button-secondary btn-auto"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>You haven't added any friends yet.</p>
              <button
                onClick={() => navigate('/friend-search')}
                className="button-primary btn-auto"
                style={{ marginTop: '1rem' }}
              >
                Find People
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}