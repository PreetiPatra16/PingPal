import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Login failed');

      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="tech-font title">ACCESS_CONTROL</h1>
        {error && <div className="error-msg tech-font">&gt; ERROR: {error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="USERNAME"
            className="auth-input"
            onChange={handleChange}
            autoFocus
          />
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            className="auth-input"
            onChange={handleChange}
          />
          <button type="submit" className="auth-btn">AUTHENTICATE</button>
        </form>
        <p className="switch-text tech-font">
          NO CREDENTIALS? <span className="link" onClick={() => window.location.hash = '#register'}>INITIALIZE_USER</span>
        </p>
      </div>

      <style>{`
        .auth-container {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-app);
        }
        .auth-card {
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          border: 1px solid var(--border-color);
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.05);
          background: rgba(2, 6, 23, 0.9);
        }
        .title {
          color: var(--accent-primary);
          font-size: 1.5rem;
          margin-bottom: 2rem;
          text-align: center;
          letter-spacing: 2px;
        }
        .error-msg {
          color: var(--status-error);
          background: rgba(239, 68, 68, 0.1);
          padding: 0.5rem;
          margin-bottom: 1rem;
          border-left: 2px solid var(--status-error);
          font-size: 0.8rem;
        }
        .switch-text {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .link {
          color: var(--accent-primary);
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;
