import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, MapPin, Loader2 } from 'lucide-react';
import { chatWithGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'model', text: 'Welcome to Federgreen Capital. I am your AI concierge. How can I assist you with our investment opportunities or services today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        const response = await chatWithGemini(userMsg.text, messages.map(m => ({ role: m.role, text: m.text })));
        
        const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: response.text || "I'm having trouble connecting. Please try again.",
            groundingUrls: response.groundingChunks?.map((c: any) => c.web?.uri).filter(Boolean)
        };
        
        setMessages(prev => [...prev, botMsg]);
        setLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-brand-gold hover:bg-brand-gold_light text-brand-900 rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                >
                    <Sparkles size={24} />
                    <span className="font-bold hidden md:inline">Ask AI</span>
                </button>
            )}

            {isOpen && (
                <div className="bg-white dark:bg-brand-900 rounded-2xl shadow-2xl w-96 max-w-[calc(100vw-40px)] h-[500px] flex flex-col border border-brand-800 overflow-hidden animate-fade-in">
                    <div className="bg-brand-950 p-4 flex justify-between items-center border-b border-brand-800">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="text-brand-gold" size={20} />
                            <h3 className="text-white font-bold">Federgreen AI</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-brand-900">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-brand-700 text-white rounded-br-none' 
                                        : 'bg-white dark:bg-brand-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-brand-700 rounded-bl-none shadow-sm'
                                }`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                    {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                                        <div className="mt-2 pt-2 border-t border-brand-600/30 text-xs">
                                            <p className="opacity-70 mb-1">Sources:</p>
                                            {msg.groundingUrls.map((url, i) => (
                                                <a key={i} href={url} target="_blank" rel="noreferrer" className="block text-brand-gold hover:underline truncate">
                                                    {new URL(url).hostname}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-brand-800 rounded-2xl p-3 rounded-bl-none flex items-center space-x-2">
                                    <Loader2 size={16} className="animate-spin text-brand-gold" />
                                    <span className="text-xs text-slate-300">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 bg-white dark:bg-brand-950 border-t border-brand-800 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about financing, sectors..."
                            className="flex-1 bg-slate-100 dark:bg-brand-900 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-brand-gold outline-none dark:text-white"
                        />
                        <button onClick={handleSend} className="bg-brand-gold text-brand-900 p-2 rounded-full hover:bg-brand-gold_light transition-colors">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeminiAssistant;