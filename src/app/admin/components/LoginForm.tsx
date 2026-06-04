'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, setup2FA, verify2FALogin } from '@/app/actions/authActions';
import { toast } from 'sonner';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State variables for 2FA flow
  const [step, setStep] = useState<'LOGIN' | 'SETUP_2FA' | 'VERIFY_2FA'>('LOGIN');
  const [tempToken, setTempToken] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [tempSecret, setTempSecret] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await loginUser(formData);
      
      if (result.error) {
        toast.error(result.error);
        setLoading(false);
      } else if (result.setup2FA) {
        setTempToken(result.tempToken!);
        setQrCodeData(result.qrCode!);
        setTempSecret(result.tempSecret!);
        setStep('SETUP_2FA');
        setLoading(false);
      } else if (result.requires2FA) {
        setTempToken(result.tempToken!);
        setStep('VERIFY_2FA');
        setLoading(false);
      } else if (result.success) {
        toast.success('Login successful. Redirecting...');
        router.push('/admin');
        router.refresh();
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (step === 'SETUP_2FA') {
        result = await setup2FA(tempToken, tempSecret, twoFactorCode);
      } else {
        result = await verify2FALogin(tempToken, twoFactorCode);
      }

      if (result.error) {
        toast.error(result.error);
        setLoading(false);
      } else if (result.success) {
        toast.success('Login successful. Redirecting...');
        router.push('/admin');
        router.refresh();
      }
    } catch (error) {
      toast.error('An unexpected error occurred during 2FA verification.');
      setLoading(false);
    }
  };

  if (step === 'SETUP_2FA') {
    return (
      <form onSubmit={handle2FASubmit} className="admin-login-form">
        <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 600 }}>Set Up Two-Factor Authentication</h3>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Scan the QR code below with your authenticator app (e.g., Google Authenticator, Authy) and enter the 6-digit code to complete setup.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {qrCodeData && (
            <img 
              src={qrCodeData} 
              alt="2FA QR Code" 
              style={{ width: '200px', height: '200px', borderRadius: 'var(--radius-md)', padding: '0.5rem', backgroundColor: '#fff' }} 
            />
          )}
        </div>

        <div className="admin-form-group">
          <label htmlFor="code" className="admin-label">Verification Code</label>
          <input 
            type="text" 
            id="code" 
            name="code" 
            className="admin-input" 
            placeholder="000000" 
            required 
            maxLength={6}
            pattern="\d{6}"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.2rem' }}
          />
        </div>

        <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify and Complete Setup'}
        </button>
        <button type="button" className="admin-btn" style={{ marginTop: '0.5rem', width: '100%' }} onClick={() => setStep('LOGIN')}>
          Cancel
        </button>
      </form>
    );
  }

  if (step === 'VERIFY_2FA') {
    return (
      <form onSubmit={handle2FASubmit} className="admin-login-form">
        <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 600 }}>Two-Factor Authentication Required</h3>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Enter the 6-digit verification code from your authenticator app.
        </p>

        <div className="admin-form-group">
          <label htmlFor="code" className="admin-label">Verification Code</label>
          <input 
            type="text" 
            id="code" 
            name="code" 
            className="admin-input" 
            placeholder="000000" 
            required 
            maxLength={6}
            pattern="\d{6}"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.2rem' }}
          />
        </div>

        <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
        <button type="button" className="admin-btn" style={{ marginTop: '0.5rem', width: '100%' }} onClick={() => setStep('LOGIN')}>
          Cancel
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleLoginSubmit} className="admin-login-form">
      <div className="admin-form-group">
        <label htmlFor="email" className="admin-label">Email Address</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          className="admin-input" 
          placeholder="admin@fireshield.com" 
          required 
        />
      </div>

      <div className="admin-form-group">
        <label htmlFor="password" className="admin-label">Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          className="admin-input" 
          placeholder="••••••••" 
          required 
        />
      </div>

      <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
        {loading ? 'Authenticating...' : 'Sign In'}
      </button>
    </form>
  );
}
