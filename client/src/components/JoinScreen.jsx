import { useState } from 'react';

const JoinScreen = ({ onJoin }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onJoin(username);
        }
    };

    return (
        <div className="join-screen">
            <div className="join-card">
                <h1 className="logo">PingPal<span className="dot">.</span></h1>
                <p className="subtitle">Enter the system</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="tech-input"
                        autoFocus
                    />
                    <button type="submit" className="tech-btn">Initialize Connection</button>
                </form>
            </div>

            <style>{`
        .join-screen {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-app);
          color: var(--text-primary);
        }
        .join-card {
          background: var(--bg-modal);
          padding: 3rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          width: 100%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .logo {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          letter-spacing: -1px;
        }
        .dot {
          color: var(--accent-secondary);
        }
        .subtitle {
          color: var(--text-secondary);
          margin-bottom: 2rem;
          font-family: var(--font-tech);
          font-size: 0.9rem;
        }
        .tech-input {
          width: 100%;
          padding: 1rem;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: white;
          font-family: var(--font-tech);
          margin-bottom: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .tech-input:focus {
          border-color: var(--accent-primary);
        }
        .tech-btn {
          width: 100%;
          padding: 1rem;
          background: var(--accent-primary);
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .tech-btn:hover {
          opacity: 0.9;
        }
      `}</style>
        </div>
    );
};

export default JoinScreen;
