
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
import AdminAuthGuard from './components/auth/AdminAuthGuard';
import SettingsInjector from './components/SettingsInjector';
import UserSwitcher from './components/auth/UserSwitcher'; // Import UserSwitcher
import { settingsService } from './services/settingsService';
import { adminAuthService } from './services/adminAuthService';
import { authService } from './services/authService'; // Import site user auth service
import { brandingService } from './services/brandingService';
import { DEFAULT_PAGE } from './constants';
import { ArrowDown, Zap, ChevronRight, Play, Pause, Terminal, ArrowRight } from 'lucide-react';
import { ScenarioManager } from './lib/scenario-manager';
import { PageSection, PageContent, FinancialScenario, SiteUser } from './types';
import { SiteSettings } from './config/settingsModel';
import AdminPreviewBar from './components/admin/AdminPreviewBar';

const PageSectionRenderer: React.FC<{ section: PageSection; onNavigate: (path: string) => void }> = ({ section, onNavigate }) => {

    const InstitutionalCard: React.FC<{ item: any, onNavigate: (path: string) => void, animationDelay: string }> = ({ item, onNavigate, animationDelay }) => {
        const cardRef = useRef<HTMLDivElement>(null);

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!cardRef.current) return;
            const card = cardRef.current;
            const { width, height, left, top } = card.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            
            const mouseX = x - width / 2;
            const mouseY = y - height / 2;
            
            const rotateY = (mouseX / (width / 2)) * 8;
            const rotateX = -(mouseY / (height / 2)) * 8;

            card.style.setProperty('--rotate-x', `${rotateX}deg`);
            card.style.setProperty('--rotate-y', `${rotateY}deg`);
            card.style.setProperty('--spotlight-x', `${(x / width) * 100}%`);
            card.style.setProperty('--spotlight-y', `${(y / height) * 100}%`);
        };

        const handleMouseLeave = () => {
            if (!cardRef.current) return;
            cardRef.current.style.setProperty('--rotate-x', '0deg');
            cardRef.current.style.setProperty('--rotate-y', '0deg');
        };
        
        return (
            <div 
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`flash-card rounded-2xl sm:rounded-3xl group animate-fade-up min-h-[280px] md:min-h-[320px]`}
                style={{ animationDelay }}
            >
                <div className="card-inner">
                    <div className={`card-front p-6 sm:p-8 md:p-10`}>
                        <div className="card-content flex flex-col items-center justify-center text-center h-full">
                            <Zap className="text-brand-gold mb-6 mx-auto" size={48} />
                            <h3 className="text-lg sm:text-xl md:text-2xl font-heading font-black text-white transition-colors tracking-tight leading-tight uppercase">
                                {item.title}
                            </h3>
                            <p className="mt-4 text-[9px] font-mono text-white/60 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity delay-300">Hover to Declassify</p>
                        </div>
                    </div>
                    <div 
                        onClick={() => item.link && onNavigate(item.link)}
                        className={`card-back p-6 sm:p-8 md:p-10 justify-between flex flex-col ${item.link ? 'cursor-pointer' : ''}`}
                    >
                        <div className="card-content">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-heading font-black text-brand-gold mb-3 sm:mb-4 transition-colors tracking-tight leading-tight uppercase">
                                {item.title}
                            </h3>
                            <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                                {item.desc}
                            </p>
                        </div>
                        <div className={`card-content pt-4 sm:pt-6 border-t border-white/10 flex items-center text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500`}>
                            {item.link ? 'Deploy Ecosystem' : 'Examine Logic'} 
                            <ChevronRight size={14} className="ml-2" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
      <div className="py-12 sm:py-16 md:py-24 border-b border-brand-800/30 last:border-0 relative px-0">
          <div className="mb-10 sm:mb-16 md:mb-20 text-left max-w-[1400px]">
              <span className="text-[9px] sm:text-[11px] font-black text-brand-gold uppercase tracking-[0.5em] mb-4 block animate-fade-up" style={{ animationDelay: '100ms' }}>Strategic Node</span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-6 md:mb-8 tracking-tighter leading-[1.1] animate-fade-up uppercase" style={{ animationDelay: '200ms' }}>
                  {section.title}
              </h2>
              <div className="w-12 sm:w-16 md:w-20 h-1 bg-brand-gold mb-6 md:mb-8 rounded-full opacity-40 animate-fade-up" style={{ animationDelay: '300ms' }}></div>
              <p className="text-sm sm:text-lg md:text-xl text-white/60 leading-relaxed font-medium max-w-4xl animate-fade-up" style={{ animationDelay: '400ms' }}>
                  {section.content}
              </p>
          </div>

          {section.type === 'cards' && section.items && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {section.items.map((item, i) => (
                      <InstitutionalCard 
                          key={i} 
                          item={item} 
                          onNavigate={onNavigate} 
                          animationDelay={`${500 + i * 150}ms`} 
                      />
                  ))}
              </div>
          )}

          {/* Form and analysis containers use consistent max-width */}
          <div className="max-w-[1600px] mx-auto">
            {section.type === 'form-contact' && <div className="animate-fade-up" style={{ animationDelay: '500ms' }}><ContactCenter /></div>}
            {section.type === 'form-membership' && <div className="animate-fade-up" style={{ animationDelay: '500ms' }}><MembershipApplication /></div>}
            {section.type === 'form-testimonial' && <div className="animate-fade-up" style={{ animationDelay: '500ms' }}><Testimonials /></div>}
            {section.type === 'ai-analysis' && (
                <div className="animate-fade-up" style={{ animationDelay: '500ms' }}>
                    <InvestmentAnalyzer toolId="residual-income" />
                </div>
            )}
            {section.type === 'compliance-hub' && <div className="animate-fade-up" style={{ animationDelay: '500ms' }}><ComplianceHub /></div>}
          </div>
      </div>
  );
};

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentPath, setCurrentPath] = useState(() => window.location.hash.replace('#', '') || '/');
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  const [isAdminUser, setIsAdminUser] = useState(!!adminAuthService.getCurrentUser());
  const [currentSiteUser, setCurrentSiteUser] = useState<SiteUser | null>(authService.getCurrentSiteUser());
  
  const [settings, setSettings] = useState<SiteSettings>(() => 
    isAdminUser ? settingsService.getDraftSettings() : settingsService.getPublishedSettings()
  );

  const handleSettingsPublish = () => {
      setSettings(settingsService.getDraftSettings());
  };

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
        setScrollProgress(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
        setOffsetY(window.pageYOffset);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.replace('#', '') || '/');
      window.scrollTo(0, 0);
      setIsAdminUser(!!adminAuthService.getCurrentUser());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    setSettings(isAdminUser ? settingsService.getDraftSettings() : settingsService.getPublishedSettings());
  }, [isAdminUser]);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo(0, 0);
  };

  const isPortal = currentPath.startsWith('/portal');
  const isDataTools = currentPath.startsWith('/data-tools');
  const isAdminPath = currentPath.startsWith('/admin');
  const isHome = currentPath === '/';

  const pageData = useMemo((): PageContent => {
      const baseData = settings.content.pages[currentPath] || DEFAULT_PAGE;
      const heroImage = settings.images[currentPath] || baseData.image;
      return { ...baseData, image: heroImage };
  }, [currentPath, settings]);

  if (!isAuthorized) {
    return <LaunchGate onAuthorize={handleAuthorization} />;
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-brand-950 text-white overflow-x-hidden">
      <SettingsInjector settings={settings} />
      
      {isAdminPath ? (
          <AdminAuthGuard />
      ) : (
        <>
            {isAdminUser && <AdminPreviewBar onPublish={handleSettingsPublish} />}
            <UserSwitcher onUserChange={setCurrentSiteUser} onNavigate={navigate} />

            <div 
                className="fixed top-0 left-0 h-1 bg-brand-gold z-[110] transition-all duration-150 ease-out shadow-[0_0_20px_rgba(0,200,83,0.6)]"
                style={{ width: `${scrollProgress * 100}%` }}
            ></div>

            <Navbar 
                navigation={settings.navigation}
                currentPath={currentPath} 
                onNavigate={navigate} 
                onSearchClick={() => setSearchOpen(true)}
                isAdminUser={isAdminUser}
            />

            <SearchCommand isOpen={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={navigate} />

            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-5%] left-[-5%] w-[70%] h-[70%] bg-brand-700/10 dark:bg-brand-gold/5 rounded-full blur-[140px] animate-glow"></div>
                <div className="absolute bottom-[-5%] right-[-10%] w-[60%] h-[60%] bg-brand-500/15 dark:bg-brand-gold/5 rounded-full blur-[140px] animate-glow delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] dark:opacity-[0.06] contrast-125 mix-blend-overlay"></div>
            </div>

            <main className="flex-grow relative z-10">
                <section className={`relative flex items-center ${isHome ? 'h-[100dvh]' : 'h-[60vh] sm:h-[65vh] lg:h-[75vh]'} overflow-hidden`}>
                    <div className="absolute inset-0 z-0 bg-brand-950">
                        {isHome && pageData.heroVideo ? (
                             <video 
                                ref={videoRef} autoPlay loop muted playsInline 
                                className="w-full h-full object-cover opacity-90 scale-100"
                                poster={pageData.image}
                                style={{ transform: `translateY(${offsetY * 0.05}px)` }}
                             > <source src={pageData.heroVideo} type="video/mp4" /> </video>
                        ) : (
                            <div 
                                className="w-full h-full opacity-90 bg-cover bg-center bg-no-repeat transition-transform duration-[30s] ease-linear"
                                style={{ 
                                    backgroundImage: `url(${pageData.image || DEFAULT_PAGE.image})`,
                                    transform: `translateY(${offsetY * 0.05}px) scale(${1.0 + (offsetY * 0.00015)})`
                                }}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/50 via-transparent to-brand-950/90"></div>
                        <div className="absolute inset-0 bg-brand-950/10 backdrop-brightness-[1.05]"></div>
                    </div>

                    <div className="relative z-10 max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-12 w-full pt-16 sm:pt-24">
                        <div className="max-w-[90rem] text-left">
                            {pageData.subtitle && (
                                <div className="flex items-center gap-3 sm:gap-6 mb-4 sm:mb-8 animate-fade-up">
                                    <div className="h-px w-6 sm:w-12 bg-brand-gold"></div>
                                    <p className="text-brand-gold font-heading font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[8px] sm:text-[11px] text-glow">{pageData.subtitle}</p>
                                </div>
                            )}
                            <h1 className={`font-heading font-black leading-[0.9] sm:leading-[0.95] mb-6 sm:mb-12 tracking-tighter text-white text-4xl sm:text-6xl md:text-7xl lg:text-9xl animate-fade-up uppercase`} style={{ animationDelay: '150ms' }}>
                               <span className={`${isHome ? 'text-brand-gold' : ''} animate-reveal-text inline-block`}>{pageData.title.split(' ').slice(0, -1).join(' ')}</span><br/>
                               <span className="text-brand-gold animate-reveal-text inline-block" style={{ animationDelay: '300ms' }}>{pageData.title.split(' ').slice(-1).join(' ')}</span>
                            </h1>
                            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-14 max-w-3xl font-medium leading-relaxed animate-fade-up" style={{ animationDelay: '450ms' }}>
                                {pageData.description}
                            </p>
                            
                            {isHome && (
                                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 animate-fade-up" style={{ animationDelay: '600ms' }}>
                                    <button 
                                        onClick={() => navigate('/portal')} 
                                        className="group relative px-8 sm:px-12 py-4 sm:py-6 bg-brand-gold text-brand-950 font-heading font-black rounded-xl sm:rounded-2xl flex items-center justify-center gap-4 transition-all hover:bg-white shadow-[0_20px_50px_rgba(0,200,83,0.5)] text-[10px] sm:text-[11px] uppercase tracking-[0.4em] overflow-hidden"
                                    >
                                        <span className="relative z-10">Access Terminal</span>
                                        <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                                    </button>
                                    <button 
                                        onClick={() => navigate('/services')} 
                                        className="px-8 sm:px-12 py-4 sm:py-6 glass border border-white/20 text-white font-heading font-black rounded-xl sm:rounded-2xl flex items-center justify-center gap-4 hover:bg-white/10 transition-all text-[10px] sm:text-[11px] uppercase tracking-[0.4em]"
                                    >
                                        Our Services
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {isHome && (
                        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 flex flex-col items-center gap-2 animate-bounce opacity-60 hidden xs:flex">
                            <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.5em] text-white">Explore Hub</span>
                            <ArrowDown size={14} className="sm:w-[18px] sm:h-[18px] text-brand-gold" />
                        </div>
                    )}
                </section>

                <div className="relative z-20 -mt-12 sm:-mt-24 max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-12 pb-32 sm:pb-48">
                    {isPortal ? ( <Portal onNavigate={navigate} /> ) : 
                     isDataTools ? ( <ToolPageTemplate currentPath={currentPath} onNavigate={navigate} scenario={activeScenario} allScenarios={allScenarios} onUpdateScenario={handleUpdateScenario} /> ) : 
                     (
                        <div className="space-y-4 sm:space-y-8">
                            {pageData.sections?.map((section, idx) => (
                                <PageSectionRenderer key={idx} section={section} onNavigate={navigate} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer onNavigate={navigate} footerLinks={settings.footer.links} isAdminUser={isAdminUser} />
            <GeminiAssistant />
        </>
      )}
    </div>
  );
};

export default App;
