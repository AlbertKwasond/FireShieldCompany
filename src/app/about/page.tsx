import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/Button';
import * as Icons from 'lucide-react';
import styles from './About.module.css';
import { getAboutContent } from '@/app/actions/aboutActions';

export const metadata: Metadata = {
  title: 'About Us | Fire Shield Company Limited',
  description: 'Learn about Fire Shield Company Limited — a 100% Ghanaian-owned engineering firm with 20+ years of excellence in fire safety, security, and electrical infrastructure.',
};

export default async function About() {
  const content = await getAboutContent();
  
  if (!content) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--black-bg)', marginBottom: '1rem' }}>Unable to load page content</h2>
        <p style={{ color: 'var(--charcoal)' }}>There was a problem connecting to the database. Please try again later.</p>
      </div>
    );
  }

  let timeline = [];
  try { timeline = JSON.parse(content.timeline); } catch {}
  
  let coreValues = [];
  try { coreValues = JSON.parse(content.coreValues); } catch {}

  let leadership = [];
  try { leadership = JSON.parse(content.leadership); } catch {}

  return (
    <div className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className="heading-xl animate-fade-in-up">
            {content.heroTitle.split(' ').map((word: string, i: number, arr: string[]) => 
              i === arr.length - 1 ? <span key={i} className="text-primary">{word}</span> : word + ' '
            )}
          </h1>
          <p className="subheading animate-fade-in-up delay-100" style={{ color: 'var(--charcoal)' }}>
            {content.heroDescription}
          </p>
        </div>
      </section>

      {/* Story Timeline Section */}
      <section className={styles.section}>
        <div className="container">
          <div className="grid grid-2 items-center">
            <div>
              <h2 className="heading-lg" style={{ color: 'var(--black-bg)' }}>
                {content.storyTitle.split(' ').map((word: string, i: number, arr: string[]) => 
                  i === arr.length - 1 ? <span key={i} className="text-primary">{word}</span> : word + ' '
                )}
              </h2>
              
              {content.storyImagePath && (
                <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden' }}>
                  <img 
                    src={content.storyImagePath} 
                    alt="Company Story" 
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} 
                  />
                </div>
              )}

              <p style={{ color: 'var(--charcoal)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                {content.storyDescription1}
              </p>
              <p style={{ color: 'var(--charcoal)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                {content.storyDescription2}
              </p>
              <div className="flex gap-md" style={{ marginTop: '2rem' }}>
                <div className="flex items-center gap-sm">
                  <Icons.CheckCircle className="text-primary" size={20} />
                  <span style={{ color: 'var(--black-bg)', fontWeight: 600 }}>100% Ghanaian Owned</span>
                </div>
                <div className="flex items-center gap-sm">
                  <Icons.CheckCircle className="text-primary" size={20} />
                  <span style={{ color: 'var(--black-bg)', fontWeight: 600 }}>20+ Years Experience</span>
                </div>
              </div>
            </div>

            <div className={styles.timeline}>
              {timeline.map((item: any, index: number) => (
                <div key={index} className={styles['timeline-item']}>
                  <div className={styles['timeline-dot']}></div>
                  <div className={styles['timeline-content']}>
                    <span className={styles['timeline-year']}>{item.year}</span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={`${styles.section} ${styles['section-dark']}`}>
        <div className="container">
          <div className="grid grid-2">
            <div className={styles['glass-card']}>
              <div className={styles['icon-wrapper']}>
                <Icons.Target size={32} />
              </div>
              <h3 style={{ color: 'var(--white)', fontSize: '1.5rem', marginBottom: '1rem' }}>Our Mission</h3>
              <p>{content.mission}</p>
            </div>
            <div className={styles['glass-card']}>
              <div className={styles['icon-wrapper']}>
                <Icons.Lightbulb size={32} />
              </div>
              <h3 style={{ color: 'var(--white)', fontSize: '1.5rem', marginBottom: '1rem' }}>Our Vision</h3>
              <p>{content.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      {coreValues.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h2 className="heading-lg" style={{ color: 'var(--black-bg)' }}>Core <span className="text-primary">Values</span></h2>
              <p style={{ color: 'var(--charcoal)', maxWidth: '600px', margin: '0 auto' }}>
                The principles that guide our engineering processes and client relationships.
              </p>
            </div>

            <div className="grid grid-4">
              {coreValues.map((item: any, index: number) => {
                const IconComponent = (Icons as any)[item.icon] || Icons.CheckCircle;
                return (
                  <div key={index} className={styles.card}>
                    <h3><IconComponent className="text-primary" size={24} /> {item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Leadership / Team */}
      {leadership.length > 0 && (
        <section className={styles.section} style={{ background: 'rgba(0,0,0,0.02)' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h2 className="heading-lg" style={{ color: 'var(--black-bg)' }}>Our <span className="text-primary">Leadership</span></h2>
              <p style={{ color: 'var(--charcoal)', maxWidth: '600px', margin: '0 auto' }}>
                Guided by experienced professionals dedicated to engineering excellence.
              </p>
            </div>

            <div className={styles['team-grid']}>
              {leadership.map((item: any, index: number) => (
                <div key={index} className={styles['team-member']}>
                  <div className={styles['team-avatar']}>
                    {item.imagePath ? (
                      <img src={item.imagePath} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Icons.Users size={48} className="text-metallic" />
                    )}
                  </div>
                  <h4>{item.name}</h4>
                  <p>{item.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className={styles.section} style={{ paddingBottom: 'var(--spacing-xxl)' }}>
        <div className="container text-center">
          <h2 className="heading-md" style={{ color: 'var(--black-bg)', marginBottom: '1rem' }}>Ready to Secure Your Operations?</h2>
          <p style={{ color: 'var(--charcoal)', marginBottom: '2rem' }}>
            Consult with our engineering experts today for a comprehensive facility audit.
          </p>
          <Link href="/contact">
            <Button>Contact Our Team <Icons.ChevronRight size={18} /></Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
