'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Button from '../../../components/shared/button';
import Input from '../../../components/shared/input';
import { useSession, signOutUser, fetchUserAddresses, createUserAddress, deleteUserAddress, Address, updateUserProfile } from '../../../lib/api';

export default function AccountPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: sessionData, isPending } = useSession();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [isEditing, setEditing] = useState(false);

  // Address states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('United States');
  const [newLabel, setNewLabel] = useState('home'); // 'home' | 'work' | 'other'

  useEffect(() => {
    if (sessionData?.user) {
      setProfile((prev) => ({
        ...prev,
        name: sessionData.user.name || '',
        email: sessionData.user.email || '',
        phone: (sessionData.user as any).phoneNumber || '',
      }));
      // Fetch saved addresses
      loadAddresses();
    }
  }, [sessionData]);

  const loadAddresses = async () => {
    setAddressLoading(true);
    const data = await fetchUserAddresses();
    setAddresses(data);
    setAddressLoading(false);
  };

  const handleSignOut = async () => {
    await signOutUser();
    router.push('/login');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateUserProfile({
        name: profile.name,
        phoneNumber: profile.phone,
      });
      if (response?.error) {
        alert(response.error.message || 'Failed to update details');
      } else {
        setEditing(false);
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newCountry) return;

    const newAddr = await createUserAddress({
      street: newStreet,
      city: newCity,
      country: newCountry,
      label: newLabel,
    });

    if (newAddr) {
      setAddresses((prev) => [newAddr, ...prev]);
      setNewStreet('');
      setNewCity('');
      setNewCountry('United States');
      setNewLabel('home');
      setShowAddForm(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const success = await deleteUserAddress(id);
    if (success) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    }
  };

  if (isPending) {
    return (
      <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop text-center select-none">
        <h1 className="font-label-caps text-label-caps text-on-surface-variant animate-pulse">
          LOADING PROFILE...
        </h1>
      </main>
    );
  }

  if (!sessionData) {
    return null;
  }

  const accountTabs = [
    { name: 'PROFILE', href: '/account' },
    { name: 'ORDERS', href: '/account/orders' },
    { name: 'WISHLIST', href: '/account/wishlist' },
  ];

  return (
    <main className="pt-32 pb-section-gap max-w-[1440px] mx-auto px-6 md:px-margin-desktop select-none">
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-unit-sm mb-12">
        <h1 className="font-display-xl text-4xl md:text-headline-lg uppercase text-primary">MY ACCOUNT</h1>
      </div>

      {/* Account Tabs */}
      <div className="flex space-x-8 border-b border-outline-variant/20 pb-4 mb-12 font-label-caps text-label-caps">
        {accountTabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`transition-colors cursor-pointer border-b-2 pb-2 -mb-[18px] ${
                isActive ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Profile Details Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
        {/* Profile Card Info */}
        <div className="md:col-span-8 space-y-12">
          
          {/* Personal Profile Details */}
          <div className="bg-surface-container-low p-8 border border-outline-variant/30 space-y-6">
            <div className="flex justify-between items-baseline border-b border-outline-variant/20 pb-4">
              <h2 className="font-label-caps text-label-caps text-primary">PERSONAL PROFILE</h2>
              <div className="flex gap-4">
                {!isEditing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="font-label-caps text-[10px] text-on-surface-variant hover:text-primary underline cursor-pointer"
                  >
                    EDIT DETAILS
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="font-label-caps text-[10px] text-error hover:opacity-85 underline cursor-pointer"
                >
                  SIGN OUT
                </button>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email Address"
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                    disabled
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Phone Number"
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="font-label-caps text-[10px] text-on-surface-variant hover:text-primary cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <Button variant="primary" type="submit">
                    SAVE CHANGES
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-sans text-sm text-on-surface-variant">
                <div className="space-y-1">
                  <span className="font-label-caps text-[10px] text-primary block">FULL NAME</span>
                  <p className="text-primary font-medium">{profile.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-label-caps text-[10px] text-primary block">EMAIL ADDRESS</span>
                  <p className="text-primary font-medium">{profile.email}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="font-label-caps text-[10px] text-primary block">PHONE NUMBER</span>
                  <p className="text-primary font-medium">{profile.phone}</p>
                </div>
              </div>
            )}
          </div>

          {/* Address Book Card */}
          <div className="bg-surface-container-low p-8 border border-outline-variant/30 space-y-6">
            <div className="flex justify-between items-baseline border-b border-outline-variant/20 pb-4">
              <h2 className="font-label-caps text-label-caps text-primary">ADDRESS BOOK</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="font-label-caps text-[10px] text-on-surface-variant hover:text-primary underline cursor-pointer"
              >
                {showAddForm ? 'CANCEL' : 'ADD NEW ADDRESS'}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddAddress} className="space-y-6 bg-surface-container-lowest p-6 border border-outline-variant/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Street Address"
                    id="newStreet"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder="123 Atelier Street"
                    required
                  />
                  <Input
                    label="City"
                    id="newCity"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Kyoto"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Country"
                    id="newCountry"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    placeholder="Japan"
                    required
                  />
                  <div>
                    <label htmlFor="newLabel" className="block text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                      Address Label
                    </label>
                    <select
                      id="newLabel"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      className="w-full bg-transparent border-b border-outline-variant py-2.5 text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button variant="primary" type="submit">
                    SAVE ADDRESS
                  </Button>
                </div>
              </form>
            )}

            {addressLoading ? (
              <p className="font-sans text-xs text-on-surface-variant animate-pulse">LOADING ADDRESSES...</p>
            ) : addresses.length === 0 ? (
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                No saved addresses found. Add a delivery address to expedite your checkout process.
              </p>
            ) : (
              <div className="divide-y divide-outline-variant/20 font-sans text-sm text-on-surface-variant">
                {addresses.map((addr) => (
                  <div key={addr.id} className="py-4 flex justify-between items-start first:pt-0 last:pb-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-label-caps text-[9px] bg-primary text-on-primary px-2 py-0.5 font-bold tracking-wider select-none uppercase">
                          {addr.label}
                        </span>
                        <span className="text-primary font-medium text-xs">
                          {addr.street}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant pl-0.5">
                        {addr.city}, {addr.country}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="font-label-caps text-[9px] text-on-surface-variant hover:text-error hover:underline cursor-pointer select-none"
                    >
                      DELETE
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Info panel */}
        <aside className="md:col-span-4 bg-surface-container-low p-8 border border-outline-variant/30 space-y-6">
          <h2 className="font-label-caps text-label-caps text-primary border-b border-outline-variant/20 pb-4">
            MEMBERSHIP ATELIER
          </h2>
          <div className="font-sans text-sm space-y-4 text-on-surface-variant leading-relaxed">
            <p>
              Status: <span className="text-primary font-bold">Mainline Archive tier</span>
            </p>
            <p>
              Thank you for supporting Caguei. You receive early access invitation catalogs and complimentary repair services for all outerwear.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
