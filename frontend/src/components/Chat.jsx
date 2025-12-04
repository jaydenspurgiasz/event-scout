import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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
    const { user } = useAuth();
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!chatId) return;

        const socket = io(API_BASE_URL, {
            transports: ["websocket"]
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            socket.emit("join_event", { eventId: chatId });
        });

        socket.on("messages_history", (data) => {
            setMessages(data.messages);
        });

        socket.on("new_message", (data) => {
            setMessages(prev => [...prev, data.message]);
        });

        return () => socket.disconnect();
    }, [chatId]);

    const handleSend = () => {
        if (!messageInput.trim() || !socketRef.current || !user) return;

        socketRef.current.emit("send_message", {
            eventId: chatId,
            userId: user.id,
            message: messageInput.trim()
        });

        setMessageInput("");
    };

    return (
      <div className="container">
        <div className="chat-card">
          <button onClick={() => navigate(-1)} className="back-button">← Back</button>
          <div className="form-header">
            <h2>{location?.state?.title || "Event Chat"}</h2>
          </div>
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${user && msg.email === user.email ? "message-sent" : "message-received"}`}>
                <div>
                  <div className="message-header">
                    {user && msg.email === user.email ? "You" : msg.name}
                  </div>
                  <div className="message-text">
                    {msg.message}
                  </div>
                  <div className="message-time">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            <button onClick={handleSend} className="send-button">Send</button>
          </div>
        </div>
      </div>
    );
}