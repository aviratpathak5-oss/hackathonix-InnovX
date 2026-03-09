import { Transaction, BudgetSettings } from './types';

const TRANSACTIONS_KEY = 'budget_planner_transactions';
const BUDGET_KEY = 'budget_planner_budget';

export function getTransactions(): Transaction[] {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTransactions(transactions: Transaction[]) {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function addTransaction(tx: Transaction) {
  const all = getTransactions();
  all.unshift(tx);
  saveTransactions(all);
  return all;
}

export function updateTransaction(tx: Transaction) {
  const all = getTransactions().map(t => t.id === tx.id ? tx : t);
  saveTransactions(all);
  return all;
}

export function deleteTransaction(id: string) {
  const all = getTransactions().filter(t => t.id !== id);
  saveTransactions(all);
  return all;
}

export function getBudgetSettings(): BudgetSettings {
  const data = localStorage.getItem(BUDGET_KEY);
  return data ? JSON.parse(data) : { monthlyBudget: 0 };
}

export function saveBudgetSettings(settings: BudgetSettings) {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(settings));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
