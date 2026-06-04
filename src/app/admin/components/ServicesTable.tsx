'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Edit2, MoreVertical, LayoutGrid, Plus } from 'lucide-react';
import DeleteServiceButton from './DeleteServiceButton';

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
};

export default function ServicesTable({ services }: { services: Service[] }) {
  const [query, setQuery] = useState('');

  const filtered = services.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.icon.toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-card">
      {/* Search bar */}
      <div
        className="admin-card-header"
        style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--admin-border)' }}
      >
        <div className="admin-search" style={{ width: '300px' }}>
          <Search size={16} color="var(--admin-text-muted)" />
          <input
            type="text"
            placeholder="Search services…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Empty state */}
      {services.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <LayoutGrid size={48} color="var(--admin-border)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--admin-text-main)' }}>
            No Services Found
          </h3>
          <p style={{ margin: '0 0 1.5rem 0', color: 'var(--admin-text-muted)' }}>
            Get started by creating your first service.
          </p>
          <Link href="/admin/services/create" className="admin-btn admin-btn-primary">
            <Plus size={18} />
            Add Service
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        /* No results for this query */
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <Search size={36} color="var(--admin-border)" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--admin-text-main)' }}>
            No results for &ldquo;{query}&rdquo;
          </h3>
          <p style={{ margin: 0, color: 'var(--admin-text-muted)' }}>
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Order</th>
                <th>Service Details</th>
                <th>Icon Ref</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((service) => (
                <tr key={service.id}>
                  <td>
                    <span className="admin-badge admin-badge-neutral">{service.order}</span>
                  </td>
                  <td>
                    <div
                      style={{
                        fontWeight: 600,
                        color: 'var(--admin-text-main)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {highlight(service.title, query)}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--admin-text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '300px',
                      }}
                    >
                      {service.description}
                    </div>
                  </td>
                  <td>
                    <code
                      style={{
                        fontSize: '0.75rem',
                        backgroundColor: 'var(--admin-bg)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--admin-radius-sm)',
                        border: '1px solid var(--admin-border)',
                      }}
                    >
                      {service.icon}
                    </code>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-success">Published</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                      <Link
                        href={`/admin/services/${service.id}`}
                        className="admin-icon-btn"
                        title="Edit Service"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <DeleteServiceButton
                        serviceId={service.id}
                        serviceTitle={service.title}
                      />
                      <button className="admin-icon-btn" title="More Options">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer — only when there is data AND results are visible */}
      {services.length > 0 && filtered.length > 0 && (
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--admin-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.875rem',
            color: 'var(--admin-text-muted)',
          }}
        >
          <span>
            {query
              ? `${filtered.length} of ${services.length} services match`
              : `Showing all ${services.length} services`}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="admin-btn admin-btn-outline" disabled>
              Previous
            </button>
            <button className="admin-btn admin-btn-outline" disabled>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Wraps matching text in a <mark> so the matched portion is highlighted. */
function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark
        style={{
          backgroundColor: '#fef08a',
          color: 'inherit',
          borderRadius: '2px',
          padding: '0 1px',
        }}
      >
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
