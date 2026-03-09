import { useAppData } from '@/hooks/useAppData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

export function BudgetProgress() {
  const { transactions, budget, setBudget } = useAppData();
  const [editBudget, setEditBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget.monthlyBudget.toString());

  const now = new Date();
  const thisMonth = transactions.filter(t =>
    t.type === 'expense' && isWithinInterval(new Date(t.date), { start: startOfMonth(now), end: endOfMonth(now) })
  );
  const totalExpense = thisMonth.reduce((s, t) => s + t.amount, 0);
  const pct = budget.monthlyBudget > 0 ? Math.min((totalExpense / budget.monthlyBudget) * 100, 100) : 0;

  const handleSave = () => {
    const val = parseFloat(budgetInput);
    if (isNaN(val) || val < 0) {
      toast.error('Enter a valid budget amount');
      return;
    }
    setBudget({ monthlyBudget: val });
    setEditBudget(false);
    toast.success('Budget updated');
  };

  const getProgressColor = () => {
    if (pct >= 100) return 'bg-expense';
    if (pct >= 80) return 'bg-warning-color';
    return 'bg-income';
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Target className="h-4 w-4" /> Monthly Budget
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setEditBudget(!editBudget)}>
            {editBudget ? 'Cancel' : 'Set Budget'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {editBudget ? (
          <div className="flex gap-2">
            <Input type="number" placeholder="Monthly budget (₹)" value={budgetInput} onChange={e => setBudgetInput(e.target.value)} />
            <Button onClick={handleSave}>Save</Button>
          </div>
        ) : budget.monthlyBudget > 0 ? (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">₹{totalExpense.toLocaleString()} spent</span>
              <span className="font-medium">₹{budget.monthlyBudget.toLocaleString()} limit</span>
            </div>
            <div className="relative h-3 rounded-full bg-secondary overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`} style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {pct >= 100 ? '⚠️ Budget exceeded!' : pct >= 80 ? '⚠️ Approaching budget limit' : `${Math.round(pct)}% of budget used`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Set a monthly budget to track your spending limit.</p>
        )}
      </CardContent>
    </Card>
  );
}
