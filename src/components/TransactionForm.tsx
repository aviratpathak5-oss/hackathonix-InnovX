import { useState } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction, TransactionType, Category, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/types';
import { categorizeExpense } from '@/lib/ai';
import { generateId } from '@/lib/store';
import { format } from 'date-fns';
import { Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  editingTx?: Transaction | null;
  onDone?: () => void;
}

export function TransactionForm({ editingTx, onDone }: Props) {
  const { addTx, updateTx } = useAppData();
  const [type, setType] = useState<TransactionType>(editingTx?.type || 'expense');
  const [amount, setAmount] = useState(editingTx?.amount?.toString() || '');
  const [description, setDescription] = useState(editingTx?.description || '');
  const [category, setCategory] = useState<Category | ''>(editingTx?.category || '');
  const [date, setDate] = useState(editingTx?.date ? format(new Date(editingTx.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
  const [aiSuggested, setAiSuggested] = useState(false);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    if (type === 'expense' && val.length > 2) {
      const suggested = categorizeExpense(val);
      if (suggested) {
        setCategory(suggested);
        setAiSuggested(true);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !description) {
      toast.error('Please fill all fields');
      return;
    }

    const tx: Transaction = {
      id: editingTx?.id || generateId(),
      amount: parseFloat(amount),
      type,
      category: category as Category,
      description,
      date: new Date(date).toISOString(),
    };

    if (editingTx) {
      updateTx(tx);
      toast.success('Transaction updated');
    } else {
      addTx(tx);
      toast.success('Transaction added');
    }

    setAmount('');
    setDescription('');
    setCategory('');
    setAiSuggested(false);
    onDone?.();
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display">{editingTx ? 'Edit Transaction' : 'Add Transaction'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <Button type="button" size="sm" variant={type === 'expense' ? 'default' : 'outline'} onClick={() => { setType('expense'); setCategory(''); setAiSuggested(false); }} className="flex-1">
              Expense
            </Button>
            <Button type="button" size="sm" variant={type === 'income' ? 'default' : 'outline'} onClick={() => { setType('income'); setCategory(''); setAiSuggested(false); }} className="flex-1">
              Income
            </Button>
          </div>

          <div>
            <Label className="text-xs">Amount (₹)</Label>
            <Input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} min="0" step="0.01" />
          </div>

          <div>
            <Label className="text-xs">Description</Label>
            <Input placeholder="e.g. Dominos Pizza" value={description} onChange={e => handleDescriptionChange(e.target.value)} />
          </div>

          <div>
            <Label className="text-xs flex items-center gap-1">
              Category
              {aiSuggested && (
                <span className="inline-flex items-center gap-1 text-xs text-income">
                  <Sparkles className="h-3 w-3" /> AI detected
                </span>
              )}
            </Label>
            <Select value={category} onValueChange={(v) => { setCategory(v as Category); setAiSuggested(false); }}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-1" />
            {editingTx ? 'Update' : 'Add'} Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
