export type TransactionType = 'INCOME' | 'EXPENSE';

export type Member = 'Vợ' | 'Chồng' | 'Con';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  member: Member;
  note: string;
  timestamp: number;
}
