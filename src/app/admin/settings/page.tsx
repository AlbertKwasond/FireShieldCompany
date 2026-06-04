import React from 'react';
import { getSettings, getSecuritySettings, getNotificationSettings } from '@/app/actions/settingsActions';
import SettingsForm from '../components/SettingsForm';

export const metadata = {
  title: 'Settings | Admin Dashboard',
};

export default async function SettingsPage() {
  const [generalSettings, securitySettings, notificationSettings] = await Promise.all([
    getSettings(),
    getSecuritySettings(),
    getNotificationSettings()
  ]);

  if (!generalSettings || !securitySettings || !notificationSettings) {
    return (
      <div className="admin-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Error Loading Settings</h2>
        <p>Could not retrieve configuration. Please try again later.</p>
      </div>
    );
  }

  return (
    <SettingsForm 
      generalSettings={generalSettings} 
      securitySettings={securitySettings} 
      notificationSettings={notificationSettings} 
    />
  );
}
