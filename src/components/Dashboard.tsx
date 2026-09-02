import { useState, useMemo } from 'react';
import { useTransactions } from '../lib/hooks/useStorage';
import { getStatsForMonth } from '../lib/utils/calculations';
import { generateFinancialReport } from '../lib/utils/analytics';
import { TransactionForm } from './TransactionForm';
import { MonthlyComparison } from './MonthlyComparison';
import { FinancialReport } from './FinancialReport';
import { subMonths, format } from 'date-fns';
import { Wallet, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function Dashboard() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonthStats = useMemo(() => getStatsForMonth(transactions, currentDate), [transactions, currentDate]);
  const previousMonthStats = useMemo(() => getStatsForMonth(transactions, subMonths(currentDate, 1)), [transactions, currentDate]);
  const report = useMemo(() => generateFinancialReport(currentMonthStats, previousMonthStats), [currentMonthStats, previousMonthStats]);

  const sortedTransactions = [...transactions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10); // Show recent 10

  return (
    <div className="min-h-screen font-sans text-neutral-900 pb-12 relative overflow-hidden bg-[#f4f7f9]">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-300/40 rounded-full mix-blend-multiply filter blur-[120px] opacity-80"></div>
        <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-[120px] opacity-80"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-[120px] opacity-80"></div>
      </div>

      <div className="relative z-10">
        <header className="bg-white/60 backdrop-blur-xl border-b border-white/40 sticky top-0 z-50 shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">WealthSpace</h1>
                <p className="text-[11px] font-bold tracking-wider uppercase text-neutral-500">Quản Lý Tài Chính Gia Đình</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/80 shadow-sm w-full sm:w-auto justify-between sm:justify-start">
               <span className="text-sm font-semibold text-neutral-600">Kỳ báo cáo:</span>
               <input 
                  type="month" 
                  value={format(currentDate, 'yyyy-MM')} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setCurrentDate(new Date(e.target.value));
                    }
                  }}
                  className="bg-transparent text-sm font-bold text-indigo-700 focus:outline-none cursor-pointer"
               />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            <div className="xl:col-span-1 space-y-6 sm:space-y-8">
              <TransactionForm onAdd={addTransaction} />
              
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6">
                <h3 className="text-base font-bold text-neutral-900 mb-5 flex items-center gap-2">
                  Giao Dịch Gần Đây
                </h3>
                {sortedTransactions.length === 0 ? (
                  <div className="text-center py-8 bg-white/40 rounded-xl border border-white/60">
                    <p className="text-sm font-medium text-neutral-500">Chưa có giao dịch nào.</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {sortedTransactions.map(t => (
                      <li key={t.id} className="flex justify-between items-center group p-3 bg-white/50 hover:bg-white/80 rounded-xl border border-white/60 transition-colors shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            {t.type === 'INCOME' ? <ArrowUpRight className="w-4 h-4"/> : <ArrowDownRight className="w-4 h-4"/>}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-neutral-900">{t.category} <span className="text-xs font-medium text-neutral-500">({t.member})</span></p>
                            <p className="text-[11px] font-medium text-neutral-500">{t.date} {t.note && `• ${t.note}`}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`text-sm font-extrabold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-neutral-900'}`}>
                            {t.type === 'INCOME' ? '+' : '-'}{t.amount.toLocaleString('vi-VN')}đ
                          </span>
                          <button 
                            onClick={() => deleteTransaction(t.id)}
                            className="text-neutral-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1.5 rounded-md shadow-sm border border-neutral-100"
                            title="Xóa giao dịch"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div className="xl:col-span-2 space-y-6 sm:space-y-8">
              <MonthlyComparison currentMonth={currentMonthStats} previousMonth={previousMonthStats} />
              <FinancialReport analysis={report} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
