'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '../../../lib/context/store-context';
import Input from '../../../components/shared/input';
import Button from '../../../components/shared/button';
import { authClient } from '../../../lib/auth-client';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useStore();
  const { data: sessionData } = authClient.useSession();

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Inline OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  // Prefill details if user is signed in
  useEffect(() => {
    if (sessionData?.user) {
      const parts = (sessionData.user.name || '').split(' ');
      setForm((prev) => ({
        ...prev,
        email: sessionData.user.email,
        firstName: prev.firstName || parts[0] || '',
        lastName: prev.lastName || parts.slice(1).join(' ') || '',
      }));
    }
  }, [sessionData]);

  const subtotal = cart.reduce((sum, item) => sum + (item?.product?.price || 0) * (item?.quantity || 0), 0);
  const currency = cart.length > 0 ? cart[0].product.currency : '$';
  const shippingCost = subtotal >= 500 ? 0 : 25;
  const estimatedTax = subtotal * 0.08;
  const grandTotal = subtotal + shippingCost + estimatedTax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.email) newErrors.email = 'Required';
    if (!form.firstName) newErrors.firstName = 'Required';
    if (!form.lastName) newErrors.lastName = 'Required';
    if (!form.address) newErrors.address = 'Required';
    if (!form.city) newErrors.city = 'Required';
    if (!form.postalCode) newErrors.postalCode = 'Required';
    if (!form.cardName) newErrors.cardName = 'Required';
    if (!form.cardNumber) newErrors.cardNumber = 'Required';
    if (!form.cardExpiry) newErrors.cardExpiry = 'Required';
    if (!form.cardCvc) newErrors.cardCvc = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      clearCart();
      router.push('/order-success');
    }
  };

  const handleSendOtp = async () => {
    if (!form.email) {
      setErrors((prev) => ({ ...prev, email: 'Enter email to send code' }));
      return;
    }
    setOtpLoading(true);
    setAuthError('');
    setAuthMessage('');

    try {
      const response = await authClient.emailOtp.sendVerificationOtp({
        email: form.email,
        type: 'sign-in',
      });

      if (response.error) {
        setAuthError(response.error.message || 'Failed to send OTP code.');
      } else {
        setOtpSent(true);
        setAuthMessage('Verification code sent to your email.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'An error occurred.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) return;
    setOtpLoading(true);
    setAuthError('');

    try {
      const response = await authClient.signIn.emailOtp({
        email: form.email,
        otp: otpCode,
      });

      if (response.error) {
        setAuthError(response.error.message || 'Invalid code.');
      } else {
        setOtpSent(false);
        setOtpCode('');
        setAuthMessage('Successfully signed in.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'An error occurred.');
    } finally {
      setOtpLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop text-center space-y-6">
        <h1 className="font-display-xl text-3xl md:text-5xl uppercase text-primary">YOUR BAG IS EMPTY</h1>
        <p className="font-body-md text-on-surface-variant">
          You must add items to your shopping bag before checking out.
        </p>
        <Link href="/shop" passHref>
          <Button variant="primary">SHOP ALL PIECES</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop select-none">
      <h1 className="sr-only">Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        
        {/* Left: Input Billing & Shipping forms */}
        <div className="lg:col-span-7 space-y-12">
          {/* Contact Details */}
          <section className="space-y-6">
            <h2 className="font-label-caps text-label-caps text-primary border-b border-outline-variant/30 pb-2">
              01 / CONTACT INFORMATION
            </h2>
            
            {authError && (
              <div className="p-3 bg-error/10 border border-error/20 text-error text-xs font-sans">
                {authError}
              </div>
            )}

            {authMessage && (
              <div className="p-3 bg-primary/5 border border-outline-variant/30 text-on-surface-variant text-xs font-sans">
                {authMessage}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
                <div className="sm:col-span-2">
                  <Input
                    label="Email Address"
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    disabled={!!sessionData}
                  />
                </div>
                {!sessionData && (
                  <div className="pb-1">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading}
                      className="w-full border border-outline-variant hover:border-primary text-primary py-3 font-label-caps text-[10px] uppercase tracking-widest cursor-pointer transition-colors"
                    >
                      {otpLoading && !otpSent ? 'SENDING...' : 'SEND LOGIN CODE'}
                    </button>
                  </div>
                )}
              </div>

              {/* OTP Entry verification inline */}
              {otpSent && !sessionData && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end pt-2 bg-surface-container-lowest p-4 border border-outline-variant/20">
                  <div className="sm:col-span-2">
                    <Input
                      label="6-Digit Verification Code"
                      id="otpCode"
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter verification code"
                      required
                    />
                  </div>
                  <div className="pb-1">
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpLoading || !otpCode}
                      className="w-full bg-primary text-on-primary py-3 font-label-caps text-[10px] uppercase tracking-widest cursor-pointer transition-colors"
                    >
                      {otpLoading ? 'VERIFYING...' : 'VERIFY CODE'}
                    </button>
                  </div>
                </div>
              )}

              {sessionData && (
                <p className="text-xs text-primary font-sans flex items-center gap-1.5 pt-1">
                  <span className="w-1.5 h-1.5 bg-success rounded-full" />
                  Signed in as <strong className="font-bold">{sessionData.user.email}</strong>.
                </p>
              )}
            </div>
          </section>

          {/* Shipping Address */}
          <section className="space-y-6">
            <h2 className="font-label-caps text-label-caps text-primary border-b border-outline-variant/30 pb-2">
              02 / DELIVERY ADDRESS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="First Name"
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name"
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-6">
              <Input
                label="Address Line 1"
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                error={errors.address}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Input
                label="City"
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                error={errors.city}
                required
              />
              <Input
                label="Postal / Zip Code"
                id="postalCode"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                error={errors.postalCode}
                required
              />
              <Input
                label="Country"
                id="country"
                name="country"
                value={form.country}
                onChange={handleChange}
                disabled
              />
            </div>
          </section>

          {/* Payment Method */}
          <section className="space-y-6">
            <h2 className="font-label-caps text-label-caps text-primary border-b border-outline-variant/30 pb-2">
              03 / PAYMENT METHOD
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <Input
                label="Name on Card"
                id="cardName"
                name="cardName"
                value={form.cardName}
                onChange={handleChange}
                error={errors.cardName}
                required
              />
              <Input
                label="Card Number"
                id="cardNumber"
                name="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={form.cardNumber}
                onChange={handleChange}
                error={errors.cardNumber}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Expiry Date"
                id="cardExpiry"
                name="cardExpiry"
                placeholder="MM/YY"
                value={form.cardExpiry}
                onChange={handleChange}
                error={errors.cardExpiry}
                required
              />
              <Input
                label="CVC / CVV"
                id="cardCvc"
                name="cardCvc"
                placeholder="000"
                value={form.cardCvc}
                onChange={handleChange}
                error={errors.cardCvc}
                required
              />
            </div>
          </section>
        </div>

        {/* Right: Summary panel */}
        <aside className="lg:col-span-5 bg-surface-container-low p-8 border border-outline-variant/30 space-y-6">
          <h2 className="font-label-caps text-label-caps text-primary pb-2 border-b border-outline-variant/30">
            ORDER PREVIEW
          </h2>

          {/* Cart items list */}
          <div className="divide-y divide-outline-variant/20 max-h-[300px] overflow-y-auto pr-2">
            {cart.filter(item => item && item.product).map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}`} className="py-4 flex gap-4 first:pt-0">
                <div className="w-16 aspect-[3/4] bg-surface-container shrink-0">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5 text-sm">
                  <div>
                    <h4 className="font-headline-md text-sm text-primary leading-tight line-clamp-1">{item.product.name}</h4>
                    <p className="font-label-caps text-[9px] text-on-surface-variant mt-1">
                      SIZE: {item.selectedSize} / QTY: {item.quantity}
                    </p>
                  </div>
                  <span className="text-primary font-bold text-xs mt-1">
                    {currency}{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-outline-variant/30 pt-6 space-y-4 font-sans text-sm text-on-surface-variant">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-primary">{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-primary">
                {shippingCost === 0 ? 'FREE' : `${currency}${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax</span>
              <span className="text-primary">{currency}{estimatedTax.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-outline-variant/30 pt-4 flex justify-between items-baseline">
            <span className="font-label-caps text-label-caps text-primary">TOTAL</span>
            <span className="font-headline-md text-2xl text-primary">
              {currency}{grandTotal.toFixed(2)}
            </span>
          </div>

          <div className="pt-4">
            <Button variant="primary" fullWidth type="submit">
              PLACE ORDER
            </Button>
          </div>
        </aside>

      </form>
    </main>
  );
}
