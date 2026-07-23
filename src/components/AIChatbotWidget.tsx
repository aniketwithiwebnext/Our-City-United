import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw, ChevronDown, MapPin, Phone } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const AIChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: '¡Hola! I am "Our City AI", your assistant for Our City United LLC in Socorro, Texas. How can I help you find local businesses, services, or events today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Best Mexican bakery in Socorro?',
    'Urgent medical clinic near North Loop?',
    'Auto repair shop in Socorro TX',
    'How do I list my business?',
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Thank you for reaching out! You can contact Our City United LLC at (915) 300-3190.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: 'I am currently connecting to our local Socorro database. Feel free to call Our City United LLC directly at (915) 300-3190 or email Ourcityunited@gmail.com!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-[#0B3D91] hover:bg-[#072252] text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
          aria-label="Open AI Chatbot"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-[#F4B400] group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4B400] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F4B400]"></span>
            </span>
          </div>
          <span className="font-bold uppercase tracking-wider text-xs pr-1 hidden sm:inline">Ask Our City AI</span>
        </button>
      )}

      {isOpen && (
        <div className="w-[calc(100vw-32px)] sm:w-[380px] h-[450px] sm:h-[480px] max-h-[calc(100vh-110px)] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#0B3D91] text-white px-4 py-3 border-b border-blue-900 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F4B400] text-[#0B3D91] flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-[#0B3D91]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xs sm:text-sm leading-tight flex items-center gap-1.5 font-heading">
                  Our City AI Assistant <Sparkles className="w-3.5 h-3.5 text-[#F4B400] animate-pulse" />
                </h3>
                <p className="text-[11px] text-blue-200/80 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#F4B400]" /> Socorro, TX Directory Expert
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick contact banner */}
          <div className="bg-[#072252] px-3 py-1.5 border-b border-blue-900 flex items-center justify-between text-[11px] text-blue-100 shrink-0">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#F4B400]" /> (915) 300-3190
            </span>
            <span className="text-[#F4B400] font-bold">Our City United LLC</span>
          </div>

          {/* Messages body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#F5F5F5]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-[#0B3D91] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-[#F4B400]" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#F4B400] text-[#0B3D91] font-semibold rounded-br-none shadow-sm'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-[#0B3D91]/70' : 'text-gray-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#F4B400] text-[#0B3D91] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-[#0B3D91]" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-xs text-[#0B3D91] bg-white p-2.5 rounded-xl border border-gray-200 w-fit shadow-sm">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0B3D91]" />
                <span className="font-medium">Searching Socorro business directory...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length < 3 && (
            <div className="p-2 bg-white border-t border-gray-100 flex flex-wrap gap-1 shrink-0">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="text-[10px] bg-gray-100 hover:bg-blue-50 text-[#0B3D91] px-2.5 py-1 rounded-full border border-gray-200 transition-all text-left font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Socorro businesses..."
              className="flex-1 bg-gray-50 text-gray-900 placeholder-gray-400 text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0B3D91] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-[#F4B400] hover:bg-amber-400 disabled:opacity-40 text-[#0B3D91] font-bold rounded-xl transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
