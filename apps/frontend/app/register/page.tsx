"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { apiRequest } from '../../lib/api';
import { useAuthStore } from '../../lib/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [name, setName] = useState('Demo Merchant');
  const [email, setEmail] = useState('merchant@cryptomerchant.local');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiRequest<{ merchant: any; accessToken: string; refreshToken: string }>('/auth/register', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ name, email, password })
      });
      setSession({ accessToken: response.accessToken, refreshToken: response.refreshToken, merchant: response.merchant });
      router.push('/dashboard');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardDescription>Create account</CardDescription>
          <CardTitle>Register merchant</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Register'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-slate-400">
            Already have account? <Link href="/login" className="text-emerald-300">Login</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
