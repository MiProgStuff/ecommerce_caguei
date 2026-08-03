'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { checkUserExists, sendVerificationOtp, signInWithOtp } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<'email' | 'register' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const exists = await checkUserExists(email);
      if (exists) {
        const response = await sendVerificationOtp(email, 'sign-in');
        if (response.error) {
          setError(response.error.message || 'Failed to send verification code.');
        } else {
          setMessage(`Verification code sent to ${email}.`);
          setStage('otp');
        }
      } else {
        setStage('register');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError('Please provide your name.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await sendVerificationOtp(email, 'sign-in');
      if (response.error) {
        setError(response.error.message || 'Failed to send verification code.');
      } else {
        setMessage(`Verification code sent to ${email}.`);
        setStage('otp');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred.');
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
      const response = await signInWithOtp(email, otp, name || undefined);

      if (response.error) {
        setError(response.error.message || 'Invalid verification code. Please try again.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#141313] px-6 py-12 select-none">
      <div className="max-w-md w-full border border-[#27272A] bg-[#18181B] p-8">
        <div className="text-center space-y-4 mb-8">
          <Image src="/brand/logo-mark.png" alt="" width={40} height={40} className="mx-auto rounded-[8px]" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">ADMIN CONSOLE</h1>
            <p className="text-xs text-[#A1A1AA] mt-2 max-w-xs mx-auto">
              Sign in with your staff email to access the caguei admin panel.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-950/40 border border-red-900 text-red-400 text-xs text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="p-3 mb-6 bg-[#141313] border border-[#27272A] text-[#A1A1AA] text-xs text-center">
            {message}
          </div>
        )}

        {stage === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest mb-2">
                Staff Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@caguei.com"
                required
                disabled={loading}
                autoFocus
                className="w-full bg-transparent border-b border-[#27272A] py-2 text-sm text-white focus:outline-none focus:border-[#C23B3B] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C23B3B] text-white py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
            >
              {loading ? 'CHECKING...' : 'CONTINUE'}
            </button>
          </form>
        )}

        {stage === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <p className="text-xs text-[#A1A1AA]">
              <strong className="text-white">{email}</strong> doesn't have an account yet. Enter your name to create one and receive a sign-in code.
            </p>
            <div>
              <label htmlFor="name" className="block text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                autoFocus
                className="w-full bg-transparent border-b border-[#27272A] py-2 text-sm text-white focus:outline-none focus:border-[#C23B3B] transition-colors"
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <button type="button" onClick={() => setStage('email')} disabled={loading} className="text-[#A1A1AA] underline hover:text-white cursor-pointer">
                Back
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C23B3B] text-white py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
            >
              {loading ? 'SENDING CODE...' : 'SEND CODE'}
            </button>
          </form>
        )}

        {stage === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-widest mb-2">
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
                autoFocus
                className="w-full bg-transparent border-b border-[#27272A] py-2 text-sm text-white tracking-widest focus:outline-none focus:border-[#C23B3B] transition-colors"
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#A1A1AA]">Code expires in 5 minutes</span>
              <button type="button" onClick={() => setStage('email')} disabled={loading} className="text-[#A1A1AA] underline hover:text-white cursor-pointer">
                Change email
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C23B3B] text-white py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
            >
              {loading ? 'VERIFYING...' : 'VERIFY & SIGN IN'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
