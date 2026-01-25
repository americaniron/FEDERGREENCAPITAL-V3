
/**
 * FEDERGREEN CAPITAL - STANDARDIZED ANALYTICAL ENGINE
 * Core library for institutional-grade financial modeling.
 */

export const Finance = {
  // 1. Fundamental Income Metrics
  // NOI = Effective Gross Income − Operating Expenses (exclude debt service)
  noi: (egi: number, opEx: number) => egi - opEx,

  // Cap Rate = NOI / Purchase Price
  capRate: (noi: number, price: number) => (price > 0 ? (noi / price) * 100 : 0),

  // Cash-on-Cash = Annual Pre-Tax Cash Flow / Total Cash Invested
  cashOnCash: (annualCashFlow: number, cashInvested: number) => 
    (cashInvested > 0 ? (annualCashFlow / cashInvested) * 100 : 0),

  // DSCR = NOI / Annual Debt Service (Standard)
  // Optionally supports Net Cash Flow (NCF) mode if requested by toggle
  dscr: (income: number, debtService: number) => 
    (debtService > 0 ? income / debtService : 0),

  // 2. Loan & Amortization Suite
  mortgagePayment: (principal: number, annualRate: number, years: number, type: 'fixed' | 'interest-only' = 'fixed') => {
    if (type === 'interest-only') return (principal * (annualRate / 100)) / 12;
    const r = annualRate / 100 / 12;
    const n = years * 12;
    if (r === 0) return principal / n;
    return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  },

  // Detailed schedule supporting Balloon and Prepayments
  amortizationSchedule: (
    principal: number, 
    rate: number, 
    years: number, 
    type: 'fixed' | 'interest-only' | 'balloon' = 'fixed',
    balloonYear: number = 0,
    monthlyExtra: number = 0
  ) => {
    const monthlyRate = rate / 100 / 12;
    const totalPeriods = years * 12;
    const standardPayment = Finance.mortgagePayment(principal, rate, years, type === 'interest-only' ? 'interest-only' : 'fixed');
    
    let balance = principal;
    const schedule = [];
    const maxPeriods = type === 'balloon' && balloonYear > 0 ? Math.min(totalPeriods, balloonYear * 12) : totalPeriods;
    
    for (let i = 1; i <= maxPeriods; i++) {
      const interest = balance * monthlyRate;
      let principalPaid = type === 'interest-only' ? 0 : standardPayment - interest;
      
      // Apply prepayment
      if (balance > 0) {
          principalPaid += monthlyExtra;
      }

      const actualPrincipal = Math.min(balance, principalPaid);
      balance -= actualPrincipal;
      
      schedule.push({
        period: i,
        payment: type === 'interest-only' ? interest : standardPayment + monthlyExtra,
        principal: actualPrincipal,
        interest: interest,
        balance: Math.max(0, balance)
      });

      if (balance <= 0) break;
    }
    return schedule;
  },

  // 3. Investment Return Metrics (NPV/IRR)
  // Supports both Annual and Monthly cash flow arrays
  npv: (discountRate: number, cashflows: number[], isMonthly: boolean = false) => {
    let npv = 0;
    const r = isMonthly ? (discountRate / 100 / 12) : (discountRate / 100);
    for (let t = 0; t < cashflows.length; t++) {
      npv += cashflows[t] / Math.pow(1 + r, t);
    }
    return npv;
  },

  irr: (cashflows: number[], guess: number = 0.1) => {
    const maxIter = 100;
    const precision = 1e-7;
    let rate = guess;

    for (let i = 0; i < maxIter; i++) {
      let f = 0;
      let df = 0;
      for (let t = 0; t < cashflows.length; t++) {
        f += cashflows[t] / Math.pow(1 + rate, t);
        df -= (t * cashflows[t]) / Math.pow(1 + rate, t + 1);
      }
      if (df === 0) return NaN;
      const newRate = rate - f / df;
      if (Math.abs(newRate - rate) < precision) return newRate * 100;
      rate = newRate;
    }
    return NaN;
  },

  // 4. Ratios & Benchmarks
  grm: (price: number, grossAnnualRent: number) => (grossAnnualRent > 0 ? price / grossAnnualRent : 0),
  oer: (opEx: number, egi: number) => (egi > 0 ? (opEx / egi) * 100 : 0),
  ltv: (loan: number, value: number) => (value > 0 ? (loan / value) * 100 : 0),
  ltc: (loan: number, cost: number) => (cost > 0 ? (loan / cost) * 100 : 0),
  compoundGrowth: (principal: number, rate: number, years: number) => principal * Math.pow(1 + (rate / 100), years),
  paybackPeriod: (initialInvestment: number, periodicCashFlows: number[]) => {
    let cumulative = -initialInvestment;
    for (let i = 0; i < periodicCashFlows.length; i++) {
      const prev = cumulative;
      cumulative += periodicCashFlows[i];
      if (cumulative >= 0) {
        return i + (Math.abs(prev) / periodicCashFlows[i]);
      }
    }
    return Infinity;
  }
};
