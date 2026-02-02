
import { Finance } from '../lib/finance-engine';

export interface CalculatorField {
  id: string;
  label: string;
  type: 'currency' | 'percent' | 'number';
  defaultValue: number;
}

export interface CalculatorDef {
  id: string;
  name: string;
  description: string;
  fields: CalculatorField[];
  calculate: (inputs: Record<string, number>) => any;
}

export const CALCULATORS: CalculatorDef[] = [
  {
    id: 'dcf-analysis',
    name: 'Discounted Cash Flow (DCF)',
    description: 'Institutional intrinsic value modeling based on multi-year free cash flow projections.',
    fields: [
      { id: 'initial_investment', label: 'Initial Investment / Price', type: 'currency', defaultValue: 10000000 },
      { id: 'fcf_y1', label: 'Year 1 Free Cash Flow', type: 'currency', defaultValue: 800000 },
      { id: 'growth_rate_5y', label: 'FCF Growth (Years 1-5)', type: 'percent', defaultValue: 10 },
      { id: 'discount_rate', label: 'Discount Rate (WACC)', type: 'percent', defaultValue: 12 },
      { id: 'terminal_growth_rate', label: 'Terminal Growth Rate', type: 'percent', defaultValue: 2.5 },
    ],
    calculate: (inputs) => {
      const cashFlows: number[] = [-inputs.initial_investment];
      const discountedCFs: { year: number, cf: number, dcf: number }[] = [];
      let lastCf = 0;
      
      for (let i = 1; i <= 5; i++) {
        const cf = inputs.fcf_y1 * Math.pow(1 + inputs.growth_rate_5y / 100, i - 1);
        cashFlows.push(cf);
        const dcf = cf / Math.pow(1 + inputs.discount_rate / 100, i);
        discountedCFs.push({ year: i, cf, dcf });
        lastCf = cf;
      }
      
      const terminalValue = (lastCf * (1 + inputs.terminal_growth_rate / 100)) / ((inputs.discount_rate / 100) - (inputs.terminal_growth_rate / 100));
      const discountedTerminalValue = terminalValue / Math.pow(1 + inputs.discount_rate / 100, 5);
      
      const dcfValue = discountedCFs.reduce((sum, val) => sum + val.dcf, 0) + discountedTerminalValue;
      
      const irrCashFlows = [...cashFlows.slice(0, 6)];
      irrCashFlows[5] += terminalValue;
      const irr = Finance.irr(irrCashFlows);

      return {
        resultLabel: 'Intrinsic DCF Value',
        result: dcfValue,
        format: 'currency',
        details: [
          { label: 'Terminal Value (Year 5)', value: `$${terminalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Projected IRR', value: `${irr.toFixed(2)}%` },
        ],
        chartData: discountedCFs.map(d => ({ label: `Year ${d.year} CF`, value: d.dcf, color: `rgba(212, 175, 55, ${0.4 + d.year * 0.1})` }))
      };
    }
  },
  {
    id: 'lbo-model',
    name: 'Leveraged Buyout (LBO) Model',
    description: 'Simulates a financial sponsor acquisition to calculate IRR and MOIC.',
    fields: [
      { id: 'ebitda', label: 'Target LTM EBITDA', type: 'currency', defaultValue: 20000000 },
      { id: 'entry_multiple', label: 'Entry Multiple', type: 'number', defaultValue: 10 },
      { id: 'equity_pct', label: 'Sponsor Equity %', type: 'percent', defaultValue: 30 },
      { id: 'debt_interest', label: 'Debt Interest Rate', type: 'percent', defaultValue: 8 },
      { id: 'holding_period', label: 'Holding Period (Years)', type: 'number', defaultValue: 5 },
      { id: 'exit_multiple', label: 'Exit Multiple', type: 'number', defaultValue: 12 },
    ],
    calculate: (inputs) => {
        const entryEV = inputs.ebitda * inputs.entry_multiple;
        const sponsorEquity = entryEV * (inputs.equity_pct / 100);
        const initialDebt = entryEV - sponsorEquity;

        // Simplified: Assume EBITDA is constant and all free cash flow pays down debt
        const annualDebtPaydown = inputs.ebitda * 0.6; // Assuming 60% FCF conversion
        let debtBalance = initialDebt;
        for (let i = 0; i < inputs.holding_period; i++) {
            debtBalance -= annualDebtPaydown;
        }
        debtBalance = Math.max(0, debtBalance);

        const exitEV = inputs.ebitda * inputs.exit_multiple;
        const exitEquityValue = exitEV - debtBalance;
        
        const moic = exitEquityValue / sponsorEquity;
        const irr = (Math.pow(moic, 1 / inputs.holding_period) - 1) * 100;

        return {
            resultLabel: 'Sponsor IRR',
            result: irr,
            format: 'percent',
            details: [
                { label: 'Multiple on Invested Capital (MOIC)', value: `${moic.toFixed(2)}x` },
                { label: 'Exit Equity Value', value: `$${exitEquityValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
            ],
            chartData: [
                { label: 'Initial Sponsor Equity', value: sponsorEquity, color: '#4338ca' },
                { label: 'Equity Value Creation', value: exitEquityValue - sponsorEquity, color: '#d4af37' }
            ]
        };
    }
  },
  {
    id: 'distribution-waterfall',
    name: 'Distribution Waterfall',
    description: 'Models profit distribution between LPs and GPs in a private equity structure.',
    fields: [
      { id: 'total_distribution', label: 'Total Distributable Cash', type: 'currency', defaultValue: 50000000 },
      { id: 'equity_lp', label: 'LP Invested Capital', type: 'currency', defaultValue: 18000000 },
      { id: 'equity_gp', label: 'GP Invested Capital', type: 'currency', defaultValue: 2000000 },
      { id: 'pref_return', label: 'LP Preferred Return %', type: 'percent', defaultValue: 8 },
      { id: 'hurdle_1_split', label: 'Hurdle 1 GP Split %', type: 'percent', defaultValue: 20 },
      { id: 'final_split', label: 'Final Catch-up GP Split %', type: 'percent', defaultValue: 50 },
    ],
    calculate: (inputs) => {
        let remainingCash = inputs.total_distribution;
        const totalInvested = inputs.equity_lp + inputs.equity_gp;
        
        // Tier 1: Return of Capital
        const rocLP = Math.min(remainingCash, inputs.equity_lp);
        remainingCash -= rocLP;
        const rocGP = Math.min(remainingCash, inputs.equity_gp);
        remainingCash -= rocGP;
        
        // Tier 2: Preferred Return to LP
        const prefToLP = Math.min(remainingCash, inputs.equity_lp * (inputs.pref_return / 100));
        remainingCash -= prefToLP;
        
        // Tier 3: First Hurdle (e.g., 80/20 split)
        const hurdle1Split = inputs.hurdle_1_split / 100;
        const hurdle1Cash = Math.min(remainingCash, totalInvested); // Simplified hurdle amount
        const hurdle1ToGP = hurdle1Cash * hurdle1Split;
        const hurdle1ToLP = hurdle1Cash * (1 - hurdle1Split);
        remainingCash -= hurdle1Cash;

        // Tier 4: Final Split (e.g., 50/50 catch-up)
        const finalSplit = inputs.final_split / 100;
        const finalToGP = remainingCash * finalSplit;
        const finalToLP = remainingCash * (1 - finalSplit);
        
        const totalToLP = rocLP + prefToLP + hurdle1ToLP + finalToLP;
        const totalToGP = rocGP + hurdle1ToGP + finalToGP;

        return {
            resultLabel: 'Total to General Partner',
            result: totalToGP,
            format: 'currency',
            details: [
                { label: 'Total to Limited Partner', value: `$${totalToLP.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                { label: 'GP Multiple (MOIC)', value: `${(totalToGP / inputs.equity_gp).toFixed(2)}x` },
            ],
            chartData: [
                { label: 'LP Distribution', value: totalToLP, color: '#312e81' },
                { label: 'GP Distribution', value: totalToGP, color: '#d4af37' }
            ]
        };
    }
  },
  {
    id: 'ccar-review',
    name: 'CCAR Stress Test',
    description: 'Simulate regulatory stress tests and capital adequacy reviews based on Tier 1 ratios and Risk-Weighted Assets (RWA).',
    fields: [
      { id: 'tier1Capital', label: 'Tier 1 Capital (Equity)', type: 'currency', defaultValue: 50000000 },
      { id: 'rwa', label: 'Risk-Weighted Assets (RWA)', type: 'currency', defaultValue: 400000000 },
      { id: 'plannedActions', label: 'Planned Capital Actions (Dividends)', type: 'currency', defaultValue: 2000000 },
      { id: 'stressLossRate', label: 'Estimated Stress Loss Rate (%)', type: 'percent', defaultValue: 2.8 },
    ],
    calculate: (inputs) => {
      const currentRatio = (inputs.tier1Capital / inputs.rwa) * 100;
      const stressLoss = inputs.rwa * (inputs.stressLossRate / 100);
      const stressedCapital = inputs.tier1Capital - stressLoss - inputs.plannedActions;
      const stressedRatio = (stressedCapital / inputs.rwa) * 100;
      const pass = stressedRatio >= 4.5; // Common regulatory floor for CET1
      
      return {
        resultLabel: 'Stressed CET1 Ratio',
        result: stressedRatio,
        format: 'percent',
        details: [
            { label: 'Baseline CET1 Ratio', value: `${currentRatio.toFixed(2)}%` },
            { label: 'Projected Stress Loss', value: `$${stressLoss.toLocaleString()}` },
            { label: 'Compliance Status', value: pass ? 'STABLE [PASS]' : 'VULNERABLE [FAIL]' },
        ],
        chartData: [
            { label: 'Remaining Capital', value: Math.max(0, stressedCapital), color: pass ? '#00ff41' : '#ef4444' },
            { label: 'Stress Loss', value: stressLoss, color: '#312e81' },
            { label: 'Distributions', value: inputs.plannedActions, color: '#d4af37' }
        ]
      };
    }
  }
];
