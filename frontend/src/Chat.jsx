import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";

function Chat({ eventId, userId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const socket = useSocket(eventId);

  useEffect(() => {
    if (!socket) return;

    socket.on("messages_history", (data) => {
      setMessages(data.messages || []);
    });

    socket.on("new_message", (data) => {
      setMessages((prev) => [...prev, data.message]);
    });

    socket.on("error", (data) => {
      setError(data.message);
    });

    return () => {
      socket.off("messages_history");
      socket.off("new_message");
      socket.off("error");
    };
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit("send_message", {
      eventId,
      userId,
      message: newMessage.trim()
    });

    setNewMessage("");
  };

  return (
    <div>
      <h3>Chat</h3>
      {error && <div>Error: {error}</div>}
      
      <div>
        {messages.length === 0 ? (
          <p>No messages yet. Say something!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id}>
              <strong>{msg.email}:</strong> {msg.message}
              <br />
              <small>{new Date(msg.created_at).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
