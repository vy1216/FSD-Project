import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import api from '../api/client';

const SUGGESTIONS = [
  'Recommend an easy beginner trek',
  'What gear do I need for camping?',
  'River rafting in Rishikesh details',
  'What are the group person limits?',
  'What is the cancellation policy?'
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello explorer! 🏔️ I am TrailBot, your WILDTRAIL AI Assistant. Ask me anything about treks, stays, technical gear, group person limits, or booking policies!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const userText = textToSend || input;
    if (!userText.trim()) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: userText });
      const botReply = res.data?.reply || "I'm here to help with all your adventure inquiries!";
      
      const botMsg = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Local client fallback response if API is unreachable
      const fallbackReply = getLocalFallbackResponse(userText);
      const botMsg = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: fallbackReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const getLocalFallbackResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('beginner') || q.includes('easy')) {
      return "For beginners, we recommend the Anamudi Peak Wilderness Trek in Munnar (Easy, ₹4,200) and Scuba Diving in Goa (Easy, ₹3,500). Both offer full guide support and require no prior mountaineering experience!";
    }
    if (q.includes('gear') || q.includes('pack') || q.includes('tent')) {
      return "Essential gear available in our shop: Everest 65L Rucksack (₹4,999), Sub-Zero -10°C Sleeping Bag (₹3,499), Carbon Fiber Trekking Poles (₹1,899), and Waterproof 4-Person Dome Tent (₹5,999).";
    }
    if (q.includes('rafting') || q.includes('rishikesh')) {
      return "Ganga River Rafting in Rishikesh is ₹2,400 per person for a 26 km Grade III & IV rapid expedition with IRF safety kayakers. Group limit is 8 persons per raft!";
    }
    if (q.includes('limit') || q.includes('capacity') || q.includes('people')) {
      return "Every expedition has strict group capacity limits (e.g. 8 for rafting, 6 for scuba, 12 for Hampta Pass trek) to ensure safety and preserve fragile mountain ecosystems.";
    }
    if (q.includes('cancel') || q.includes('policy')) {
      return "You can cancel any adventure or stay reservation up to 72 hours before the start date for a 100% full refund directly from your User Panel (/dashboard)!";
    }
    return "Thank you for asking! You can explore all our verified Expeditions, Alpine Stays, and Technical Gear directly from the top navigation bar.";
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Chat cleared! How else can I assist your expedition planning today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chatbot-trigger-btn"
          title="Open TrailBot AI Assistant"
        >
          <Bot size={24} />
          <span className="chatbot-trigger-pulse"></span>
          <span className="chatbot-trigger-label">Ask AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="chatbot-avatar">
                <Bot size={20} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  TrailBot AI <Sparkles size={14} color="#facc15" />
                </div>
                <div style={{ fontSize: '12px', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span className="online-indicator"></span> Online Guide
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handleClearChat}
                className="chatbot-header-btn"
                title="Clear conversation"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="chatbot-header-btn"
                title="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="chat-avatar-small">
                    <Bot size={14} />
                  </div>
                )}
                <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                    {msg.text}
                  </div>
                  <div className="chat-time">{msg.time}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-bubble-row bot-row">
                <div className="chat-avatar-small">
                  <Bot size={14} />
                </div>
                <div className="chat-bubble bot-bubble typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions Chips */}
          <div className="chatbot-suggestions">
            {SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(item)}
                className="suggestion-chip"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="chatbot-input-form"
          >
            <input
              type="text"
              placeholder="Ask about treks, stays, gear, limits..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chatbot-input"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="chatbot-send-btn"
              title="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
