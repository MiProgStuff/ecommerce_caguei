'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound } from 'lucide-react';
import { authClient } from '../../lib/auth-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [stage, setStage] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'sign-in',
      });

      if (response.error) {
        setError(response.error.message || 'Failed to send verification code.');
      } else {
        setMessage(`Verification code sent to ${email}.`);
        setStage('otp');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    setError('');

    try {
      const response = await authClient.signIn.emailOtp({
        email,
        otp,
        name: name || undefined,
      });

      if (response.error) {
        setError(response.error.message || 'Invalid verification code.');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12 select-none">
      <div className="max-w-md w-full border border-gray-200 bg-white p-8 shadow-sm">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <KeyRound size={28} className="mx-auto text-black" />
          <h1 className="text-2xl font-bold tracking-tight text-black">
            ADMIN PORTAL
          </h1>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Provide credentials below to authenticate.
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="p-4 mb-6 bg-blue-50 border border-blue-200 text-blue-800 text-sm text-center">
            {message}
          </div>
        )}

        {stage === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@caguei.com"
                required
                disabled={loading}
                className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
            >
              {loading ? 'SENDING CODE...' : 'REQUEST ACCESS CODE'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="6-digit code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Display Name (New admins)
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Optional"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Code expires in 5 minutes</span>
              <button
                type="button"
                onClick={() => setStage('email')}
                className="text-black underline cursor-pointer hover:opacity-70"
                disabled={loading}
              >
                Change Email
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
            >
              {loading ? 'VERIFYING...' : 'VERIFY & SIGN IN'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
