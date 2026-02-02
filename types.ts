
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  subItems?: NavItem[];
  description?: string;
  icon?: LucideIcon;
}

export interface PageContent {
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  heroVideo?: string;
  sections?: PageSection[];
}

export interface PageSection {
  title: string;
  content: string;
  type?: 'text' | 'cards' | 'form-contact' | 'form-membership' | 'form-testimonial' | 'list' | 'ai-analysis' | 'tts-article' | 'compliance-hub' | 'document-analyzer' | 'market-commentary';
  items?: { title: string; desc: string; icon?: any; link?: string }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  groundingUrls?: string[];
}

// --- DATA TOOLS & SCENARIO ENGINE ---

export interface FinancialScenario {
  id: string;
  name: string;
  lastModified: number;
  version: number;
  
  // Property Data
  propertyAddress: string;
  purchasePrice: number;
  arv: number; 
  rehabBudget: number;
  closingCosts: number;
  
  // Income & Expenses
  grossPotentialRent: number;
  otherIncome: number;
  vacancyRate: number; 
  propertyTax: number;
  insurance: number;
  maintenance: number;
  managementFee: number; // %
  hoa: number;
  utilities: number;
  otherExpenses: number;
  
  // Financing
  loanAmount: number;
  interestRate: number;
  termYears: number;
  loanType: 'fixed' | 'interest-only' | 'balloon';
  balloonYear: number;
  
  // Growth & Exit Assumptions
  appreciationRate: number;
  rentGrowthRate: number;
  expenseGrowthRate: number;
  discountRate: number;
  holdingPeriod: number;
  exitPriceOverride?: number; // Optional manual override
  sellingCosts: number; // %
  
  // Refinance Assumptions
  refiYear: number;
  refiRate: number;
  refiLtv: number;

  // Business Specifics (New for Plan Builder)
  cac?: number;
  ltv?: number;
  churnRate?: number;
  grossMargin?: number;
  paybackMonths?: number;
}

export interface ToolResult {
  value: any;
  label: string;
  format: 'currency' | 'percent' | 'number' | 'text' | 'table';
  secondaryMetrics?: { label: string; value: string; hint?: string }[];
  charts?: { type: 'bar' | 'line' | 'pie'; data: any[] }[];
}

// --- PHASE 5: ENTITLEMENTS & AUDITING ---

export interface SiteUser {
  id: string;
  email: string;
  membershipTier: string; // e.g., 'Free', 'Pro'
  entitlementOverrides: Record<string, boolean>; // toolId -> hasAccess
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  adminEmail: string;
  action: string; // e.g., "Updated User Entitlements"
  entity: string; // e.g., "User: john.doe@example.com"
  details: {
    before: any;
    after: any;
  };
}
