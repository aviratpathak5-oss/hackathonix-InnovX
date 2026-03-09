import { useAppData } from '@/hooks/useAppData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Brain } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { predictNextMonthExpense } from '@/lib/ai';

export function SummaryCards() {
  const { transactions } = useAppData();
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const thisMonth = transactions.filter(t =>
    isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
  );

  const totalIncome = thisMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const thisMonthExpense = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const allTimeExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const allTimeIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const balance = allTimeIncome - allTimeExpense;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - thisMonthExpense) / totalIncome) * 100) : 0;
  const prediction = predictNextMonthExpense(transactions);

  const cards = [
    { title: 'Total Income', value: totalIncome, icon: TrendingUp, colorClass: 'text-income bg-income-muted' },
    { title: 'Total Expenses', value: allTimeExpense, icon: TrendingDown, colorClass: 'text-expense bg-expense-muted' },
    { title: 'Balance', value: balance, icon: Wallet, colorClass: balance >= 0 ? 'text-income bg-income-muted' : 'text-expense bg-expense-muted' },
    { title: 'Savings Rate', value: savingsRate, icon: PiggyBank, colorClass: 'text-primary bg-secondary', isSavings: true },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.title} className="animate-fade-in border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.colorClass}`}>
                <c.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display">
                {c.isSavings ? `${c.value}%` : `₹${Math.abs(c.value).toLocaleString()}`}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {prediction !== null && (
        <Card className="animate-fade-in border-none shadow-sm bg-secondary/50">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">AI Spending Forecast</p>
              <p className="text-lg font-bold font-display">
                Predicted next month expense: ₹{prediction.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
