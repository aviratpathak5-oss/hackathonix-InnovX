import { useAppData } from '@/hooks/useAppData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { startOfMonth, endOfMonth, isWithinInterval, format, subMonths } from 'date-fns';
import { CATEGORY_COLORS } from '@/lib/types';

export function SpendingCharts() {
  const { transactions } = useAppData();
  const now = new Date();

  // Pie chart - category breakdown this month
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const thisMonthExpenses = transactions.filter(t =>
    t.type === 'expense' && isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
  );

  const categoryData = Object.entries(
    thisMonthExpenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] || '#888' }))
    .sort((a, b) => b.value - a.value);

  // Bar chart - last 6 months income vs expense
  const barData = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(now, 5 - i);
    const ms = startOfMonth(month);
    const me = endOfMonth(month);
    const monthTxs = transactions.filter(t => isWithinInterval(new Date(t.date), { start: ms, end: me }));
    return {
      month: format(month, 'MMM'),
      Income: monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      Expenses: monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    };
  });

  // Line chart - spending trend
  const lineData = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(now, 5 - i);
    const ms = startOfMonth(month);
    const me = endOfMonth(month);
    const total = transactions.filter(t => t.type === 'expense' && isWithinInterval(new Date(t.date), { start: ms, end: me }))
      .reduce((s, t) => s + t.amount, 0);
    return { month: format(month, 'MMM'), Spending: total };
  });

  const hasData = transactions.length > 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Pie Chart */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={2}>
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {categoryData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">No expense data yet</div>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="Income" fill="hsl(152, 69%, 40%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expenses" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card className="border-none shadow-sm lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="Spending" stroke="hsl(222, 60%, 50%)" strokeWidth={2} dot={{ fill: 'hsl(222, 60%, 50%)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
