'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div className="admin-login-wrapper">{children}</div>;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main-wrapper">
        <AdminTopbar />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
