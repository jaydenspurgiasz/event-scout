import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { friendsAPI } from "../api";

export default function FriendRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const pending = await friendsAPI.getRequests();
      setRequests(Array.isArray(pending) ? pending : []);
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (friendId) => {
    try {
      await friendsAPI.acceptRequest(friendId);
      loadRequests();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDecline = async (friendId) => {
    try {
      await friendsAPI.rejectRequest(friendId);
      loadRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <button onClick={() => navigate("/friends")} className="back-button">
          ← Back
        </button>

        <div className="form-header">
          <h2 className="form-title">Friend Requests</h2>
          <p className="subtitle">People who want to connect with you</p>
        </div>

        <div className="events-list">
          {loading ? (
            <p className="empty-state">Loading...</p>
          ) : requests.length > 0 ? (
            requests.map((req) => (
              <div key={req.user_id} className="event-card">
                <div className="request-header user-info">
                  <h3>{req.name}</h3>
                </div>
                <div className="request-actions">
                  <button
                    onClick={() => handleAccept(req.user_id)}
                    className="button-primary btn-request"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecline(req.user_id)}
                    className="button-secondary btn-request"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No pending friend requests.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}