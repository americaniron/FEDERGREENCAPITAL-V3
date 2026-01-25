
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
    id: 'mortgage-calc',
    name: 'Mortgage Calculator',
    description: 'Standard principal and interest payment modeling.',
    fields: [
      { id: 'principal', label: 'Loan Principal', type: 'currency', defaultValue: 300000 },
      { id: 'rate', label: 'Annual Rate', type: 'percent', defaultValue: 6.5 },
      { id: 'years', label: 'Loan Term (Years)', type: 'number', defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const payment = Finance.mortgagePayment(inputs.principal, inputs.rate, inputs.years);
      const totalInterest = (payment * inputs.years * 12) - inputs.principal;
      const totalPaid = payment * inputs.years * 12;
      return {
        resultLabel: 'Monthly Payment',
        result: payment,
        format: 'currency',
        details: [
            { label: 'Total Interest', value: `$${totalInterest.toLocaleString(undefined, {maximumFractionDigits: 0})}` },
            { label: 'Total Paid', value: `$${totalPaid.toLocaleString(undefined, {maximumFractionDigits: 0})}` },
        ],
        chartData: [
            { label: 'Principal', value: inputs.principal, color: '#4338ca' },
            { label: 'Interest', value: totalInterest, color: '#c026d3' }
        ]
      };
    }
  },
  {
    id: 'amort-schedule',
    name: 'Amortization Schedule',
    description: 'Full principal and interest reduction modeling.',
    fields: [
      { id: 'principal', label: 'Loan Principal', type: 'currency', defaultValue: 500000 },
      { id: 'rate', label: 'Interest Rate', type: 'percent', defaultValue: 7.2 },
      { id: 'years', label: 'Amortization Years', type: 'number', defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const payment = Finance.mortgagePayment(inputs.principal, inputs.rate, inputs.years);
      const totalPaid = payment * inputs.years * 12;
      const totalInterest = totalPaid - inputs.principal;
      return {
        resultLabel: 'Monthly P&I',
        result: payment,
        format: 'currency',
        details: [
            { label: 'Total Principal', value: `$${inputs.principal.toLocaleString()}` },
            { label: 'Total Interest', value: `$${totalInterest.toLocaleString(undefined, {maximumFractionDigits: 0})}` },
            { label: 'Total Payback', value: `$${totalPaid.toLocaleString(undefined, {maximumFractionDigits: 0})}` },
        ],
        chartData: [
            { label: 'Principal', value: inputs.principal, color: '#d4af37' },
            { label: 'Interest', value: totalInterest, color: '#312e81' }
        ]
      };
    }
  },
  {
    id: 'cap-rate',
    name: 'Cap Rate Calculator',
    description: 'Unleveraged yield based on current income and price.',
    fields: [
      { id: 'noi', label: 'Net Operating Income', type: 'currency', defaultValue: 50000 },
      { id: 'price', label: 'Purchase Price', type: 'currency', defaultValue: 1000000 },
    ],
    calculate: (inputs) => {
      const capRate = Finance.capRate(inputs.noi, inputs.price);
      return {
        resultLabel: 'Capitalization Rate',
        result: capRate,
        format: 'percent',
        details: [
            { label: 'NOI', value: `$${inputs.noi.toLocaleString()}` },
            { label: 'Price', value: `$${inputs.price.toLocaleString()}` },
        ],
      };
    }
  }
];
