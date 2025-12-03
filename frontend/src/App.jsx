import { Component, useState } from "react";
import "./App.css";

import Choice from "./components/choice"
import Login from "./components/login"
import Register from "./components/register"
import Profile from "./components/profile"
import Followers from "./components/followers"
import Following from "./components/following"
import {SettingsMenu, ChangeEmail, ChangePassword} from "./components/settings"
import {ChatList, ChatRoom} from "./components/chat"

export default function App() {
  const [view, setView] = useState("choice");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [currentChat, setCurrentChat] = useState(null);
  const [chats, setChats] = useState({user1: [], user2: []});

  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (loginEmail, loginPassword) => {
    setEmail(loginEmail);
    setPassword(loginPassword);
    setLoggedIn(true);
    setView("choice");
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

  if (!loggedIn) {
    switch (view) {
      case "choice":
        return <Choice setView={setView} />;

      case "login":
        return <Login setView={setView} onLogin={handleLogin} isLoggedIn={setLoggedIn}/>;

      case "register":
        return <Register setView={setView} onRegister={handleRegister} />;

      default:
        return <Register setView={setView} />;
    }
  }

  switch (view) {
    case "choice":
      return <Choice setView={setView} />;

    case "login":
      return <Login setView={setView} onLogin={handleLogin} />;

    case "register":
      return <Register setView={setView} onRegister={handleRegister} />;

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
    
    default:
      return <Choice setView={setView} />;
  }
}
