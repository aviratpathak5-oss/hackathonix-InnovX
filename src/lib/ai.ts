import { Transaction, Category } from './types';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

// AI Categorization - keyword-based NLP
const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  Food: ['pizza', 'burger', 'restaurant', 'cafe', 'coffee', 'dominos', 'mcdonald', 'kfc', 'starbucks', 'swiggy', 'zomato', 'food', 'grocery', 'meal', 'lunch', 'dinner', 'breakfast', 'snack', 'eat', 'bakery', 'subway', 'uber eats', 'doordash'],
  Transport: ['uber', 'lyft', 'ola', 'taxi', 'cab', 'fuel', 'gas', 'petrol', 'diesel', 'metro', 'bus', 'train', 'flight', 'airline', 'parking', 'toll', 'transport', 'ride'],
  Shopping: ['amazon', 'flipkart', 'walmart', 'ebay', 'shop', 'mall', 'cloth', 'shoe', 'fashion', 'nike', 'adidas', 'zara', 'h&m', 'myntra', 'purchase', 'buy', 'order'],
  Entertainment: ['netflix', 'spotify', 'movie', 'cinema', 'game', 'concert', 'show', 'theater', 'disney', 'hulu', 'youtube', 'subscription', 'music', 'party', 'club', 'bar'],
  Bills: ['electricity', 'water', 'internet', 'wifi', 'phone', 'mobile', 'recharge', 'bill', 'insurance', 'premium', 'utility', 'broadband', 'cable'],
  Health: ['hospital', 'doctor', 'medicine', 'pharmacy', 'gym', 'fitness', 'yoga', 'dental', 'medical', 'health', 'clinic', 'therapy', 'wellness'],
  Education: ['course', 'book', 'udemy', 'coursera', 'tuition', 'school', 'college', 'university', 'class', 'study', 'learning', 'tutorial', 'exam', 'education'],
  Housing: ['rent', 'mortgage', 'maintenance', 'repair', 'furniture', 'home', 'house', 'apartment', 'lease', 'property'],
  Salary: ['salary', 'paycheck', 'wages', 'pay'],
  Freelance: ['freelance', 'contract', 'gig', 'project', 'client'],
  Investment: ['dividend', 'interest', 'stock', 'mutual fund', 'investment', 'returns', 'crypto', 'bitcoin'],
  Other: [],
};

export function categorizeExpense(description: string): Category | null {
  const lower = description.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'Other') continue;
    if (keywords.some(kw => lower.includes(kw))) {
      return category as Category;
    }
  }
  return null;
}

// AI Prediction - simple moving average
export function predictNextMonthExpense(transactions: Transaction[]): number | null {
  const expenses = transactions.filter(t => t.type === 'expense');
  if (expenses.length < 3) return null;

  const monthlyTotals: Record<string, number> = {};
  expenses.forEach(t => {
    const key = format(new Date(t.date), 'yyyy-MM');
    monthlyTotals[key] = (monthlyTotals[key] || 0) + t.amount;
  });

  const months = Object.keys(monthlyTotals).sort();
  if (months.length < 2) return null;

  const last3 = months.slice(-3);
  const avg = last3.reduce((s, m) => s + monthlyTotals[m], 0) / last3.length;
  
  // Simple trend: compare last month to average
  const lastMonth = monthlyTotals[months[months.length - 1]];
  const trend = lastMonth / avg;
  
  return Math.round(avg * trend);
}

// AI Insights
export interface Insight {
  type: 'info' | 'warning' | 'tip';
  message: string;
}

export function generateInsights(transactions: Transaction[], monthlyBudget: number): Insight[] {
  const insights: Insight[] = [];
  const now = new Date();
  const thisMonth = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonth = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const thisMonthTxs = transactions.filter(t => {
    const d = new Date(t.date);
    return isWithinInterval(d, { start: thisMonth, end: thisMonthEnd });
  });

  const lastMonthTxs = transactions.filter(t => {
    const d = new Date(t.date);
    return isWithinInterval(d, { start: lastMonth, end: lastMonthEnd });
  });

  const thisIncome = thisMonthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const thisExpense = thisMonthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const lastExpense = lastMonthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  // Category breakdown
  if (thisIncome > 0) {
    const categoryTotals: Record<string, number> = {};
    thisMonthTxs.filter(t => t.type === 'expense').forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
      const pct = Math.round((topCategory[1] / thisIncome) * 100);
      insights.push({
        type: 'info',
        message: `You spent ${pct}% of your income on ${topCategory[0]} this month.`,
      });
    }

    const savingsRate = Math.round(((thisIncome - thisExpense) / thisIncome) * 100);
    if (savingsRate < 20 && savingsRate >= 0) {
      insights.push({
        type: 'warning',
        message: `Your savings rate is only ${savingsRate}%. Aim for at least 20%.`,
      });
    } else if (savingsRate >= 20) {
      insights.push({
        type: 'tip',
        message: `Great job! You're saving ${savingsRate}% of your income this month.`,
      });
    }
  }

  // Month comparison
  if (lastExpense > 0 && thisExpense > 0) {
    const change = Math.round(((thisExpense - lastExpense) / lastExpense) * 100);
    if (change > 0) {
      insights.push({
        type: 'warning',
        message: `Your expenses increased by ${change}% compared to last month.`,
      });
    } else if (change < -5) {
      insights.push({
        type: 'tip',
        message: `Your expenses decreased by ${Math.abs(change)}% compared to last month. Keep it up!`,
      });
    }
  }

  // Reduction suggestions
  const categoryTotals: Record<string, number> = {};
  thisMonthTxs.filter(t => t.type === 'expense').forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });
  
  const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 1) {
    const reducible = sorted.find(([cat]) => ['Entertainment', 'Shopping', 'Food'].includes(cat));
    if (reducible) {
      const reduction = Math.round(reducible[1] * 0.2);
      insights.push({
        type: 'tip',
        message: `Reducing ${reducible[0]} expenses by ₹${reduction.toLocaleString()} per month could increase your annual savings by ₹${(reduction * 12).toLocaleString()}.`,
      });
    }
  }

  // Budget warning
  if (monthlyBudget > 0) {
    const usage = thisExpense / monthlyBudget;
    if (usage >= 1) {
      insights.push({ type: 'warning', message: `⚠️ You've exceeded your monthly budget by ₹${Math.round(thisExpense - monthlyBudget).toLocaleString()}!` });
    } else if (usage >= 0.8) {
      insights.push({ type: 'warning', message: `You've used ${Math.round(usage * 100)}% of your monthly budget. Be cautious!` });
    }
  }

  return insights;
}

// CSV Export
export function exportToCSV(transactions: Transaction[]): string {
  const header = 'Date,Type,Category,Description,Amount\n';
  const rows = transactions.map(t =>
    `${t.date},${t.type},${t.category},"${t.description}",${t.amount}`
  ).join('\n');
  return header + rows;
}

export function downloadCSV(transactions: Transaction[]) {
  const csv = exportToCSV(transactions);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
