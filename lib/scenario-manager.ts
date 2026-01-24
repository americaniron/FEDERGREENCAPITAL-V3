
import { FinancialScenario } from '../types';

const STORAGE_KEY = 'federgreen_scenarios';
const ACTIVE_KEY = 'federgreen_active_scenario_id';

export const DEFAULT_SCENARIO: FinancialScenario = {
  id: 'default-001',
  name: 'Empire State Multi-Asset',
  lastModified: Date.now(),
  version: 1,
  propertyAddress: '350 5th Ave, New York, NY',
  purchasePrice: 12500000,
  arv: 15000000,
  rehabBudget: 1500000,
  closingCosts: 300000,
  grossPotentialRent: 120000,
  otherIncome: 5000,
  vacancyRate: 5,
  propertyTax: 180000,
  insurance: 25000,
  maintenance: 15000,
  managementFee: 6,
  hoa: 0,
  utilities: 18000,
  otherExpenses: 12000,
  loanAmount: 8750000,
  interestRate: 6.5,
  termYears: 30,
  loanType: 'fixed',
  balloonYear: 0,
  appreciationRate: 4,
  rentGrowthRate: 3.5,
  expenseGrowthRate: 2.5,
  discountRate: 10,
  holdingPeriod: 10,
  sellingCosts: 5,
  refiYear: 5,
  refiRate: 5.5,
  refiLtv: 75
};

export const ScenarioManager = {
  getScenarios: (): FinancialScenario[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [DEFAULT_SCENARIO];
    try {
      return JSON.parse(data);
    } catch (e) {
      return [DEFAULT_SCENARIO];
    }
  },

  saveScenarios: (scenarios: FinancialScenario[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  },

  getActiveScenarioId: (): string => {
    return localStorage.getItem(ACTIVE_KEY) || DEFAULT_SCENARIO.id;
  },

  setActiveScenarioId: (id: string) => {
    localStorage.setItem(ACTIVE_KEY, id);
  },

  getActiveScenario: (): FinancialScenario => {
    const scenarios = ScenarioManager.getScenarios();
    const activeId = ScenarioManager.getActiveScenarioId();
    return scenarios.find(s => s.id === activeId) || scenarios[0] || DEFAULT_SCENARIO;
  },

  updateScenario: (updated: FinancialScenario) => {
    const scenarios = ScenarioManager.getScenarios();
    const index = scenarios.findIndex(s => s.id === updated.id);
    const sceneToSave = { ...updated, lastModified: Date.now(), version: updated.version + 1 };
    
    if (index !== -1) {
      scenarios[index] = sceneToSave;
    } else {
      scenarios.push(sceneToSave);
    }
    ScenarioManager.saveScenarios(scenarios);
    return sceneToSave;
  },

  duplicateScenario: (id: string) => {
    const scenarios = ScenarioManager.getScenarios();
    const source = scenarios.find(s => s.id === id);
    if (source) {
      const newScene: FinancialScenario = {
        ...source,
        id: crypto.randomUUID(),
        name: `${source.name} (Copy)`,
        lastModified: Date.now(),
        version: 1
      };
      scenarios.push(newScene);
      ScenarioManager.saveScenarios(scenarios);
      return newScene;
    }
    return null;
  }
};
