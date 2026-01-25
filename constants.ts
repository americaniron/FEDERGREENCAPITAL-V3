
import { NavItem, PageContent } from './types';
import { 
  Building2, Globe, Briefcase, TrendingUp, ShieldCheck, 
  Users, Zap, Leaf, Landmark, Factory, Plane, Cpu, 
  Bitcoin, FileText, Newspaper, Phone, Database, Scale, Calculator, Receipt, Shield
} from 'lucide-react';
import { TOOL_REGISTRY } from './lib/tool-registry';

export const SITE_NAME = "Federgreen Capital";

const DATA_TOOL_CATEGORIES = [
  { label: 'Financial Analysis', id: 'financial-analysis' },
  { label: 'Tax & Reserves', id: 'tax-reserves' },
  { label: 'Investment Analysis', id: 'investment-analysis' },
  { label: 'Property Metrics', id: 'property-metrics' },
  { label: 'Advanced Metrics', id: 'advanced-metrics' },
  { label: 'Cost & Expenses', id: 'cost-expenses' },
  { label: 'Tax & Gains', id: 'tax-gains' },
  { label: 'Portfolio & Comparison', id: 'portfolio' },
  { label: 'Market Analysis', id: 'market' },
  { label: 'Business Analysis', id: 'business' },
  { label: 'Compliance (KYC/AML)', id: 'compliance' },
];

const dataToolsSubItems = DATA_TOOL_CATEGORIES.map(category => {
    const tools = TOOL_REGISTRY.filter(tool => tool.category === category.id);
    const firstToolPath = tools.length > 0 
        ? `/data-tools/${category.id}/${tools[0].id}` 
        : `/data-tools/${category.id}`;
        
    return {
        label: category.label,
        path: firstToolPath,
        subItems: tools.map(tool => ({
            label: tool.name,
            path: `/data-tools/${category.id}/${tool.id}`
        }))
    };
});

export const NAVIGATION: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about-us' },
  {
    label: 'Data Tools',
    path: '/data-tools',
    icon: Database,
    subItems: dataToolsSubItems
  },
  {
    label: 'Private Memberships',
    path: '/private-memberships',
    subItems: [
      { label: 'Global Private Access', path: '/private-memberships/global-private-access' },
      { label: 'Global Capital Access', path: '/private-memberships/global-capital-access' },
      { label: 'Founders Circle', path: '/private-memberships/founders-circle' },
      { label: 'Compliance Hub', path: '/compliance' }
    ]
  },
  {
    label: 'Services',
    path: '/services',
    subItems: [
      { label: 'Capital Advisory', path: '/services/capital-advisory' },
      { label: 'Strategy', path: '/services/strategy' },
      { label: 'Analysis', path: '/services/analysis' },
      { label: 'Risk Mitigation', path: '/services/risk-mitigation' },
      { label: 'Secured Depositor Programs', path: '/services/secured-depositor-programs' },
      { label: 'Citizenship by Investment', path: '/services/citizenship-by-investment' },
      { label: 'Scaling Businesses', path: '/services/scaling-businesses' },
      { label: 'High ROIs Low Risk', path: '/services/high-rois-low-risk' },
      { 
        label: 'Due Diligence', 
        path: '/services/due-diligence',
        subItems: [
          { label: 'Security Checks/KYC/AML', path: '/services/due-diligence/security-checks' },
          { label: 'Third-Party Valuations', path: '/services/due-diligence/third-party-valuations' },
          { label: 'Feasibility Studies', path: '/services/due-diligence/feasibility-studies' },
        ]
      },
    ]
  },
  {
    label: 'Sectors',
    path: '/sectors',
    subItems: [
      { label: 'Real Estate', path: '/sectors/real-estate' },
      { label: 'Technology', path: '/sectors/technology' },
      { label: 'Health', path: '/sectors/health' },
      { label: 'Sports', path: '/sectors/sports' },
      { label: 'Aerospace', path: '/sectors/aerospace' },
      { label: 'Renewable Energy', path: '/sectors/renewable-energy' },
      { label: 'Film & Entertainment', path: '/sectors/film-entertainment' },
      { label: 'Sustainability', path: '/sectors/sustainability' },
      { label: 'Mining', path: '/sectors/mining' },
      { label: 'Food & Beverage', path: '/sectors/food-beverage' },
      { label: 'Manufacturing', path: '/sectors/manufacturing' },
      { label: 'Fashion & Beauty', path: '/sectors/fashion-beauty' },
    ]
  },
  {
    label: 'Financing',
    path: '/financing',
    subItems: [
      { label: 'Debt', path: '/financing/debt' },
      { label: 'Equity', path: '/financing/equity' },
      { label: 'Hybrid', path: '/financing/hybrid' },
      { label: 'Private Funds', path: '/financing/private-funds' },
      { label: 'New World of Finance', path: '/financing/new-world-of-finance' },
      { 
        label: 'Asset Based Lending', 
        path: '/financing/asset-based-lending',
        subItems: [
           { label: 'BTC/USDT Lending', path: '/financing/asset-based-lending/btc-usdt-lending' },
           { label: 'Leveraging Programs', path: '/financing/asset-based-lending/leveraging' },
           { label: 'Monetization', path: '/financing/asset-based-lending/monetization' },
           { 
             label: 'Financial Instruments', 
             path: '/financing/asset-based-lending/financial-instruments',
             subItems: [
                { label: 'Commodities', path: '/financing/asset-based-lending/financial-instruments/commodities' },
                { label: 'Trade Programs', path: '/financing/asset-based-lending/financial-instruments/trade-programs' },
                { label: 'BTC/USDT Trade', path: '/financing/asset-based-lending/financial-instruments/btc-usdt-trade' },
             ]
           },
        ]
      },
    ]
  },
  { label: 'Contact', path: '/contact' }
];

export const PAGE_DATA: Record<string, PageContent> = {
  '/': {
    title: 'Defining the Future of Capital',
    subtitle: 'Strategic Investment & Global Advisory',
    description: 'Federgreen Capital bridges the gap between ambition and achievement. We provide elite financial solutions, private membership access, and strategic foresight for the modern investor.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4', 
    sections: [
      {
        title: 'Featured Opportunities',
        content: 'Exclusive access to high-yield global markets.',
        type: 'cards',
        items: [
          { title: 'Global Tech Fund', desc: 'Investing in Quantum Computing infrastructure. Projected IRR 18-22%.', link: '/sectors/technology' },
          { title: 'Green Energy Bonds', desc: 'Sustainable returns from renewable energy projects in Europe. A-Rated security.', link: '/sectors/renewable-energy' },
          { title: 'Luxury Real Estate', desc: 'Prime asset acquisition in emerging metropolitan hubs. Value-add strategy.', link: '/sectors/real-estate' }
        ]
      }
    ]
  },
  '/about-us': {
    title: 'A Legacy of Excellence',
    description: 'Founded on the principles of integrity, innovation, and insight, Federgreen Capital has evolved into a global powerhouse in strategic investment.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop',
    sections: [
        {
            title: 'Market Intelligence',
            content: 'Access our global data hub for geospacial and socio-economic due diligence.',
            type: 'cards',
            items: [
                { title: 'Data Hub', desc: 'Connect to real-time global datasets.', link: '/data-tools/market/data-hub' },
                { title: 'API Configuration', desc: 'Manage institutional data keys.', link: '/data-tools/market/api-settings' }
            ]
        }
    ]
  },
  '/contact': {
      title: 'Contact Concierge',
      description: 'Begin your journey with Federgreen Capital.',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop',
      sections: [{ title: 'Get in Touch', content: 'Our team is available 24/7.', type: 'form-contact' }]
  },
  '/data-tools': { 
    title: 'Architect Suite', 
    description: 'The most comprehensive analytical suite for institutional and private capital.', 
    image: 'https://images.unsplash.com/photo-1551288049-bbbda5366991?q=80&w=2070&auto=format&fit=crop' 
  },
  '/private-memberships': { 
    title: 'Private Memberships', 
    description: 'Exclusive access to institutional deal flow.', 
    image: 'https://images.unsplash.com/photo-1560669882-c20e32718428?q=80&w=2070&auto=format&fit=crop', 
    sections: [
        { title: 'Join the Elite', content: 'Apply for membership below.', type: 'form-membership' },
        {
            title: 'Member Data Tools',
            content: 'Advanced portfolio and asset analytics for private members.',
            type: 'cards',
            items: [
                { title: 'Portfolio Performance', desc: 'Aggregate holdings analysis.', link: '/data-tools/portfolio/portfolio-performance' },
                { title: 'Multi-Property Comparison', desc: 'Side-by-side analytical matrix.', link: '/data-tools/portfolio/multi-prop-compare' },
                { title: 'Rental Growth Projector', desc: 'Market-indexed escalation modeling.', link: '/data-tools/portfolio/rental-growth-proj' },
                { title: 'Leverage Analysis', desc: 'LTV impact on portfolio IRR.', link: '/data-tools/portfolio/leverage-analysis' }
            ]
        },
        {
            title: 'Institutional Compliance',
            content: 'Mandatory KYC/AML intake and risk oversight.',
            type: 'cards',
            items: [
                { title: 'Compliance Hub', desc: 'Execute regulatory verification.', link: '/compliance' }
            ]
        }
    ] 
  },
  '/services': { 
    title: 'Elite Services', 
    description: 'Bespoke financial solutions for complex global landscapes.', 
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
    sections: [
        {
            title: 'Investment & Deal Analysis',
            content: 'Deep-reasoning tools for deal structuring and valuation.',
            type: 'cards',
            items: [
                { title: 'Venture Validator', desc: 'Business model valuation.', link: '/data-tools/business/business-valuation-tool' },
                { title: 'Fix & Flip ROI', desc: 'Short-term rehab modeling.', link: '/data-tools/investment-analysis/fix-flip-roi' },
                { title: 'BRRRR Tracker', desc: 'Refinance and repeat analyzer.', link: '/data-tools/investment-analysis/brrrr-tracker' },
                { title: 'Business Plan Builder', desc: 'Strategic drafting suite.', link: '/data-tools/business/business-planner' }
            ]
        }
    ]
  },
  '/services/analysis': { 
    title: 'Advanced Analysis', 
    description: 'Data-driven insights for sovereign-level investment.', 
    image: 'https://images.unsplash.com/photo-1551288049-bbbda5366991?q=80&w=2070&auto=format&fit=crop', 
    sections: [{ title: 'Strategy Engine', content: 'Run a preliminary analysis below.', type: 'ai-analysis' }] 
  },
  '/financing': { 
    title: 'Capital Solutions', 
    description: 'Flexible financing for the evolving economic landscape.', 
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2071&auto=format&fit=crop',
    sections: [
        {
            title: 'Financial Calculators',
            content: 'Institutional-grade modeling for debt and asset acquisition.',
            type: 'cards',
            items: [
                { title: 'Mortgage Calculator', desc: 'P&I payment modeling.', link: '/data-tools/financial-analysis/mortgage-calc' },
                { title: 'Amortization Schedule', desc: 'Full reduction modeling.', link: '/data-tools/advanced-metrics/amort-schedule' },
                { title: 'DSCR Analysis', desc: 'Debt coverage modeling.', link: '/data-tools/financial-analysis/dscr' },
                { title: 'LTV / LTC Calculator', desc: 'Asset exposure analytics.', link: '/data-tools/property-metrics/ltv' },
                { title: 'HELOC Calculator', desc: 'Line of credit modeling.', link: '/data-tools/property-metrics/heloc-calc' },
                { title: 'Refi Break-Even', desc: 'Cost recovery analysis.', link: '/data-tools/advanced-metrics/refi-be' }
            ]
        }
    ]
  },
  '/compliance': {
      title: 'Compliance Hub',
      description: 'Institutional KYC/AML intake and risk categorization.',
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2232&auto=format&fit=crop',
      sections: [{ title: 'Regulatory Node', content: 'Execute mandatory intake protocol.', type: 'compliance-hub' }]
  },
  '/sectors/real-estate': {
    title: 'Strategic Real Estate Acquisition',
    subtitle: 'Global Prime Asset Management',
    description: 'Federgreen Capital specializes in high-value real estate acquisitions across emerging metropolitan hubs. We leverage global data for precision valuation and risk-mitigated returns.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    sections: [
      {
        title: 'Asset Classes',
        content: 'Our portfolio spans across diverse high-yield sectors.',
        type: 'cards',
        items: [
          { title: 'Prime Residential', desc: 'Luxury metropolitan developments and multi-family assets.', link: '/data-tools/property-metrics/comparables' },
          { title: 'Industrial Logistics', desc: 'Strategically located distribution hubs and micro-fulfillment centers.', link: '/data-tools/market/data-hub' },
          { title: 'Hospitality Portfolio', desc: 'Boutique hotels and high-end resort developments in global destinations.', link: '/services/analysis' }
        ]
      }
    ]
  },
  '/sectors/technology': {
    title: 'Frontier Technology Infrastructure',
    subtitle: 'Capital for the Digital Renaissance',
    description: 'We invest in the foundational technologies of tomorrow, focusing on AI infrastructure, quantum computing nodes, and sovereign-grade cybersecurity ecosystems.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    sections: [
      {
        title: 'Strategic Tech Verticals',
        content: 'Deploying capital into high-growth digital infrastructure.',
        type: 'cards',
        items: [
          { title: 'Quantum Computing', desc: 'Hardware and infrastructure for the next generation of encryption.', link: '/services/analysis' },
          { title: 'Sovereign AI', desc: 'Localized LLM infrastructure and data sovereignty solutions.', link: '/data-tools/business/business-planner' },
          { title: 'FinTech Nodes', desc: 'Next-gen global payment rails and decentralized liquidity pools.', link: '/financing/new-world-of-finance' }
        ]
      }
    ]
  },
  '/sectors/health': {
    title: 'Global Healthcare Innovation',
    subtitle: 'Biotech & Medical Infrastructure',
    description: 'Driving medical advancement through strategic investment in biotechnology, precision diagnostics, and world-class specialized medical facilities.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop',
    sections: [
      {
        title: 'Medical Verticals',
        content: 'Investing in the future of human longevity.',
        type: 'cards',
        items: [
          { title: 'Biotechnology', desc: 'Therapeutic innovations and precision medicine platforms.', link: '/services/analysis' },
          { title: 'Medical Hubs', desc: 'Developing specialized healthcare real estate and regional centers.', link: '/sectors/real-estate' },
          { title: 'Diagnostics AI', desc: 'Early detection systems powered by advanced neural networks.', link: '/sectors/technology' }
        ]
      }
    ]
  },
  '/sectors/sports': {
    title: 'Elite Sports & Entertainment',
    subtitle: 'Institutional Asset Acquisition',
    description: 'Federgreen Capital provides capital for professional sports franchises, world-class stadium infrastructure, and global sports technology platforms.',
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2070&auto=format&fit=crop',
    sections: [
      {
        title: 'Sports Investments',
        content: 'Merging passion with institutional-grade returns.',
        type: 'cards',
        items: [
          { title: 'Club Acquisitions', desc: 'Strategic equity in professional global sports franchises.', link: '/services/capital-advisory' },
          { title: 'Stadium Tech', desc: 'Developing next-gen fan engagement and venue infrastructure.', link: '/sectors/technology' },
          { title: 'Sports Media', desc: 'Financing digital rights and global distribution networks.', link: '/financing/equity' }
        ]
      }
    ]
  },
  '/sectors/aerospace': {
    title: 'Aerospace & Orbital Intelligence',
    subtitle: 'Strategic Space Infrastructure',
    description: 'Supporting the next frontier of human expansion through orbital logistics, satellite constellations, and frontier aerospace manufacturing.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2070&auto=format&fit=crop',
    sections: [
      {
        title: 'Aerospace Nodes',
        content: 'Capital for the orbital economy.',
        type: 'cards',
        items: [
          { title: 'Orbital Logistics', desc: 'Space-bound cargo and manufacturing infrastructure.', link: '/services/analysis' },
          { title: 'Satellite Nets', desc: 'Global communication and observation constellations.', link: '/sectors/technology' },
          { title: 'Defense Tech', desc: 'Sovereign aerospace defense and surveillance systems.', link: '/services/risk-mitigation' }
        ]
      }
    ]
  },
  '/sectors/renewable-energy': {
    title: 'Sustainable Energy Sovereignty',
    subtitle: 'Infrastructure for a Green Future',
    description: 'Deploying institutional capital into high-yield renewable projects, including solar farms, wind infrastructure, and green hydrogen hubs.',
    image: 'https://images.unsplash.com/photo-1466611653911-95282fc3656b?q=80&w=2070&auto=format&fit=crop',
    sections: [
      {
        title: 'Energy Verticals',
        content: 'Financing the transition to zero-carbon energy.',
        type: 'cards',
        items: [
          { title: 'Solar Infrastructure', desc: 'Large-scale photovoltaic arrays in high-irradiation zones.', link: '/services/analysis' },
          { title: 'Hydrogen Hubs', desc: 'Green hydrogen production and storage facilities.', link: '/financing/debt' },
          { title: 'Wind Farms', desc: 'Onshore and offshore wind energy generation nodes.', link: '/sectors/sustainability' }
        ]
      }
    ]
  },
  '/sectors/film-entertainment': {
    title: 'Media & Global Entertainment',
    subtitle: 'Strategic Production Capital',
    description: 'Financing the future of storytelling through film production, digital distribution platforms, and immersive media technology.',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2070&auto=format&fit=crop',
    sections: [
      {
        title: 'Entertainment Nodes',
        content: 'Investing in high-impact cultural assets.',
        type: 'cards',
        items: [
          { title: 'Film Finance', desc: 'Strategic debt and equity for blockbuster productions.', link: '/financing/private-funds' },
          { title: 'Immersive Tech', desc: 'Investing in VR/AR and metaverse content engines.', link: '/sectors/technology' },
          { title: 'Distribution', desc: 'Scaling digital platforms and global content libraries.', link: '/services/strategy' }
        ]
      }
    ]
  },
  '/sectors/sustainability': {
    title: 'Circular Economy & Impact',
    subtitle: 'Sovereign-Grade ESG Investment',
    description: 'Focusing on systemic sustainability through waste-to-energy, water purification tech, and ESG-compliant industrial models.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format&fit=crop',
    sections: [
      {
        title: 'Impact Verticals',
        content: 'Capital that preserves our global future.',
        type: 'cards',
        items: [
          { title: 'Waste to Energy', desc: 'Advanced pyrolysis and biochemical waste conversion nodes.', link: '/services/analysis' },
          { title: 'Water Tech', desc: 'Sovereign-grade desalination and purification infrastructure.', link: '/sectors/technology' },
          { title: 'ESG Industry', desc: 'Decarbonizing global manufacturing and supply chains.', link: '/sectors/manufacturing' }
        ]
      }
    ]
  },
  '/sectors/mining': {
    title: 'Critical Resource Extraction',
    subtitle: 'Mining for the Green Transition',
    description: 'Strategic investment in critical mineral extraction, focusing on lithium, copper, and rare-earth elements vital for the technology sector.',
    image: 'https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?q=80&w=2070&auto=format&fit=crop',
    sections: [
      {
        title: 'Resource Verticals',
        content: 'Securing the supply chain for global electrification.',
        type: 'cards',
        items: [
          { title: 'Battery Minerals', desc: 'Lithium, cobalt, and nickel extraction projects.', link: '/services/analysis' },
          { title: 'Noble Metals', desc: 'Gold, silver, and platinum group metals for industrial use.', link: '/financing/hybrid' },
          { title: 'Tech Minerals', desc: 'Copper and rare-earth elements for aerospace and energy.', link: '/sectors/aerospace' }
        ]
      }
    ]
  },
  '/sectors/food-beverage': {
    title: 'Global Food Security & AgTech',
    subtitle: 'Innovation in Nutrition Logistics',
    description: 'Ensuring global supply chain resilience through investments in vertical farming, precision agriculture, and high-end beverage heritage brands.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070&auto=format&fit=crop',
    sections: [
      {
        title: 'Agricultural Nodes',
        content: 'Securing global nutrition with frontier tech.',
        type: 'cards',
        items: [
          { title: 'Vertical Farming', desc: 'Climate-resilient urban agriculture infrastructure.', link: '/services/analysis' },
          { title: 'Agri-Robotics', desc: 'Autonomous planting and precision irrigation systems.', link: '/sectors/technology' },
          { title: 'Heritage Brands', desc: 'Acquiring and scaling ultra-premium beverage labels.', link: '/services/scaling-businesses' }
        ]
      }
    ]
  },
  '/sectors/manufacturing': {
    title: 'Advanced Industrial Automation',
    subtitle: 'Precision Manufacturing Hubs',
    description: 'Financing the future of global production through robotics, 3D printing at scale, and smart-factory industrial real estate.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
    sections: [
      {
        title: 'Manufacturing Nodes',
        content: 'Scaling the next industrial revolution.',
        type: 'cards',
        items: [
          { title: 'Industrial Robotics', desc: 'AI-driven automation for global supply chains.', link: '/sectors/technology' },
          { title: 'Additive Mfg', desc: 'Enterprise-scale 3D printing for aerospace and medical.', link: '/sectors/aerospace' },
          { title: 'Smart Factories', desc: 'Developing high-efficiency, zero-waste production hubs.', link: '/sectors/sustainability' }
        ]
      }
    ]
  },
  '/sectors/fashion-beauty': {
    title: 'Luxury Retail & Heritage Fashion',
    subtitle: 'Global Brand Architecture',
    description: 'Acquiring, scaling, and optimizing the world’s most prestigious fashion and beauty brands through strategic capital and digital transformation.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
    sections: [
      {
        title: 'Fashion Verticals',
        content: 'Investing in global prestige and heritage.',
        type: 'cards',
        items: [
          { title: 'Heritage Labels', desc: 'Revitalizing and scaling legacy luxury fashion houses.', link: '/services/scaling-businesses' },
          { title: 'Beauty Tech', desc: 'Next-gen diagnostics and personalized skincare tech.', link: '/sectors/technology' },
          { title: 'Retail Nodes', desc: 'Developing immersive flagship real estate in global hubs.', link: '/sectors/real-estate' }
        ]
      }
    ]
  }
};

export const DEFAULT_PAGE: PageContent = {
  title: 'Federgreen Capital',
  description: 'Your partner in global finance and strategic growth.',
  image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'
};

export const ENTERPRISE_SECTIONS = [
  { id: 'financial-analysis', label: 'Financial Analysis', icon: Calculator },
  { id: 'tax-reserves', label: 'Tax & Reserves', icon: Receipt },
  { id: 'investment-analysis', label: 'Investment Analysis', icon: TrendingUp },
  { id: 'property-metrics', label: 'Property Metrics', icon: Building2 },
  { id: 'advanced-metrics', label: 'Advanced Metrics', icon: Zap },
  { id: 'cost-expenses', label: 'Cost & Expenses', icon: Scale },
  { id: 'tax-gains', label: 'Tax & Gains', icon: Landmark },
  { id: 'portfolio', label: 'Portfolio & Comparison', icon: Users },
  { id: 'market', label: 'Market Analysis & Data', icon: Globe },
  { id: 'business', label: 'Business Analysis', icon: Briefcase },
  { id: 'compliance', label: 'Compliance (KYC/AML)', icon: Shield },
];

export const TESTIMONIALS = [
  { id: '1', name: 'Sarah Chen', role: 'Managing Director, Tech Ventures', rating: 5, text: 'The strategic foresight provided by Federgreen Capital has been instrumental in our European expansion.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' },
  { id: '2', name: 'James Wilson', role: 'CEO, Global Logistics', rating: 5, text: 'Their understanding of complex debt structures is unmatched in the current market.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop' },
  { id: '3', name: 'Elena Rodriguez', role: 'Founder, Eco-Renewables', rating: 5, text: "Federgreen doesn't just provide capital; they provide a roadmap for sustainable growth.", image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop' }
];

export const MEMBERSHIP_TIERS = [
  { name: 'Global Private Access', price: '$25,000', period: 'Annual', initiation: '$5,000', features: [ 'Access to Tier 1 Deal Flow', 'Concierge Strategic Advisory', 'Institutional Data Suite Access', 'Bi-Annual Strategy Reviews' ], highlight: false },
  { name: 'Global Capital Access', price: '$75,000', period: 'Annual', initiation: '$15,000', features: [ 'Direct GP/LP Networking', 'Priority Capital Allocation', 'On-Demand Risk Modeling', 'Quarterly Insight Summits' ], highlight: true },
  { name: 'Founders Circle', price: '$250,000', period: 'Annual', initiation: '$50,000', features: [ 'Equity Participation Rights', 'Direct Board Representation', 'Bespoke Portfolio Engineering', 'Private Family Office Services' ], highlight: false }
];
