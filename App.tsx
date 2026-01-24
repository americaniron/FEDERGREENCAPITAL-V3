
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GeminiAssistant from './components/GeminiAssistant';
import InvestmentAnalyzer from './components/InvestmentAnalyzer';
import TTSPlayer from './components/TTSPlayer';
import Testimonials from './components/Testimonials';
import MembershipApplication from './components/MembershipApplication';
import ContactCenter from './components/ContactCenter';
import Portal from './components/Portal';
import SearchCommand from './components/SearchCommand';
import ScenarioDashboard from './components/data-tools/ScenarioDashboard';
import ToolRenderer from './components/data-tools/ToolRenderer';
import { PAGE_DATA, DEFAULT_PAGE, ENTERPRISE_SECTIONS } from './constants';
import { ArrowRight, CheckCircle2, Pause, Play, ShieldCheck, Globe, Layers, Search as SearchIcon, ArrowDown } from 'lucide-react';
import { ScenarioManager } from './lib/scenario-manager';
import { FinancialScenario, PageSection } from './types';
import { TOOL_REGISTRY } from './lib/tool-registry';

// --- SUB-COMPONENTS FOR CONTENT RENDERING ---

const PageSectionRenderer: React.FC<{ section: PageSection; onNavigate: (path: string) => void }> = ({ section, onNavigate }) => {
  return (
      <div className="py-20 border-b border-brand-800/30 last:border-0">
          <div className="mb-12 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-white mb-6 tracking-tight">{section.title}</h2>
              <p className="text-lg text-slate-400 leading-relaxed font-light">{section.content}</p>
          </div>

          {section.type === 'cards' && section.items && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {section.items.map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => item.link && onNavigate(item.link)}
                        className={`bg-brand-900/50 backdrop-blur-sm border border-brand-800 p-8 rounded-2xl hover:border-brand-gold transition-all duration-300 hover:-translate-y-2 group shadow-xl ${item.link ? 'cursor-pointer' : ''}`}
                      >
                          <h3 className="text-xl font-bold text-white mb-4 group-hover:text-brand-gold transition-colors">{item.title}</h3>
                          <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                          <div className={`mt-6 pt-4 border-t border-brand-800/50 flex items-center text-brand-gold text-xs font-bold uppercase tracking-widest transition-opacity ${item.link ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              {item.link ? 'Open Tool' : 'Learn More'} <ArrowRight size={14} className="ml-2" />
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {section.type === 'form-contact' && <ContactCenter />}
          {section.type === 'form-membership' && <MembershipApplication />}
          {section.type === 'form-testimonial' && <Testimonials />}
          {section.type === 'ai-analysis' && <InvestmentAnalyzer />}
      </div>
  );
};

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(() => {
    try {
        return window.location.hash.replace('#', '') || '/';
    } catch (e) {
        return '/';
    }
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [activeScenario, setActiveScenario] = useState<FinancialScenario>(ScenarioManager.getActiveScenario());
  const [scenarios, setScenarios] = useState<FinancialScenario[]>(ScenarioManager.getScenarios());

  const handleUpdateScenario = (updates: Partial<FinancialScenario>) => {
    const fullUpdate = { ...activeScenario, ...updates };
    const updated = ScenarioManager.updateScenario(fullUpdate);
    setActiveScenario(updated);
    setScenarios(ScenarioManager.getScenarios());
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        setScrollProgress(windowHeight > 0 ? totalScroll / windowHeight : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      try {
        const path = window.location.hash.replace('#', '') || '/';
        setCurrentPath(path);
        window.scrollTo(0, 0);
      } catch (e) {
        // Fallback for environments where location access is restricted
        console.warn("Hash access restricted", e);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    try {
        window.location.hash = path;
    } catch (e) {
        console.warn("Navigation hash update failed:", e);
    }
    window.scrollTo(0, 0);
  };

  const isPortal = currentPath.startsWith('/portal');
  const isDataTools = currentPath.startsWith('/data-tools');

  const DataToolsLandingPage = () => (
    <>
      <section className="relative flex items-center h-[60vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={PAGE_DATA['/data-tools'].image} alt="Data Tools" className="w-full h-full object-cover fixed-bg-effect" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/80 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-20">
          <div className="max-w-4xl animate-fade-up">
            <h1 className="text-6xl font-heading font-bold text-white leading-tight mb-4 drop-shadow-lg">Capital Investments Suite</h1>
            <p className="text-xl text-slate-200 mb-10 max-w-2xl font-light">The most comprehensive analytical suite for institutional and private capital. Real-time modeling, risk assessment, and AI-driven insights.</p>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-24 space-y-24">
        <ScenarioDashboard scenario={ScenarioManager.getActiveScenario()} />
        {ENTERPRISE_SECTIONS.map(section => (
          <div key={section.id}>
            <div className="flex items-center gap-6 mb-12">
                <div className="h-px bg-brand-800 flex-1"></div>
                <h2 className="text-3xl font-heading font-bold text-white text-center flex items-center gap-4">
                    <section.icon className="text-brand-gold" size={32} /> {section.label.substring(3)}
                </h2>
                <div className="h-px bg-brand-800 flex-1"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOOL_REGISTRY.filter(t => t.category === section.id).map(tool => (
                    <div key={tool.id} onClick={() => navigate(`/data-tools/${tool.category}/${tool.id}`)} className="bg-brand-900/40 p-8 rounded-2xl border border-brand-800/60 hover:border-brand-gold hover:bg-brand-900 transition-all group cursor-pointer shadow-lg backdrop-blur-sm">
                        <h4 className="font-bold text-lg text-white mb-2 group-hover:text-brand-gold transition-colors">{tool.name}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">{tool.description}</p>
                    </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const ToolCategoryPage = ({ categoryId }: { categoryId: string }) => {
      const category = ENTERPRISE_SECTIONS.find(c => c.id === categoryId);
      const tools = TOOL_REGISTRY.filter(t => t.category === categoryId);
      // Fetch specific image for this category if available, else fallback
      const categoryData = PAGE_DATA[`/data-tools/${categoryId}`] || PAGE_DATA['/data-tools'];

      if (!category) return <div>Category not found</div>;

      return (
        <>
            <section className="relative flex items-center h-[50vh] overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={categoryData.image} alt={category.label} className="w-full h-full object-cover fixed-bg-effect" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/80 to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-20">
                    <div className="max-w-4xl animate-fade-up">
                        <p className="text-brand-gold font-bold uppercase tracking-widest mb-4">Data Tools</p>
                        <h1 className="text-5xl font-heading font-bold text-white drop-shadow-lg">{category.label.substring(3)}</h1>
                    </div>
                </div>
            </section>
            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tools.map(tool => (
                        <div key={tool.id} onClick={() => navigate(`/data-tools/${tool.category}/${tool.id}`)} className="bg-brand-900 p-8 rounded-2xl border border-brand-800 hover:border-brand-gold transition-all group cursor-pointer shadow-xl hover:-translate-y-2">
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-gold">{tool.name}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{tool.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
      );
  };
  
  const renderDataTools = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    const categoryId = pathParts[1];
    const toolId = pathParts[2];
    
    if (toolId) {
      return <ToolRenderer 
        toolId={toolId}
        categoryId={categoryId}
        scenario={activeScenario}
        allScenarios={scenarios}
        onUpdateScenario={handleUpdateScenario}
      />;
    }
    if (categoryId) {
      return <ToolCategoryPage categoryId={categoryId} />;
    }
    return <DataToolsLandingPage />;
  };

  const pageData = isDataTools ? (PAGE_DATA[currentPath] || PAGE_DATA['/data-tools']) : (PAGE_DATA[currentPath] || DEFAULT_PAGE);
  const isHome = currentPath === '/';

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-brand-gold selection:text-brand-900 dark bg-brand-950 text-slate-100">
      <div 
        className="fixed top-0 left-0 h-1 bg-brand-gold z-[100] transition-all duration-100 ease-out box-shadow-glow"
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

      <main className="flex-grow">
        {isPortal ? <Portal onNavigate={navigate} /> : 
         isDataTools ? renderDataTools() : (
            <>
                {/* Cinematic Hero Section */}
                <section className={`relative flex items-center ${isHome ? 'h-screen' : 'h-[60vh]'} overflow-hidden group`}>
                    <div className="absolute inset-0 z-0">
                        {isHome && pageData.heroVideo ? (
                            <video 
                                autoPlay 
                                loop 
                                muted 
                                playsInline 
                                poster={pageData.image} 
                                className="w-full h-full object-cover opacity-60"
                            >
                                <source src={pageData.heroVideo} type="video/mp4" />
                            </video>
                        ) : (
                            <img 
                                src={pageData.image} 
                                alt={pageData.title} 
                                className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[20s] ease-linear" 
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-brand-900/30"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-12">
                        <div className="max-w-5xl animate-fade-up">
                            {pageData.subtitle && (
                                <p className="text-brand-gold font-bold uppercase tracking-[0.2em] mb-4 text-sm md:text-base animate-fade-in delay-100">{pageData.subtitle}</p>
                            )}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white leading-[1.1] mb-8 tracking-tight drop-shadow-2xl">
                                {pageData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl font-light leading-relaxed drop-shadow-md">
                                {pageData.description}
                            </p>
                            {isHome && (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button onClick={() => navigate('/services')} className="px-8 py-4 bg-brand-gold text-brand-900 font-bold rounded-full hover:bg-white transition-all shadow-xl hover:shadow-brand-gold/20 flex items-center justify-center gap-2">
                                        Explore Solutions <ArrowRight size={18}/>
                                    </button>
                                    <button onClick={() => navigate('/contact')} className="px-8 py-4 bg-brand-950/50 backdrop-blur-md text-white font-bold rounded-full border border-white/20 hover:bg-brand-900 hover:border-brand-gold transition-all flex items-center justify-center gap-2">
                                        Partner With Us
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    {isHome && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-70">
                            <span className="text-[10px] uppercase tracking-widest text-slate-400">Scroll</span>
                            <ArrowDown size={20} className="text-brand-gold"/>
                        </div>
                    )}
                </section>

                {/* Main Content Area */}
                <div className="max-w-7xl mx-auto px-4 pt-12 pb-32">
                    {pageData.sections && pageData.sections.length > 0 ? (
                        pageData.sections.map((section, idx) => (
                            <PageSectionRenderer key={idx} section={section} onNavigate={navigate} />
                        ))
                    ) : (
                        // Fallback for pages without defined sections
                        <div className="py-20 text-center">
                            <p className="text-slate-500 italic">Content pending institutional review.</p>
                        </div>
                    )}
                    
                    {/* Special Components for Home Page */}
                    {isHome && (
                        <>
                            <div className="py-20">
                                <Testimonials />
                            </div>
                            <div className="py-20">
                                <ContactCenter />
                            </div>
                        </>
                    )}
                    {/* Special Components for Contact Page */}
                    {currentPath === '/contact' && (
                         <div className="py-10">
                            <ContactCenter />
                        </div>
                    )}
                </div>
            </>
        )}
      </main>

      <Footer onNavigate={navigate} />
      <GeminiAssistant />
    </div>
  );
};

export default App;
