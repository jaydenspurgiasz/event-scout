import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:8000";

export const useSocket = (eventId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!eventId) return;

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("join_event", { eventId });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [eventId]);

  return socketRef.current;
};

