'use client';

import React from 'react';
import Image from 'next/image';
import { User, Mail, Shield, CheckCircle2 } from 'lucide-react';

type UserLivePreviewProps = {
  name: string;
  email: string;
  role: string;
  status: string;
  avatarSrc: string;
};

export default function UserLivePreview({
  name,
  email,
  role,
  status,
  avatarSrc,
}: UserLivePreviewProps) {
  // Use a fallback avatar logic if none is provided
  const initials = name ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  return (
    <div className="admin-preview-pane">
      <div className="admin-preview-header">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={18} />
          Live Preview
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.25rem' }}>
          See how the user profile will appear in the system.
        </p>
      </div>

      <div className="admin-preview-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--admin-bg-alt)', border: '4px solid var(--admin-card-bg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={name || 'User Avatar'}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized={avatarSrc.startsWith('blob:')}
            />
          ) : (
            <span style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--admin-text-muted)' }}>
              {initials}
            </span>
          )}
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--admin-text-main)', marginTop: '1.5rem' }}>
          {name || 'New User'}
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem' }}>
          <Mail size={14} />
          <span>{email || 'user@example.com'}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <span className={`admin-badge ${role === 'Super Admin' ? 'admin-badge-neutral' : 'admin-badge-warning'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: role === 'Super Admin' ? '#f1f5f9' : '#f0fdfa', color: role === 'Super Admin' ? '#475569' : '#0f766e' }}>
            <Shield size={12} />
            {role || 'Viewer'}
          </span>
          <span className={`admin-badge ${status === 'Active' ? 'admin-badge-success' : 'admin-badge-neutral'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <CheckCircle2 size={12} />
            {status || 'Active'}
          </span>
        </div>
      </div>
    </div>
  );
}
