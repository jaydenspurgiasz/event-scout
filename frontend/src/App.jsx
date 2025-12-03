import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './index.css';
import './App.css';

import Choice from './components/Choice';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Followers from './components/Followers';
import Following from './components/Following';
import { SettingsMenu, ChangeEmail, ChangePassword } from './components/Settings';
import { ChatList, ChatRoom } from './components/Chat';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';

function LoadingScreen() {
  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h2 className="title">Loading...</h2>
        </div>
      </div>
    </div>
  );
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Choice />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/followers" element={
          <ProtectedRoute>
            <Followers />
          </ProtectedRoute>
        } />
        <Route path="/following" element={
          <ProtectedRoute>
            <Following />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsMenu />
          </ProtectedRoute>
        } />
        <Route path="/settings/change-email" element={
          <ProtectedRoute>
            <ChangeEmail />
          </ProtectedRoute>
        } />
        <Route path="/settings/change-password" element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        } />
        <Route path="/chats" element={
          <ProtectedRoute>
            <ChatList />
          </ProtectedRoute>
        } />
        <Route path="/chats/:chatId" element={
          <ProtectedRoute>
            <ChatRoom />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
