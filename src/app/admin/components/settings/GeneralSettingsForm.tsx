'use client';

import React, { useState, useTransition } from 'react';
import { updateSettings } from '@/app/actions/settingsActions';
import { toast } from 'sonner';

export default function GeneralSettingsForm({ initialSettings }: { initialSettings: any }) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    siteName: initialSettings.siteName,
    contactEmail: initialSettings.contactEmail,
    phoneNumber: initialSettings.phoneNumber || '',
    address: initialSettings.address || '',
    timezone: initialSettings.timezone,
    maintenanceMode: initialSettings.maintenanceMode,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleMaintenanceToggle = () => {
    setFormData((prev) => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    startTransition(async () => {
      try {
        const result = await updateSettings(formData);
        if (result.success) {
          toast.success('General settings updated successfully');
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
      <div className="admin-form-group">
        <label className="admin-label">Site Name</label>
        <input 
          type="text" 
          name="siteName"
          className="admin-input" 
          value={formData.siteName} 
          onChange={handleChange}
        />
      </div>
      
      <div className="admin-form-group">
        <label className="admin-label">Contact Email</label>
        <input 
          type="email" 
          name="contactEmail"
          className="admin-input" 
          value={formData.contactEmail} 
          onChange={handleChange}
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-label">Phone Number</label>
        <input 
          type="text" 
          name="phoneNumber"
          className="admin-input" 
          value={formData.phoneNumber} 
          onChange={handleChange}
          placeholder="0544015490, 0501676271"
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-label">Office Address</label>
        <input 
          type="text" 
          name="address"
          className="admin-input" 
          value={formData.address} 
          onChange={handleChange}
          placeholder="54 Faanofa Road, Kokomlemle - Accra, Ghana"
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-label">Timezone</label>
        <select 
          name="timezone"
          className="admin-select" 
          value={formData.timezone}
          onChange={handleChange}
        >
          <option value="GMT">Greenwich Mean Time (GMT)</option>
          <option value="EST">Eastern Standard Time (EST)</option>
          <option value="PST">Pacific Standard Time (PST)</option>
        </select>
      </div>

      <div style={{ marginTop: '2rem', borderTop: '1px solid var(--admin-border)', paddingTop: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>Maintenance Mode</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--admin-bg)', borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-border)' }}>
          <div>
            <div style={{ fontWeight: 500 }}>Enable Maintenance Mode</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Displays a &quot;Site under construction&quot; page to public visitors.</div>
          </div>
          <div 
            onClick={handleMaintenanceToggle}
            style={{ 
              width: 44, 
              height: 24, 
              backgroundColor: formData.maintenanceMode ? 'var(--admin-primary)' : 'var(--admin-border)', 
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
              left: formData.maintenanceMode ? 22 : 2, 
              boxShadow: 'var(--admin-shadow-sm)',
              transition: 'left 0.2s ease'
            }}></div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <button 
          type="submit" 
          className="admin-btn admin-btn-primary" 
          disabled={isPending}
        >
          {isPending ? 'Saving...' : 'Save General Settings'}
        </button>
      </div>
    </form>
  );
}
