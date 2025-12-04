import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { usersAPI, friendsAPI } from '../api';

export default function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { userId } = useParams();
    
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [friendsList, setFriendsList] = useState([]);
    const [showFriends, setShowFriends] = useState(false);
    const [numFriends, setNumFriends] = useState(0);
    const [events, setEvents] = useState([]);

    const isMe = !userId || (user && userId == user.id);

    useEffect(() => {
        if (user) {
            setLoading(true);
            let id = userId;
            if (isMe) {
                id = user.id;
            }

            usersAPI.getById(id).then(data => {
                setProfile(data);
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            });
        }
    }, [userId, user, isMe]);

    useEffect(() => {
      const loadFriends = async () => {
        try {
          const friendsData = await friendsAPI.getAllFriends();
          setNumFriends(friendsData ? friendsData.length : 0);
        } catch(err) {
          console.log('error loading friends', err);
        }
      };
      loadFriends();
    }, []);

    useEffect(() => {
      const loadEvents = async () => {
        try {
          const eventsData = await eventsAPI.searchAttending(user.id);
          setEvents(Array.isArray(eventsData) ? eventsData : []);
        } catch(err) {
          console.log('error loading events', err);
          setEvents([]);
        }
      };
      loadEvents();
    }, [user?.id]);

    const addFriend = () => {
        friendsAPI.sendRequest(userId).then(() => {
            alert("Friend request sent!");
            setProfile({
                ...profile,
                isPending: true
            });
        }).catch(() => {
            alert("Failed to send request");
        });
    };

    const handleFriendsClick = () => {
        if (isMe) {
            navigate("/friends");
        } else {
            if (showFriends) {
                setShowFriends(false);
            } else {
                friendsAPI.getFriendsOfUser(userId).then(data => {
                    setFriendsList(data);
                    setShowFriends(true);
                }).catch(err => {
                    console.log(err);
                    alert("Failed to load friends");
                });
            }
        }
    };

    if (loading) {
        return <div className="container"><div className="card">Loading...</div></div>;
    }

    if (!profile) {
        return <div className="container"><div className="card">User not found</div></div>;
    }

    return (
        <div className="container">
            <div className="card">
                <div>
                    <button onClick={() => navigate("/home")} className="back-button">← Back</button>
                    {isMe && (
                        <button onClick={() => navigate("/settings")} className="settings-button">Settings</button>
                    )}
                </div>

                <div className="header">
                    <h2 className="title">{profile.name}</h2>
                    {isMe && <p className="subtitle">{user.email}</p>}
                </div>

                {!isMe && !profile.isFriend && (
                    <div className="button-group" style={{ marginBottom: '2rem' }}>
                        {profile.isPending ? (
                            <button className="button-primary" disabled>Request Sent</button>
                        ) : (
                            <button onClick={addFriend} className="button-primary">Add Friend</button>
                        )}
                    </div>
                )}

                <div className="profile-stats">
                    <button onClick={handleFriendsClick} className="button-secondary">
                        <span className="stat-label">Friends: </span>
                        <span className="stat-number">{profile.friendCount}</span>
                    </button>
                </div>

                {showFriends && !isMe && (
                    <div className="event-section">
                        <h2 className="form-title">Friends List</h2>
                        <div className="event-list">
                            {friendsList.length > 0 ? (
                                friendsList.map(friend => (
                                    <div key={friend.id} className="event-item" onClick={() => {
                                        navigate(`/profile/${friend.id}`);
                                        setShowFriends(false);
                                    }} style={{cursor: 'pointer'}}>
                                        <h3>{friend.name}</h3>
                                    </div>
                                ))
                            ) : (
                                <p>No friends found.</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="event-section">
                    <h2 className="form-title">Events</h2>
                    <div className="event-list">
                        {profile.events && profile.events.length > 0 ? (
                            profile.events.map(event => (
                                <div key={event.id} className="event-item">
                                    <h3>{event.title}</h3>
                                    <p>{new Date(event.date).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <p>No events found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
