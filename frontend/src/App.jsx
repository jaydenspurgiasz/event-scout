import { useState } from "react";
import "./App.css";

export default function App() {
  const [view, setView] = useState("choice");
  const [email, setEmail] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [tempName, setTempName] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chats, setChats] = useState({user1: [], user2: []});

  // Choice screen
  if (view === "choice") {
    return (
      <div className="container">
        <div className="card">
          <div className="header">
            <div>
              <h2 className="title">Welcome to Event Scout</h2>
              <p className="subtitle">Plan, Post, and RSVP to Amazing Events!</p>
            </div>
          </div>
          <div className="button-group">
            <button onClick={() => setView("login")} className="button-primary">
              Login
            </button>
            <button onClick={() => setView("register")} className="button-secondary">
              Register
            </button>
            <button onClick={() => setView("profile")} className="button-secondary">
              Test Profile
            </button>
            <button onClick={() => setView("chat-list")} className="button-secondary">
              Test Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "login") {
    const handleLogin = () => {
      setEmail(tempEmail);
      setPassword(tempPassword);
      setTempEmail("");
      setTempPassword("");
    }
    return (
      <div className="container">
        <div className="card">
          <button onClick={() => setView("choice")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Login</h2>
            <p className="form-subtitle">Sign in to your Account</p>
          </div>
          <div className="form-group">
            <div className="input-group">
              <label htmlFor="login-email" className="label">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="login-password" className="label">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input"
              />
            </div>
            <button onClick={handleLogin} className="button-submit">Sign In</button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "register") {
    const handleRegister = () => {
      setEmail(tempEmail);
      setPassword(tempPassword);
      setName(tempName);
      setTempEmail("");
      setTempPassword("");
      setTempName("");
    }
    return (
      <div className="container">
        <div className="card">
          <button onClick={() => setView("choice")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Register</h2>
            <p className="form-subtitle">Create your Account</p>
          </div>
          <div className="form-group">
            <div className="input-group">
              <label htmlFor="name" className="label">
                Name
              </label>
              <input
                id="name"
                type="name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="First Last"
                required
                className="input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="register-email" className="label">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="register-password" className="label">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input"
              />
            </div>
            <button onClick={handleRegister} className="button-submit">Create Account</button>
          </div>
        </div>
      </div>
    );
  }

  if(view === "profile") {
    return (
      <div className="container">
        <div className="card">
          <div>
            <button onClick={() => setView("choice")} className="back-button">
              ← Back
            </button>
            <button onClick={() => setView("settings")} className="settings-button">
              Settings
            </button>
            
          </div>
          <div className="header">
            <h2 className="title">
              {name}
            </h2>
            <p className="subtitle">
              {email}
            </p>
          </div>
          <div className="profile-stats">
            <button onClick={() => setView("followers")}>
              <span className="stat-number">1</span>
              <span className="stat-label"> followers</span>
            </button>
            <button onClick={() => setView("following")}>
              <span className="stat-number">1</span>
              <span className="stat-label"> following</span>
            </button>
          </div>
          <div className="event-section">
            <h2 className="form-title">
              Events
            </h2>
            <div className="event-list">
              <div className="event-item">event1</div>
              <div className="event-item">event2</div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if(view === "following") {
    return (
      <div className="container">
        <div className="card">
          <button onClick={() => setView("profile")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Following</h2>
          </div>
        </div>
      </div>
    );
  }

  if(view === "followers") {
    return (
      <div className="container">
        <div className="card">
          <button onClick={() => setView("profile")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Following</h2>
          </div>
        </div>
      </div>
    );
  }

  if(view === "settings") {
    return (
      <div className="container">
        <div className="card">
          <button onClick={() => setView("profile")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Settings</h2>
            <div className="button-group">
              <button onClick={() => setView("change-email")} className="button-primary">
                Change Email
              </button>
              <button onClick={() => setView("change-password")} className="button-primary">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(view === "change-email") {
    const changeEmail = () => {
      if(tempPassword === password){
        setEmail(tempEmail);
      }
      setTempPassword("");
      setTempEmail("");
    }

    return (
      <div className="container">
        <div className="card">
          <button onClick={() => setView("settings")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Change Email</h2>
            <div className="form-group">
              <div className="input-group">
                <label htmlFor="new-email" className="label">
                  New Email
                </label>
                <input
                  id="change-email"
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input"
                />
              </div>
              <div className="input-group">
                <label htmlFor="login-password" className="label">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input"
                />
              </div>
              <button onClick={changeEmail} className="button-submit">Change Email</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(view === "change-password") {
    const changePassword = () => {
      if(tempPassword === password){
        setPassword(newPassword);
      }
      setTempPassword("");
      setNewPassword("");
    }

    return (
      <div className="container">
        <div className="card">
          <button onClick={() => setView("settings")} className="back-button">
            ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">Change Password</h2>
            <div className="form-group">
              <div className="input-group">
                <label htmlFor="login-password" className="label">
                  Old Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input"
                />
              </div>
              <div className="input-group">
                <label htmlFor="new-password" className="label">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input"
                />
              </div>
              <button onClick={changePassword} className="button-submit">Change Password</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(view === "chat-list") {
    return (
      <div className="container">
        <div className="card">
          <button onClick={() => setView("choice")} className="back-button">
              ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">
              Chats
            </h2>
          </div>
          <div className="chat-list">
            <button onClick={() => {setView("chat"); setCurrentChat("user1");}} className="chat-item">
              <span className="chat-name">user1</span>
            </button>
            <button onClick={() => {setView("chat"); setCurrentChat("user2");}} className="chat-item">
              <span className="chat-name">user2</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if(view === "chat") {
    const handleSendMessage = () => {
      if (messageInput.trim() && currentChat) {
        const newMessage = {
          sender: "me",
          text: messageInput,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setChats(prevChats => ({
          ...prevChats,
          [currentChat]: [...prevChats[currentChat], newMessage]
        }));
        
        setMessageInput("");
      }
    };

    const currentMessages = currentChat ? chats[currentChat] : [];

    return (
      <div className="container">
        <div className="chat-card">
          <button onClick={() => setView("chat-list")} className="back-button">
              ← Back
          </button>
          <div className="form-header">
            <h2>
              {currentChat}
            </h2>
          </div>
          <div className="messages-container">
            {currentMessages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === "me" ? "message-sent" : "message-received"}`}>
                <div>
                  <div className="message-header">
                    {msg.sender === "me" ? "You: " : msg.sender||": "}
                  </div>
                  <div className="message-text">
                    {msg.text}
                  </div>
                  <div className="message-time">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="message-input-container">
            <input
              className="message-input"
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage} className="send-button"> Send </button>
          </div>
        </div>
      </div>
    );
  }
}