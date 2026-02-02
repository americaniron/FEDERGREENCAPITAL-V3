
export interface ToolDef {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultTier: string; // 'Free', 'Basic', 'Pro', 'Enterprise'
}

export const TOOL_REGISTRY: ToolDef[] = [
  // 1. Financial Analysis (Mostly Basic)
  { id: 'residual-income', name: 'Residual Income', category: 'financial-analysis', description: 'Net income after all expenses and debt service.', defaultTier: 'Basic' },
  { id: 'eg-income', name: 'Effective Gross Income', category: 'financial-analysis', description: 'Gross potential income minus vacancy and credit loss.', defaultTier: 'Basic' },
  { id: 'mortgage-rates', name: 'Mortgage Rates', category: 'financial-analysis', description: 'Rate comparison suite with APR vs Note Rate analytics.', defaultTier: 'Free' },
  { id: 'dti', name: 'Debt-to-Income', category: 'financial-analysis', description: 'Ratio of total debt obligations to gross monthly income.', defaultTier: 'Free' },
  { id: 'gross-rental-yield', name: 'Gross Rental Yield', category: 'financial-analysis', description: 'Total annual rent divided by the property purchase price.', defaultTier: 'Free' },
  { id: 'cash-flow-projection', name: 'Cash Flow Projection', category: 'financial-analysis', description: 'Multi-year monthly and annual cash flow forecasting.', defaultTier: 'Pro' },
  { id: 'dscr', name: 'DSCR', category: 'financial-analysis', description: 'Debt Service Coverage Ratio for commercial lending.', defaultTier: 'Basic' },
  { id: 'noi', name: 'Net Operating Income', category: 'financial-analysis', description: 'Total income minus all operating expenses (excludes debt).', defaultTier: 'Basic' },
  { id: 'rental-yield', name: 'Rental Yield', category: 'financial-analysis', description: 'Net rental income as a percentage of property value.', defaultTier: 'Basic' },
  { id: 'mortgage-calc', name: 'Mortgage Calculator', category: 'financial-analysis', description: 'Standard principal and interest payment modeling.', defaultTier: 'Free' },
  { id: 'cap-rate', name: 'Cap Rate', category: 'financial-analysis', description: 'Unleveraged yield based on current income and price.', defaultTier: 'Basic' },
  { id: 'coc-return', name: 'Cash-on-Cash Return', category: 'financial-analysis', description: 'Annual pre-tax cash flow divided by total cash invested.', defaultTier: 'Basic' },

  // 2. Tax & Reserves (Pro)
  { id: 'depreciation-deduction', name: 'Depreciation Deduction', category: 'tax-reserves', description: 'IRS standard depreciation schedule for investment assets.', defaultTier: 'Pro' },
  { id: 'maintenance-reserves', name: 'Maintenance Reserves', category: 'tax-reserves', description: 'Capital expenditure planning and reserve fund modeling.', defaultTier: 'Pro' },
  { id: 'rental-coverage-ratio', name: 'Rental Coverage Ratio', category: 'tax-reserves', description: 'Ratio of rental income to total housing expenses.', defaultTier: 'Basic' },

  // 3. Investment Analysis (Tiered)
  { id: 'buy-vs-rent', name: 'Buy vs Rent', category: 'investment-analysis', description: 'Long-term wealth comparison between ownership and leasing.', defaultTier: 'Free' },
  { id: 'fix-flip-roi', name: 'Fix and Flip ROI', category: 'investment-analysis', description: 'Short-term rehab investment return modeling.', defaultTier: 'Pro' },
  { id: 'appreciation', name: 'Appreciation', category: 'investment-analysis', description: 'Historical and projected asset value growth analysis.', defaultTier: 'Basic' },
  { id: 'break-even', name: 'Break-Even Analysis', category: 'investment-analysis', description: 'Minimum occupancy or income required to cover all costs.', defaultTier: 'Basic' },
  { id: 'seller-financing', name: 'Seller Financing', category: 'investment-analysis', description: 'Creative financing structure and yield analysis.', defaultTier: 'Pro' },
  { id: 'brrrr-tracker', name: 'BRRRR Method Tracker', category: 'investment-analysis', description: 'Buy, Rehab, Rent, Refinance, Repeat analyzer.', defaultTier: 'Pro' },
  { id: 'hard-money-loan', name: 'Hard Money Loan', category: 'investment-analysis', description: 'Short-term high-interest private capital modeling.', defaultTier: 'Enterprise' },
  { id: 'bridge-loan', name: 'Bridge Loan', category: 'investment-analysis', description: 'Interim financing for transitional properties.', defaultTier: 'Enterprise' },
  { id: 'payback-period', name: 'Payback Period', category: 'investment-analysis', description: 'Time required to recover the initial investment cost.', defaultTier: 'Basic' },
  { id: 'conversion-cost', name: 'Conversion Cost', category: 'investment-analysis', description: 'Industrial/Office to Residential conversion ROI.', defaultTier: 'Enterprise' },
  { id: 'house-hacking', name: 'House Hacking', category: 'investment-analysis', description: 'Owner-occupied multi-unit income modeling.', defaultTier: 'Pro' },
  { id: 'wholesaling-deal', name: 'Wholesaling Deal Analyzer', category: 'investment-analysis', description: 'Assignment fee and spread analyzer for wholesalers.', defaultTier: 'Pro' },
  { id: 'multi-unit-analyzer', name: 'Multi-Unit Analyzer', category: 'investment-analysis', description: 'Comprehensive dashboard for 5+ unit properties.', defaultTier: 'Pro' },
  { id: 'business-valuation', name: 'Business Valuation', category: 'investment-analysis', description: 'EBITDA multiples and DCF valuation modeling.', defaultTier: 'Enterprise' },

  // 4. Property Metrics (Basic)
  { id: 'oer', name: 'Operating Expense Ratio', category: 'property-metrics', description: 'Expenses as a percentage of gross operating income.', defaultTier: 'Basic' },
  { id: 'price-to-rent', name: 'Price-to-rent-ratio', category: 'property-metrics', description: 'Asset value vs annual rent multiple.', defaultTier: 'Free' },
  { id: 'ltv', name: 'Loan-to-value (LTV)', category: 'property-metrics', description: 'Current loan balance vs appraised value.', defaultTier: 'Basic' },
  { id: 'ltc', name: 'Loan-to-cost (LTC)', category: 'property-metrics', description: 'Loan amount vs total acquisition/rehab cost.', defaultTier: 'Basic' },
  { id: 'heloc-calc', name: 'Heloc Calculator', category: 'property-metrics', description: 'Line of credit interest-only vs repayment modeling.', defaultTier: 'Basic' },
  { id: 'tenant-qual', name: 'Tenant Qualification', category: 'property-metrics', description: 'Income-to-rent and credit score benchmarking.', defaultTier: 'Pro' },
  { id: 'comparables', name: 'Comparable Properties', category: 'property-metrics', description: 'Weighted adjustment modeling for market comps.', defaultTier: 'Pro' },

  // 5. Advanced Metrics (Pro/Enterprise)
  { id: 'amort-schedule', name: 'Amortization Schedule', category: 'advanced-metrics', description: 'Full monthly principal and interest breakdown.', defaultTier: 'Basic' },
  { id: 'grm', name: 'Gross Rent Multiplier', category: 'advanced-metrics', description: 'Asset price divided by gross annual rent.', defaultTier: 'Basic' },
  { id: 'equity-buildup', name: 'Equity Buildup', category: 'advanced-metrics', description: 'Principal paydown and appreciation projection.', defaultTier: 'Pro' },
  { id: 'io-payment', name: 'Interest-only payment', category: 'advanced-metrics', description: 'Cash flow impact of IO loan structures.', defaultTier: 'Pro' },
  { id: 'compound-growth', name: 'Compound Growth', category: 'advanced-metrics', description: 'Exponential growth modeling for portfolios.', defaultTier: 'Basic' },
  { id: 'refi-be', name: 'Refinancing Break-Even', category: 'advanced-metrics', description: 'Time to recover refi closing costs via lower rates.', defaultTier: 'Pro' },
  { id: 'balloon-payment', name: 'Baloon Payment', category: 'advanced-metrics', description: 'Lump-sum payoff modeling for term-limited loans.', defaultTier: 'Pro' },
  { id: 'mortgage-prepay', name: 'Mortgage Prepayment', category: 'advanced-metrics', description: 'Impact of extra principal payments on loan term.', defaultTier: 'Basic' },
  { id: 'npv', name: 'Net Present Value (NPV)', category: 'advanced-metrics', description: 'Discounted cash flow value in today\'s currency.', defaultTier: 'Enterprise' },
  { id: 'irr', name: 'Internal Rate of Return', category: 'advanced-metrics', description: 'Annualized profitability of a multi-year project.', defaultTier: 'Enterprise' },
  { id: 'ccar-review', name: 'CCAR Stress Test', category: 'advanced-metrics', description: 'Comprehensive Capital Analysis and Review (CCAR) simulation.', defaultTier: 'Enterprise' },
  { id: 'notes-financing', name: 'Notes Financing', category: 'advanced-metrics', description: 'Private note yield and discounted note acquisition.', defaultTier: 'Enterprise' },

  // 6. Cost & Expenses (Basic)
  { id: 'closing-costs', name: 'Closing Costs', category: 'cost-expenses', description: 'Buyer and seller transaction cost estimator.', defaultTier: 'Free' },
  { id: 'property-tax', name: 'Property Tax', category: 'cost-expenses', description: 'Tax millage rate and assessment projections.', defaultTier: 'Basic' },
  { id: 'rental-insurance', name: 'Rental Insurance', category: 'cost-expenses', description: 'Liability and hazard insurance cost modeling.', defaultTier: 'Basic' },
  { id: 'vacancy-impact', name: 'Vacancy Impact', category: 'cost-expenses', description: 'Economic impact of downtime between tenants.', defaultTier: 'Basic' },
  { id: 'mgmt-fee', name: 'Property Management Fee', category: 'cost-expenses', description: 'External vs internal management cost analysis.', defaultTier: 'Basic' },
  { id: 'eviction-cost', name: 'Eviction Cost', category: 'cost-expenses', description: 'Legal, turnover, and lost rent risk modeling.', defaultTier: 'Pro' },
  { id: 'rehab-budget', name: 'Rehab Budget', category: 'cost-expenses', description: 'Itemized CapEx and renovation tracker.', defaultTier: 'Pro' },
  { id: 'utility-projector', name: 'Utility Cost Projector', category: 'cost-expenses', description: 'Seasonally adjusted utility expense modeling.', defaultTier: 'Basic' },
  { id: 'hoa-analyzer', name: 'HOA Impact Analyzer', category: 'cost-expenses', description: 'HOA fee growth and special assessment risk.', defaultTier: 'Basic' },
  { id: 'insurance-estimator', name: 'Insurance Cost Estimator', category: 'cost-expenses', description: 'Market-based hazard insurance projections.', defaultTier: 'Basic' },

  // 7. Tax & Gains (Pro/Enterprise)
  { id: 'capital-gains', name: 'Capital Gains Tax', category: 'tax-gains', description: 'Short vs Long term gain tax liability calculator.', defaultTier: 'Pro' },
  { id: '1031-exchange', name: '1031 Exchange', category: 'tax-gains', description: 'Tax deferral modeling for like-kind property swaps.', defaultTier: 'Enterprise' },
  { id: 'cost-basis', name: 'Cost Basis Tracker', category: 'tax-gains', description: 'Adjusted basis including improvements and depreciation.', defaultTier: 'Pro' },
  { id: 'tax-deferral', name: 'Tax Deferral', category: 'tax-gains', description: 'Strategic timing for gain realization and deferral.', defaultTier: 'Enterprise' },
  { id: 'opportunity-zone', name: 'Opportunity Zone', category: 'tax-gains', description: 'QOZ investment tax incentive and step-up basis.', defaultTier: 'Enterprise' },
  { id: 'cost-segregation', name: 'Cost Segregation', category: 'tax-gains', description: 'Accelerated depreciation via component life analysis.', defaultTier: 'Enterprise' },
  { id: 'depreciation-recapture', name: 'Depreciation Recapture', category: 'tax-gains', description: 'Tax liability on accumulated depreciation at sale.', defaultTier: 'Pro' },

  // 8. Portfolio & Comparison (Pro)
  { id: 'multi-prop-compare', name: 'Multi-Property Comparison', category: 'portfolio', description: 'Side-by-side analytical matrix for deal selection.', defaultTier: 'Pro' },
  { id: 'leverage-analysis', name: 'Leverage Analysis', category: 'portfolio', description: 'Impact of various LTV ratios on portfolio IRR.', defaultTier: 'Pro' },
  { id: 'rental-growth-proj', name: 'Rental Growth Projector', category: 'portfolio', description: 'Market-indexed rent escalation modeling.', defaultTier: 'Pro' },
  { id: 'portfolio-performance', name: 'Portfolio Performance', category: 'portfolio', description: 'Aggregated NOI, cash flow, and equity dashboard.', defaultTier: 'Pro' },

  // 9. Market Analysis & Data (Enterprise)
  { id: 'data-hub', name: 'Market Intelligence Hub', category: 'market', description: 'Global geospatial, climate, and demographic data integration.', defaultTier: 'Enterprise' },
  { id: 'api-settings', name: 'API Configuration', category: 'market', description: 'Manage connection keys for third-party data providers.', defaultTier: 'Enterprise' },

  // 10. Business Analysis (Enterprise)
  { id: 'business-planner', name: 'Strategic Business Plan Builder', category: 'business', description: 'Step-by-step strategic drafting suite.', defaultTier: 'Enterprise' },
  { id: 'business-valuation-tool', name: 'Business Model Valuation', category: 'business', description: 'Detailed model for startup and enterprise valuation.', defaultTier: 'Enterprise' }
];
