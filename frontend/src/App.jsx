import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './index.css';
import './App.css';

import Choice from './components/Choice';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Following from './components/Friends';
import { SettingsMenu} from './components/Settings';
import { ChatRoom } from './components/Chat';
import HomePage from './pages/HomePage';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import FriendSearch from './components/FriendSearch';
import FriendRequests from './components/FriendRequests';

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
        <Route path="/profile/:userId" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/friends" element={
          <ProtectedRoute>
            <Following />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsMenu />
          </ProtectedRoute>
        } />
        <Route path="/chats/:chatId" element={
          <ProtectedRoute>
            <ChatRoom />
          </ProtectedRoute>
        } />
        <Route path="/friend-search" element={
          <ProtectedRoute>
            <FriendSearch />
          </ProtectedRoute>
        } />
        <Route path="/friend-requests" element={
          <ProtectedRoute>
            <FriendRequests />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
