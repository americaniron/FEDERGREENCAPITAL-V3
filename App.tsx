
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GeminiAssistant from './components/GeminiAssistant';
import InvestmentAnalyzer from './components/InvestmentAnalyzer';
import Testimonials from './components/Testimonials';
import MembershipApplication from './components/MembershipApplication';
import ContactCenter from './components/ContactCenter';
import Portal from './components/Portal';
import SearchCommand from './components/SearchCommand';
import ToolPageTemplate from './components/data-tools/ToolPageTemplate';
import ComplianceHub from './components/tools/ComplianceHub';
import LaunchGate from './components/LaunchGate';
import { PAGE_DATA, DEFAULT_PAGE } from './constants';
import { ArrowDown, Zap, ChevronRight, Play, Pause, Terminal, ArrowRight } from 'lucide-react';
import { ScenarioManager } from './lib/scenario-manager';
import { PageSection, PageContent, FinancialScenario } from './types';

const PageSectionRenderer: React.FC<{ section: PageSection; onNavigate: (path: string) => void }> = ({ section, onNavigate }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
      <div className="py-16 md:py-24 border-b border-brand-800/30 last:border-0 relative px-0">
          <div className="mb-12 md:mb-20 text-left max-w-5xl">
              <span className="text-[10px] md:text-[11px] font-extrabold text-brand-gold uppercase tracking-[0.5em] mb-4 block animate-fade-up" style={{ animationDelay: '100ms' }}>Strategic Context</span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-6 md:mb-8 tracking-tighter leading-[1.1] animate-fade-up uppercase" style={{ animationDelay: '200ms' }}>
                  {section.title}
              </h2>
              <div className="w-16 md:w-20 h-1 bg-brand-gold mb-6 md:mb-8 rounded-full opacity-30 animate-fade-up" style={{ animationDelay: '300ms' }}></div>
              <p className="text-base md:text-xl text-white/60 leading-relaxed font-medium max-w-3xl animate-fade-up" style={{ animationDelay: '400ms' }}>
                  {section.content}
              </p>
          </div>

          {section.type === 'cards' && section.items && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {section.items.map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => item.link && onNavigate(item.link)}
                        className={`flash-card p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] group transition-all duration-700 animate-fade-up ${item.link ? 'cursor-pointer' : ''}`}
                        style={{ animationDelay: `${500 + i * 150}ms`, perspective: '1000px' }}
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            e.currentTarget.style.setProperty('--spotlight-x', `${x}px`);
                            e.currentTarget.style.setProperty('--spotlight-y', `${y}px`);
                            
                            const rotateX = (y / rect.height - 0.5) * -8;
                            const rotateY = (x / rect.width - 0.5) * 8;
                            if (window.innerWidth > 768) {
                                e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = `rotateX(0deg) rotateY(0deg)`;
                        }}
                      >
                          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 hidden md:block">
                              <Zap className="text-brand-gold/40" size={32} />
                          </div>
                          <h3 className="text-xl md:text-2xl font-heading font-extrabold text-white mb-4 group-hover:text-brand-gold transition-colors tracking-tight leading-tight uppercase">
                              {item.title}
                          </h3>
                          <p className="text-white/50 text-sm md:text-base leading-relaxed mb-6 font-medium">
                              {item.desc}
                          </p>
                          <div className={`pt-6 border-t border-brand-800/50 flex items-center text-brand-gold text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.3em] transition-all duration-500`}>
                              {item.link ? 'Deploy Ecosystem' : 'Examine Logic'} 
                              <ChevronRight size={16} className="ml-2 group-hover:translate-x-3 transition-transform" />
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {section.type === 'form-contact' && <div className="animate-fade-up" style={{ animationDelay: '500ms' }}><ContactCenter /></div>}
          {section.type === 'form-membership' && <div className="animate-fade-up" style={{ animationDelay: '500ms' }}><MembershipApplication /></div>}
          {section.type === 'form-testimonial' && <div className="animate-fade-up" style={{ animationDelay: '500ms' }}><Testimonials /></div>}
          {section.type === 'ai-analysis' && <div className="animate-fade-up" style={{ animationDelay: '500ms' }}><InvestmentAnalyzer /></div>}
          {section.type === 'compliance-hub' && <div className="animate-fade-up" style={{ animationDelay: '500ms' }}><ComplianceHub /></div>}
      </div>
  );
};

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentPath, setCurrentPath] = useState(() => window.location.hash.replace('#', '') || '/');
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [offsetY, setOffsetY] = useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem('fc_authorized') === 'true') {
        setIsAuthorized(true);
    }
  }, []);

  const handleAuthorization = () => {
    sessionStorage.setItem('fc_authorized', 'true');
    setIsAuthorized(true);
  };

  const [activeScenario, setActiveScenario] = useState<FinancialScenario>(() => ScenarioManager.getActiveScenario());
  const [allScenarios, setAllScenarios] = useState<FinancialScenario[]>(() => ScenarioManager.getScenarios());

  const handleUpdateScenario = (updates: Partial<FinancialScenario>) => {
    const updated = ScenarioManager.updateScenario({ ...activeScenario, ...updates });
    setActiveScenario(updated);
    setAllScenarios(ScenarioManager.getScenarios());
  };

  useEffect(() => {
    const handleScroll = () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        setScrollProgress(windowHeight > 0 ? totalScroll / windowHeight : 0);
        setOffsetY(window.pageYOffset);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    window.document.documentElement.classList.toggle('dark', isDark);
    window.document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.replace('#', '') || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo(0, 0);
  };

  const isPortal = currentPath.startsWith('/portal');
  const isDataTools = currentPath.startsWith('/data-tools');
  const isHome = currentPath === '/';

  const pageData = useMemo((): PageContent => PAGE_DATA[currentPath] || DEFAULT_PAGE, [currentPath]);

  if (!isAuthorized) {
    return <LaunchGate onAuthorize={handleAuthorization} />;
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-brand-950 text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-5%] w-[65%] h-[65%] bg-brand-700/10 dark:bg-brand-gold/5 rounded-full blur-[140px] animate-glow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-brand-500/15 dark:bg-brand-gold/5 rounded-full blur-[140px] animate-glow delay-1000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.06] contrast-125 mix-blend-multiply dark:mix-blend-overlay"></div>
      </div>

      <div 
        className="fixed top-0 left-0 h-1 bg-brand-gold z-[100] transition-all duration-150 ease-out shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        style={{ width: `${scrollProgress * 100}%` }}
      ></div>

      <Navbar 
        currentPath={currentPath} 
        onNavigate={navigate} 
        onSearchClick={() => setSearchOpen(true)}
        toggleTheme={() => setIsDark(!isDark)}
        isDark={isDark}
      />

      <SearchCommand isOpen={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={navigate} />

      <main className="flex-grow relative z-10">
            <section className={`relative flex items-center ${isHome ? 'h-[100dvh]' : 'h-[65vh] md:h-[75vh]'} overflow-hidden`}>
                <div className="absolute inset-0 z-0 bg-brand-950">
                    {isHome && pageData.heroVideo ? (
                         <video 
                            ref={videoRef} autoPlay loop muted playsInline 
                            className="w-full h-full object-cover opacity-90 scale-100"
                            poster={pageData.image}
                            style={{ transform: `translateY(${offsetY * 0.08}px)` }}
                         > <source src={pageData.heroVideo} type="video/mp4" /> </video>
                    ) : (
                        <div 
                            className="w-full h-full opacity-90 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-linear"
                            style={{ 
                                backgroundImage: `url(${pageData.image || DEFAULT_PAGE.image})`,
                                transform: `translateY(${offsetY * 0.08}px) scale(${1.0 + (offsetY * 0.0002)})`
                            }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-950/40 via-brand-950/0 to-brand-950/80"></div>
                    <div className="absolute inset-0 bg-brand-950/10 backdrop-brightness-[0.95]"></div>
                </div>

                <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 w-full pt-12 md:pt-24">
                    <div className="max-w-4xl text-left">
                        {pageData.subtitle && (
                            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8 animate-fade-up">
                                <div className="h-px w-8 md:w-12 bg-brand-gold"></div>
                                <p className="text-brand-gold font-heading font-extrabold uppercase tracking-[0.4em] md:tracking-[0.5em] text-[10px] md:text-xs text-glow">{pageData.subtitle}</p>
                            </div>
                        )}
                        <h1 className={`font-heading font-black leading-[0.95] mb-8 md:mb-12 tracking-tighter text-white text-5xl md:text-7xl lg:text-8xl xl:text-9xl animate-fade-up uppercase`} style={{ animationDelay: '150ms' }}>
                           <span className="animate-reveal-text inline-block">{pageData.title.split(' ').slice(0, -1).join(' ')}</span><br/>
                           <span className="text-brand-gold animate-reveal-text inline-block" style={{ animationDelay: '300ms' }}>{pageData.title.split(' ').slice(-1).join(' ')}</span>
                        </h1>
                        <p className="text-base md:text-xl lg:text-2xl text-white/90 mb-10 md:mb-14 max-w-2xl font-medium leading-relaxed animate-fade-up" style={{ animationDelay: '450ms' }}>
                            {pageData.description}
                        </p>
                        
                        {isHome && (
                            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 animate-fade-up" style={{ animationDelay: '600ms' }}>
                                <button 
                                    onClick={() => navigate('/portal')} 
                                    className="group relative px-10 md:px-12 py-5 md:py-6 bg-brand-gold text-brand-950 font-heading font-black rounded-2xl flex items-center justify-center gap-4 transition-all hover:bg-white shadow-[0_20px_50px_rgba(212,175,55,0.4)] text-[10px] md:text-[11px] uppercase tracking-[0.4em] overflow-hidden w-full sm:w-auto"
                                >
                                    <span className="relative z-10">Access Terminal</span>
                                    <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                                </button>
                                <button 
                                    onClick={() => navigate('/services')} 
                                    className="px-10 md:px-12 py-5 md:py-6 glass border border-white/10 text-white font-heading font-black rounded-2xl flex items-center justify-center gap-4 hover:bg-white/10 transition-all text-[10px] md:text-[11px] uppercase tracking-[0.4em] w-full sm:w-auto"
                                >
                                    Our Services
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {isHome && (
                    <div className="absolute bottom-10 left-10 flex flex-col items-center gap-3 animate-bounce opacity-50 hidden md:flex">
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.5em] text-white">Explore</span>
                        <ArrowDown size={18} />
                    </div>
                )}
            </section>

            <div className="relative z-20 -mt-16 md:-mt-24 max-w-[1600px] mx-auto px-6 lg:px-12 pb-32 md:pb-48">
                {isPortal ? ( <Portal onNavigate={navigate} /> ) : 
                 isDataTools ? ( <ToolPageTemplate currentPath={currentPath} onNavigate={navigate} scenario={activeScenario} allScenarios={allScenarios} onUpdateScenario={handleUpdateScenario} /> ) : 
                 (
                    <div className="space-y-4">
                        {pageData.sections?.map((section, idx) => (
                            <PageSectionRenderer key={idx} section={section} onNavigate={navigate} />
                        ))}
                    </div>
                )}
            </div>
      </main>

      <Footer onNavigate={navigate} />
      <GeminiAssistant />
    </div>
  );
};

export default App;
