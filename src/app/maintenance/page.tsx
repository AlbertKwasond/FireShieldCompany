import React from 'react';
import { getPublicSettings } from '@/app/actions/settingsActions';
import { ShieldAlert, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Site Under Maintenance | Fire Shield Company Limited',
  description: 'Our website is currently undergoing scheduled maintenance.',
};

export default async function MaintenancePage() {
  const settings = await getPublicSettings();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '3rem 2rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
        
        <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', marginBottom: '1.5rem' }}>
          <ShieldAlert size={40} />
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
          System Maintenance
        </h1>
        
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          We are currently performing scheduled maintenance to improve our platform. We will be back online shortly. Thank you for your patience.
        </p>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginTop: '2rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600, fontFamily: 'var(--font-heading)', textAlign: 'center' }}>
            Contact Us In The Meantime
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {settings?.phoneNumber && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                <div style={{ color: 'var(--primary)', flexShrink: 0 }}><Phone size={20} /></div>
                <span>{settings.phoneNumber}</span>
              </div>
            )}
            
            {settings?.contactEmail && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                <div style={{ color: 'var(--primary)', flexShrink: 0 }}><Mail size={20} /></div>
                <a href={`mailto:${settings.contactEmail}`} style={{ color: 'inherit', textDecoration: 'none' }} className="hover-primary">{settings.contactEmail}</a>
              </div>
            )}
            
            {settings?.address && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', color: 'var(--text-muted)' }}>
                <div style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }}><MapPin size={20} /></div>
                <span>{settings.address}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <Link href="/admin/login" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s ease' }}>
            Admin Access
          </Link>
        </div>
      </div>
    </div>
  );
}
