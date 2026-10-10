import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

import { useAuth } from '../providers/auth.context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter Email and Password');
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });
      navigate('/home', { replace: true });
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f5f5f5] px-4 py-6 text-[#171717]">
      <div className="mb-6 flex items-center justify-center gap-5">
        <img
          src="/acadify-app-icon.svg"
          alt=""
          className="h-12 w-12 shrink-0 object-contain"
        />
        <h1 className="text-2xl font-semibold tracking-tight">Acadify</h1>
      </div>

      <Card className="w-full max-w-md rounded-3xl border border-[#dedede] bg-white text-[#171717] shadow-[0_2px_5px_rgba(0,0,0,0.08)]">
        <CardHeader className="space-y-2 px-6 pb-5 pt-7">
          <CardTitle className="text-center text-2xl font-semibold">
            Login
          </CardTitle>

          <CardDescription className="text-center text-sm leading-relaxed text-[#737373] sm:text-base">
            Enter your credentials below to login to your account.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-5 px-6">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isLoading}
                required
                autoComplete="email"
                className="h-11 rounded-xl border-[#dedede] bg-white px-4 text-sm shadow-sm focus-visible:ring-[#a3a3a3]/30"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLoading}
                required
                autoComplete="current-password"
                className="h-11 rounded-xl border-[#dedede] bg-white px-4 text-sm shadow-sm focus-visible:ring-[#a3a3a3]/30"
              />
            </div>
          </CardContent>

          <CardFooter className="border-0 bg-transparent px-6 pb-7 pt-5">
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-xl bg-[#171717] text-sm font-medium text-white hover:bg-[#333333] disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="mt-6 max-w-sm px-4 text-center text-sm leading-6 text-[#737373]">
        By clicking continue, you agree to our{' '}
        <a
          href="/terms"
          className="underline underline-offset-4 hover:text-[#171717]"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="/privacy"
          className="underline underline-offset-4 hover:text-[#171717]"
        >
          Privacy Policy
        </a>
        .
      </p>
    </main>
  );
}
