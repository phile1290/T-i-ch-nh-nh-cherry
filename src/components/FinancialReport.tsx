import { FinancialAnalysis } from '../lib/utils/analytics';
import { AlertCircle, TrendingUp, TrendingDown, Info, CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  analysis: FinancialAnalysis;
}

export function FinancialReport({ analysis }: Props) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/60">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center border border-indigo-200/50 shadow-sm">
           <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-neutral-900">
            Phân Tích & Khuyến Nghị Tự Động
          </h3>
          <p className="text-xs font-medium text-neutral-500">Dựa trên thuật toán AI theo dõi biến động</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-5">
          <div className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-white/80 shadow-sm hover:bg-white/80 transition-colors">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-indigo-500" /> Tổng Quan
            </h4>
            <p className="text-neutral-800 font-medium leading-relaxed text-sm">{analysis.overview}</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-white/80 shadow-sm hover:bg-white/80 transition-colors">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-500" /> Biến Động Danh Mục
            </h4>
            <p className="text-neutral-800 font-medium leading-relaxed text-sm">{analysis.categoryAnalysis}</p>
          </div>
        </div>

        <div className="space-y-5">
           <div className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-white/80 shadow-sm hover:bg-white/80 transition-colors">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4 text-emerald-500" /> Dòng Tiền & Tiết Kiệm
            </h4>
            <p className="text-neutral-800 font-medium leading-relaxed text-sm">{analysis.savings}</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-white/80 shadow-sm hover:bg-white/80 transition-colors">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-rose-500" /> Đóng Góp Thành Viên
            </h4>
            <p className="text-neutral-800 font-medium leading-relaxed text-sm">{analysis.memberAnalysis}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50/50 p-6 rounded-2xl border border-indigo-100 shadow-inner">
        <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
          Hành Động Đề Xuất (Action Items)
        </h4>
        <ul className="space-y-3">
          {analysis.actionItems.map((item, index) => (
            <li key={index} className="flex gap-3 items-start text-sm text-indigo-800">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-200/50 flex items-center justify-center font-bold text-indigo-700 text-xs mt-0.5">{index + 1}</span>
              <span className="font-medium leading-relaxed pt-0.5">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
