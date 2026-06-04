import React from 'react';
import { Users, Eye, TrendingUp, ShieldAlert, MoreHorizontal, CheckCircle2, Briefcase, LayoutTemplate, Factory, Activity } from 'lucide-react';
import AdminDashboardChart from './components/AdminDashboardChart';
import { getDashboardOverview } from '../actions/dashboardActions';

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export default async function AdminDashboard() {
  const { kpis, recentActivity, chartData } = await getDashboardOverview();

  return (
    <div>
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here is what&apos;s happening with your CMS today.</p>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="admin-kpi-grid">
        <div className="admin-card admin-kpi-card">
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Total Services</span>
            <Briefcase size={20} className="admin-kpi-icon" style={{ color: 'var(--admin-primary)', backgroundColor: '#e0e7ff' }} />
          </div>
          <div className="admin-kpi-value">{kpis.services}</div>
          <div className="admin-kpi-trend">
            <span style={{ color: 'var(--admin-text-muted)' }}>Active service offerings</span>
          </div>
        </div>
        
        <div className="admin-card admin-kpi-card">
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Total Projects</span>
            <LayoutTemplate size={20} className="admin-kpi-icon" style={{ color: 'var(--admin-success)', backgroundColor: '#d1fae5' }} />
          </div>
          <div className="admin-kpi-value">{kpis.projects}</div>
          <div className="admin-kpi-trend">
            <span style={{ color: 'var(--admin-text-muted)' }}>Completed portfolio items</span>
          </div>
        </div>

        <div className="admin-card admin-kpi-card">
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Industries Covered</span>
            <Factory size={20} className="admin-kpi-icon" style={{ color: 'var(--admin-warning)', backgroundColor: '#fef3c7' }} />
          </div>
          <div className="admin-kpi-value">{kpis.industries}</div>
          <div className="admin-kpi-trend">
            <span style={{ color: 'var(--admin-text-muted)' }}>Sectors we serve</span>
          </div>
        </div>

        <div className="admin-card admin-kpi-card">
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">System Admins</span>
            <Users size={20} className="admin-kpi-icon" style={{ color: '#8b5cf6', backgroundColor: '#ede9fe' }} />
          </div>
          <div className="admin-kpi-value">{kpis.users}</div>
          <div className="admin-kpi-trend">
            <span style={{ color: 'var(--admin-text-muted)' }}>Registered staff</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="admin-dashboard-grid">
        
        {/* Chart Section */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Activity Overview (Last 7 Days)</h2>
            <button className="admin-icon-btn"><MoreHorizontal size={20} /></button>
          </div>
          <div className="admin-card-body">
            <AdminDashboardChart data={chartData} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent Activity</h2>
          </div>
          <div className="admin-card-body">
            {recentActivity.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                <p>No recent activity logged yet.</p>
              </div>
            ) : (
              <ul className="admin-activity-list">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="admin-activity-item">
                    <div className="admin-activity-icon" style={{ color: 'var(--admin-primary)', backgroundColor: '#e0e7ff' }}>
                      <Activity size={14} />
                    </div>
                    <div className="admin-activity-content">
                      <p>
                        <strong>{activity.user?.name || 'System'}</strong> {activity.action.toLowerCase()} {activity.entityType.toLowerCase()}{' '}
                        <strong>{activity.entityName}</strong>
                      </p>
                      <span>{timeAgo(activity.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
