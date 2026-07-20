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
  const [showPassword, setShowPassword] = useState(false);
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
          setError(signUpError.message || 'Registration failed');
          setLoading(false);
          return;
        }
        setMode('sign-in');
        setError('Agent registered. Now sign in.');
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
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh items-center justify-center p-6 bg-black text-white">
      <button
        onClick={() => router.push('/')}
        className="self-start text-sm text-gray-500 hover:text-white transition-colors mb-4"
      >
        &larr; Back to Home
      </button>
      <Card className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === 'sign-in' ? 'Sign In' : 'Join the Hunt'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'sign-up' && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nickname</label>
              <p className="text-xs text-gray-500 mb-2">Your callsign on the leaderboard</p>
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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-white"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {mode === 'sign-up' && (
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters — mix letters and numbers</p>
            )}
          </div>

          {error && (
            <p className={`text-sm ${error.includes('registered') ? 'text-green-400' : 'text-red-400'}`}>
              {error}
            </p>
          )}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Please wait...' : mode === 'sign-in' ? 'Sign In' : 'Join the Hunt'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {mode === 'sign-in' ? (
            <>New recruit?{' '}<button onClick={() => { setMode('sign-up'); setError(''); }} className="text-white underline">Sign up</button></>
          ) : (
            <>Already tracking?{' '}<button onClick={() => { setMode('sign-in'); setError(''); }} className="text-white underline">Sign in</button></>
          )}
        </p>
      </Card>
    </div>
  );
}
