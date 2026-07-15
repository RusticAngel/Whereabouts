'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'sign-up') {
        const { error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (signUpError) {
          setError(signUpError.message || 'Failed to create account');
          setLoading(false);
          return;
        }
        setMode('sign-in');
        setError('Account created. Please sign in.');
        setLoading(false);
      } else {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
        });
        if (signInError) {
          setError(signInError.message || 'Failed to sign in');
          setLoading(false);
          return;
        }
        router.push('/');
      }
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh items-center justify-center p-6 bg-black text-white">
      <Card className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === 'sign-in' ? 'Sign In' : 'Create Account'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'sign-up' && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-white"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-white"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className={`text-sm ${error.includes('created') ? 'text-green-400' : 'text-red-400'}`}>
              {error}
            </p>
          )}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Please wait...' : mode === 'sign-in' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {mode === 'sign-in' ? (
            <>No account?{' '}<button onClick={() => { setMode('sign-up'); setError(''); }} className="text-white underline">Sign up</button></>
          ) : (
            <>Have an account?{' '}<button onClick={() => { setMode('sign-in'); setError(''); }} className="text-white underline">Sign in</button></>
          )}
        </p>
      </Card>
    </div>
  );
}
