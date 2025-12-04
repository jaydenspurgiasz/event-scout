import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { friendsAPI } from "../api";
import { useAuth } from "../contexts/AuthContext";

export default function FriendSearch() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [existingFriendIds, setExistingFriendIds] = useState(new Set());

  const { user: currentUser } = useAuth();

  useEffect(() => {
    const loadExistingFriends = async () => {
      try {
        const myFriends = await friendsAPI.getAllFriends();
        if (Array.isArray(myFriends)) {
          // Create a Set of IDs for fast lookup
          const ids = new Set(myFriends.map(f => f.id));
          setExistingFriendIds(ids);
        }
      } catch (err) {
        console.error("Failed to load existing friends for filtering", err);
      }
    };
    loadExistingFriends();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (query.trim().length > 0) {
      setLoading(true);
      try {
        const users = await friendsAPI.searchByName(query);
        
        // 2. Filter the results
        const allUsers = Array.isArray(users) ? users : [];
        
        const filteredResults = allUsers.filter(user => {
            // Filter out if they are in our friends list
            const isFriend = existingFriendIds.has(user.id);
            // Filter out if it's ME (the current logged in user)
            const isMe = currentUser?.id === user.id;
            
            return !isFriend && !isMe;
        });

        setResults(filteredResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

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
            placeholder="Enter name..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {message && (
          <div className="success-message" style={{ color: message.includes("Failed") || message.includes("already") ? "red" : "green" }}>
            {message}
          </div>
        )}

        <div className="events-list">
          {loading && <p className="empty-state">Searching...</p>}

          {!loading && results.length === 0 && search.length > 0 && (
            <p className="empty-state">No new users found.</p>
          )}

          {results.map((user) => (
            <div key={user.id} className="event-card card-flex">
              <div className="user-info">
                <h3>
                   {user.name}
                </h3>
                <p className="user-email">{user.email}</p>
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