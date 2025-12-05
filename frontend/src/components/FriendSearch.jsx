import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usersAPI, friendsAPI } from "../api";
import { useAuth } from "../contexts/AuthContext";

export default function FriendSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { user: currentUser } = useAuth();

  /**
   * Filter out users who are already friends or the current user
   * Uses a Set for O(1) lookup when checking friend status
   */
  const filterExistingFriends = (users, friendIds) => {
    return users.filter(user => {
      const isFriend = friendIds.has(user.id);
      const isMe = currentUser?.id === user.id;
      return !isFriend && !isMe;
    });
  }

  /**
   * Load friends list first, then filter all users
   * This approach ensures we don't show users who are already friends
   * or allow users to friend themselves
   */
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        const myFriends = await friendsAPI.getAllFriends();
        const ids = Array.isArray(myFriends) ? new Set(myFriends.map(f => f.id)) : new Set();
        
        const allUsers = await usersAPI.search();
        const filteredUsers = filterExistingFriends(Array.isArray(allUsers) ? allUsers : [], ids);
        setUsers(filteredUsers);
      } catch (err) {
        console.error("Failed to initialize:", err);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  // Client-side filtering using useMemo (same as EventsList)
  const filteredUsers = useMemo(() => {
    const list = Array.isArray(users) ? users : [];
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return list;
    return list.filter((user) => {
      const name = (user.name || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q)
      );
    });
  }, [users, searchQuery]);

  const handleAddFriend = async (friendId) => {
    try {
      await friendsAPI.sendRequest(friendId);
      setMessage("Friend request sent!");
    } catch (error) {
      console.error("Error sending request:", error);
      setMessage("Failed to send request.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <button onClick={() => navigate("/friends")} className="back-button">
          ← Back
        </button>

        <div className="form-header">
          <h2 className="form-title">Search Users</h2>
          <p className="subtitle">Find new people</p>
        </div>

        <div className="input-group">
          <input
            type="text"
            className="input"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {message && (
          <div className="success-message" style={{ color: message.includes("Failed") || message.includes("already") ? "red" : "green" }}>
            {message}
          </div>
        )}

        <div className="events-list">
          {loading && <p className="empty-state">Loading...</p>}

          {!loading && users.length === 0 && <p className="empty-state">No users available.</p>}
          
          {!loading && users.length > 0 && filteredUsers.length === 0 && (
            <p className="empty-state">No users match your search.</p>
          )}

          {filteredUsers.map((user) => (
            <div key={user.id} className="event-card card-flex">
              <div className="user-info">
                <h3>
                   {user.name}
                </h3>
              </div>
              <button
                onClick={() => handleAddFriend(user.id)}
                className="button-secondary btn-auto"
              >
                Add +
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}