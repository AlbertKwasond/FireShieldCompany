'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  name: string;
  activity: number;
}

interface AdminDashboardChartProps {
  data: ChartDataPoint[];
}

export default function AdminDashboardChart({ data }: AdminDashboardChartProps) {
  // If no data, show empty state or just render empty chart
  const hasData = data && data.length > 0 && data.some(d => d.activity > 0);

  return (
    <div style={{ width: '100%', height: 300, marginTop: '1rem', position: 'relative' }}>
      {!hasData && (
        <div style={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--admin-text-muted)',
          zIndex: 10
        }}>
          No activity data for the last 7 days.
        </div>
      )}
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--admin-primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--admin-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'var(--admin-text-muted)' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'var(--admin-text-muted)' }}
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--admin-surface)', 
              borderRadius: '0.5rem',
              border: '1px solid var(--admin-border)',
              boxShadow: 'var(--admin-shadow)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="activity" 
            name="Activities"
            stroke="var(--admin-primary)" 
            strokeWidth={2} 
            fillOpacity={1} 
            fill="url(#colorActivity)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
