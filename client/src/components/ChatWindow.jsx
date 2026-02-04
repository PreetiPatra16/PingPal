import React, { useRef, useEffect } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';

import MessageBubble from './MessageBubble';
import InputArea from './InputArea';

const ChatWindow = ({ socket, messages, currentRoom, username, typingUser }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, typingUser]);

    return (
        <main className="chat-window">
            <header className="chat-header">
                <div className="header-info">
                    <span className="room-prefix">#</span>
                    <h2 className="room-name">{currentRoom}</h2>
                </div>
                <div className="header-actions">
                    {/* Placeholder for header actions */}
                </div>
            </header>

            <div className="messages-area">
                <div className="message-list">
                    {messages.map((msg, index) => (
                        <MessageBubble
                            key={msg.id || index}
                            message={msg}
                            isOwn={msg.sender === username}
                        />
                    ))}
                    {typingUser && (
                        <div className="typing-indicator">
                            <span className="tech-font">{typingUser} is typing...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <InputArea socket={socket} room={currentRoom} username={username} />

            <style>{`
        .chat-window {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-chat);
          height: 100%;
        }
        .chat-header {
          height: var(--header-height);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
          background: rgba(15, 23, 42, 0.95);
        }
        .room-prefix {
          color: var(--text-muted);
          margin-right: 0.25rem;
          font-size: 1.2rem;
        }
        .room-name {
          font-size: 1.1rem;
          font-weight: 600;
        }
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .message-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: auto; /* Push messages to bottom if few */
        }
        .typing-indicator {
            padding: 0.5rem;
            color: var(--accent-secondary);
            font-size: 0.8rem;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
        }
      `}</style>
        </main>
    );
};

export default ChatWindow;
