import React, { useState, useRef, useEffect } from 'react';

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Shoot!' }
  ]);
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setMessages(prev => [...prev, { sender: 'user', text: query.trim() }]);
    const userQuery = query.trim();
    setQuery('');
    try {
      const res = await fetch('https://glad-ai-combine-connector.trycloudflare.com/api/llm1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'cid3',
          query: userQuery,
        }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data?.result?.agentResponse || 'No response' }]);
    } catch {
      setMessages(prev => [...prev, { sender: 'bot', text: '❌ Failed to get response' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
      {isOpen ? (
        <div className="bg-white shadow-2xl rounded-2xl w-96 max-w-full p-0 border border-gray-200 flex flex-col" style={{ height: 480 }}>
          <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-2xl">
            <span className="font-semibold text-white text-lg">Control Logic GPT</span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 text-xl">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50" style={{ scrollbarWidth: 'thin' }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-2xl rounded-tl-2xl rounded-tr-md px-4 py-2 max-w-[75%] shadow'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-2xl rounded-tr-2xl rounded-tl-md px-4 py-2 max-w-[75%] shadow'
                  }
                  style={{ wordBreak: 'break-word', fontSize: 15 }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-2">
                <div className="bg-white border border-gray-200 text-blue-500 rounded-bl-2xl rounded-tr-2xl rounded-tl-md px-4 py-2 max-w-[75%] shadow animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-white">
            <form
              className="flex gap-2"
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm bg-gray-50"
                placeholder="Type your question..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                disabled={loading}
                autoFocus
                maxLength={500}
              />
              <button
                type="submit"
                className={`bg-blue-600 text-white px-5 py-2 rounded-full text-base font-semibold shadow hover:bg-blue-700 transition-all ${loading || !query.trim() ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={loading || !query.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-full shadow-2xl w-16 h-16 flex items-center justify-center text-3xl hover:scale-105 hover:shadow-blue-300 transition-all border-4 border-white"
          aria-label="Open ChatBot"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatBotWidget;
