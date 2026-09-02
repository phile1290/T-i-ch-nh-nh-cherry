import { MonthlyStats, calculatePercentageChange } from '../lib/utils/calculations';
import { MEMBERS } from '../lib/constants';
import { TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react';

interface Props {
  currentMonth: MonthlyStats;
  previousMonth: MonthlyStats;
}

export function MonthlyComparison({ currentMonth, previousMonth }: Props) {
  const expenseChange = currentMonth.expense - previousMonth.expense;
  const expenseChangePct = calculatePercentageChange(previousMonth.expense, currentMonth.expense);
  
  const incomeChange = currentMonth.income - previousMonth.income;
  const incomeChangePct = calculatePercentageChange(previousMonth.income, currentMonth.income);

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 overflow-hidden">
      <div className="p-6 border-b border-white/60 bg-white/40">
        <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Tổng Quan Tháng Này
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/60">
        <div className="p-6 bg-white/20 hover:bg-white/40 transition-colors">
          <p className="text-sm font-semibold text-neutral-500 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Tổng Thu Nhập
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-extrabold text-neutral-900">{currentMonth.income.toLocaleString('vi-VN')}đ</h4>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${incomeChange >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {incomeChange >= 0 ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
              {Math.abs(incomeChangePct).toFixed(1)}%
            </span>
            <span className="text-xs font-medium text-neutral-500">vs {previousMonth.income.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        <div className="p-6 bg-white/20 hover:bg-white/40 transition-colors">
          <p className="text-sm font-semibold text-neutral-500 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Tổng Chi Tiêu
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-extrabold text-neutral-900">{currentMonth.expense.toLocaleString('vi-VN')}đ</h4>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${expenseChange > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {expenseChange > 0 ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
              {Math.abs(expenseChangePct).toFixed(1)}%
            </span>
            <span className="text-xs font-medium text-neutral-500">vs {previousMonth.expense.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        <div className="p-6 bg-white/20 hover:bg-white/40 transition-colors">
           <p className="text-sm font-semibold text-neutral-500 mb-2 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-blue-500" />
            Thặng Dư (Dòng Tiền)
          </p>
           <h4 className={`text-3xl font-extrabold ${currentMonth.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
             {currentMonth.balance > 0 ? '+' : ''}{currentMonth.balance.toLocaleString('vi-VN')}đ
           </h4>
           <p className="text-xs font-medium text-neutral-500 mt-3">
            Tháng trước: {previousMonth.balance > 0 ? '+' : ''}{previousMonth.balance.toLocaleString('vi-VN')}đ
          </p>
        </div>
      </div>

      <div className="bg-white/30 p-6 border-t border-white/60">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Nguồn Thu Theo Thành Viên */}
          <div>
            <h4 className="text-xs font-bold text-neutral-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Nguồn Thu Theo Thành Viên
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {MEMBERS.map(member => {
                const current = currentMonth.byMember[member].income;
                const previous = previousMonth.byMember[member].income;
                const change = current - previous;
                const pct = currentMonth.income > 0 ? (current / currentMonth.income) * 100 : 0;
                
                return (
                  <div key={member} className="bg-white/60 backdrop-blur-md p-4 rounded-xl border border-white/60 shadow-sm flex items-center justify-between group hover:bg-white/80 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-bold text-neutral-900">{member}</span>
                      <span className="text-xs font-medium text-neutral-500">Đóng góp: {pct.toFixed(1)}%</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-emerald-600">{current.toLocaleString('vi-VN')}đ</div>
                      <div className="text-xs font-medium mt-1">
                        <span className={change > 0 ? 'text-emerald-600' : change < 0 ? 'text-rose-600' : 'text-neutral-400'}>
                          {change > 0 ? '▲ +' : change < 0 ? '▼ -' : ''}{Math.abs(change).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chi Tiêu Theo Thành Viên */}
          <div>
            <h4 className="text-xs font-bold text-neutral-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Chi Tiêu Theo Thành Viên
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {MEMBERS.map(member => {
                const current = currentMonth.byMember[member].expense;
                const previous = previousMonth.byMember[member].expense;
                const change = current - previous;
                const pct = currentMonth.expense > 0 ? (current / currentMonth.expense) * 100 : 0;
                
                return (
                  <div key={member} className="bg-white/60 backdrop-blur-md p-4 rounded-xl border border-white/60 shadow-sm flex items-center justify-between group hover:bg-white/80 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-bold text-neutral-900">{member}</span>
                      <span className="text-xs font-medium text-neutral-500">Chiếm: {pct.toFixed(1)}%</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-rose-600">{current.toLocaleString('vi-VN')}đ</div>
                      <div className="text-xs font-medium mt-1">
                        <span className={change > 0 ? 'text-rose-600' : change < 0 ? 'text-emerald-600' : 'text-neutral-400'}>
                          {change > 0 ? '▲ +' : change < 0 ? '▼ -' : ''}{Math.abs(change).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
