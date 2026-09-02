import { MonthlyStats } from './calculations';

export interface FinancialAnalysis {
  overview: string;
  savings: string;
  categoryAnalysis: string;
  memberAnalysis: string;
  actionItems: string[];
}

export function generateFinancialReport(currentMonth: MonthlyStats, previousMonth: MonthlyStats): FinancialAnalysis {
  const expenseDiff = currentMonth.expense - previousMonth.expense;
  const expenseDiffPct = previousMonth.expense === 0 ? 0 : (expenseDiff / previousMonth.expense) * 100;
  
  const overview = `Tổng chi tiêu tháng này là ${currentMonth.expense.toLocaleString('vi-VN')}đ, ${expenseDiff > 0 ? 'tăng' : expenseDiff < 0 ? 'giảm' : 'không đổi'} ${Math.abs(expenseDiff).toLocaleString('vi-VN')}đ (${Math.abs(expenseDiffPct).toFixed(1)}%) so với tháng trước.`;
  
  let savings = "Chưa có dữ liệu thu nhập để tính tỷ lệ tiết kiệm.";
  if (currentMonth.income > 0) {
      const savingsRate = ((currentMonth.income - currentMonth.expense) / currentMonth.income) * 100;
      savings = `Tỷ lệ tiết kiệm tháng này đạt ${savingsRate.toFixed(1)}% trên tổng thu nhập ${currentMonth.income.toLocaleString('vi-VN')}đ. Dòng tiền ${currentMonth.balance >= 0 ? 'thặng dư' : 'thâm hụt'} ${Math.abs(currentMonth.balance).toLocaleString('vi-VN')}đ.`;
  }

  let maxIncreaseCategory = '';
  let maxIncreaseAmount = 0;
  
  for (const [category, amount] of Object.entries(currentMonth.byCategory)) {
      const prevAmount = previousMonth.byCategory[category] || 0;
      const diff = amount - prevAmount;
      if (diff > maxIncreaseAmount) {
          maxIncreaseAmount = diff;
          maxIncreaseCategory = category;
      }
  }

  let categoryAnalysis = "";
  if (maxIncreaseAmount > 0) {
      categoryAnalysis = `Danh mục gây ra sự gia tăng chi tiêu lớn nhất là "${maxIncreaseCategory}", tăng ${maxIncreaseAmount.toLocaleString('vi-VN')}đ so với tháng trước.`;
  } else if (expenseDiff < 0) {
      categoryAnalysis = `Gia đình đã kiểm soát tốt chi tiêu trong tháng này, không có danh mục nào tăng đột biến so với tháng trước.`;
  } else {
      categoryAnalysis = `Chi tiêu ổn định giữa các danh mục so với tháng trước.`;
  }

  let highestSpender = '';
  let highestExpense = 0;
  let highestEarner = '';
  let highestIncome = 0;

  for (const [member, stats] of Object.entries(currentMonth.byMember)) {
      if (stats.expense > highestExpense) {
          highestExpense = stats.expense;
          highestSpender = member;
      }
      if (stats.income > highestIncome) {
          highestIncome = stats.income;
          highestEarner = member;
      }
  }

  let memberAnalysis = "Chưa có đủ dữ liệu thu/chi chi tiết theo thành viên.";
  const memberParts = [];
  if (highestEarner && currentMonth.income > 0) {
      memberParts.push(`Thành viên đóng góp thu nhập lớn nhất là ${highestEarner} với ${highestIncome.toLocaleString('vi-VN')}đ (chiếm ${((highestIncome/currentMonth.income)*100).toFixed(1)}% tổng thu).`);
  }
  if (highestSpender && currentMonth.expense > 0) {
      memberParts.push(`Thành viên chi tiêu nhiều nhất là ${highestSpender} với ${highestExpense.toLocaleString('vi-VN')}đ (chiếm ${((highestExpense/currentMonth.expense)*100).toFixed(1)}% tổng chi).`);
  }
  if (memberParts.length > 0) {
      memberAnalysis = memberParts.join(' ');
  }

  const actionItems: string[] = [];
  if (expenseDiff > 0 && maxIncreaseCategory) {
      actionItems.push(`Đặt ngân sách trần cho danh mục "${maxIncreaseCategory}" và theo dõi hàng tuần.`);
  } else {
       actionItems.push(`Tiếp tục duy trì mức chi tiêu hiện tại cho các danh mục thiết yếu.`);
  }
  
  if (currentMonth.balance < 0) {
      actionItems.push(`Cảnh báo thâm hụt: Rà soát lại các khoản chi không cần thiết của ${highestSpender || 'các thành viên'} để đưa dòng tiền về trạng thái dương.`);
  } else if (currentMonth.balance > 0) {
      actionItems.push(`Trích ${Math.round(currentMonth.balance * 0.5).toLocaleString('vi-VN')}đ (50% thặng dư) vào quỹ dự phòng khẩn cấp hoặc đầu tư.`);
  } else {
      actionItems.push(`Cố gắng gia tăng thu nhập hoặc cắt giảm chi phí nhỏ để tạo ra thặng dư cho dự phòng khẩn cấp.`);
  }

  actionItems.push(`Các thành viên nên họp gia đình vào cuối tuần đầu tiên của tháng tới để thống nhất mục tiêu tài chính mới.`);

  return { overview, savings, categoryAnalysis, memberAnalysis, actionItems };
}
