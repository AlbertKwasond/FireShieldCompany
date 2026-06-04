import React from 'react';
import LoginForm from '../components/LoginForm';

export const metadata = {
  title: 'Admin Login | Fire Shield Company Limited',
  description: 'Secure admin login for Fire Shield Company Limited.',
};

export default function AdminLoginPage() {
  return (
    <div className="admin-login-container">
      <div className="admin-login-header">
        <h1 className="admin-login-logo">
          <span>FS</span> Fire Shield
        </h1>
        <p className="admin-login-subtitle">Sign in to the Admin Dashboard</p>
      </div>
      
      <LoginForm />
    </div>
  );
}
