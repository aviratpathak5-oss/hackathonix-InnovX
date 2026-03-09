export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills'
  | 'Health'
  | 'Education'
  | 'Housing'
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Other';

export const EXPENSE_CATEGORIES: Category[] = [
  'Food', 'Transport', 'Shopping', 'Entertainment',
  'Bills', 'Health', 'Education', 'Housing', 'Other'
];

export const INCOME_CATEGORIES: Category[] = [
  'Salary', 'Freelance', 'Investment', 'Other'
];

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  description: string;
  date: string; // ISO string
}

export interface BudgetSettings {
  monthlyBudget: number;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: 'hsl(38, 92%, 50%)',
  Transport: 'hsl(199, 89%, 48%)',
  Shopping: 'hsl(262, 52%, 47%)',
  Entertainment: 'hsl(328, 73%, 52%)',
  Bills: 'hsl(0, 72%, 51%)',
  Health: 'hsl(152, 69%, 40%)',
  Education: 'hsl(222, 60%, 50%)',
  Housing: 'hsl(28, 80%, 52%)',
  Salary: 'hsl(152, 69%, 40%)',
  Freelance: 'hsl(199, 89%, 48%)',
  Investment: 'hsl(262, 52%, 47%)',
  Other: 'hsl(220, 9%, 46%)',
};
