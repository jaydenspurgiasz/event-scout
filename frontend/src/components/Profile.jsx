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

                {!isMe && (
                    <div className="button-group" style={{ marginBottom: '2rem' }}>
                        {profile.isFriend ? (
                            <button className="button-secondary" disabled>Friends</button>
                        ) : profile.isPending ? (
                            <button className="button-primary" disabled>Request Sent</button>
                        ) : (
                            <button onClick={addFriend} className="button-primary">Add Friend</button>
                        )}
                    </div>
                )}

                <div className="profile-stats">
                    <div className="button-secondary" style={{cursor: 'default'}}>
                        <span className="stat-label">Friends: </span>
                        <span className="stat-number">{profile.friendCount}</span>
                    </div>
                </div>

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
