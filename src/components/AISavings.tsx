import { useAppData } from '@/hooks/useAppData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { startOfMonth, endOfMonth, isWithinInterval, format, subMonths } from 'date-fns';
import { Sparkles, TrendingUp, Shield, Zap, Target, ArrowUpRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

function analyzeSavings(transactions: ReturnType<typeof useAppData>['transactions']) {
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(now, 5 - i);
    const ms = startOfMonth(month);
    const me = endOfMonth(month);
    const txs = transactions.filter(t => isWithinInterval(new Date(t.date), { start: ms, end: me }));
    const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const savings = Math.max(0, income - expense);
    return {
      month: format(month, 'MMM'),
      fullMonth: format(month, 'MMMM yyyy'),
      income,
      expense,
      savings,
      savingsRate: income > 0 ? Math.round((savings / income) * 100) : 0,
    };
  });

  const totalSavings = monthlyData.reduce((s, m) => s + m.savings, 0);
  const totalIncome = monthlyData.reduce((s, m) => s + m.income, 0);
  const avgSavingsRate = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

  // AI prediction: project next month savings based on trend
  const recentSavings = monthlyData.slice(-3).map(m => m.savings);
  const trend = recentSavings.length >= 2
    ? (recentSavings[recentSavings.length - 1] - recentSavings[0]) / recentSavings.length
    : 0;
  const predictedSavings = Math.max(0, Math.round(recentSavings[recentSavings.length - 1] + trend));

  // Find top expense categories that could be cut
  const currentMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return t.type === 'expense' && isWithinInterval(d, { start: startOfMonth(now), end: endOfMonth(now) });
  });
  const catTotals: Record<string, number> = {};
  currentMonth.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });
  const cuttable = Object.entries(catTotals)
    .filter(([cat]) => ['Entertainment', 'Shopping', 'Food'].includes(cat))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, amount]) => ({
      category: cat,
      amount,
      potentialSave: Math.round(amount * 0.25),
    }));

  // Savings score (0-100)
  const score = Math.min(100, Math.round(avgSavingsRate * 2.5));

  return { monthlyData, totalSavings, avgSavingsRate, predictedSavings, cuttable, score };
}

export function AISavings() {
  const { transactions } = useAppData();
  const { monthlyData, totalSavings, avgSavingsRate, predictedSavings, cuttable, score } = analyzeSavings(transactions);

  const radialData = [{ name: 'Score', value: score, fill: 'hsl(var(--income))' }];

  const hasData = transactions.length > 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-income/10">
          <Sparkles className="h-5 w-5 text-income" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display">AI Savings Intelligence</h2>
          <p className="text-sm text-muted-foreground">Smart analysis to maximize your savings</p>
        </div>
      </div>

      {/* Top metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border-none shadow-sm bg-gradient-to-br from-income/5 to-income/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-income/5 rounded-full -translate-y-6 translate-x-6" />
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Shield className="h-3.5 w-3.5 text-income" />
              Total Saved (6mo)
            </div>
            <p className="text-2xl font-bold font-display text-income">₹{totalSavings.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-income">
              <ArrowUpRight className="h-3 w-3" />
              {avgSavingsRate}% avg rate
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-chart-6/5 to-chart-6/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-chart-6/5 rounded-full -translate-y-6 translate-x-6" />
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Zap className="h-3.5 w-3.5 text-chart-6" />
              AI Predicted Savings
            </div>
            <p className="text-2xl font-bold font-display">₹{predictedSavings.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Next month forecast</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-chart-5/5 to-chart-5/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-chart-5/5 rounded-full -translate-y-6 translate-x-6" />
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Target className="h-3.5 w-3.5 text-chart-5" />
              Savings Score
            </div>
            <p className="text-2xl font-bold font-display">{score}<span className="text-base text-muted-foreground">/100</span></p>
            <Progress value={score} className="mt-2 h-1.5 [&>div]:bg-chart-5" />
          </CardContent>
        </Card>
      </div>

      {/* Savings trend chart */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-income" />
            Savings Growth Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(152, 69%, 40%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(152, 69%, 40%)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: number, name: string) => [`₹${v.toLocaleString()}`, name]}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                />
                <Area type="monotone" dataKey="savings" name="Savings" stroke="hsl(152, 69%, 40%)" strokeWidth={2.5} fill="url(#savingsGradient)" dot={{ fill: 'hsl(152, 69%, 40%)', r: 4, strokeWidth: 2, stroke: '#fff' }} />
                <Area type="monotone" dataKey="expense" name="Expenses (cut from)" stroke="hsl(0, 72%, 51%)" strokeWidth={1.5} fill="url(#expenseGradient)" strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
              Add transactions to see your savings trend
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Cut suggestions */}
      {cuttable.length > 0 && (
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-warning" />
              AI Savings Optimizer
            </CardTitle>
            <p className="text-xs text-muted-foreground">Smart suggestions to increase your savings by cutting non-essential expenses</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {cuttable.map((item) => (
              <div key={item.category} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-xs text-muted-foreground">₹{item.amount.toLocaleString()} spent</span>
                  </div>
                  <Progress value={75} className="h-1.5 [&>div]:bg-warning" />
                </div>
                <div className="text-right min-w-[90px]">
                  <p className="text-sm font-bold text-income">+₹{item.potentialSave.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">if cut 25%</p>
                </div>
              </div>
            ))}
            <div className="mt-2 p-3 rounded-xl bg-income/5 border border-income/10">
              <p className="text-sm font-medium text-income">
                💡 Total potential monthly savings: ₹{cuttable.reduce((s, c) => s + c.potentialSave, 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                That's ₹{(cuttable.reduce((s, c) => s + c.potentialSave, 0) * 12).toLocaleString()} extra per year!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
