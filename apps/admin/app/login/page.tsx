'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound } from 'lucide-react';
import { checkUserExists, sendVerificationOtp, signInWithOtp, createUserAddress } from '../../lib/api';

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
          setMessage(`Verification code sent to ${email}.`);
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

        {stage === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
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
              {loading ? 'CHECKING...' : 'CONTINUE'}
            </button>
          </form>
        )}

        {stage === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Create an Admin Account
              </h2>
              <p className="text-xs text-gray-500">
                Email <strong>{email}</strong> is not registered. Please provide your profile details to register.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label htmlFor="street" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Street Address
                </label>
                <input
                  id="street"
                  type="text"
                  placeholder="Office street address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    placeholder="United States"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-2">
              <button
                type="button"
                onClick={() => setStage('email')}
                className="text-black underline cursor-pointer hover:opacity-70"
                disabled={loading}
              >
                Back
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
            >
              {loading ? 'SENDING CODE...' : 'SEND OTP & REGISTER'}
            </button>
          </form>
        )}

        {stage === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
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
