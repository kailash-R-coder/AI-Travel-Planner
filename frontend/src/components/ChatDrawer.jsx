import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ChatDrawer({ currentTrip = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello! I am your AI Travel Assistant. ${
        currentTrip
          ? `Ask me anything about your upcoming trip to **${currentTrip.destination}**!`
          : 'Ask me for destination recommendations, packing tips, or travel advice!'
      }`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { isAuthenticated } = useAuth();

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Load chat history if trip is active
  useEffect(() => {
    async function loadHistory() {
      if (currentTrip?.id && isAuthenticated) {
        try {
          const history = await api.chat.getHistory(currentTrip.id);
          if (history && history.length > 0) {
            const formatted = [];
            history.forEach((h) => {
              formatted.push({ sender: 'user', text: h.question });
              formatted.push({ sender: 'assistant', text: h.answer });
            });
            setMessages(formatted);
          }
        } catch (err) {
          console.warn('Could not load chat history');
        }
      }
    }
    loadHistory();
  }, [currentTrip?.id, isAuthenticated]);

  const handleSend = async (customPrompt = null) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      if (!isAuthenticated) {
        // Guest simulated response
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              sender: 'assistant',
              text: `Here is a tip for ${currentTrip?.destination || 'your trip'}: Make sure to pack comfortable footwear, stay hydrated, and sample authentic regional cuisine at top-rated local eateries! (Sign in to save chat history)`,
            },
          ]);
          setLoading(false);
        }, 600);
        return;
      }

      const res = await api.chat.ask({
        trip_id: currentTrip?.id || null,
        question: textToSend,
      });

      setMessages((prev) => [...prev, { sender: 'assistant', text: res.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: `Sorry, I encountered an error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = currentTrip
    ? ['What should I pack?', 'Best regional foods to eat?', 'Is local transit safe?', 'Any budget tips?']
    : ['Recommend best beach spots', 'Top heritage cities in India', 'Budget travel under 20k'];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          className="chat-trigger-btn"
          onClick={() => setIsOpen(true)}
          title="Open AI Travel Assistant"
        >
          <Bot size={28} />
        </button>
      )}

      {/* Expandable Chat Drawer */}
      {isOpen && (
        <div className="chat-drawer">
          {/* Header */}
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '50%' }}>
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>AI Travel Assistant</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>
                  {currentTrip ? `Context: ${currentTrip.destination}` : 'Online 24/7'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="chat-body">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-msg ${m.sender}`}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '2px', opacity: 0.8 }}>
                  {m.sender === 'user' ? 'You' : 'AI Guide'}
                </div>
                <div>{m.text}</div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg assistant" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="loading-spinner" style={{ width: '16px', height: '16px', borderTopColor: '#0d9488' }} />
                <span>AI is formulating response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '0.5rem 0.8rem', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.4rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.3rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-subtle)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            className="chat-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Ask a travel question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ fontSize: '0.88rem', padding: '0.5rem 0.8rem' }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={!input.trim() || loading}
              style={{ padding: '0.5rem 0.9rem' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
