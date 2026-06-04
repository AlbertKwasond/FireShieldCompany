import React from 'react';
import AdminLayoutWrapper from './components/AdminLayoutWrapper';
import { Toaster } from 'sonner';
import './admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminLayoutWrapper>
        {children}
      </AdminLayoutWrapper>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            fontFamily: 'var(--admin-font)',
            borderRadius: 'var(--admin-radius-sm)',
          },
        }}
      />
    </>
  );
}
