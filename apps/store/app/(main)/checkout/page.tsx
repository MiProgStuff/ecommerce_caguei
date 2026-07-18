'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useStore } from '../../../lib/context/store-context';
import Input from '../../../components/shared/input';
import Button from '../../../components/shared/button';
import {
  useSession,
  sendVerificationOtp,
  signInWithOtp,
  checkUserExists,
  createUserAddress,
  fetchUserAddresses,
  createPaymentIntent,
  Address,
} from '../../../lib/api';

// ─── Stripe setup (outside component so it's not re-created on each render) ──
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// ─── Stripe Payment Form (inner component, inside <Elements>) ─────────────────
function StripePaymentForm({
  grandTotal,
  currency,
  onSuccess,
  onError,
}: {
  grandTotal: number;
  currency: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaying(true);
    onError('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success`,
      },
    });

    // Only reaches here if there was an error (Stripe redirects on success)
    if (error) {
      onError(error.message || 'Payment failed. Please try again.');
    }
    setPaying(false);
  };

  return (
    <form onSubmit={handlePay} id="stripe-payment-form">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />
      <div className="mt-6">
        <Button variant="primary" fullWidth type="submit" disabled={paying || !stripe}>
          {paying ? 'PROCESSING...' : `PAY ${currency}${grandTotal.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
}

// ─── Label badge ──────────────────────────────────────────────────────────────
const labelColors: Record<string, string> = {
  home: 'bg-blue-50 text-blue-700 border-blue-200',
  work: 'bg-amber-50 text-amber-700 border-amber-200',
  other: 'bg-surface-container text-on-surface-variant border-outline-variant/30',
};

// ─── Main Checkout page ───────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useStore();
  const { data: sessionData } = useSession();

  // ── Calculations ──────────────────────────────────────────────────────────
  const subtotal = cart.reduce(
    (sum, item) => sum + (item?.product?.price || 0) * (item?.quantity || 0),
    0
  );
  const currency = cart.length > 0 ? cart[0].product.currency : '$';
  const shippingCost = subtotal >= 500 ? 0 : 25;
  const estimatedTax = subtotal * 0.08;
  const grandTotal = subtotal + shippingCost + estimatedTax;

  // ── Contact / Auth state ──────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [showRegFields, setShowRegFields] = useState(false);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regCountry, setRegCountry] = useState('United States');

  // ── Address state ─────────────────────────────────────────────────────────
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    label: 'home',
  });
  const [addingAddress, setAddingAddress] = useState(false);
  // Guest address form
  const [guestAddress, setGuestAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: 'United States',
  });

  // ── Stripe state ──────────────────────────────────────────────────────────
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentLoading, setIntentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'address' | 'payment'>('address');

  // ── Prefill email from session ────────────────────────────────────────────
  useEffect(() => {
    if (sessionData?.user) {
      setEmail(sessionData.user.email);
    }
  }, [sessionData]);

  // ── Load saved addresses when user is authenticated ───────────────────────
  useEffect(() => {
    if (sessionData?.user) {
      fetchUserAddresses().then((addrs) => {
        setSavedAddresses(addrs);
        if (addrs.length > 0) setSelectedAddressId(addrs[0].id);
      });
    }
  }, [sessionData]);

  // ─────────────────────────────────────────────────────────────────────────
  // Auth Handlers
  // ─────────────────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!email) {
      setAuthError('Enter your email to continue.');
      return;
    }
    setOtpLoading(true);
    setAuthError('');
    setAuthMessage('');
    try {
      const exists = await checkUserExists(email);
      if (exists) {
        setIsNewUser(false);
        setShowRegFields(false);
        const response = await sendVerificationOtp(email, 'sign-in');
        if (response.error) {
          setAuthError(response.error.message || 'Failed to send OTP code.');
        } else {
          setOtpSent(true);
          setAuthMessage('Verification code sent to your email.');
        }
      } else {
        setIsNewUser(true);
        setShowRegFields(true);
        setAuthMessage('Email not registered. Please enter your details to create an account.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'An error occurred.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegisterAndSendOtp = async () => {
    if (!regName || !regPhone || !regAddress || !regCity || !regCountry) {
      setAuthError('Please enter Name, Phone, Street, City, and Country.');
      return;
    }
    setOtpLoading(true);
    setAuthError('');
    try {
      const response = await sendVerificationOtp(email, 'sign-in');
      if (response.error) {
        setAuthError(response.error.message || 'Failed to send OTP code.');
      } else {
        setOtpSent(true);
        setShowRegFields(false);
        setAuthMessage('Verification code sent. Enter the code below to complete registration.');
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
      const response = await signInWithOtp(
        email,
        otpCode,
        isNewUser ? regName : undefined,
        isNewUser ? regPhone : undefined,
        isNewUser ? regAddress : undefined
      );
      if (response.error) {
        setAuthError(response.error.message || 'Invalid code.');
      } else {
        if (isNewUser && regName && regPhone && regAddress && regCity) {
          await createUserAddress({
            street: regAddress,
            city: regCity,
            country: regCountry,
            label: 'home',
          });
        }
        setOtpSent(false);
        setOtpCode('');
        setIsNewUser(false);
        setAuthMessage('Successfully signed in.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'An error occurred.');
    } finally {
      setOtpLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Address Handlers
  // ─────────────────────────────────────────────────────────────────────────
  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.city || !newAddress.country) {
      setAuthError('Street, City, and Country are required.');
      return;
    }
    setAddingAddress(true);
    setAuthError('');
    try {
      const created = await createUserAddress(newAddress);
      if (created) {
        setSavedAddresses((prev) => [created, ...prev]);
        setSelectedAddressId(created.id);
        setShowAddAddressForm(false);
        setNewAddress({ street: '', city: '', state: '', postalCode: '', country: 'United States', label: 'home' });
      } else {
        setAuthError('Failed to save address. Please try again.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'An error occurred.');
    } finally {
      setAddingAddress(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Proceed to Payment — creates Stripe PaymentIntent
  // ─────────────────────────────────────────────────────────────────────────
  const handleProceedToPayment = async () => {
    setPaymentError('');

    // Validation: must be signed in
    if (!sessionData?.user) {
      setAuthError('Please sign in to continue.');
      return;
    }

    // Validation: must have an address selected
    let finalAddressId = selectedAddressId;

    if (!finalAddressId && savedAddresses.length === 0) {
      // No saved address AND no address selected — prompt guest form logic
      if (!guestAddress.street || !guestAddress.city) {
        setAuthError('Please provide a delivery address.');
        return;
      }
      // Create an address from the guest form
      setIntentLoading(true);
      try {
        const created = await createUserAddress({
          street: guestAddress.street,
          city: guestAddress.city,
          postalCode: guestAddress.postalCode,
          country: guestAddress.country,
          label: 'home',
        });
        if (!created) throw new Error('Failed to save address.');
        finalAddressId = created.id;
        setSavedAddresses([created]);
        setSelectedAddressId(created.id);
      } catch (err: any) {
        setPaymentError(err.message);
        setIntentLoading(false);
        return;
      }
    }

    if (!finalAddressId) {
      setPaymentError('Please select a delivery address.');
      return;
    }

    setIntentLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        size: item.selectedSize,
        price: item.product.price,
      }));

      const result = await createPaymentIntent({
        addressId: finalAddressId,
        subtotal,
        shippingCost,
        estimatedTax,
        grandTotal,
        items: orderItems,
      });

      if (!result?.clientSecret) throw new Error('Failed to initialise payment.');
      setClientSecret(result.clientSecret);
      setCheckoutStep('payment');
    } catch (err: any) {
      setPaymentError(err.message || 'Failed to initialise payment. Please try again.');
    } finally {
      setIntentLoading(false);
    }
  };

  // Called after Stripe redirects back (handled in order-success page)
  const handlePaymentSuccess = () => {
    clearCart();
    router.push('/order-success');
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Empty cart guard
  // ─────────────────────────────────────────────────────────────────────────
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

  const stripeAppearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0a0a0a',
      colorBackground: '#fafafa',
      colorText: '#0a0a0a',
      colorDanger: '#c62828',
      fontFamily: '"Inter", system-ui, sans-serif',
      borderRadius: '0px',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': {
        border: '1px solid #e0e0e0',
        boxShadow: 'none',
        fontSize: '13px',
        padding: '12px 14px',
      },
      '.Input:focus': {
        border: '1px solid #0a0a0a',
        boxShadow: 'none',
      },
      '.Label': {
        fontSize: '10px',
        fontWeight: '600',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      },
    },
  };

  return (
    <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop select-none">
      <h1 className="sr-only">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* ── Left Panel ────────────────────────────────────────────────── */}
        <div className="lg:col-span-7 space-y-12">

          {/* ── 01 / CONTACT ─────────────────────────────────────────────── */}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={!!sessionData || otpSent}
                  />
                </div>
                {!sessionData && !otpSent && !showRegFields && (
                  <div className="pb-1">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading}
                      className="w-full border border-outline-variant hover:border-primary text-primary py-3 font-label-caps text-[10px] uppercase tracking-widest cursor-pointer transition-colors"
                    >
                      {otpLoading ? 'CHECKING...' : 'CONTINUE'}
                    </button>
                  </div>
                )}
              </div>

              {/* New user registration fields */}
              {showRegFields && !sessionData && (
                <div className="space-y-4 p-4 border border-outline-variant/30 bg-surface-container-lowest">
                  <div className="space-y-1">
                    <h3 className="font-label-caps text-[10px] text-primary">NEW ATELIER ACCOUNT</h3>
                    <p className="text-[11px] text-on-surface-variant">Please provide your details to register.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Full Name" id="regName" type="text" placeholder="John Doe" value={regName} onChange={(e) => setRegName(e.target.value)} required />
                    <Input label="Phone Number" id="phone" type="tel" placeholder="+1 (555) 000-0000" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} required />
                  </div>
                  <Input label="Street Address" id="regStreet" type="text" placeholder="123 Street Name" value={regAddress} onChange={(e) => setRegAddress(e.target.value)} required />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="City" id="regCity" type="text" placeholder="Kyoto" value={regCity} onChange={(e) => setRegCity(e.target.value)} required />
                    <Input label="Country" id="regCountry" type="text" placeholder="Japan" value={regCountry} onChange={(e) => setRegCountry(e.target.value)} required />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button type="button" onClick={() => setShowRegFields(false)} className="border border-outline-variant hover:bg-surface-container text-primary px-4 py-2 text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors">
                      Cancel
                    </button>
                    <button type="button" onClick={handleRegisterAndSendOtp} disabled={otpLoading} className="flex-1 bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest cursor-pointer hover:opacity-90 transition-opacity">
                      {otpLoading ? 'SENDING...' : 'SEND CODE & REGISTER'}
                    </button>
                  </div>
                </div>
              )}

              {/* OTP verification */}
              {otpSent && !sessionData && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end pt-2 bg-surface-container-lowest p-4 border border-outline-variant/20">
                  <div className="sm:col-span-2">
                    <Input label="6-Digit Verification Code" id="otpCode" type="text" maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="Enter verification code" required />
                  </div>
                  <div className="pb-1">
                    <button type="button" onClick={handleVerifyOtp} disabled={otpLoading || !otpCode} className="w-full bg-primary text-on-primary py-3 font-label-caps text-[10px] uppercase tracking-widest cursor-pointer transition-colors">
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

          {/* ── 02 / DELIVERY ADDRESS ─────────────────────────────────────── */}
          <section className="space-y-6">
            <h2 className="font-label-caps text-label-caps text-primary border-b border-outline-variant/30 pb-2">
              02 / DELIVERY ADDRESS
            </h2>

            {sessionData && savedAddresses.length > 0 ? (
              /* Authenticated — show saved address cards */
              <div className="space-y-3">
                {savedAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    htmlFor={`addr-${addr.id}`}
                    className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-primary bg-surface-container-low'
                        : 'border-outline-variant/30 hover:border-outline-variant bg-transparent'
                    }`}
                  >
                    <input
                      id={`addr-${addr.id}`}
                      type="radio"
                      name="deliveryAddress"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-0.5 accent-black"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-label-caps uppercase border ${labelColors[addr.label] || labelColors.other}`}>
                          {addr.label}
                        </span>
                      </div>
                      <p className="text-sm text-primary font-sans leading-snug">
                        {addr.street}
                        {addr.city && `, ${addr.city}`}
                        {addr.state && `, ${addr.state}`}
                        {addr.postalCode && ` ${addr.postalCode}`}
                      </p>
                      <p className="text-xs text-on-surface-variant font-sans">{addr.country}</p>
                    </div>
                  </label>
                ))}

                {/* Add new address toggle */}
                {!showAddAddressForm ? (
                  <button
                    type="button"
                    onClick={() => setShowAddAddressForm(true)}
                    className="w-full border border-dashed border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary py-3 text-xs font-label-caps uppercase tracking-widest transition-colors"
                  >
                    + ADD NEW ADDRESS
                  </button>
                ) : (
                  <div className="p-4 border border-outline-variant/30 space-y-4 bg-surface-container-lowest">
                    <h3 className="font-label-caps text-[10px] text-primary">NEW ADDRESS</h3>
                    <Input label="Street Address" id="newStreet" value={newAddress.street} onChange={(e) => setNewAddress((p) => ({ ...p, street: e.target.value }))} required />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="City" id="newCity" value={newAddress.city} onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))} required />
                      <Input label="State / Region" id="newState" value={newAddress.state} onChange={(e) => setNewAddress((p) => ({ ...p, state: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Postal Code" id="newPostal" value={newAddress.postalCode} onChange={(e) => setNewAddress((p) => ({ ...p, postalCode: e.target.value }))} />
                      <Input label="Country" id="newCountry" value={newAddress.country} onChange={(e) => setNewAddress((p) => ({ ...p, country: e.target.value }))} required />
                    </div>
                    <div className="space-y-1">
                      <p className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest">Label</p>
                      <div className="flex gap-2">
                        {(['home', 'work', 'other'] as const).map((l) => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => setNewAddress((p) => ({ ...p, label: l }))}
                            className={`px-3 py-1.5 text-[9px] font-label-caps uppercase border transition-colors ${
                              newAddress.label === l
                                ? 'bg-primary text-on-primary border-primary'
                                : 'border-outline-variant text-on-surface-variant hover:border-primary'
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setShowAddAddressForm(false)} className="border border-outline-variant text-primary px-4 py-2 text-xs uppercase tracking-widest hover:bg-surface-container transition-colors">
                        Cancel
                      </button>
                      <button type="button" onClick={handleAddAddress} disabled={addingAddress} className="flex-1 bg-primary text-on-primary py-2 text-xs font-label-caps uppercase tracking-widest hover:opacity-90 transition-opacity">
                        {addingAddress ? 'SAVING...' : 'SAVE ADDRESS'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : sessionData && savedAddresses.length === 0 ? (
              /* Authenticated but no saved addresses — show inline add form */
              <div className="space-y-4">
                <p className="text-xs text-on-surface-variant font-sans">
                  No saved addresses found. Please add one to continue.
                </p>
                <Input label="Street Address" id="newStreet" value={newAddress.street} onChange={(e) => setNewAddress((p) => ({ ...p, street: e.target.value }))} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" id="newCity" value={newAddress.city} onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))} required />
                  <Input label="Postal Code" id="newPostal" value={newAddress.postalCode} onChange={(e) => setNewAddress((p) => ({ ...p, postalCode: e.target.value }))} />
                </div>
                <Input label="Country" id="newCountry" value={newAddress.country} onChange={(e) => setNewAddress((p) => ({ ...p, country: e.target.value }))} required />
                <div className="space-y-1">
                  <p className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest">Label</p>
                  <div className="flex gap-2">
                    {(['home', 'work', 'other'] as const).map((l) => (
                      <button key={l} type="button" onClick={() => setNewAddress((p) => ({ ...p, label: l }))} className={`px-3 py-1.5 text-[9px] font-label-caps uppercase border transition-colors ${newAddress.label === l ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Guest — simple address form */
              <div className="space-y-4">
                <Input label="Street Address" id="guestStreet" value={guestAddress.street} onChange={(e) => setGuestAddress((p) => ({ ...p, street: e.target.value }))} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="City" id="guestCity" value={guestAddress.city} onChange={(e) => setGuestAddress((p) => ({ ...p, city: e.target.value }))} required />
                  <Input label="Postal Code" id="guestPostal" value={guestAddress.postalCode} onChange={(e) => setGuestAddress((p) => ({ ...p, postalCode: e.target.value }))} />
                </div>
                <Input label="Country" id="guestCountry" value={guestAddress.country} onChange={(e) => setGuestAddress((p) => ({ ...p, country: e.target.value }))} required />
              </div>
            )}
          </section>

          {/* ── 03 / PAYMENT ─────────────────────────────────────────────── */}
          <section className="space-y-6">
            <h2 className="font-label-caps text-label-caps text-primary border-b border-outline-variant/30 pb-2">
              03 / PAYMENT METHOD
            </h2>

            {paymentError && (
              <div className="p-3 bg-error/10 border border-error/20 text-error text-xs font-sans">
                {paymentError}
              </div>
            )}

            {checkoutStep === 'address' ? (
              /* Show "Proceed to Payment" button until PaymentIntent is ready */
              <div className="space-y-3">
                <p className="text-xs text-on-surface-variant font-sans">
                  Your payment is securely processed by Stripe. We accept all major cards, Apple Pay, and Google Pay.
                </p>
                <div className="flex gap-2 text-on-surface-variant/50">
                  {/* Card logos placeholder */}
                  {['VISA', 'MC', 'AMEX', 'APPLE PAY'].map((brand) => (
                    <span key={brand} className="text-[8px] font-bold px-2 py-1 border border-outline-variant/20 tracking-wider">{brand}</span>
                  ))}
                </div>
                <div className="pt-2">
                  {sessionData ? (
                    <Button
                      variant="primary"
                      fullWidth
                      type="button"
                      disabled={intentLoading || (!selectedAddressId && savedAddresses.length > 0)}
                      onClick={handleProceedToPayment}
                    >
                      {intentLoading ? 'PREPARING PAYMENT...' : 'PROCEED TO PAYMENT'}
                    </Button>
                  ) : (
                    <p className="text-xs text-on-surface-variant/70 font-sans text-center">
                      Please sign in above to continue to payment.
                    </p>
                  )}
                </div>
              </div>
            ) : clientSecret ? (
              /* Stripe Elements Payment Form */
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: stripeAppearance,
                }}
              >
                <StripePaymentForm
                  grandTotal={grandTotal}
                  currency={currency}
                  onSuccess={handlePaymentSuccess}
                  onError={setPaymentError}
                />
              </Elements>
            ) : null}
          </section>
        </div>

        {/* ── Right: Order Summary ───────────────────────────────────────── */}
        <aside className="lg:col-span-5 bg-surface-container-low p-8 border border-outline-variant/30 space-y-6 lg:sticky lg:top-32">
          <h2 className="font-label-caps text-label-caps text-primary pb-2 border-b border-outline-variant/30">
            ORDER PREVIEW
          </h2>

          {/* Cart items */}
          <div className="divide-y divide-outline-variant/20 max-h-[300px] overflow-y-auto pr-2">
            {cart.filter((item) => item && item.product).map((item) => (
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

          {/* Totals */}
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
              <span>Estimated Tax (8%)</span>
              <span className="text-primary">{currency}{estimatedTax.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-outline-variant/30 pt-4 flex justify-between items-baseline">
            <span className="font-label-caps text-label-caps text-primary">TOTAL</span>
            <span className="font-headline-md text-2xl text-primary">
              {currency}{grandTotal.toFixed(2)}
            </span>
          </div>

          {/* Selected delivery address preview */}
          {sessionData && selectedAddressId && (
            <div className="border-t border-outline-variant/30 pt-4 space-y-1">
              <p className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest">Delivering To</p>
              {(() => {
                const addr = savedAddresses.find((a) => a.id === selectedAddressId);
                if (!addr) return null;
                return (
                  <p className="text-xs text-primary font-sans leading-relaxed">
                    {addr.street}, {addr.city}{addr.state ? `, ${addr.state}` : ''}{addr.postalCode ? ` ${addr.postalCode}` : ''}<br />{addr.country}
                  </p>
                );
              })()}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
