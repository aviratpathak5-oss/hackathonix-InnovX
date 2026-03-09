import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Brain, Shield, TrendingUp, Wallet, Zap } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export function LandingPage({ onStart }: Props) {
  const features = [
    { icon: Brain, title: 'AI Categorization', desc: 'Auto-detect expense categories from descriptions using smart NLP' },
    { icon: TrendingUp, title: 'Spending Predictions', desc: 'ML-powered forecasts predict your next month expenses' },
    { icon: Zap, title: 'Smart Insights', desc: 'Get personalized financial advice to boost your savings' },
    { icon: BarChart3, title: 'Visual Analytics', desc: 'Interactive charts showing spending patterns and trends' },
    { icon: Shield, title: 'Budget Alerts', desc: 'Set limits and get warned before overspending' },
    { icon: Wallet, title: 'Complete Tracking', desc: 'Track every transaction with search, filter, and CSV export' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-income/5" />
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium">
              <Brain className="h-4 w-4 text-income" />
              AI-Powered Finance
            </div>
            <h1 className="text-4xl font-bold tracking-tight font-display sm:text-5xl md:text-6xl">
              Smart Budget Planning{' '}
              <span className="bg-gradient-to-r from-income to-chart-6 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Track income, manage expenses, predict future spending, and receive AI-driven financial advice — all in one beautiful dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="text-base px-8" onClick={onStart}>
                Start Managing Your Budget <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-display">Everything You Need</h2>
          <p className="mt-2 text-muted-foreground">Powerful features to take control of your finances</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={f.title} className="group rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold font-display mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container pb-20">
        <div className="rounded-2xl bg-primary p-8 md:p-12 text-center text-primary-foreground">
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-3">Ready to Take Control?</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
            Join thousands of users who are making smarter financial decisions with AI.
          </p>
          <Button size="lg" variant="secondary" className="text-base" onClick={onStart}>
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
