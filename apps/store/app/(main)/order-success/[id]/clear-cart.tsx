'use client';

import React, { useEffect } from 'react';
import { useStore } from '../../../../lib/context/store-context';

export default function ClearCart() {
  const { clearCart } = useStore();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
