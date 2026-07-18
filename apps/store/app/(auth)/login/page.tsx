'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound } from 'lucide-react';
import Input from '../../../components/shared/input';
import Button from '../../../components/shared/button';
import { checkUserExists, sendVerificationOtp, signInWithOtp, createUserAddress } from '../../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('United States');
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
        // User exists, send OTP directly
        const response = await sendVerificationOtp(email, 'sign-in');
        if (response.error) {
          setError(response.error.message || 'Failed to send verification code.');
        } else {
          setMessage(`Verification code has been sent to ${email}.`);
          setStage('otp');
        }
      } else {
        // User does not exist, go to register stage
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
    if (!name || !phone || !street || !city || !country) {
      setError('Please fill in all fields to register.');
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
        setMessage(`Verification code has been sent to ${email}. Please verify to register.`);
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
      const response = await signInWithOtp(
        email,
        otp,
        name || undefined,
        phone || undefined,
        street || undefined
      );

      if (response.error) {
        setError(response.error.message || 'Invalid verification code. Please try again.');
      } else {
        // If registration details were provided, save their first Address record!
        if (name && phone && street && city) {
          await createUserAddress({
            street,
            city,
            country,
            label: 'home',
          });
        }
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

        {stage === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                {loading ? 'CHECKING...' : 'CONTINUE'}
              </Button>
            </div>
          </form>
        )}

        {stage === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider">
                Create an Atelier Account
              </h2>
              <p className="text-[11px] text-on-surface-variant/80">
                Email <strong>{email}</strong> is not registered. Please provide your profile details to sign up.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Full Name"
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Phone Number"
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Street Address"
                id="street"
                type="text"
                placeholder="123 Atelier Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                disabled={loading}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  id="city"
                  type="text"
                  placeholder="Kyoto"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  disabled={loading}
                />
                <Input
                  label="Country"
                  id="country"
                  type="text"
                  placeholder="Japan"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-2">
              <button
                type="button"
                onClick={() => setStage('email')}
                className="font-label-caps text-[10px] text-primary underline cursor-pointer hover:opacity-70"
                disabled={loading}
              >
                Back
              </button>
            </div>

            <div className="pt-2">
              <Button variant="primary" fullWidth type="submit" disabled={loading}>
                {loading ? 'SENDING CODE...' : 'SEND OTP & REGISTER'}
              </Button>
            </div>
          </form>
        )}

        {stage === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
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
