'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function HeaderWrapper() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <Navbar />;
}

export function FooterWrapper() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <Footer />;
}
