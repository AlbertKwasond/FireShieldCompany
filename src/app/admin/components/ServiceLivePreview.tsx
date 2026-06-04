'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

type PreviewProps = {
  title: string;
  description: string;
  iconName: string;
  features: string[];
  imageSrc: string;
};

export default function ServiceLivePreview({
  title,
  description,
  iconName,
  features,
  imageSrc
}: PreviewProps) {
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Layers;

  return (
    <div className="admin-browser-frame">
      <div className="admin-browser-header">
        <div className="admin-browser-dots">
          <div className="admin-browser-dot" style={{ backgroundColor: '#ff5f56' }}></div>
          <div className="admin-browser-dot" style={{ backgroundColor: '#ffbd2e' }}></div>
          <div className="admin-browser-dot" style={{ backgroundColor: '#27c93f' }}></div>
        </div>
        <div className="admin-browser-url">
          <LucideIcons.Lock size={12} />
          fireshieldghana.com/services
        </div>
      </div>
      
      {/* Mini Website Canvas */}
      <div style={{ padding: '1.5rem', backgroundColor: '#ffffff', minHeight: '400px', pointerEvents: 'none' }}>
        
        <div style={{ display: 'flex', gap: '1.5rem', flexDirection: 'column' }}>
          
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IconComponent size={20} color="#c52828" />
              {title || 'Service Title'}
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
              {description || 'Provide a detailed description of the service here. It will be displayed to your website visitors.'}
            </p>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {features.length > 0 ? features.map((feature, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem', fontSize: '0.75rem', color: '#111827' }}>
                  <CheckCircle size={14} color="#c52828" style={{ flexShrink: 0, marginTop: '2px' }} />
                  {feature}
                </li>
              )) : (
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                  <CheckCircle size={14} color="#9ca3af" style={{ flexShrink: 0, marginTop: '2px' }} />
                  Feature 1
                </li>
              )}
            </ul>
          </div>

          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', overflow: 'hidden' }}>
            {imageSrc ? (
              <Image 
                src={imageSrc} 
                alt="Preview" 
                fill 
                style={{ objectFit: 'cover' }} 
                unoptimized
              />
            ) : (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                <LucideIcons.Image size={32} />
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
