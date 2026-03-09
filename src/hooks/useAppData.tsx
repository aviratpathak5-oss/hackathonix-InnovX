import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Transaction, BudgetSettings } from '@/lib/types';
import * as store from '@/lib/store';

interface AppContextType {
  transactions: Transaction[];
  budget: BudgetSettings;
  setTransactions: (txs: Transaction[]) => void;
  addTx: (tx: Transaction) => void;
  updateTx: (tx: Transaction) => void;
  deleteTx: (id: string) => void;
  setBudget: (b: BudgetSettings) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactionsState] = useState<Transaction[]>(store.getTransactions());
  const [budget, setBudgetState] = useState<BudgetSettings>(store.getBudgetSettings());

  const setTransactions = useCallback((txs: Transaction[]) => {
    store.saveTransactions(txs);
    setTransactionsState(txs);
  }, []);

  const addTx = useCallback((tx: Transaction) => {
    const updated = store.addTransaction(tx);
    setTransactionsState(updated);
  }, []);

  const updateTx = useCallback((tx: Transaction) => {
    const updated = store.updateTransaction(tx);
    setTransactionsState(updated);
  }, []);

  const deleteTx = useCallback((id: string) => {
    const updated = store.deleteTransaction(id);
    setTransactionsState(updated);
  }, []);

  const setBudget = useCallback((b: BudgetSettings) => {
    store.saveBudgetSettings(b);
    setBudgetState(b);
  }, []);

  return (
    <AppContext.Provider value={{ transactions, budget, setTransactions, addTx, updateTx, deleteTx, setBudget }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppData must be used within AppProvider');
  return ctx;
}
