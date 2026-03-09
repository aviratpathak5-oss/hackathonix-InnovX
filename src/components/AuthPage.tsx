import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onLogin: (name: string) => void;
}

export function AuthPage({ onLogin }: Props) {
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignup && !name)) {
      toast.error('Please fill all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const displayName = isSignup ? name : (localStorage.getItem('budget_user_name') || 'User');
    if (isSignup) {
      localStorage.setItem('budget_user_name', name);
      localStorage.setItem('budget_user_email', email);
    }
    onLogin(displayName);
    toast.success(isSignup ? 'Account created!' : 'Welcome back!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-income/5" />
      <Card className="w-full max-w-md relative border-none shadow-xl animate-fade-in">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-display">{isSignup ? 'Create Account' : 'Welcome Back'}</CardTitle>
          <CardDescription>{isSignup ? 'Start managing your finances with AI' : 'Log in to your dashboard'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <Label>Name</Label>
                <Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">{isSignup ? 'Create Account' : 'Log In'}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsSignup(!isSignup)} className="text-primary font-medium hover:underline">
              {isSignup ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
