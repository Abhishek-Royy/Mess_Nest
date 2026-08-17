import React, { useState, useEffect, useRef } from 'react';

const CHATBOT_API = 'http://localhost:5001/api/chat';

// ── Icons (inline SVG to avoid extra deps) ───────────────────────────────────
const ChatIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const BotAvatar = () => (
  <div style={{
    width: 30, height: 30, borderRadius: '50%',
    background: 'linear-gradient(135deg, #0d9488, #0f766e)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, fontSize: 14,
  }}>
    🤖
  </div>
);

// ── Typing Indicator ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '4px 0' }}>
    <BotAvatar />
    <div style={{
      background: 'rgba(15,118,110,0.12)',
      borderRadius: '18px 18px 18px 4px',
      padding: '10px 14px',
      display: 'flex', gap: 4, alignItems: 'center',
    }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#0d9488',
          display: 'inline-block',
          animation: `chatbotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  </div>
);

// ── Message Bubble ────────────────────────────────────────────────────────────
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
      gap: 8,
      animation: 'chatbotFadeIn 0.25s ease',
    }}>
      {!isUser && <BotAvatar />}
      <div style={{
        maxWidth: '75%',
        padding: '10px 14px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser
          ? 'linear-gradient(135deg, #0d9488, #0f766e)'
          : 'rgba(15,118,110,0.1)',
        color: isUser ? '#fff' : '#0f172a',
        fontSize: 13,
        lineHeight: '1.5',
        boxShadow: isUser ? '0 2px 12px rgba(13,148,136,0.25)' : 'none',
        wordBreak: 'break-word',
      }}>
        {msg.text}
      </div>
    </div>
  );
};

// ── Main ChatbotWidget Component ──────────────────────────────────────────────
export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: "👋 Hi! I'm the MessNest AI assistant. Ask me anything about finding messes, PGs, or flats!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pulse, setPulse] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  // Pulse animation every 8s when closed (attention-grabber)
  useEffect(() => {
    if (open) return;
    const id = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
    }, 8000);
    return () => clearInterval(id);
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: Date.now(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(CHATBOT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const reply = data.reply || "I'm not sure about that. Please contact support.";
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: '⚠️ Could not connect to the AI server. Make sure the chatbot server is running on port 5001.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Keyframe Styles ─────────────────────────────────────────────────── */}
      <style>{`
        @keyframes chatbotBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes chatbotFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatbotSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatbotPulse {
          0%   { box-shadow: 0 0 0 0 rgba(13,148,136,0.6); }
          70%  { box-shadow: 0 0 0 14px rgba(13,148,136,0); }
          100% { box-shadow: 0 0 0 0 rgba(13,148,136,0); }
        }
        #messnest-chatbot-input::placeholder { color: #94a3b8; }
        #messnest-chatbot-input:focus { outline: none; }
        #messnest-chatbot-messages::-webkit-scrollbar { width: 4px; }
        #messnest-chatbot-messages::-webkit-scrollbar-track { background: transparent; }
        #messnest-chatbot-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>

      {/* ── Floating Bubble Button ───────────────────────────────────────────── */}
      <button
        id="messnest-chatbot-toggle"
        onClick={() => setOpen(o => !o)}
        title="MessNest AI Assistant"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 9998,
          width: 58,
          height: 58,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #0d9488, #0f766e)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 24px rgba(13,148,136,0.45)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          animation: pulse ? 'chatbotPulse 0.8s ease-out' : 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>

      {/* ── Unread Badge (shows when closed and there are bot messages) ──────── */}
      {!open && messages.length > 1 && (
        <div style={{
          position: 'fixed',
          bottom: 76,
          right: 24,
          zIndex: 9999,
          background: '#ef4444',
          color: '#fff',
          borderRadius: '50%',
          width: 18,
          height: 18,
          fontSize: 10,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #fff',
          pointerEvents: 'none',
        }}>
          {messages.filter(m => m.role === 'bot').length}
        </div>
      )}

      {/* ── Chat Window ─────────────────────────────────────────────────────── */}
      {open && (
        <div
          id="messnest-chatbot-window"
          style={{
            position: 'fixed',
            bottom: 100,
            right: 28,
            zIndex: 9997,
            width: 360,
            maxWidth: 'calc(100vw - 40px)',
            height: 500,
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(13,148,136,0.15)',
            animation: 'chatbotSlideUp 0.28s cubic-bezier(.22,.68,0,1.2)',
            border: '1px solid rgba(13,148,136,0.18)',
            background: '#fff',
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              border: '2px solid rgba(255,255,255,0.3)',
            }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: 0.2 }}>
                MessNest AI Assistant
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%', background: '#4ade80',
                  boxShadow: '0 0 6px #4ade80',
                }} />
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>
                  Powered by MessNest AI
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                borderRadius: '50%',
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              title="Close"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div
            id="messnest-chatbot-messages"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              background: '#f8fafc',
            }}
          >
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Suggested Quick Replies */}
          {messages.length === 1 && (
            <div style={{
              padding: '8px 14px',
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
            }}>
              {['Find a mess', 'PG options', 'How to book?'].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
                  style={{
                    background: 'rgba(13,148,136,0.08)',
                    color: '#0d9488',
                    border: '1px solid rgba(13,148,136,0.25)',
                    borderRadius: 20,
                    padding: '5px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(13,148,136,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(13,148,136,0.08)'}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            background: '#fff',
          }}>
            <input
              id="messnest-chatbot-input"
              ref={inputRef}
              type="text"
              placeholder="Ask me anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                border: '1.5px solid #e2e8f0',
                borderRadius: 12,
                padding: '9px 14px',
                fontSize: 13,
                background: '#f8fafc',
                color: '#0f172a',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = '#0d9488'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <button
              id="messnest-chatbot-send"
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: 'none',
                cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                background: input.trim() && !isTyping
                  ? 'linear-gradient(135deg, #0d9488, #0f766e)'
                  : '#e2e8f0',
                color: input.trim() && !isTyping ? '#fff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
