import React, { useState } from 'react';
import { FaHashtag, FaUser, FaCircle, FaSearch, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ currentUser, isConnected, onStartChat, onLogout, activeChatUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      setIsSearching(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/users/search?q=${query}`);
        const data = await res.json();
        // Filter out self
        setSearchResults(data.filter(u => u.username !== currentUser.username));
      } catch (err) {
        console.error(err);
      }
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="connection-status">
          <FaCircle className={isConnected ? 'status-icon online' : 'status-icon offline'} />
          <span className="status-text">{isConnected ? 'NET_ONLINE' : 'NET_OFFLINE'}</span>
        </div>
        <div className="current-user">
          <span className="user-label">LOGGED_IN_AS:</span>
          <span className="user-name tech-font">{currentUser.username}</span>
        </div>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="SEARCH_TARGET..."
            value={searchQuery}
            onChange={handleSearch}
            className="tech-input"
          />
        </div>
      </div>

      <div className="section">
        {isSearching ? (
          <>
            <h3 className="section-title">SEARCH_RESULTS</h3>
            <ul className="user-list">
              {searchResults.map(user => (
                <li key={user._id} className="user-item" onClick={() => onStartChat(user)}>
                  <div className="user-avatar"><FaUser /></div>
                  <span className="user-name tech-font">{user.username}</span>
                </li>
              ))}
              {searchResults.length === 0 && <li className="no-res">&gt; NO_DATA_FOUND</li>}
            </ul>
          </>
        ) : (
          <>
            <h3 className="section-title">ACTIVE_CHANNELS</h3>
            {activeChatUser && (
              <div className="channel-item active">
                <FaUser className="channel-icon" />
                <span>{activeChatUser.username}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt /> TERMINATE_SESSION
        </button>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background-color: var(--bg-sidebar);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          color: var(--text-primary);
        }
        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        .connection-status {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
          color: var(--text-muted);
        }
        .status-icon {
          font-size: 0.6rem;
          margin-right: 0.5rem;
        }
        .status-icon.online { color: var(--status-online); }
        .status-icon.offline { color: var(--status-error); }
        
        .current-user {
          display: flex;
          flex-direction: column;
        }
        .user-label {
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        .search-section {
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        .search-bar {
            display: flex;
            align-items: center;
            background: rgba(255,255,255,0.05);
            padding: 0.5rem;
            border-radius: 4px;
        }
        .search-icon { color: var(--text-muted); margin-right: 0.5rem; }
        .tech-input {
            background: transparent;
            border: none;
            color: white;
            width: 100%;
            font-family: var(--font-tech);
            font-size: 0.85rem;
            outline: none;
        }
        
        .section {
          padding: 1.5rem;
          flex: 1;
        }
        .section-title {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 1rem;
        }
        .channel-item {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          background-color: rgba(255,255,255,0.03);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }
        .channel-item.active {
          background-color: rgba(34, 197, 94, 0.1); /* Green tint */
          border-left-color: var(--accent-primary);
          color: white;
        }
        .channel-icon {
          margin-right: 0.75rem;
          color: var(--text-muted);
        }
        .channel-item.active .channel-icon {
          color: var(--accent-primary);
        }
        .user-list { list-style: none; }
        .user-item {
          display: flex;
          align-items: center;
          padding: 0.5rem 0.5rem;
          cursor: pointer;
          border-radius: 4px;
        }
        .user-item:hover {
             background: rgba(255,255,255,0.05);
             color: var(--accent-primary);
        }
        .user-avatar {
          margin-right: 0.75rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .no-res { font-size: 0.8rem; color: var(--text-muted); padding: 0.5rem; }
        
        .sidebar-footer {
            padding: 1rem;
            border-top: 1px solid var(--border-color);
        }
        .logout-btn {
            width: 100%;
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-muted);
            padding: 0.75rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-family: var(--font-tech);
            transition: all 0.2s;
        }
        .logout-btn:hover {
            border-color: var(--status-error);
            color: var(--status-error);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
