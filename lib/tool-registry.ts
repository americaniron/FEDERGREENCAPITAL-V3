
export interface ToolDef {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const TOOL_REGISTRY: ToolDef[] = [
  // 1. Financial Analysis
  { id: 'residual-income', name: 'Residual Income', category: 'financial-analysis', description: 'Net income remaining after all operating expenses and debt service.' },
  { id: 'eg-income', name: 'Effective Gross Income', category: 'financial-analysis', description: 'Gross potential income minus vacancy and credit loss.' },
  { id: 'mortgage-rates', name: 'Mortgage Rates', category: 'financial-analysis', description: 'Rate comparison suite with APR vs Note Rate analytics.' },
  { id: 'dti', name: 'Debt-to-Income', category: 'financial-analysis', description: 'Ratio of total debt obligations to gross monthly income.' },
  { id: 'gross-rental-yield', name: 'Gross Rental Yield', category: 'financial-analysis', description: 'Total annual rent divided by the property purchase price.' },
  { id: 'cash-flow-projection', name: 'Cash Flow Projection', category: 'financial-analysis', description: 'Multi-year monthly and annual cash flow forecasting.' },
  { id: 'dscr', name: 'DSCR', category: 'financial-analysis', description: 'Debt Service Coverage Ratio for commercial lending.' },
  { id: 'noi', name: 'Net Operating Income', category: 'financial-analysis', description: 'Total income minus all operating expenses (excludes debt).' },
  { id: 'rental-yield', name: 'Rental Yield', category: 'financial-analysis', description: 'Net rental income as a percentage of property value.' },
  { id: 'mortgage-calc', name: 'Mortgage Calculator', category: 'financial-analysis', description: 'Standard principal and interest payment modeling.' },
  { id: 'cap-rate', name: 'Cap Rate', category: 'financial-analysis', description: 'Unleveraged yield based on current income and price.' },
  { id: 'coc-return', name: 'Cash-on-Cash Return', category: 'financial-analysis', description: 'Annual pre-tax cash flow divided by total cash invested.' },

  // 2. Tax & Reserves
  { id: 'depreciation-deduction', name: 'Depreciation Deduction', category: 'tax-reserves', description: 'IRS standard depreciation schedule for investment assets.' },
  { id: 'maintenance-reserves', name: 'Maintenance Reserves', category: 'tax-reserves', description: 'Capital expenditure planning and reserve fund modeling.' },
  { id: 'rental-coverage-ratio', name: 'Rental Coverage Ratio', category: 'tax-reserves', description: 'Ratio of rental income to total housing expenses.' },

  // 3. Investment Analysis
  { id: 'buy-vs-rent', name: 'Buy vs Rent', category: 'investment-analysis', description: 'Long-term wealth comparison between ownership and leasing.' },
  { id: 'fix-flip-roi', name: 'Fix and Flip ROI', category: 'investment-analysis', description: 'Short-term rehab investment return modeling.' },
  { id: 'appreciation', name: 'Appreciation', category: 'investment-analysis', description: 'Historical and projected asset value growth analysis.' },
  { id: 'break-even', name: 'Break-Even Analysis', category: 'investment-analysis', description: 'Minimum occupancy or income required to cover all costs.' },
  { id: 'seller-financing', name: 'Seller Financing', category: 'investment-analysis', description: 'Creative financing structure and yield analysis.' },
  { id: 'brrrr-tracker', name: 'BRRRR Method Tracker', category: 'investment-analysis', description: 'Buy, Rehab, Rent, Refinance, Repeat analyzer.' },
  { id: 'hard-money-loan', name: 'Hard Money Loan', category: 'investment-analysis', description: 'Short-term high-interest private capital modeling.' },
  { id: 'bridge-loan', name: 'Bridge Loan', category: 'investment-analysis', description: 'Interim financing for transitional properties.' },
  { id: 'payback-period', name: 'Payback Period', category: 'investment-analysis', description: 'Time required to recover the initial investment cost.' },
  { id: 'conversion-cost', name: 'Conversion Cost', category: 'investment-analysis', description: 'Industrial/Office to Residential conversion ROI.' },
  { id: 'house-hacking', name: 'House Hacking', category: 'investment-analysis', description: 'Owner-occupied multi-unit income modeling.' },
  { id: 'wholesaling-deal', name: 'Wholesaling Deal Analyzer', category: 'investment-analysis', description: 'Assignment fee and spread analyzer for wholesalers.' },
  { id: 'multi-unit-analyzer', name: 'Multi-Unit Analyzer', category: 'investment-analysis', description: 'Comprehensive dashboard for 5+ unit properties.' },
  { id: 'business-valuation', name: 'Business Valuation', category: 'investment-analysis', description: 'EBITDA multiples and DCF valuation modeling.' },

  // 4. Property Metrics
  { id: 'oer', name: 'Operating Expense Ratio', category: 'property-metrics', description: 'Expenses as a percentage of gross operating income.' },
  { id: 'price-to-rent', name: 'Price-to-rent-ratio', category: 'property-metrics', description: 'Asset value vs annual rent multiple.' },
  { id: 'ltv', name: 'Loan-to-value (LTV)', category: 'property-metrics', description: 'Current loan balance vs appraised value.' },
  { id: 'ltc', name: 'Loan-to-cost (LTC)', category: 'property-metrics', description: 'Loan amount vs total acquisition/rehab cost.' },
  { id: 'heloc-calc', name: 'Heloc Calculator', category: 'property-metrics', description: 'Line of credit interest-only vs repayment modeling.' },
  { id: 'tenant-qual', name: 'Tenant Qualification', category: 'property-metrics', description: 'Income-to-rent and credit score benchmarking.' },
  { id: 'comparables', name: 'Comparable Properties', category: 'property-metrics', description: 'Weighted adjustment modeling for market comps.' },

  // 5. Advanced Metrics
  { id: 'amort-schedule', name: 'Amortization Schedule', category: 'advanced-metrics', description: 'Full monthly principal and interest breakdown.' },
  { id: 'grm', name: 'Gross Rent Multiplier', category: 'advanced-metrics', description: 'Asset price divided by gross annual rent.' },
  { id: 'equity-buildup', name: 'Equity Buildup', category: 'advanced-metrics', description: 'Principal paydown and appreciation projection.' },
  { id: 'io-payment', name: 'Interest-only payment', category: 'advanced-metrics', description: 'Cash flow impact of IO loan structures.' },
  { id: 'compound-growth', name: 'Compound Growth', category: 'advanced-metrics', description: 'Exponential growth modeling for portfolios.' },
  { id: 'refi-be', name: 'Refinancing Break-Even', category: 'advanced-metrics', description: 'Time to recover refi closing costs via lower rates.' },
  { id: 'balloon-payment', name: 'Baloon Payment', category: 'advanced-metrics', description: 'Lump-sum payoff modeling for term-limited loans.' },
  { id: 'mortgage-prepay', name: 'Mortgage Prepayment', category: 'advanced-metrics', description: 'Impact of extra principal payments on loan term.' },
  { id: 'npv', name: 'Net Present Value (NPV)', category: 'advanced-metrics', description: 'Discounted cash flow value in today\'s currency.' },
  { id: 'irr', name: 'Internal Rate of Return', category: 'advanced-metrics', description: 'Annualized profitability of a multi-year project.' },
  { id: 'notes-financing', name: 'Notes Financing', category: 'advanced-metrics', description: 'Private note yield and discounted note acquisition.' },

  // 6. Cost & Expenses
  { id: 'closing-costs', name: 'Closing Costs', category: 'cost-expenses', description: 'Buyer and seller transaction cost estimator.' },
  { id: 'property-tax', name: 'Property Tax', category: 'cost-expenses', description: 'Tax millage rate and assessment projections.' },
  { id: 'rental-insurance', name: 'Rental Insurance', category: 'cost-expenses', description: 'Liability and hazard insurance cost modeling.' },
  { id: 'vacancy-impact', name: 'Vacancy Impact', category: 'cost-expenses', description: 'Economic impact of downtime between tenants.' },
  { id: 'mgmt-fee', name: 'Property Management Fee', category: 'cost-expenses', description: 'External vs internal management cost analysis.' },
  { id: 'eviction-cost', name: 'Eviction Cost', category: 'cost-expenses', description: 'Legal, turnover, and lost rent risk modeling.' },
  { id: 'rehab-budget', name: 'Rehab Budget', category: 'cost-expenses', description: 'Itemized CapEx and renovation tracker.' },
  { id: 'utility-projector', name: 'Utility Cost Projector', category: 'cost-expenses', description: 'Seasonally adjusted utility expense modeling.' },
  { id: 'hoa-analyzer', name: 'HOA Impact Analyzer', category: 'cost-expenses', description: 'HOA fee growth and special assessment risk.' },
  { id: 'insurance-estimator', name: 'Insurance Cost Estimator', category: 'cost-expenses', description: 'Market-based hazard insurance projections.' },

  // 7. Tax & Gains
  { id: 'capital-gains', name: 'Capital Gains Tax', category: 'tax-gains', description: 'Short vs Long term gain tax liability calculator.' },
  { id: '1031-exchange', name: '1031 Exchange', category: 'tax-gains', description: 'Tax deferral modeling for like-kind property swaps.' },
  { id: 'cost-basis', name: 'Cost Basis Tracker', category: 'tax-gains', description: 'Adjusted basis including improvements and depreciation.' },
  { id: 'tax-deferral', name: 'Tax Deferral', category: 'tax-gains', description: 'Strategic timing for gain realization and deferral.' },
  { id: 'opportunity-zone', name: 'Opportunity Zone', category: 'tax-gains', description: 'QOZ investment tax incentive and step-up basis.' },
  { id: 'cost-segregation', name: 'Cost Segregation', category: 'tax-gains', description: 'Accelerated depreciation via component life analysis.' },
  { id: 'depreciation-recapture', name: 'Depreciation Recapture', category: 'tax-gains', description: 'Tax liability on accumulated depreciation at sale.' },

  // 8. Portfolio & Comparison
  { id: 'multi-prop-compare', name: 'Multi-Property Comparison', category: 'portfolio', description: 'Side-by-side analytical matrix for deal selection.' },
  { id: 'leverage-analysis', name: 'Leverage Analysis', category: 'portfolio', description: 'Impact of various LTV ratios on portfolio IRR.' },
  { id: 'rental-growth-proj', name: 'Rental Growth Projector', category: 'portfolio', description: 'Market-indexed rent escalation modeling.' },
  { id: 'portfolio-performance', name: 'Portfolio Performance', category: 'portfolio', description: 'Aggregated NOI, cash flow, and equity dashboard.' },

  // 9. Market Analysis & Data
  { id: 'data-hub', name: 'Market Intelligence Hub', category: 'market', description: 'Global geospatial, climate, and demographic data integration.' },
  { id: 'api-settings', name: 'API Configuration', category: 'market', description: 'Manage connection keys for third-party data providers.' },

  // 10. Business Analysis
  { id: 'business-planner', name: 'Strategic Business Plan Builder', category: 'business', description: 'Step-by-step strategic drafting suite.' },
  { id: 'business-valuation-tool', name: 'Business Model Valuation', category: 'business', description: 'Detailed model for startup and enterprise valuation.' }
];
