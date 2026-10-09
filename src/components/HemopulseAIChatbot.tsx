import React, { useState, useEffect, useRef } from 'react';
import {
  ChatMessage,
  ChatContext,
  sendChatMessage,
} from '../services/aiChatService.ts';
import {
  Bot,
  User,
  Send,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Minimize2,
  Maximize2,
  HelpCircle,
  ShieldCheck,
  Phone,
  Flame,
  Radio,
  RefreshCw,
} from 'lucide-react';

interface HemopulseAIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  context: ChatContext;
  languageMode?: 'EN' | 'HI';
}

const PRESET_PROMPTS = [
  { label: '🔮 Predictive Inventory Forecaster', query: 'How does the Predictive Inventory Forecaster inside the MILP solver anticipate Diwali and Dengue demand spikes to proactively rebalance stock before shortages?' },
  { label: '🩸 Universal Donor & Compatibility', query: 'What is the universal blood donor and recipient? Explain compatibility rules under NBTC.' },
  { label: '🚨 Green Corridor Transit Protocol', query: 'How does Green Corridor emergency blood transit work in India with police clearance?' },
  { label: '⏱️ e-RaktKosh Shelf-Life Limits', query: 'What are the shelf-life and cold-chain storage temperature standards in e-RaktKosh?' },
  { label: '❤️ Voluntary Donor Eligibility', query: 'What are the criteria for voluntary blood donation in India according to government rules?' },
  { label: '📞 Emergency Helplines (108, 1910)', query: 'What are the emergency numbers for blood availability and ambulances in India?' },
  { label: '⚡ Massive Transfusion (MTP 1:1:1)', query: 'Explain the Massive Transfusion Protocol (MTP 1:1:1) and Shock Index calculation in trauma.' },
];

export const HemopulseAIChatbot: React.FC<HemopulseAIChatbotProps> = ({
  isOpen,
  onClose,
  context,
  languageMode = 'EN',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: languageMode === 'HI'
        ? `नमस्ते! मैं **HEMOPULSE AI Copilot** हूँ।\n\nमैं ई-रक्तकोश (e-RaktKosh) और राष्ट्रीय रक्त आधान परिषद (NBTC) मानकों पर आधारित 24x7 आपातकालीन रक्त उपलब्धता, अनुकूलता चार्ट, और 108 एम्बुलेंस ग्रीन कॉरिडोर की संपूर्ण जानकारी प्रदान करता हूँ। आप मुझसे कोई भी प्रश्न पूछ सकते हैं!`
        : `Welcome to **HEMOPULSE Emergency AI Copilot**.\n\nIntegrated with **e-RaktKosh** & **NBTC** guidelines. I can answer any questions regarding blood group compatibility, Indian hospital stocks, 108 emergency green corridor activation, shelf-life limits, and voluntary donor guidelines.\n\nHow can I help you right now?`,
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const speakText = (text: string) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Remove Markdown headers and bullets for cleaner audio speech
      const cleanedText = text
        .replace(/#{1,6}\s+/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`{1,3}[^`]*`{1,3}/g, '')
        .slice(0, 300); // Speak first couple sentences cleanly

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = languageMode === 'HI' ? 'hi-IN' : 'en-IN';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS error:', e);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await sendChatMessage(
        text,
        [...messages, userMessage],
        context,
        languageMode
      );

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      speakText(responseText);
    } catch (error) {
      console.error('Chat response error:', error);
      const errorMessage: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: '### ⚠️ Network Latency\n\nUnable to reach server. Please call **1910 (National Blood Helpline)** or **108 (EMS)** for immediate life-critical support.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: 'Chat history cleared. How can I assist you with Indian blood banking protocols?',
        timestamp: new Date(),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-out flex flex-col shadow-2xl border border-slate-700 bg-slate-950 ${
        isExpanded
          ? 'inset-3 sm:inset-8 md:inset-12 rounded-2xl'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[440px] md:w-[480px] h-[600px] max-h-[85vh] rounded-2xl'
      }`}
    >
      {/* Copilot Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 p-3.5 border-b border-slate-800 flex items-center justify-between rounded-t-2xl shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center text-white shadow-lg shadow-rose-950/60 border border-rose-400/40">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-white text-sm tracking-tight">
                HEMOPULSE AI Copilot
              </h3>
              <span className="bg-rose-900/60 text-rose-300 text-[10px] font-mono px-1.5 py-0.2 rounded border border-rose-700/60 font-bold">
                e-RaktKosh 24x7
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>National Blood Transfusion Council Intelligence</span>
              {context.activeLocationLabel && (
                <span className="text-cyan-400 font-mono hidden sm:inline">
                  • {context.activeLocationLabel}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Header Tools */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            title={speechEnabled ? 'Mute Speech' : 'Enable Voice Output'}
            className={`p-1.5 rounded-lg transition hover:bg-slate-800 ${
              speechEnabled ? 'text-cyan-400' : 'text-slate-500'
            }`}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={handleClearHistory}
            title="Reset Conversation"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Restore Size' : 'Maximize'}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition hidden sm:block"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            title="Close Copilot"
            className="p-1.5 rounded-lg hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-3 py-2 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
        <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
        {PRESET_PROMPTS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.query)}
            disabled={isLoading}
            className="whitespace-nowrap bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1 rounded-full border border-slate-700/60 font-medium transition shrink-0 active:scale-95"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-950/90 text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-rose-700 text-white shadow-md shadow-rose-950'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble Container */}
            <div
              className={`group relative max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none prose prose-invert'
              }`}
            >
              {/* Formatted Content */}
              <div className="whitespace-pre-wrap font-sans text-[12.5px] leading-relaxed">
                {msg.text}
              </div>

              {/* Time & Action Toolbar */}
              <div className="mt-2 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                {msg.sender === 'assistant' && (
                  <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => speakText(msg.text)}
                      title="Read aloud"
                      className="hover:text-cyan-300 transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      title="Copy response"
                      className="hover:text-cyan-300 transition"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2 bg-slate-900/50 rounded-xl border border-slate-800/80 w-fit">
            <Bot className="w-4 h-4 text-rose-400 animate-spin" />
            <span>Consulting e-RaktKosh knowledge base &amp; Gemini 3.8 Flash...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Tray */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 rounded-b-2xl shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              languageMode === 'HI'
                ? 'रक्त उपलब्धता, संगतता, या 108 ग्रीन कॉरिडोर के बारे में पूछें...'
                : 'Ask about blood stock, compatibility, shelf-life, or 108 Green Corridor...'
            }
            className="flex-1 bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-950/60 transition active:scale-95 shrink-0"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 px-1 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Govt. of India NBTC &amp; e-RaktKosh Clinical Reference</span>
          </span>
          <span className="text-rose-400 font-bold">Helpline: 1910 / 108</span>
        </div>
      </div>
    </div>
  );
};
