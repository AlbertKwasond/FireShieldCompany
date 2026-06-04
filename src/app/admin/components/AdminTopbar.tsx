import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function AdminTopbar() {
  return (
    <header className="admin-topbar">
      <div className="admin-search">
        <Search size={18} color="var(--admin-text-muted)" />
        <input type="text" placeholder="Search anything..." />
      </div>
      
      <div className="admin-topbar-actions">
        <button className="admin-icon-btn">
          <Bell size={20} />
        </button>
        <div className="admin-user-avatar">
          AD
        </div>
      </div>
    </header>
  );
}
