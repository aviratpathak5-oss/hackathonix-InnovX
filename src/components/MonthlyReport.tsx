import { useAppData } from '@/hooks/useAppData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { startOfMonth, endOfMonth, isWithinInterval, format } from 'date-fns';
import { Download, FileText } from 'lucide-react';
import { downloadCSV, generateInsights } from '@/lib/ai';

export function MonthlyReport() {
  const { transactions, budget } = useAppData();
  const now = new Date();
  const ms = startOfMonth(now);
  const me = endOfMonth(now);

  const thisMonth = transactions.filter(t =>
    isWithinInterval(new Date(t.date), { start: ms, end: me })
  );

  const income = thisMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  const categoryBreakdown = Object.entries(
    thisMonth.filter(t => t.type === 'expense').reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  const insights = generateInsights(transactions, budget.monthlyBudget);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display">Monthly Report</h2>
          <p className="text-sm text-muted-foreground">{format(now, 'MMMM yyyy')}</p>
        </div>
        <Button variant="outline" onClick={() => downloadCSV(thisMonth)} disabled={thisMonth.length === 0}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-2xl font-bold font-display text-income">₹{income.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold font-display text-expense">₹{expense.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Savings Rate</p>
            <p className="text-2xl font-bold font-display">{savingsRate}%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">Top Spending Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryBreakdown.length > 0 ? (
            <div className="space-y-3">
              {categoryBreakdown.map(([cat, amount], i) => (
                <div key={cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-5 text-muted-foreground">#{i + 1}</span>
                    <span className="text-sm font-medium">{cat}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold">₹{amount.toLocaleString()}</span>
                    {expense > 0 && (
                      <span className="text-xs text-muted-foreground ml-2">({Math.round((amount / expense) * 100)}%)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No expenses this month</p>
          )}
        </CardContent>
      </Card>

      {insights.length > 0 && (
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <FileText className="h-4 w-4" /> AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {insights.map((insight, i) => (
              <p key={i} className="text-sm text-muted-foreground">• {insight.message}</p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
