import React, { useState } from "react";

export function ChatList({setView, setCurrentChat}) {
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

export function ChatRoom({setView, currentChat, messages, onSendMessage}) {
    const [messageInput, setMessageInput] = useState("");

    const handleSend = () => {
        if (messageInput.trim()) {
        onSendMessage(messageInput);
        setMessageInput("");
        }
    };

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