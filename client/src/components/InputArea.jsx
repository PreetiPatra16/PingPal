import React, { useState, useRef } from 'react';
import { FaPaperPlane, FaPlus } from 'react-icons/fa';

const InputArea = ({ socket, room, username }) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const handleTyping = (e) => {
        setMessage(e.target.value);

        // Emit typing event
        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing', room);
        }

        // Debounce stop typing
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.emit('stop_typing', room);
        }, 2000);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (message.trim() === '') return;

        socket.emit('send_message', {
            room,
            sender: username,
            text: message,
            timestamp: new Date().toISOString()
        });

        setMessage('');
        socket.emit('stop_typing', room);
        setIsTyping(false);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Upload to server first
            const response = await fetch('http://localhost:3001/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            // Send message with file info
            socket.emit('send_message', {
                room,
                sender: username,
                text: '', // No text, just file
                file: {
                    url: data.url,
                    name: data.filename,
                    type: data.mimetype
                },
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error("Upload failed", error);
        }

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="input-area">
            <form className="input-form" onSubmit={handleSendMessage}>
                <button type="button" className="attach-btn" onClick={() => fileInputRef.current?.click()}>
                    <FaPlus />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                />

                <input
                    type="text"
                    className="message-input"
                    placeholder="Type a command or message..."
                    value={message}
                    onChange={handleTyping}
                />

                <button type="submit" className="send-btn" disabled={!message.trim()}>
                    <FaPaperPlane />
                </button>
            </form>

            <style>{`
        .input-area {
          height: var(--input-height);
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-input);
        }
        .input-form {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .attach-btn {
            background: none;
            border: 1px solid var(--border-color);
            color: var(--text-muted);
            width: 36px;
            height: 36px;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .attach-btn:hover {
            border-color: var(--accent-primary);
            color: var(--accent-primary);
        }

        .message-input {
            flex: 1;
            background: transparent;
            border: none;
            color: var(--text-primary);
            font-family: var(--font-primary);
            font-size: 0.95rem;
            outline: none;
        }
        .message-input::placeholder {
            color: var(--text-muted);
        }

        .send-btn {
            background: var(--accent-primary);
            color: white;
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.2s;
        }
        .send-btn:disabled {
            background: var(--border-color);
            cursor: not-allowed;
            opacity: 0.5;
        }
        .send-btn:hover:not(:disabled) {
            opacity: 0.9;
        }
      `}</style>
        </div>
    );
};

export default InputArea;
