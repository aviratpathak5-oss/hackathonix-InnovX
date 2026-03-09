import { useAppData } from '@/hooks/useAppData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateInsights } from '@/lib/ai';
import { Lightbulb, AlertTriangle, Info } from 'lucide-react';

export function AIInsights() {
  const { transactions, budget } = useAppData();
  const insights = generateInsights(transactions, budget.monthlyBudget);

  if (insights.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Lightbulb className="h-4 w-4" /> AI Financial Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Add some transactions to receive personalized financial insights.</p>
        </CardContent>
      </Card>
    );
  }

  const iconMap = {
    info: <Info className="h-4 w-4 text-chart-6 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-expense shrink-0" />,
    tip: <Lightbulb className="h-4 w-4 text-income shrink-0" />,
  };

  const bgMap = {
    info: 'bg-secondary',
    warning: 'bg-expense-muted',
    tip: 'bg-income-muted',
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Lightbulb className="h-4 w-4" /> AI Financial Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {insights.map((insight, i) => (
          <div key={i} className={`flex items-start gap-3 rounded-lg p-3 ${bgMap[insight.type]} animate-slide-in`} style={{ animationDelay: `${i * 100}ms` }}>
            {iconMap[insight.type]}
            <p className="text-sm">{insight.message}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
