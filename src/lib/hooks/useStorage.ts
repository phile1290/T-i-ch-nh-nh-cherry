import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../../types';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('family_expenses');
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }
  }, []);

  const addTransaction = useCallback((t: Transaction) => {
    setTransactions(prev => {
      const updated = [...prev, t];
      localStorage.setItem('family_expenses', JSON.stringify(updated));
      return updated;
    });
  }, []);
  
  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem('family_expenses', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { transactions, addTransaction, deleteTransaction };
}
