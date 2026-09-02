import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionType, Member } from '../types';
import { CATEGORIES, MEMBERS } from '../lib/constants';
import { PlusCircle, Edit2, X } from 'lucide-react';

interface Props {
  onAdd: (t: Transaction) => void;
  onUpdate?: (t: Transaction) => void;
  onCancelEdit?: () => void;
  editingTransaction?: Transaction | null;
}

export function TransactionForm({ onAdd, onUpdate, onCancelEdit, editingTransaction }: Props) {
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [member, setMember] = useState<Member>('Chồng');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setMember(editingTransaction.member);
      setNote(editingTransaction.note || '');
    } else {
      setType('EXPENSE');
      setAmount('');
      setCategory(CATEGORIES[0]);
      setDate(new Date().toISOString().split('T')[0]);
      setMember('Chồng');
      setNote('');
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    if (editingTransaction && onUpdate) {
      onUpdate({
        ...editingTransaction,
        type,
        amount: Number(amount),
        category,
        date,
        member,
        note
      });
    } else {
      const newTransaction: Transaction = {
        id: uuidv4(),
        type,
        amount: Number(amount),
        category,
        date,
        member,
        note,
        timestamp: Date.now()
      };
      onAdd(newTransaction);
      setAmount('');
      setNote('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
          {editingTransaction ? <Edit2 className="w-5 h-5 text-indigo-600" /> : <PlusCircle className="w-5 h-5 text-indigo-600" />}
          {editingTransaction ? 'Cập Nhật Giao Dịch' : 'Thêm Giao Dịch'}
        </h3>
        {editingTransaction && onCancelEdit && (
          <button 
            type="button" 
            onClick={onCancelEdit}
            className="text-neutral-400 hover:text-rose-500 transition-colors p-1"
            title="Hủy cập nhật"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="flex bg-white/50 p-1 rounded-xl border border-white/60 mb-5 shadow-inner">
        <button
          type="button"
          onClick={() => setType('EXPENSE')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'EXPENSE' ? 'bg-white text-rose-600 shadow-sm border border-neutral-100' : 'text-neutral-500 hover:text-neutral-700'}`}
        >
          Chi Tiền
        </button>
        <button
          type="button"
          onClick={() => setType('INCOME')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm border border-neutral-100' : 'text-neutral-500 hover:text-neutral-700'}`}
        >
          Thu Tiền
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Số tiền (VNĐ)</label>
          <input 
            type="number" 
            required 
            min="0"
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/60 border border-white/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-neutral-900 shadow-sm"
            placeholder="Ví dụ: 50000"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Danh mục</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/60 border border-white/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-neutral-900 shadow-sm"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Thành viên</label>
            <select 
              value={member} 
              onChange={e => setMember(e.target.value as Member)}
              className="w-full px-4 py-2.5 bg-white/60 border border-white/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-neutral-900 shadow-sm"
            >
              {MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Ngày tháng</label>
          <input 
            type="date" 
            required 
            value={date} 
            onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/60 border border-white/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-neutral-900 shadow-sm"
          />
        </div>
        
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Ghi chú (Tùy chọn)</label>
          <input 
            type="text" 
            value={note} 
            onChange={e => setNote(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/60 border border-white/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-neutral-900 shadow-sm"
            placeholder="Mua sắm siêu thị..."
          />
        </div>

        <button type="submit" className="w-full py-3 mt-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all">
          {editingTransaction ? 'Cập Nhật Giao Dịch' : 'Lưu Giao Dịch'}
        </button>
      </div>
    </form>
  );
}
