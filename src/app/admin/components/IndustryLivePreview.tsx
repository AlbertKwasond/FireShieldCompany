import React from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import * as Icons from 'lucide-react';

type IndustryLivePreviewProps = {
  title: string;
  description: string;
  iconName: string;
  imageSrc: string;
};

export default function IndustryLivePreview({
  title,
  description,
  iconName,
  imageSrc,
}: IndustryLivePreviewProps) {
  // Safe dynamic icon resolution
  const IconComponent = (Icons as any)[iconName] || Icons.HelpCircle;

  return (
    <div className="admin-preview-pane">
      <div className="admin-preview-header">
        <h3 className="admin-preview-title">Live Preview</h3>
        <span className="admin-preview-badge">Card View</span>
      </div>
      
      <div className="admin-preview-content">
        <div 
          style={{
            position: 'relative',
            backgroundColor: '#1E232E',
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            aspectRatio: '3/4',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '2rem',
            fontFamily: 'var(--font-inter), sans-serif'
          }}
        >
          {/* Background Image */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}>
            {imageSrc ? (
              <Image 
                src={imageSrc}
                alt={title || 'Industry Preview'}
                fill
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#0d1117',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: 'rgba(255,255,255,0.15)',
                border: '2px dashed rgba(255,255,255,0.08)'
              }}>
                <ImageOff size={36} />
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>No image uploaded</span>
              </div>
            )}
          </div>
          
          {/* Overlay Gradient */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, rgba(10, 12, 16, 1) 0%, rgba(10, 12, 16, 0.4) 50%, rgba(10, 12, 16, 0.1) 100%)',
            zIndex: 2,
            transition: 'background 0.3s ease'
          }}></div>

          {/* Icon Badge */}
          <div style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(212, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            zIndex: 3,
            boxShadow: '0 4px 20px rgba(212, 0, 0, 0.4)'
          }}>
            <IconComponent size={24} />
          </div>

          {/* Content */}
          <div style={{
            position: 'relative',
            zIndex: 3,
            transform: 'translateY(20px)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <h3 style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '1rem',
              lineHeight: 1.2
            }}>
              {title || 'Industry Title'}
            </h3>
            
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {description || 'Industry description will appear here...'}
            </p>
          </div>
        </div>
        
        <p style={{ marginTop: '1rem', color: 'var(--admin-text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
          This is a representation of how the industry will appear on the public website.
        </p>
      </div>
    </div>
  );
}
