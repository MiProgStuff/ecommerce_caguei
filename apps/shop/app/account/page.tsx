'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '../../components/shared/button';
import Input from '../../components/shared/input';

export default function AccountPage() {
  const pathname = usePathname();

  const [profile, setProfile] = useState({
    name: 'Soumya Mishra',
    email: 'soumya@example.com',
    phone: '+1 (555) 019-2834',
    address: '142 Kyoto Atelier Way',
    city: 'Kyoto',
    postalCode: '600-8216',
    country: 'Japan',
  });

  const [isEditing, setEditing] = useState(false);

  const accountTabs = [
    { name: 'PROFILE', href: '/account' },
    { name: 'ORDERS', href: '/account/orders' },
    { name: 'WISHLIST', href: '/account/wishlist' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
  };

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
        <div className="md:col-span-8 bg-surface-container-low p-8 border border-outline-variant/30 space-y-6">
          <div className="flex justify-between items-baseline border-b border-outline-variant/20 pb-4">
            <h2 className="font-label-caps text-label-caps text-primary">PERSONAL PROFILE</h2>
            {!isEditing && (
              <button
                onClick={() => setEditing(true)}
                className="font-label-caps text-[10px] text-on-surface-variant hover:text-primary underline cursor-pointer"
              >
                EDIT DETAILS
              </button>
            )}
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
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
                <Input
                  label="Address Line"
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Input
                  label="City"
                  id="city"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                />
                <Input
                  label="Postal Code"
                  id="postalCode"
                  value={profile.postalCode}
                  onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                />
                <Input
                  label="Country"
                  id="country"
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
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
              <div className="space-y-1">
                <span className="font-label-caps text-[10px] text-primary block">PHONE NUMBER</span>
                <p className="text-primary font-medium">{profile.phone}</p>
              </div>
              <div className="space-y-1">
                <span className="font-label-caps text-[10px] text-primary block">DEFAULT ADDRESS</span>
                <p className="text-primary font-medium">
                  {profile.address}, {profile.city}, {profile.postalCode}, {profile.country}
                </p>
              </div>
            </div>
          )}
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
