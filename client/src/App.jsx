import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './index.css';

// Components
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import JoinScreen from './components/JoinScreen'; // Legacy, remove or keep? Removing for auth.
import Login from './components/Login';
import Register from './components/Register';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const socket = io(API_URL, {
  autoConnect: false
});

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const [users, setUsers] = useState([]); // Online users list

  // Chat State
  const [currentRoom, setCurrentRoom] = useState(null); // 'General' or specific userId string
  const [activeChatUser, setActiveChatUser] = useState(null); // User object we are chatting with
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const [view, setView] = useState('login'); // 'login' | 'register' | 'chat'

  useEffect(() => {
    // If we have a token, try to connect
    if (token && currentUser) {
      socket.auth = { token };
      socket.connect();
      socket.emit('register_user', currentUser.id);
      setView('chat');
    }

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('user_status', (data) => {
      // Handle online status updates if needed
    });

    socket.on('receive_message', (message) => {
      console.log("Received", message);
      // Only add if it belongs to current room
      // In a real app, we'd add to a global store or check room ID
      setMessages((prev) => [...prev, message]);
    });

    socket.on('display_typing', (senderId) => {
      setTypingUser('Partner'); // Simplify for now
    });

    socket.on('hide_typing', () => {
      setTypingUser(null);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('user_status');
      socket.off('receive_message');
      socket.off('display_typing');
      socket.off('hide_typing');
    };
  }, [token, currentUser]);

  // Load messages when room changes
  useEffect(() => {
    if (currentRoom) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      fetch(`${API_URL}/api/users/messages/${currentRoom}`)
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error(err));
    }
  }, [currentRoom]);

  const handleLogin = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    socket.disconnect();
    setView('login');
    window.location.hash = '';
  };

  const startChat = (targetUser) => {
    // Logic for 1:1 chat room name: sort IDs to be consistent
    const ids = [currentUser.id, targetUser._id].sort();
    const roomName = `${ids[0]}-${ids[1]}`;

    setActiveChatUser(targetUser);
    setCurrentRoom(roomName);

    socket.emit('join_room', roomName);
    setMessages([]); // Clear before load
  };

  // Hash routing for auth pages
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!token) {
        if (hash === '#register') setView('register');
        else setView('login');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Init

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [token]);

  if (!token) {
    if (view === 'register') return <Register onLogin={handleLogin} />;
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        currentUser={currentUser}
        isConnected={isConnected}
        onStartChat={startChat}
        onLogout={handleLogout}
        activeChatUser={activeChatUser}
      />

      {currentRoom ? (
        <ChatWindow
          socket={socket}
          messages={messages}
          currentRoom={activeChatUser ? activeChatUser.username : 'Chat'}
          username={currentUser.username}
          typingUser={typingUser}
          roomId={currentRoom}
          userId={currentUser.id}
        />
      ) : (
        <div className="empty-state">
          <h2 className="tech-font">SYSTEM_READY</h2>
          <p className="tech-font">&gt; SEARCH_USER_TO_BEGIN_TRANSMISSION</p>
        </div>
      )}

      <style>{`
        .app-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          background-color: var(--bg-app);
        }
        .empty-state {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
        }
        .empty-state h2 {
            font-size: 2rem;
            color: var(--accent-primary);
            margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}

export default App;
