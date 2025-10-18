// components/providers/ClientProvider.tsx
'use client';

import { CartProvider } from './CartProvider';

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}