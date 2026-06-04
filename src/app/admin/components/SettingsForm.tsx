'use client';

import React, { useState } from 'react';
import { Globe, Shield, Bell } from 'lucide-react';

import GeneralSettingsForm from './settings/GeneralSettingsForm';
import SecuritySettingsForm from './settings/SecuritySettingsForm';
import NotificationSettingsForm from './settings/NotificationSettingsForm';

export default function SettingsForm({ 
  generalSettings,
  securitySettings,
  notificationSettings
}: { 
  generalSettings: any;
  securitySettings: any;
  notificationSettings: any;
}) {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div>
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>Settings</h1>
          <p>Manage your platform preferences and configurations.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Settings Navigation */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          <div className="admin-card" style={{ padding: '0.5rem' }}>
            <div 
              className={`admin-nav-item ${activeTab === 'general' ? 'active' : ''}`} 
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveTab('general')}
            >
              <Globe size={18} />
              <span>General Settings</span>
            </div>
            <div 
              className={`admin-nav-item ${activeTab === 'security' ? 'active' : ''}`} 
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveTab('security')}
            >
              <Shield size={18} />
              <span>Security</span>
            </div>
            <div 
              className={`admin-nav-item ${activeTab === 'notifications' ? 'active' : ''}`} 
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell size={18} />
              <span>Notifications</span>
            </div>
          </div>
        </div>

        {/* Settings Form Container */}
        <div className="admin-card" style={{ flex: 1 }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              {activeTab === 'general' && 'General Information'}
              {activeTab === 'security' && 'Security Settings'}
              {activeTab === 'notifications' && 'Notification Preferences'}
            </h2>
          </div>
          <div className="admin-card-body">
            {activeTab === 'general' && (
              <GeneralSettingsForm initialSettings={generalSettings} />
            )}
            
            {activeTab === 'security' && (
              <SecuritySettingsForm initialSettings={securitySettings} />
            )}

            {activeTab === 'notifications' && (
              <NotificationSettingsForm 
                initialSettings={notificationSettings} 
                fallbackEmail={generalSettings.contactEmail} 
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
