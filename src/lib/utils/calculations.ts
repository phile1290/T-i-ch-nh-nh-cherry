import { Transaction, Member } from '../../types';
import { parseISO, isSameMonth } from 'date-fns';

export interface MonthlyStats {
  income: number;
  expense: number;
  balance: number;
  byMember: Record<Member, { income: number; expense: number }>;
  byCategory: Record<string, number>;
}

export function getStatsForMonth(transactions: Transaction[], date: Date): MonthlyStats {
  const stats: MonthlyStats = {
    income: 0,
    expense: 0,
    balance: 0,
    byMember: {
      'Chồng': { income: 0, expense: 0 },
      'Vợ': { income: 0, expense: 0 },
      'Con': { income: 0, expense: 0 }
    },
    byCategory: {}
  };

  const currentMonthTx = transactions.filter(t => {
    try {
      return isSameMonth(parseISO(t.date), date);
    } catch {
      return false;
    }
  });

  currentMonthTx.forEach(t => {
    if (t.type === 'INCOME') {
      stats.income += t.amount;
      stats.byMember[t.member].income += t.amount;
    } else {
      stats.expense += t.amount;
      stats.byMember[t.member].expense += t.amount;
      stats.byCategory[t.category] = (stats.byCategory[t.category] || 0) + t.amount;
    }
  });

  stats.balance = stats.income - stats.expense;
  return stats;
}

export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / oldValue) * 100;
}
