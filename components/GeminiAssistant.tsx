
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, MapPin, Loader2, Terminal as TerminalIcon, ShieldAlert, Sparkles, Cpu, Activity, Fingerprint, Lock, ChevronRight } from 'lucide-react';
import { chatWithGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { PantherLogo } from './PantherLogo';

const GeminiAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { id: '1', role: 'model', text: 'AUTHENTICATION_SUCCESSFUL. WELCOME TO THE FEDERGREEN STRATEGIC NODE. I AM YOUR TERMINAL CONCIERGE. INITIALIZING ADVISORY_CORE_V4.2...' }
            ]);
            setTimeout(() => {
                if (window.innerWidth > 768) inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (messageText?: string) => {
        const textToSend = messageText || input;
        if (!textToSend.trim() || loading) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        const response = await chatWithGemini(userMsg.text, messages.map(m => ({ role: m.role, text: m.text })));
        
        const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: response.text || "TERMINAL_TIMEOUT: CONNECTION_FAILED. RETRY_HANDSHAKE.",
            groundingUrls: response.groundingChunks?.map((c: any) => c.web?.uri).filter(Boolean)
        };
        
        setMessages(prev => [...prev, botMsg]);
        setLoading(false);
    };
    
    const suggestedPrompts = [
        "Analyze latest tech market trends",
        "Draft an email to a potential investor",
        "Summarize current sovereign bond yields",
        "Explain quantum encryption for finance",
    ];

    return (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100]">
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-brand-950 hover:bg-brand-gold text-white hover:text-brand-950 rounded-full pl-6 pr-8 md:pl-8 md:pr-12 py-4 md:py-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-2 border-brand-gold/30 hover:border-brand-gold transition-all duration-700 hover:scale-110 flex items-center space-x-4 md:space-x-6 relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-brand-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <TerminalIcon className="relative z-10 group-hover:rotate-12 transition-transform" size={24} />
                    <span className="relative z-10 font-black text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.5em] uppercase">Initialize Terminal</span>
                </button>
            )}

            {isOpen && (
                <div className={`bg-brand-950/95 backdrop-blur-3xl md:rounded-[3rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,1)] flex flex-col border-2 border-brand-gold/30 overflow-hidden animate-fade-in relative transition-all duration-500 ${
                    window.innerWidth < 768 ? 'fixed inset-0 w-full h-full rounded-none border-0' : 'w-[480px] h-[750px]'
                }`}>
                    <div className="scanline-overlay opacity-10"></div>
                    
                    {/* Header */}
                    <div className="bg-brand-950/50 p-6 md:p-10 flex justify-between items-center border-b border-brand-gold/20 relative z-10">
                        <div className="flex items-center space-x-4 md:space-x-8">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-brand-gold blur-xl opacity-20"></div>
                                <PantherLogo className="h-8 md:h-12 w-auto brightness-0 invert relative z-10" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-white font-heading font-black text-[10px] md:text-[12px] tracking-[0.2em] md:tracking-[0.3em] uppercase">Command Hub</h3>
                                <div className="flex items-center gap-2 md:gap-3 mt-1">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-terminal animate-pulse shadow-[0_0_8px_currentColor] text-brand-terminal"></div>
                                    <span className="text-[8px] md:text-[10px] font-mono text-brand-terminal font-black uppercase tracking-widest">Live Secure</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-brand-gold/5 flex items-center justify-center text-brand-gold/40 hover:bg-brand-gold hover:text-brand-950 transition-all border border-brand-gold/10 shadow-xl group">
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 md:space-y-10 bg-transparent custom-scrollbar relative z-10">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[95%] md:max-w-[92%] rounded-[1.8rem] md:rounded-[2.5rem] px-6 py-5 md:px-10 md:py-8 text-sm leading-relaxed relative shadow-2xl ${
                                    msg.role === 'user' 
                                        ? 'bg-brand-gold text-brand-950 font-black rounded-tr-none border border-brand-gold/50 shadow-[0_20px_50px_-10px_rgba(0,200,83,0.4)]' 
                                        : 'bg-white/5 text-white/90 border border-brand-gold/20 rounded-tl-none backdrop-blur-xl'
                                }`}>
                                    {msg.role === 'model' && (
                                        <div className="flex justify-between items-center mb-4 border-b border-brand-gold/10 pb-2">
                                            <div className="text-[8px] md:text-[10px] font-mono text-brand-gold/50 uppercase tracking-widest font-black flex items-center gap-2">
                                                <Fingerprint size={10}/> ADVISORY_CORE_V4
                                            </div>
                                            <span className="text-[8px] text-white/10 font-mono">NODE_0xFD...</span>
                                        </div>
                                    )}
                                    <p className={`whitespace-pre-wrap ${msg.role === 'model' ? 'font-light leading-relaxed font-mono text-[12px] md:text-[13px]' : 'tracking-tight text-sm md:text-base'}`}>{msg.text}</p>
                                    {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-brand-gold/10">
                                            <p className="text-[9px] font-mono font-black text-brand-gold/50 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <ShieldAlert size={12} className="animate-pulse" /> Verified Intelligence:
                                            </p>
                                            <div className="flex flex-wrap gap-2 md:gap-3">
                                                {msg.groundingUrls.map((url, i) => (
                                                    <a key={i} href={url} target="_blank" rel="noreferrer" className="text-[9px] font-black block truncate max-w-full italic bg-brand-gold/5 text-brand-gold px-3 py-1.5 rounded-lg border border-brand-gold/20 hover:bg-brand-gold hover:text-brand-950 transition-all">
                                                        {new URL(url).hostname.toUpperCase()}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {messages.length <= 1 && !loading && (
                            <div className="space-y-4 pt-8 md:pt-12 animate-fade-in">
                                <div className="flex items-center gap-3 ml-2">
                                     <Sparkles size={12} className="text-brand-gold/40" />
                                     <p className="text-[10px] font-mono font-black text-brand-gold/40 uppercase tracking-[0.3em]">Suggested Commands</p>
                                </div>
                                <div className="grid grid-cols-1 gap-2 md:gap-3">
                                    {suggestedPrompts.map(prompt => (
                                        <button key={prompt} onClick={() => handleSend(prompt)} className="w-full text-left p-4 md:p-6 bg-white/5 border border-white/5 rounded-2xl text-[10px] md:text-xs font-mono text-white/40 hover:text-brand-gold hover:bg-brand-gold/5 hover:border-brand-gold/30 transition-all group flex justify-between items-center">
                                            {prompt}
                                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-[1.8rem] md:rounded-[2.5rem] px-6 py-5 md:px-10 md:py-8 rounded-tl-none flex flex-col gap-4 shadow-inner w-[240px] md:w-[300px]">
                                    <div className="flex items-center gap-3">
                                         <Loader2 size={16} className="animate-spin text-brand-gold" />
                                         <span className="text-[10px] font-mono font-black text-brand-gold uppercase tracking-[0.3em] animate-pulse">Syncing...</span>
                                    </div>
                                    <div className="space-y-1.5">
                                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                             <div className="h-full bg-brand-gold/40 animate-shimmer"></div>
                                         </div>
                                         <div className="h-1 w-3/4 bg-white/5 rounded-full overflow-hidden">
                                             <div className="h-full bg-brand-gold/40 animate-shimmer" style={{animationDelay: '200ms'}}></div>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 md:p-12 bg-brand-950/90 border-t-2 border-brand-gold/20 relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                        <div className="relative group flex items-center">
                            <span className="absolute left-6 md:left-10 text-brand-gold/40 font-mono text-lg pointer-events-none group-focus-within:text-brand-gold transition-all">&gt;</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Query Terminal..."
                                className="w-full bg-brand-gold/5 border-2 border-brand-gold/10 rounded-2xl md:rounded-[2rem] pl-12 md:pl-16 pr-20 md:pr-24 py-4 md:py-7 text-sm md:text-base focus:border-brand-gold outline-none text-white placeholder:text-white/10 font-mono tracking-tight transition-all"
                            />
                            <div className="absolute right-2 top-2 md:right-4 md:top-4">
                                <button onClick={() => handleSend()} className="bg-brand-gold text-brand-950 p-3 md:p-5 rounded-xl md:rounded-2xl hover:bg-white transition-all shadow-2xl active:scale-90">
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="mt-6 md:mt-8 flex justify-between items-center text-[8px] md:text-[9px] font-mono text-white/10 uppercase tracking-[0.4em] md:tracking-[0.6em]">
                             <div className="flex items-center gap-2">
                                 <Lock size={10} /> ISO_27001
                             </div>
                             <span>OS_v4.2.0_SECURE_UPLINK</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeminiAssistant;
