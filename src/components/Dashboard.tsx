import { useState } from 'react';
import { Header } from '@/components/Header';
import { SummaryCards } from '@/components/SummaryCards';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { SpendingCharts } from '@/components/SpendingCharts';
import { AIInsights } from '@/components/AIInsights';
import { BudgetProgress } from '@/components/BudgetProgress';
import { MonthlyReport } from '@/components/MonthlyReport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transaction } from '@/lib/types';
import { LayoutDashboard, ArrowLeftRight, BarChart3, FileText, PiggyBank } from 'lucide-react';
import { AISavings } from '@/components/AISavings';

interface DashboardProps {
  onLogout?: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={onLogout} />
      <main className="container py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-lg">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm">
              <LayoutDashboard className="h-4 w-4 mr-1 hidden sm:block" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs sm:text-sm">
              <ArrowLeftRight className="h-4 w-4 mr-1 hidden sm:block" /> Transactions
            </TabsTrigger>
            <TabsTrigger value="savings" className="text-xs sm:text-sm">
              <PiggyBank className="h-4 w-4 mr-1 hidden sm:block" /> AI Savings
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4 mr-1 hidden sm:block" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-xs sm:text-sm">
              <FileText className="h-4 w-4 mr-1 hidden sm:block" /> Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <SummaryCards />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <AIInsights />
                <SpendingCharts />
              </div>
              <div className="space-y-6">
                <TransactionForm editingTx={editingTx} onDone={() => setEditingTx(null)} />
                <BudgetProgress />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TransactionList onEdit={setEditingTx} />
              </div>
              <div>
                <TransactionForm editingTx={editingTx} onDone={() => setEditingTx(null)} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="savings" className="space-y-6">
            <AISavings />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <SpendingCharts />
          </TabsContent>

          <TabsContent value="reports">
            <MonthlyReport />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
