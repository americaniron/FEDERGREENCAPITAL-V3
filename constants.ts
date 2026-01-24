
import { NavItem, PageContent } from './types';
import { 
  Building2, Globe, Briefcase, TrendingUp, ShieldCheck, 
  Users, Zap, Leaf, Landmark, Factory, Plane, Cpu, 
  Bitcoin, FileText, Newspaper, Phone, Database, Scale, Calculator, Receipt, Shield
} from 'lucide-react';

export const SITE_NAME = "Federgreen Capital";

export const NAVIGATION: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about-us' },
  {
    label: 'Data Tools',
    path: '/data-tools',
    icon: Database,
    subItems: [
      { label: 'Financial Analysis', path: '/data-tools/financial-analysis' },
      { label: 'Tax & Reserves', path: '/data-tools/tax-reserves' },
      { label: 'Investment Analysis', path: '/data-tools/investment-analysis' },
      { label: 'Property Metrics', path: '/data-tools/property-metrics' },
      { label: 'Advanced Metrics', path: '/data-tools/advanced-metrics' },
      { label: 'Cost & Expenses', path: '/data-tools/cost-expenses' },
      { label: 'Tax & Gains', path: '/data-tools/tax-gains' },
      { label: 'Portfolio & Comparison', path: '/data-tools/portfolio' },
      { label: 'Market Analysis', path: '/data-tools/market' },
      { label: 'Business Analysis', path: '/data-tools/business' },
      { label: 'Compliance (KYC/AML)', path: '/data-tools/compliance' },
    ]
  },
  {
    label: 'Private Memberships',
    path: '/private-memberships',
    subItems: [
      { label: 'Global Private Access', path: '/private-memberships/global-private-access' },
      { label: 'Global Capital Access', path: '/private-memberships/global-capital-access' },
      { label: 'Founders Circle', path: '/private-memberships/founders-circle' },
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

export const TESTIMONIALS = [
    {
        id: 1,
        name: "James Sterling",
        role: "CEO, Sterling Tech Ventures",
        text: "Federgreen Capital provided the strategic bridge we needed to enter the Asian markets. Their due diligence is unmatched in the industry.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Elena Rostova",
        role: "Managing Director, GreenEarth Holdings",
        text: "The secured depositor programs offered stability in a volatile market. A partner that truly understands risk mitigation.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Marcus Chen",
        role: "Founder, Apex Logistics",
        text: "Access to the Founders Circle has been transformative. The network value alone exceeds the capital investment.",
        rating: 4,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
    }
];

export const MEMBERSHIP_TIERS = [
    {
        name: "Global Private Access",
        price: "$5,000",
        period: "per year",
        initiation: "$2,500 one-time",
        features: [
            "Access to Global Deal Flow",
            "Quarterly Market Reports",
            "Invitation to Annual Summit",
            "Basic Due Diligence Support"
        ],
        highlight: false
    },
    {
        name: "Global Capital Access",
        price: "$15,000",
        period: "per year",
        initiation: "$5,000 one-time",
        features: [
            "All Private Access Benefits",
            "Direct Access to Lenders",
            "Priority Project Financing",
            "Dedicated Relationship Manager",
            "Monthly Strategy Calls"
        ],
        highlight: true
    },
    {
        name: "Founders Circle",
        price: "$50,000",
        period: "per year",
        initiation: "$10,000 one-time",
        features: [
            "Full Capital Access Benefits",
            "Board Advisory Services",
            "Co-Investment Rights",
            "Private Retreats & Networking",
            "Unlimited Due Diligence"
        ],
        highlight: false
    }
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
          { title: 'Global Tech Fund', desc: 'Investing in AI and Quantum Computing infrastructure. Projected IRR 18-22%.' },
          { title: 'Green Energy Bonds', desc: 'Sustainable returns from renewable energy projects in Europe. A-Rated security.' },
          { title: 'Luxury Real Estate', desc: 'Prime asset acquisition in emerging metropolitan hubs. Value-add strategy.' }
        ]
      },
      {
        title: 'Our Philosophy',
        content: 'We believe that true wealth is built on a foundation of rigorous analysis, strategic foresight, and unwavering integrity. Our approach combines traditional financial wisdom with innovative capital structures.',
        type: 'text'
      }
    ]
  },
  '/about-us': {
    title: 'A Legacy of Excellence',
    description: 'Founded on the principles of integrity, innovation, and insight, Federgreen Capital has evolved into a global powerhouse in strategic investment and advisory.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070&auto=format&fit=crop',
    sections: [
      {
        title: 'Our Mission',
        content: 'To empower visionary investors and enterprises with the capital, strategy, and network required to shape the future.',
        type: 'text'
      },
      {
        title: 'Leadership',
        content: 'Guided by industry veterans with decades of experience across Wall Street, London, and Asian markets.',
        type: 'cards',
        items: [
            { title: 'Executive Board', desc: 'Comprised of former C-suite executives from Fortune 500 financial institutions.' },
            { title: 'Global Advisors', desc: 'A network of regional specialists providing on-the-ground intelligence.' },
            { title: 'Research Team', desc: 'Dedicated analysts utilizing proprietary AI and data models.' }
        ]
      }
    ]
  },
  
  // --- PRIVATE MEMBERSHIPS ---
  '/private-memberships': {
    title: 'Private Memberships',
    description: 'Exclusive access to deal flow, strategic networking, and elite capital resources.',
    image: 'https://images.unsplash.com/photo-1560669882-c20e32718428?q=80&w=2070&auto=format&fit=crop',
    sections: [{ title: 'Join the Elite', content: 'Apply for membership below.', type: 'form-membership' }]
  },
  '/private-memberships/global-private-access': {
    title: 'Global Private Access',
    description: 'Your gateway to international markets and exclusive deal flow.',
    image: 'https://images.unsplash.com/photo-1540961665-22765870f7d4?q=80&w=2070&auto=format&fit=crop',
    sections: [{ title: 'Membership Application', content: 'Secure your place in the Global Private Access tier.', type: 'form-membership' }]
  },
  '/private-memberships/global-capital-access': {
    title: 'Global Capital Access',
    description: 'Direct lines to institutional lenders and priority project financing.',
    image: 'https://images.unsplash.com/photo-1610375461246-d42404005f3b?q=80&w=2070&auto=format&fit=crop',
    sections: [{ title: 'Upgrade to Capital Access', content: 'Unlock direct lender relationships.', type: 'form-membership' }]
  },
  '/private-memberships/founders-circle': {
    title: 'Founders Circle',
    description: 'The pinnacle of access. Board advisory, co-investment rights, and private retreats.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
    sections: [{ title: 'Apply for Founders Circle', content: 'Strictly limited to 50 members worldwide.', type: 'form-membership' }]
  },

  // --- SERVICES ---
  '/services': {
    title: 'Elite Financial Services',
    description: 'Bespoke solutions for complex financial landscapes. From capital advisory to risk mitigation, we serve as your strategic partner.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
    sections: [
        { 
            title: 'Our Expertise', 
            content: 'Comprehensive financial services.', 
            type: 'cards', 
            items: [{title: 'Advisory', desc: 'Strategic Guidance'}, {title: 'Analysis', desc: 'Deep Dive Data'}] 
        },
        {
            title: 'Investment & Deal Analysis',
            content: 'Leverage our proprietary algorithms to validate your investment thesis.',
            type: 'cards',
            items: [
                { title: 'Deal Analyzer', desc: 'Comprehensive multi-unit and commercial analysis.', link: '/data-tools/investment-analysis/multi-unit-analyzer' },
                { title: 'Business Valuation', desc: 'EBITDA multiples and DCF valuation modeling.', link: '/data-tools/business/business-valuation-tool' },
                { title: 'Market Intelligence', desc: 'Global geospacial and demographic data.', link: '/data-tools/market/data-hub' }
            ]
        }
    ]
  },
  '/services/capital-advisory': {
    title: 'Capital Advisory',
    description: 'Structuring the optimal capital stack for growth and stability.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop'
  },
  '/services/strategy': {
    title: 'Strategic Planning',
    description: 'Long-term roadmaps for market entry and expansion.',
    image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?q=80&w=2070&auto=format&fit=crop'
  },
  '/services/analysis': {
    title: 'Advanced Analysis',
    description: 'Data-driven insights using proprietary AI models.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
    sections: [{ title: 'AI Analyst', content: 'Run a preliminary analysis below.', type: 'ai-analysis' }]
  },
  '/services/risk-mitigation': {
    title: 'Risk Mitigation',
    description: 'Hedging strategies to protect assets in volatile markets.',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop'
  },
  '/services/secured-depositor-programs': {
    title: 'Secured Depositor Programs',
    description: 'High-yield, asset-backed deposit structures for institutional capital.',
    image: 'https://images.unsplash.com/photo-1565514020176-dbf22384914e?q=80&w=2070&auto=format&fit=crop'
  },
  '/services/citizenship-by-investment': {
    title: 'Citizenship by Investment',
    description: 'Global mobility solutions for high-net-worth individuals.',
    image: 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2064&auto=format&fit=crop'
  },
  '/services/scaling-businesses': {
    title: 'Scaling Businesses',
    description: 'Operational and financial scaffolding for rapid growth phases.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop'
  },
  '/services/high-rois-low-risk': {
    title: 'High ROI / Low Risk',
    description: 'Asymmetric return profiles through arbitrage and secured lending.',
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=2070&auto=format&fit=crop'
  },
  '/services/due-diligence': {
    title: 'Due Diligence',
    description: 'Rigorous verification processes for investments and partnerships.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop'
  },
  '/services/due-diligence/security-checks': {
    title: 'Security Checks & KYC',
    description: 'Background verification and AML screening.',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop'
  },
  '/services/due-diligence/third-party-valuations': {
    title: 'Third-Party Valuations',
    description: 'Independent appraisals for accurate asset pricing.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2072&auto=format&fit=crop'
  },
  '/services/due-diligence/feasibility-studies': {
    title: 'Feasibility Studies',
    description: 'Technical and economic viability assessments for large projects.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop'
  },

  // --- SECTORS ---
  '/sectors': {
    title: 'Industry Expertise',
    description: 'Deep domain knowledge across high-growth verticals.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'
  },
  '/sectors/real-estate': { title: 'Real Estate', description: 'Commercial, industrial, and residential portfolio management.', image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb6fce?q=80&w=2070&auto=format&fit=crop' },
  '/sectors/technology': { title: 'Technology', description: 'Investing in the infrastructure of the future.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop' },
  '/sectors/health': { title: 'Health & Biotech', description: 'Life sciences and healthcare innovation.', image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2032&auto=format&fit=crop' },
  '/sectors/sports': { title: 'Sports Management', description: 'Franchise valuation and stadium financing.', image: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=2068&auto=format&fit=crop' },
  '/sectors/aerospace': { title: 'Aerospace', description: 'Defense, logistics, and commercial aviation.', image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop' },
  '/sectors/renewable-energy': { title: 'Renewable Energy', description: 'Sustainable power generation and storage.', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop' },
  '/sectors/film-entertainment': { title: 'Film & Entertainment', description: 'Production financing and IP monetization.', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop' },
  '/sectors/sustainability': { title: 'Sustainability', description: 'ESG-focused investment vehicles.', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop' },
  '/sectors/mining': { title: 'Mining & Resources', description: 'Extraction and processing of critical minerals.', image: 'https://images.unsplash.com/photo-1515266591878-5a146e9f0994?q=80&w=2070&auto=format&fit=crop' },
  '/sectors/food-beverage': { title: 'Food & Beverage', description: 'Supply chain, production, and hospitality.', image: 'https://images.unsplash.com/photo-1625246188056-b748d554b473?q=80&w=2070&auto=format&fit=crop' },
  '/sectors/manufacturing': { title: 'Manufacturing', description: 'Industrial automation and production.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop' },
  '/sectors/fashion-beauty': { title: 'Fashion & Beauty', description: 'Luxury brands and retail innovation.', image: 'https://images.unsplash.com/photo-1490481651871-6188e73f6c7c?q=80&w=2070&auto=format&fit=crop' },

  // --- FINANCING ---
  '/financing': {
    title: 'Capital Solutions',
    description: 'Flexible financing structures tailored to your unique requirements.',
    image: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2070&auto=format&fit=crop',
    sections: [
        {
            title: 'Instruments',
            content: 'A diverse array of funding mechanisms.',
            type: 'cards',
            items: [
                { title: 'Private Debt', desc: 'Senior and mezzanine debt facilities.' },
                { title: 'Equity Injection', desc: 'Growth capital for scaling enterprises.' },
                { title: 'Asset-Based Lending', desc: 'Liquidity against verified assets.' }
            ]
        },
        {
            title: 'Financial Calculators',
            content: 'Model your debt service and capital costs with our institutional-grade tools.',
            type: 'cards',
            items: [
                { title: 'Mortgage Calculator', desc: 'Standard principal and interest payment modeling.', link: '/data-tools/financial-analysis/mortgage-calc' },
                { title: 'DSCR Analysis', desc: 'Debt Service Coverage Ratio for commercial lending.', link: '/data-tools/financial-analysis/dscr' },
                { title: 'Amortization Schedules', desc: 'Full monthly principal and interest breakdown.', link: '/data-tools/advanced-metrics/amort-schedule' }
            ]
        }
    ]
  },
  '/financing/debt': { title: 'Private Debt', description: 'Senior secured and mezzanine financing.', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2072&auto=format&fit=crop' },
  '/financing/equity': { title: 'Equity Capital', description: 'Growth equity and venture funding.', image: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2070&auto=format&fit=crop' },
  '/financing/hybrid': { title: 'Hybrid Instruments', description: 'Convertible notes and preferred structures.', image: 'https://images.unsplash.com/photo-1551288049-bbbda5366991?q=80&w=2070&auto=format&fit=crop' },
  '/financing/private-funds': { title: 'Private Funds', description: 'Investment vehicles for accredited investors.', image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=2070&auto=format&fit=crop' },
  '/financing/new-world-of-finance': { title: 'New World Finance', description: 'DeFi and blockchain-based asset management.', image: 'https://images.unsplash.com/photo-1621504450168-38f647319c43?q=80&w=2070&auto=format&fit=crop' },
  '/financing/asset-based-lending': { title: 'Asset Based Lending', description: 'Liquidity against hard assets.', image: 'https://images.unsplash.com/photo-1565514020176-dbf22384914e?q=80&w=2070&auto=format&fit=crop' },
  '/financing/asset-based-lending/btc-usdt-lending': { title: 'Crypto Lending', description: 'Borrowing against digital asset holdings.', image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop' },
  '/financing/asset-based-lending/leveraging': { title: 'Leveraging Programs', description: 'Maximizing capital efficiency.', image: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?q=80&w=2070&auto=format&fit=crop' },
  '/financing/asset-based-lending/monetization': { title: 'Asset Monetization', description: 'Turning illiquid assets into working capital.', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2071&auto=format&fit=crop' },
  '/financing/asset-based-lending/financial-instruments': { title: 'Financial Instruments', description: 'BG, SBLC, and MTN trading.', image: 'https://images.unsplash.com/photo-1616077168712-fc6c788cd4ee?q=80&w=2070&auto=format&fit=crop' },
  '/financing/asset-based-lending/financial-instruments/commodities': { title: 'Commodities Trading', description: 'Oil, Gas, and Precious Metals.', image: 'https://images.unsplash.com/photo-1605722243979-fe0be81929d9?q=80&w=2070&auto=format&fit=crop' },
  '/financing/asset-based-lending/financial-instruments/trade-programs': { title: 'Trade Programs', description: 'High-yield private placement programs.', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop' },
  '/financing/asset-based-lending/financial-instruments/btc-usdt-trade': { title: 'BTC/USDT Trading', description: 'Algorithmic crypto arbitrage.', image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2069&auto=format&fit=crop' },

  // --- DATA TOOLS & CATEGORIES ---
  '/data-tools': {
    title: 'Capital Investments Suite',
    description: 'The most comprehensive analytical suite for institutional and private capital.',
    image: 'https://images.unsplash.com/photo-1551288049-bbbda5366991?q=80&w=2070&auto=format&fit=crop'
  },
  '/data-tools/financial-analysis': { title: 'Financial Analysis', description: 'Core metrics for asset performance.', image: 'https://images.unsplash.com/photo-1543286386-2f6595e96e6d?q=80&w=2070&auto=format&fit=crop' },
  '/data-tools/tax-reserves': { title: 'Tax & Reserves', description: 'Optimization of liabilities and capex.', image: 'https://images.unsplash.com/photo-1554224154-260327c00c41?q=80&w=2070&auto=format&fit=crop' },
  '/data-tools/investment-analysis': { title: 'Investment Analysis', description: 'Deal structuring and exit modeling.', image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop' },
  '/data-tools/property-metrics': { title: 'Property Metrics', description: 'Physical asset KPIs.', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop' },
  '/data-tools/advanced-metrics': { title: 'Advanced Metrics', description: 'Complex financial engineering.', image: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2070&auto=format&fit=crop' },
  '/data-tools/cost-expenses': { title: 'Cost & Expenses', description: 'Detailed operating audits.', image: 'https://images.unsplash.com/photo-1634733988685-a91a649ee89d?q=80&w=2071&auto=format&fit=crop' },
  '/data-tools/tax-gains': { title: 'Tax & Gains', description: 'Capital gains and deferral strategies.', image: 'https://images.unsplash.com/photo-1621504450168-38f647319c43?q=80&w=2070&auto=format&fit=crop' },
  '/data-tools/portfolio': { title: 'Portfolio Management', description: 'Aggregate holdings analysis.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop' },
  '/data-tools/market': { title: 'Market Intelligence', description: 'Global data feeds and geospacial analysis.', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop' },
  '/data-tools/business': { title: 'Business Analysis', description: 'Venture validation and planning.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop' },
  '/data-tools/compliance': { title: 'Compliance Hub', description: 'Regulatory and risk management.', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop' },

  // --- CONTACT ---
  '/contact': {
      title: 'Contact Concierge',
      description: 'Begin your journey with Federgreen Capital.',
      image: 'https://images.unsplash.com/photo-1423666639041-f14005171849?q=80&w=2074&auto=format&fit=crop',
      sections: [{ title: 'Get in Touch', content: 'Our team is available 24/7.', type: 'form-contact' }]
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
