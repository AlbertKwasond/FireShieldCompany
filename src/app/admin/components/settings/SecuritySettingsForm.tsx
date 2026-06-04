'use client';

import React, { useState, useTransition } from 'react';
import { updateSecuritySettings } from '@/app/actions/settingsActions';
import { toast } from 'sonner';

export default function SecuritySettingsForm({ initialSettings }: { initialSettings: any }) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    passwordMinLength: initialSettings.passwordMinLength,
    requireSpecialChar: initialSettings.requireSpecialChar,
    sessionTimeoutMins: initialSettings.sessionTimeoutMins,
    enable2FA: initialSettings.enable2FA,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;
    if (type === 'checkbox') {
      val = (e.target as HTMLInputElement).checked;
    } else if (type === 'number' || name === 'sessionTimeoutMins') {
      val = parseInt(value, 10);
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    startTransition(async () => {
      try {
        const result = await updateSecuritySettings(formData);
        if (result.success) {
          toast.success('Security settings updated successfully');
        } else {
          toast.error(result.error || 'Failed to update settings');
        }
      } catch (err) {
        toast.error('An unexpected error occurred');
      }
    });
  };

  return (
    <form onSubmit={handleSave}>
      <p style={{ color: 'var(--admin-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Manage the security settings for the platform. Additional authentication features will be available in a future update.
      </p>
      
      <div className="admin-form-group">
        <label className="admin-label">Require Strong Passwords</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input 
            type="checkbox" 
            name="requireSpecialChar"
            checked={formData.requireSpecialChar}
            onChange={handleChange}
          />
          <span style={{ fontSize: '0.9rem' }}>Enforce minimum {formData.passwordMinLength} characters, uppercase, and symbols for all user accounts</span>
        </div>
      </div>
      
      <div className="admin-form-group">
        <label className="admin-label">Minimum Password Length</label>
        <input 
          type="number"
          name="passwordMinLength"
          className="admin-input"
          min="8"
          max="32"
          value={formData.passwordMinLength}
          onChange={handleChange}
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-label">Session Timeout</label>
        <select 
          name="sessionTimeoutMins"
          className="admin-select" 
          value={formData.sessionTimeoutMins.toString()}
          onChange={handleChange}
        >
          <option value="15">15 Minutes</option>
          <option value="30">30 Minutes</option>
          <option value="60">1 Hour</option>
          <option value="120">2 Hours</option>
        </select>
      </div>

      <div style={{ marginTop: '2rem', borderTop: '1px solid var(--admin-border)', paddingTop: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>Two-Factor Authentication (2FA)</h3>
        <div style={{ padding: '1rem', backgroundColor: 'var(--admin-bg)', borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 500 }}>Enable 2FA</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Require a verification code in addition to password for all admin accounts.</div>
            </div>
            <div 
              onClick={() => {
                setFormData((prev) => ({ ...prev, enable2FA: !prev.enable2FA }));
              }}
              style={{ 
                width: 44, 
                height: 24, 
                backgroundColor: formData.enable2FA ? 'var(--admin-primary)' : 'var(--admin-border)', 
                borderRadius: 999, 
                position: 'relative', 
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
            >
              <div style={{ 
                width: 20, 
                height: 20, 
                backgroundColor: 'white', 
                borderRadius: '50%', 
                position: 'absolute', 
                top: 2, 
                left: formData.enable2FA ? 22 : 2, 
                boxShadow: 'var(--admin-shadow-sm)',
                transition: 'left 0.2s ease'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <button 
          type="submit" 
          className="admin-btn admin-btn-primary" 
          disabled={isPending}
        >
          {isPending ? 'Saving...' : 'Save Security Settings'}
        </button>
      </div>
    </form>
  );
}
