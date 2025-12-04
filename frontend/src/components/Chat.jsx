import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function ChatList() {
    const navigate = useNavigate();
    useEffect(() => {
      navigate(-1);
    }, [navigate]);
    return null;
}

export function ChatRoom() {
    const navigate = useNavigate();
    const location = useLocation();
    const { chatId } = useParams();
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([]);
    const chatTitle = location?.state?.title || "";

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
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>
          <div className="form-header">
            <h2>{chatTitle}</h2>
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