'use client';

import React, { useState, useTransition } from 'react';
import { updateNotificationSettings } from '@/app/actions/settingsActions';
import { toast } from 'sonner';

export default function NotificationSettingsForm({ initialSettings, fallbackEmail }: { initialSettings: any, fallbackEmail: string }) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    emailNotifications: initialSettings.emailNotifications,
    securityAlerts: initialSettings.securityAlerts,
    systemNotifications: initialSettings.systemNotifications,
    notificationEmail: initialSettings.notificationEmail || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    startTransition(async () => {
      try {
        const result = await updateNotificationSettings(formData);
        if (result.success) {
          toast.success('Notification settings updated successfully');
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
        Configure how and when you receive system alerts and notifications.
      </p>

      <div className="admin-form-group">
        <label className="admin-label">General Notifications</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input 
            type="checkbox" 
            name="emailNotifications"
            checked={formData.emailNotifications}
            onChange={handleChange}
          />
          <span style={{ fontSize: '0.9rem' }}>Enable email notifications</span>
        </div>
      </div>

      <div className="admin-form-group">
        <label className="admin-label">Security Alerts</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input 
            type="checkbox" 
            name="securityAlerts"
            checked={formData.securityAlerts}
            onChange={handleChange}
            disabled={!formData.emailNotifications}
          />
          <span style={{ fontSize: '0.9rem', opacity: formData.emailNotifications ? 1 : 0.5 }}>Email me when a new device logs into an admin account</span>
        </div>
      </div>

      <div className="admin-form-group">
        <label className="admin-label">System Notifications</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input 
            type="checkbox" 
            name="systemNotifications"
            checked={formData.systemNotifications}
            onChange={handleChange}
            disabled={!formData.emailNotifications}
          />
          <span style={{ fontSize: '0.9rem', opacity: formData.emailNotifications ? 1 : 0.5 }}>Receive weekly summary reports</span>
        </div>
      </div>

      <div className="admin-form-group">
        <label className="admin-label">Notification Email Address</label>
        <input 
          type="email" 
          name="notificationEmail"
          className="admin-input" 
          value={formData.notificationEmail}
          onChange={handleChange}
          placeholder={fallbackEmail}
          disabled={!formData.emailNotifications}
        />
        <small style={{ color: 'var(--admin-text-muted)', marginTop: '0.25rem', display: 'block' }}>
          Leave blank to use the primary contact email ({fallbackEmail}).
        </small>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <button 
          type="submit" 
          className="admin-btn admin-btn-primary" 
          disabled={isPending}
        >
          {isPending ? 'Saving...' : 'Save Notification Settings'}
        </button>
      </div>
    </form>
  );
}
