
import React, { useState, useEffect } from 'react';
import { PantherLogo } from './PantherLogo';
import { 
    LayoutDashboard, PieChart, FileText, Settings, LogOut, 
    TrendingUp, Shield, Users, User, CheckCircle, Clock, 
    ArrowUpRight, ArrowRight, Download, Wallet, Bell, Lock, AlertCircle, Wrench,
    Zap, Globe, Activity, Crown, Fingerprint, Eye, Command, Server, Cpu, Terminal as TerminalIcon
} from 'lucide-react';
import MarketIntelligence from './tools/MarketIntelligence';
import BusinessPlanBuilder from './tools/BusinessPlanBuilder';
import BusinessIntelligence from './tools/BusinessIntelligence';
import InvestmentAnalyzer from './InvestmentAnalyzer';

interface PortalProps {
    onNavigate: (path: string) => void;
}

const Portal: React.FC<PortalProps> = ({ onNavigate }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [terminalLines, setTerminalLines] = useState<string[]>([]);

    useEffect(() => {
        if (isAuthenticating) {
            const lines = [
                "> INITIALIZING FEDERGREEN SECURE KERNEL...",
                "> ESTABLISHING QUANTUM HANDSHAKE...",
                "> BYPASSING STANDARD FIREWALLS...",
                "> AUTHENTICATING GLOBAL ACCESS NODE...",
                "> ACCESS GRANTED: [LEVEL_MAX]",
                "> DEPLOYING INTERFACE..."
            ];
            let current = 0;
            const interval = setInterval(() => {
                if (current < lines.length) {
                    setTerminalLines(prev => [...prev, lines[current]]);
                    current++;
                } else {
                    clearInterval(interval);
                }
            }, 200);
            return () => clearInterval(interval);
        } else {
            setTerminalLines([]);
        }
    }, [isAuthenticating]);

    const handleConnect = () => {
        setIsAuthenticating(true);
        setTimeout(() => {
            setIsAuthorized(true);
            setIsAuthenticating(false);
        }, 2200);
    };

    const handleDisconnect = () => {
        setIsAuthorized(false);
    };

    const FlashCard = ({ title, icon: Icon, children, accent = "brand-gold" }: any) => (
        <div className="bg-brand-950/30 backdrop-blur-md border border-brand-gold/10 p-10 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-brand-gold/30 transition-all duration-700">
            <div className={`absolute top-0 right-0 w-48 h-48 bg-brand-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-gold/10 transition-all`}></div>
            <div className="scanline-overlay opacity-5"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div className={`p-4 bg-brand-gold/10 rounded-3xl text-brand-gold border border-brand-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.1)] group-hover:scale-110 transition-transform`}>
                        <Icon size={28} />
                    </div>
                    <div className="text-[10px] font-mono text-brand-gold/40 tracking-[0.3em] uppercase">SYSTEM_NODE_{Math.floor(Math.random() * 900) + 100}</div>
                </div>
                <h3 className="text-white font-heading font-extrabold text-2xl mb-6 tracking-tight uppercase group-hover:text-brand-gold transition-colors">{title}</h3>
                <div className="space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );

    const UnifiedDashboard = () => (
        <div className="animate-fade-in space-y-12 pb-32">
            {/* Main Header Card - Combined flair into Global Master access */}
            <div className="relative p-16 rounded-[4rem] border border-brand-gold/20 shadow-[0_0_100px_rgba(212,175,55,0.1)] overflow-hidden bg-brand-950/30 backdrop-blur-xl">
                <div className="scanline-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-transparent"></div>
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-16">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 text-brand-gold font-bold uppercase tracking-[0.6em] text-[10px] mb-8 bg-brand-gold/10 w-fit px-4 py-2 rounded-full border border-brand-gold/20">
                            <Fingerprint size={16} /> GLOBAL COMMAND NODE ACTIVE
                        </div>
                        <h2 className="text-7xl md:text-8xl font-heading font-extrabold text-white tracking-tighter leading-[0.85] mb-10">
                            Master <br/><span className="text-brand-gold">Terminal.</span>
                        </h2>
                        <p className="text-white/80 text-2xl font-light leading-relaxed mb-12">
                            Access all proprietary intelligence models, AI reasoning cores, and capital migration monitors. <br/>
                            <span className="text-brand-gold font-bold underline decoration-brand-gold/30 underline-offset-8">All AI Models (Gemini 3.0 Pro) Uplinked.</span>
                        </p>
                        <div className="flex gap-6">
                            <div className="p-4 bg-brand-gold/5 border border-brand-gold/10 rounded-2xl flex items-center gap-4 backdrop-blur-md">
                                <Activity className="text-brand-gold animate-pulse" size={24} />
                                <div>
                                    <p className="text-[9px] font-bold text-brand-gold/60 uppercase tracking-widest">Global Sentiment</p>
                                    <p className="text-white font-bold text-sm">OPTIMISTIC [A+]</p>
                                </div>
                            </div>
                            <div className="p-4 bg-brand-terminal/5 border border-brand-terminal/10 rounded-2xl flex items-center gap-4 backdrop-blur-md">
                                <Server className="text-brand-terminal" size={24} />
                                <div>
                                    <p className="text-[9px] font-bold text-brand-terminal/60 uppercase tracking-widest">System Health</p>
                                    <p className="text-white font-bold text-sm">STABLE [100%]</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0 relative group">
                        <div className="absolute inset-0 bg-brand-gold blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="w-64 h-64 rounded-[3rem] border-2 border-brand-gold/30 p-2 flex items-center justify-center relative bg-brand-950/50 overflow-hidden shadow-2xl">
                             <img 
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop" 
                                className="w-full h-full rounded-[2.5rem] object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000"
                                alt="Access Node"
                            />
                            <div className="absolute bottom-4 left-4 right-4 bg-brand-gold/90 text-brand-950 py-2 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center shadow-lg">ID_GLOBAL_NODE</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <FlashCard title="Sovereign Corridors" icon={Globe}>
                    <div className="space-y-4">
                        {[
                            { name: 'KSA Neom Tech Phase II', flow: '+$2.4B', risk: 'LOW' },
                            { name: 'EU Green Hydrogen Hub', flow: '+$1.8B', risk: 'MED' },
                            { name: 'APAC Semi-Con Build', flow: '+$4.2B', risk: 'LOW' }
                        ].map((deal, i) => (
                            <div key={i} className="flex justify-between items-center p-6 bg-brand-gold/5 rounded-3xl border border-brand-gold/10 hover:border-brand-gold transition-all cursor-pointer group/node backdrop-blur-sm">
                                <div>
                                    <p className="text-white font-bold text-sm group-hover/node:text-brand-gold transition-colors">{deal.name}</p>
                                    <p className="text-[9px] text-brand-gold/40 font-bold uppercase tracking-widest mt-1">CAPITAL_FLOW_ENTRY</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-brand-gold font-bold text-sm">{deal.flow}</p>
                                    <span className="text-[9px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded uppercase font-bold">{deal.risk}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </FlashCard>

                <FlashCard title="Strategic Intelligence" icon={Cpu}>
                    <p className="text-white/70 text-sm mb-10 leading-relaxed font-mono">
                        AI REASONING CORE ENGAGED... <br/>
                        READY FOR COMPLEX STRATEGY ANALYSIS.
                    </p>
                    <button 
                        onClick={() => onNavigate('/services/analysis')}
                        className="w-full py-5 bg-brand-gold text-brand-950 font-extrabold rounded-2xl transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-brand-gold/50 text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3"
                    >
                        <Zap size={16} /> Open Strategy Engine
                    </button>
                </FlashCard>

                <FlashCard title="Market Velocity" icon={TrendingUp}>
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Asset Utilization</span>
                            <span className="text-brand-gold font-bold text-lg">84%</span>
                        </div>
                        <div className="w-full h-2 bg-brand-950/40 rounded-full overflow-hidden border border-brand-gold/10">
                            <div className="h-full bg-brand-gold shadow-[0_0_10px_#d4af37] w-[84%]"></div>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed italic">Global market sentiment indicates consistent institutional top-quartile performance.</p>
                    </div>
                </FlashCard>
            </div>

            {/* AI Reasoning Section */}
            <div className="bg-brand-950/30 backdrop-blur-xl border border-brand-gold/10 p-16 rounded-[4rem] shadow-2xl relative">
                <div className="scanline-overlay opacity-5"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-brand-terminal/10 rounded-2xl text-brand-terminal border border-brand-terminal/20">
                            <Eye size={28} />
                        </div>
                        <div>
                            <h3 className="text-4xl font-heading font-extrabold text-white tracking-tight uppercase">Strategic AI Audit</h3>
                            <p className="text-brand-terminal/60 font-mono text-[10px] uppercase tracking-[0.3em] mt-2">Uplink: Gemini 3.0 Pro Reasoning</p>
                        </div>
                    </div>
                    <div className="px-6 py-3 glass border border-brand-terminal/30 rounded-2xl flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-brand-terminal animate-pulse"></div>
                        <span className="text-[10px] font-mono font-bold text-brand-terminal uppercase tracking-widest">LATENCY: 0.02ms</span>
                    </div>
                </div>
                <InvestmentAnalyzer />
            </div>

            {/* Portfolio & Reports */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 <FlashCard title="Node Reports" icon={FileText}>
                    <button className="w-full py-5 glass border border-brand-gold/20 text-brand-gold rounded-2xl text-[11px] font-extrabold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-brand-gold hover:text-brand-950 transition-all shadow-xl">
                        <Download size={18} /> Q3_PERFORMANCE_PDF
                    </button>
                    <button className="w-full py-5 glass border border-brand-gold/20 text-brand-gold rounded-2xl text-[11px] font-extrabold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-brand-gold hover:text-brand-950 transition-all shadow-xl mt-4">
                        <Download size={18} /> RISK_EXPOSURE_AUDIT
                    </button>
                </FlashCard>

                <FlashCard title="AI Core Status" icon={Cpu} accent="brand-terminal">
                    <div className="p-8 bg-brand-950/30 backdrop-blur-sm rounded-[2.5rem] border border-brand-terminal/10 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-terminal/20 animate-scanline"></div>
                        <div className="flex justify-between items-center text-[11px] font-mono font-bold uppercase text-brand-terminal/60">
                            <span>Logic Flux</span>
                            <span className="text-brand-terminal animate-pulse">OPTIMAL</span>
                        </div>
                        <div className="h-4 w-full bg-brand-terminal/5 rounded-full overflow-hidden border border-brand-terminal/10">
                            <div className="h-full bg-brand-terminal w-[92%] shadow-[0_0_15px_#00ff41]"></div>
                        </div>
                        <p className="text-xs text-white/60 font-mono leading-relaxed">
                            System reasoning cores are synchronized. All institutional data tools are operational for the global node.
                        </p>
                    </div>
                </FlashCard>

                <FlashCard title="System Node Triggers" icon={Wrench}>
                    <div className="grid grid-cols-2 gap-4">
                        {['Market', 'Compliance', 'Finance', 'Venture'].map(btn => (
                            <button key={btn} onClick={() => onNavigate(`/data-tools/${btn.toLowerCase()}`)} className="p-4 bg-brand-950/30 backdrop-blur-md border border-brand-gold/10 rounded-2xl text-[10px] font-mono font-bold text-white uppercase hover:border-brand-gold hover:bg-brand-gold/5 transition-all shadow-inner tracking-widest">{btn}_ACCESS</button>
                        ))}
                    </div>
                </FlashCard>
            </div>
            
            <button 
                onClick={() => onNavigate('/data-tools')}
                className="w-full py-10 border-2 border-dashed border-brand-gold/20 text-brand-gold/60 hover:text-brand-gold hover:border-brand-gold hover:bg-brand-gold/10 rounded-[3rem] transition-all text-sm font-extrabold uppercase tracking-[0.5em] flex items-center justify-center gap-6 shadow-inner group backdrop-blur-sm"
            >
                <TerminalIcon size={28} className="group-hover:rotate-12 transition-transform" /> 
                INITIALIZE FULL ARCHITECT SUITE_
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-950 pt-32 pb-12 relative overflow-hidden">
             {/* Dynamic Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-5%] right-[-5%] w-[900px] h-[900px] bg-brand-gold/5 rounded-full blur-[180px] animate-glow"></div>
                <div className="absolute bottom-[-5%] left-[-5%] w-[900px] h-[900px] bg-brand-gold/5 rounded-full blur-[180px] animate-glow delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] mix-blend-overlay"></div>
            </div>

            {isAuthenticating && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-brand-950/90 backdrop-blur-3xl animate-fade-in">
                    <div className="scanline-overlay opacity-10"></div>
                    <div className="relative mb-16 group">
                        <div className="absolute inset-0 bg-brand-gold blur-3xl opacity-20 animate-pulse"></div>
                        <Fingerprint size={120} className="text-brand-gold relative z-10 animate-bounce" />
                    </div>
                    <div className="w-full max-w-md space-y-2 text-left px-12 relative z-10">
                        {terminalLines.map((line, i) => (
                            <p key={i} className="terminal-text text-[11px] animate-fade-in uppercase tracking-[0.2em]">{line}</p>
                        ))}
                    </div>
                    <div className="mt-16 w-80 h-1 bg-brand-gold/10 rounded-full overflow-hidden border border-brand-gold/20 relative z-10">
                        <div className="h-full bg-brand-gold animate-shimmer shadow-[0_0_20px_#d4af37]"></div>
                    </div>
                    <p className="mt-8 text-brand-gold font-bold uppercase tracking-[0.6em] text-[10px] animate-pulse relative z-10">AUTHORIZING_IDENTITY...</p>
                </div>
            )}

            {!isAuthorized ? (
                <div className="max-w-xl mx-auto px-6 relative z-10 pt-12">
                    <div className="bg-brand-950/50 border border-brand-gold/20 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] p-16 text-center backdrop-blur-3xl animate-fade-up relative overflow-hidden">
                        <div className="scanline-overlay opacity-5"></div>
                        <div className="w-32 h-32 bg-brand-gold/10 rounded-[2.5rem] border border-brand-gold/20 flex items-center justify-center mx-auto mb-12 shadow-[0_0_50px_rgba(212,175,55,0.1)] group transition-all hover:scale-105">
                            <PantherLogo className="h-20 w-auto brightness-0 invert" />
                        </div>
                        <h2 className="text-5xl font-heading font-extrabold text-white mb-6 tracking-tighter uppercase">Strategic Entry</h2>
                        <p className="text-white/70 text-lg mb-16 font-medium tracking-tight">Bypass role-restrictions. Access Federgreen Global Node.</p>
                        
                        <button 
                            onClick={handleConnect}
                            className="group w-full flex items-center gap-8 p-10 bg-brand-gold text-brand-950 border border-brand-gold/30 rounded-[2.5rem] hover:bg-white transition-all shadow-[0_20px_50px_-10px_rgba(212,175,55,0.4)]"
                        >
                            <div className={`p-5 bg-brand-950 rounded-[2rem] text-brand-gold border border-brand-gold/20 group-hover:scale-110 transition-transform shadow-xl`}>
                                <TerminalIcon size={32} />
                            </div>
                            <div className="text-left">
                                <p className="font-extrabold text-2xl leading-none mb-2 uppercase tracking-tighter">Initialize Secure Terminal</p>
                                <p className="text-[10px] text-brand-950/60 font-bold uppercase tracking-[0.2em]">Deploy Institutional AI Core v4.2</p>
                            </div>
                            <ArrowRight className="ml-auto text-brand-950/20 group-hover:text-brand-950 group-hover:translate-x-2 transition-all" size={32} />
                        </button>

                        <div className="mt-16 flex items-center justify-center gap-4 py-4 bg-brand-gold/5 rounded-2xl border border-brand-gold/10">
                             <Lock size={14} className="text-brand-gold" />
                             <p className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.5em]">
                                Encrypted Session Locked • ISO 27001
                             </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-10 bg-brand-950/30 p-8 rounded-[3rem] border border-brand-gold/10 backdrop-blur-xl">
                        <div className="flex items-center gap-8">
                            <div className="relative cursor-pointer" onClick={() => onNavigate('/')}>
                                <PantherLogo className="h-12 w-auto brightness-0 invert" />
                                <div className="absolute inset-0 bg-brand-gold blur-xl opacity-20"></div>
                            </div>
                            <div className="h-12 w-px bg-brand-gold/20"></div>
                            <div>
                                <h1 className="text-xl font-heading font-extrabold text-white uppercase tracking-tighter flex items-center gap-3">
                                  Global Command Center
                                  <span className="text-brand-gold text-sm font-mono">[ROOT_NODE]</span>
                                </h1>
                                <p className="text-[10px] text-brand-gold/50 font-bold uppercase tracking-[0.6em] mt-1">Federgreen OS v4.2.0-PRO</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col items-end">
                                <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">System Latency</p>
                                <p className="text-brand-terminal font-mono text-xs">0.02ms</p>
                            </div>
                            <button className="w-16 h-16 rounded-[1.5rem] bg-brand-gold/5 border border-brand-gold/10 flex items-center justify-center text-white/60 hover:text-brand-gold hover:border-brand-gold transition-all relative group shadow-inner">
                                <Bell size={24} />
                                <span className="absolute top-4 right-4 w-3 h-3 bg-brand-gold rounded-full shadow-[0_0_10px_#d4af37] animate-pulse"></span>
                            </button>
                            <button onClick={handleDisconnect} className="flex items-center gap-4 px-10 py-5 bg-brand-gold text-brand-950 text-[11px] font-extrabold uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl hover:bg-white">
                                <LogOut size={18} /> Disconnect
                            </button>
                        </div>
                    </div>

                    <UnifiedDashboard />
                </div>
            )}
        </div>
    );
};

export default Portal;
