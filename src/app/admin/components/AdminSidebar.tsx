'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutUser } from '@/app/actions/authActions';
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  Settings, 
  LogOut,
  FolderKanban,
  ShieldAlert,
  Info
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true;
    if (path !== '/admin' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-logo">
          <span>FS</span> Fire Shield
        </div>
      </div>
      
      <nav className="admin-nav">
        <div className="admin-nav-category">Main</div>
        <Link 
          href="/admin" 
          className={`admin-nav-item ${isActive('/admin') ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        
        <div className="admin-nav-category">Content</div>
        <Link 
          href="/admin/about" 
          className={`admin-nav-item ${isActive('/admin/about') ? 'active' : ''}`}
        >
          <Info size={20} />
          <span>About Page</span>
        </Link>
        <Link 
          href="/admin/services" 
          className={`admin-nav-item ${isActive('/admin/services') ? 'active' : ''}`}
        >
          <Layers size={20} />
          <span>Services</span>
        </Link>
        <Link 
          href="/admin/projects" 
          className={`admin-nav-item ${isActive('/admin/projects') ? 'active' : ''}`}
        >
          <FolderKanban size={20} />
          <span>Projects</span>
        </Link>
        <Link 
          href="/admin/industries" 
          className={`admin-nav-item ${isActive('/admin/industries') ? 'active' : ''}`}
        >
          <ShieldAlert size={20} />
          <span>Industries</span>
        </Link>
        
        <div className="admin-nav-category">Administration</div>
        <Link 
          href="/admin/users" 
          className={`admin-nav-item ${isActive('/admin/users') ? 'active' : ''}`}
        >
          <Users size={20} />
          <span>Users</span>
        </Link>
        <Link 
          href="/admin/settings" 
          className={`admin-nav-item ${isActive('/admin/settings') ? 'active' : ''}`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        
        <div style={{ flex: 1 }}></div>
        
        <Link href="/" className="admin-nav-item" style={{ marginTop: '1rem' }} target="_blank">
          <Info size={20} />
          <span>Exit to Site</span>
        </Link>
        <button 
          className="admin-nav-item" 
          style={{ width: '100%', background: 'transparent', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer', opacity: isPending ? 0.5 : 1 }} 
          onClick={() => startTransition(() => logoutUser())}
          disabled={isPending}
        >
          <LogOut size={20} />
          <span>{isPending ? 'Logging out...' : 'Logout'}</span>
        </button>
      </nav>
    </aside>
  );
}
