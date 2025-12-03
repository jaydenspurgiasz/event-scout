import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function ChatList() {
    const navigate = useNavigate();
    
    return (
      <div className="container">
        <div className="card">
          <button onClick={() => navigate("/home")} className="back-button">
              ← Back
          </button>
          <div className="form-header">
            <h2 className="form-title">
              Chats
            </h2>
          </div>
          <div className="chat-list">
            <button onClick={() => navigate("/chats/user1")} className="chat-item">
              <span className="chat-name">user1</span>
            </button>
            <button onClick={() => navigate("/chats/user2")} className="chat-item">
              <span className="chat-name">user2</span>
            </button>
          </div>
        </div>
      </div>
    );
}

export function ChatRoom() {
    const navigate = useNavigate();
    const { chatId } = useParams();
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSend = () => {
        if (messageInput.trim()) {
            const newMessage = {
                sender: "me",
                text: messageInput,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setMessageInput("");
        }
    };

    return (
      <div className="container">
        <div className="chat-card">
          <button onClick={() => navigate("/chats")} className="back-button">
              ← Back
          </button>
          <div className="form-header">
            <h2>
              {chatId}
            </h2>
          </div>
          <div className="messages-container">
            {messages.map((msg, index) => (
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
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
            />
            <button onClick={handleSend} className="send-button"> Send </button>
          </div>
        </div>
      </div>
    );
}