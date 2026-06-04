'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Edit2, MoreVertical, LayoutGrid, Plus } from 'lucide-react';
import DeleteIndustryButton from './DeleteIndustryButton';
import * as Icons from 'lucide-react';

type Industry = {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
};

export default function IndustriesTable({ industries }: { industries: Industry[] }) {
  const [query, setQuery] = useState('');

  const filtered = industries.filter((i) => {
    const q = query.toLowerCase();
    return (
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
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
            placeholder="Search industries…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Empty state */}
      {industries.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <LayoutGrid size={48} color="var(--admin-border)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--admin-text-main)' }}>
            No Industries Found
          </h3>
          <p style={{ margin: '0 0 1.5rem 0', color: 'var(--admin-text-muted)' }}>
            Get started by creating your first industry.
          </p>
          <Link href="/admin/industries/create" className="admin-btn admin-btn-primary">
            <Plus size={18} />
            Add Industry
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
                <th style={{ width: '60px' }}>Icon</th>
                <th>Industry Details</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((industry) => {
                const IconComponent = (Icons as any)[industry.icon] || Icons.HelpCircle;

                return (
                  <tr key={industry.id}>
                    <td>
                      <span className="admin-badge admin-badge-neutral">{industry.order}</span>
                    </td>
                    <td>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(212, 0, 0, 0.12)',
                        border: '1px solid rgba(212, 0, 0, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#e63946',
                        flexShrink: 0
                      }}>
                        <IconComponent size={18} />
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--admin-text-main)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {highlight(industry.title, query)}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--admin-text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '400px',
                        }}
                      >
                        {highlight(industry.description, query)}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                        <Link
                          href={`/admin/industries/${industry.id}/edit`}
                          className="admin-icon-btn"
                          title="Edit Industry"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <DeleteIndustryButton
                          industryId={industry.id}
                          industryTitle={industry.title}
                        />
                        <button className="admin-icon-btn" title="More Options">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer — only when there is data AND results are visible */}
      {industries.length > 0 && filtered.length > 0 && (
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
              ? `${filtered.length} of ${industries.length} industries match`
              : `Showing all ${industries.length} industries`}
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
          color: '#000',
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
