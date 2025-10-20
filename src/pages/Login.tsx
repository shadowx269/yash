import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authenticateUser, registerUser, saveCurrentUser, getCurrentUser } from '@/lib/mockData';
import { toast } from 'sonner';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const user = authenticateUser(email, password);
        if (user) {
          saveCurrentUser(user);
          toast.success('Login successful!');
          navigate(user.role === 'admin' ? '/admin' : '/');
        } else {
          toast.error('Invalid email or password');
        }
      } else {
        const user = registerUser(email, password);
        saveCurrentUser(user);
        toast.success('Account created successfully!');
        navigate('/');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 rounded-2xl animate-fade-in">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-2 shadow-lg">
            <span className="text-2xl font-bold text-white">P</span>
          </div>
          <CardTitle className="text-3xl font-heading bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Priya's Collection
          </CardTitle>
          <CardDescription className="text-base">
            {isLogin ? 'Welcome back! Sign in to continue' : 'Create your account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl border-2 focus-visible:ring-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-2 focus-visible:ring-primary transition-all"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all" 
              disabled={loading}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="p-5 bg-gradient-to-br from-muted/50 to-muted rounded-xl border">
            <p className="text-xs font-bold mb-3 text-foreground">Demo Credentials:</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Admin</Badge>
                <span className="text-muted-foreground">admin@priyascollection.com / admin123</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">User</Badge>
                <span className="text-muted-foreground">user@example.com / user123</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
