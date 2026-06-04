import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import styles from '@/app/projects/Projects.module.css';

type ProjectLivePreviewProps = {
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  imageSrc: string;
};

export default function ProjectLivePreview({
  title,
  category,
  description,
  location,
  date,
  imageSrc,
}: ProjectLivePreviewProps) {
  return (
    <div className="admin-preview-pane">
      <div className="admin-preview-header">
        Live Preview
        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', fontWeight: 'normal' }}>
          Real-time rendering
        </span>
      </div>
      
      <div className="admin-preview-content">
        {/* We reuse the public projects card styles to give an accurate preview */}
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className={styles['project-card']}>
            <div className={styles['project-image-wrapper']}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={imageSrc || '/images/projects/manufacturing-plant.png'} 
                alt={title || 'Project preview'} 
                className={styles['project-image']}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles['project-content']}>
              <div className={styles['project-category']}>{category || 'Category Name'}</div>
              <h3 className={styles['project-title']}>{title || 'Project Title'}</h3>
              <p className={styles['project-description']}>
                {description || 'Provide a short description of the project highlighting key engineering solutions delivered.'}
              </p>
              
              <div className={styles['project-stats']}>
                <div className={styles.stat}>
                  <MapPin size={16} />
                  <span>{location || 'Location'}</span>
                </div>
                <div className={styles.stat} style={{ marginLeft: 'auto' }}>
                  <Calendar size={16} />
                  <span>{date || 'Date/Year'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
