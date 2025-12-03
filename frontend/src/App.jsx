import { useState } from 'react';
import './index.css';
import './App.css';

import Choice from "./components/choice"
import Login from "./components/login"
import Register from "./components/register"
import Profile from "./components/profile"
import Followers from "./components/followers"
import Following from "./components/following"
import {SettingsMenu, ChangeEmail, ChangePassword} from "./components/settings"
import {ChatList, ChatRoom} from "./components/chat"

function App() {
  const [view, setView] = useState("choice");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [currentChat, setCurrentChat] = useState(null);
  const [chats, setChats] = useState({user1: [], user2: []});

  const [page, setPage] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 1,
      name: 'Study Session',
      date: 'December 5, 2025',
      location: 'Library - Room 201',
      attendees: ['John', 'Sarah', 'Mike']
    },
    {
      id: 2,
      name: 'Basketball Game',
      date: 'December 6, 2025',
      location: 'Main Gym',
      attendees: ['Alex', 'Chris', 'Taylor', 'Jordan']
    }
  ];

  const handleLogin = (loginEmail, loginPassword) => {
    setEmail(loginEmail);
    setPassword(loginPassword);
    setIsAuthenticated(true);
    setView("home");
  }

  const handleRegister = (registerName, registerEmail, registerPassword) => {
    setName(registerName);
    setEmail(registerEmail);
    setPassword(registerPassword);
    setView("login");
  }

  const handleSendMessage = (text) => {
    if (currentChat) {
      const newMessage = {
        sender: "me",
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChats(prevChats => ({
        ...prevChats,
        [currentChat]: [...prevChats[currentChat], newMessage]
      }));
    }
  };

  if (!isAuthenticated) {
    switch (view) {
      case "choice":
        return <Choice setView={setView} />;

      case "login":
        return <Login setView={setView} onLogin={handleLogin} />;

      case "register":
        return <Register setView={setView} onRegister={handleRegister} />;

      default:
        return <Choice setView={setView} />;
    }
  }

  switch (view) {
    case "profile":
      return <Profile setView={setView} name={name} email={email} />;

    case "following":
      return <Following setView={setView} />;

    case "followers":
      return <Followers setView={setView} />;

    case "settings":
      return <SettingsMenu setView={setView} />;
    
    case "change-email":
      return (
        <ChangeEmail 
          setView={setView} 
          currentPassword={password} 
          onChangeEmail={setEmail} 
        />
      );

    case "change-password":
      return (
        <ChangePassword 
          setView={setView} 
          currentPassword={password} 
          onChangePassword={setPassword} 
        />
      );

    case "chat-list":
      return <ChatList setView={setView} setCurrentChat={setCurrentChat} />;

    case "chat":
      return (
        <ChatRoom
          setView={setView}
          currentChat={currentChat}
          messages={currentChat ? chats[currentChat] : []}
          onSendMessage={handleSendMessage}
        />
      );

    case "home":
    default:
      return (
        <div className="app">
          <header className="app-header">
            <h1>Event Scout</h1>
          </header>
          <main className="app-main">
            {page === 'home' && !selectedEvent && (
              <div className="events-page">
                <h2>My Events</h2>
                <div className="events-list">
                  {events.map(event => (
                    <div 
                      key={event.id}
                      className="event-card"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <h3>{event.name}</h3>
                      <p>{event.date}</p>
                      <p>{event.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {page === 'home' && selectedEvent && (
              <div className="event-detail">
                <button className="back-button" onClick={() => setSelectedEvent(null)}>
                  ← Back
                </button>
                <div className="event-detail-card">
                  <h2>{selectedEvent.name}</h2>
                  <p><strong>Date:</strong> {selectedEvent.date}</p>
                  <p><strong>Location:</strong> {selectedEvent.location}</p>
                  <div className="attendees-section">
                    <h3>Who's Going ({selectedEvent.attendees.length})</h3>
                    <ul className="attendees-list">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <li key={index}>
                          {attendee}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {page === 'create' && (
              <div className="create-page">
                <h2>Create New Event</h2>
                <form className="event-form">
                  <input type="text" placeholder="Event name" className="input" />
                  <input type="date" className="input" />
                  <input type="text" placeholder="Location" className="input" />
                  <button type="submit" className="button-submit">
                    Create Event
                  </button>
                </form>
              </div>
            )}
          </main>
          <nav className="app-nav">
            <button 
              className={`nav-button ${page === 'home' ? 'active' : ''}`}
              onClick={() => { setPage('home'); setSelectedEvent(null); setView('home'); }}
            >
              Home
            </button>
            <button 
              className={`nav-button ${page === 'create' ? 'active' : ''}`}
              onClick={() => { setPage('create'); setView('home'); }}
            >
              Create
            </button>
            <button 
              className={`nav-button ${view === 'profile' ? 'active' : ''}`}
              onClick={() => { setView('profile'); setPage('home'); }}
            >
              Profile
            </button>
          </nav>
        </div>
      );
  }
}

export default App;
