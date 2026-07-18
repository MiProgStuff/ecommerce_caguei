'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, KeyRound } from 'lucide-react';
import Input from '../../../components/shared/input';
import Button from '../../../components/shared/button';
import { authClient } from '../../../lib/auth-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState(''); // Optional, used for automatic signup
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
        setError(response.error.message || 'Failed to send verification code. Please try again.');
      } else {
        setMessage(`Verification code has been sent to ${email}.`);
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
        setError(response.error.message || 'Invalid verification code. Please try again.');
      } else {
        router.push('/account');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop flex items-center justify-center min-h-[70vh] select-none">
      <div className="max-w-md w-full border border-outline-variant/30 bg-surface-container-low p-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <KeyRound size={28} strokeWidth={1.5} className="mx-auto text-primary" />
          <h1 className="font-display-xl text-3xl uppercase tracking-tighter text-primary">
            ATELIER LOG IN
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant max-w-xs mx-auto">
            Access your orders, profile, and saved wishlists through passwordless verification.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-error/10 border border-error/20 text-error font-sans text-xs text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="p-4 bg-primary/5 border border-outline-variant/30 text-on-surface-variant font-sans text-xs text-center">
            {message}
          </div>
        )}

        {stage === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <Input
              label="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              disabled={loading}
            />
            
            <div className="pt-4">
              <Button variant="primary" fullWidth type="submit" disabled={loading}>
                {loading ? 'SENDING CODE...' : 'REQUEST LOGIN CODE'}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Verification Code"
                id="otp"
                type="text"
                placeholder="6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Full Name (New accounts only)"
                id="name"
                type="text"
                placeholder="Optional"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-variant">Code expires in 5 minutes</span>
              <button
                type="button"
                onClick={() => setStage('email')}
                className="font-label-caps text-[10px] text-primary underline cursor-pointer hover:opacity-70"
                disabled={loading}
              >
                Change Email
              </button>
            </div>

            <div className="pt-4">
              <Button variant="primary" fullWidth type="submit" disabled={loading}>
                {loading ? 'VERIFYING...' : 'VERIFY & SIGN IN'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
