import React from 'react';
import { FaFile, FaFileImage, FaDownload } from 'react-icons/fa';

const MessageBubble = ({ message, isOwn }) => {
    const isSystem = message.sender === 'System';

    // Format timestamp (HH:MM:SS)
    const formatTime = (ts) => {
        if (!ts) return '';
        const date = new Date(ts);
        return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
    };

    if (isSystem) {
        return (
            <div className="system-message">
                <span>{message.text}</span>
            </div>
        );
    }

    return (
        <div className={`message-row ${isOwn ? 'own' : ''}`}>
            <div className="message-content">
                <div className="message-header">
                    <span className={`sender-name tech-font ${isOwn ? 'own-text' : ''}`}>
                        {message.sender}
                    </span>
                    <span className="timestamp tech-font">{formatTime(message.timestamp)}</span>
                </div>

                <div className={`bubble ${isOwn ? 'sent' : 'received'}`}>
                    {message.text && <p className="message-text">{message.text}</p>}

                    {message.file && (
                        <div className="file-attachment">
                            {(() => {
                                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                                if (message.file.type && message.file.type.startsWith('image/')) {
                                    return (
                                        <div className="image-preview">
                                            <img src={`${API_URL}${message.file.url}`} alt="attachment" />
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="file-info">
                                            <FaFile className="file-icon" />
                                            <span className="file-name">{message.file.name}</span>
                                        </div>
                                    );
                                }
                            })()}
                            <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${message.file.url}`} target="_blank" rel="noopener noreferrer" className="download-link">
                                <span className="download-text">OPEN</span> <FaDownload />
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .message-row {
          display: flex;
          width: 100%;
          margin-bottom: 0.5rem;
        }
        .message-row.own {
          justify-content: flex-end;
        }
        .message-content {
          max-width: 70%;
          display: flex;
          flex-direction: column;
        }
        .message-row.own .message-content {
          align-items: flex-end;
        }
        .message-header {
          display: flex;
          align-items: baseline;
          margin-bottom: 0.25rem;
          gap: 0.5rem;
        }
        .sender-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent-secondary);
        }
        .sender-name.own-text {
          color: var(--accent-primary);
        }
        .timestamp {
          font-size: 0.7rem;
          color: var(--text-timestamp);
        }
        
        .bubble {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border-top-left-radius: 0;
          background: var(--bg-bubble-recv);
          border: 1px solid var(--border-color);
          position: relative;
        }
        .message-row.own .bubble {
            border-top-left-radius: 8px;
            border-top-right-radius: 0;
            background: var(--bg-bubble-sent);
            border-color: rgba(59, 130, 246, 0.3);
        }

        .message-text {
            line-height: 1.5;
            word-wrap: break-word;
        }

        .file-attachment {
            margin-top: 0.5rem;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 4px;
            padding: 0.5rem;
            background: rgba(0,0,0,0.2);
        }
        .image-preview img {
            max-width: 100%;
            border-radius: 4px;
            display: block;
        }
        .file-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }
        .download-link {
            display: inline-flex;
            align-items: center;
            font-size: 0.75rem;
            color: var(--accent-primary);
            text-decoration: none;
            gap: 0.25rem;
            margin-top: 0.25rem;
        }
        .download-link:hover {
            text-decoration: underline;
        }
      `}</style>
        </div>
    );
};

export default MessageBubble;
