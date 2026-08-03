import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authService } from '../services/auth.service';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter Email and Password');
      return;
    }

    try {
      setIsLoading(true);

      const response = await authService.login({ email, password });

      localStorage.setItem('accessToken', response.accessToken);

      navigate('/students');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Can not login, check your credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border p-6"
      >
        <h1 className="text-center text-2xl font-bold">Login</h1>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-md border px-3 py-2"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-md border px-3 py-2"
            disabled={isLoading}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
}
