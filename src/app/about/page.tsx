import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ShieldCheck, Target, Lightbulb, Users, CheckCircle, ChevronRight } from 'lucide-react';
import styles from './About.module.css';

export default function About() {
  return (
    <div className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className="heading-xl animate-fade-in-up">
            Our <span className="text-primary">Story</span>
          </h1>
          <p className="subheading animate-fade-in-up delay-100" style={{ color: 'var(--charcoal)' }}>
            For over two decades, Fire Shield Company Limited has been at the forefront of engineering excellence, protecting assets and securing futures across Ghana and beyond.
          </p>
        </div>
      </section>

      {/* Story Timeline Section */}
      <section className={styles.section}>
        <div className="container">
          <div className="grid grid-2 items-center">
            <div>
              <h2 className="heading-lg" style={{ color: 'var(--black-bg)' }}>
                A Legacy of <span className="text-primary">Trust</span>
              </h2>
              <p style={{ color: 'var(--charcoal)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                Established in 2003, Fire Shield Company Limited began with a single mission: to elevate the standards of fire safety and engineering in Ghana. As a 100% Ghanaian-owned company, we understand the local landscape while adhering strictly to international standards.
              </p>
              <p style={{ color: 'var(--charcoal)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                Over the years, our expertise has expanded from fire engineering to encompass electronic security, electrical systems, and mission-critical data center infrastructure. Today, we are proud to be the trusted partner for major corporate institutions, government facilities, and industrial complexes.
              </p>
              <div className="flex gap-md" style={{ marginTop: '2rem' }}>
                <div className="flex items-center gap-sm">
                  <CheckCircle className="text-primary" size={20} />
                  <span style={{ color: 'var(--black-bg)', fontWeight: 600 }}>100% Ghanaian Owned</span>
                </div>
                <div className="flex items-center gap-sm">
                  <CheckCircle className="text-primary" size={20} />
                  <span style={{ color: 'var(--black-bg)', fontWeight: 600 }}>20+ Years Experience</span>
                </div>
              </div>
            </div>

            <div className={styles.timeline}>
              <div className={styles['timeline-item']}>
                <div className={styles['timeline-dot']}></div>
                <div className={styles['timeline-content']}>
                  <span className={styles['timeline-year']}>2003</span>
                  <h3>Company Founded</h3>
                  <p>Started as a specialized fire engineering firm dedicated to safety.</p>
                </div>
              </div>
              <div className={styles['timeline-item']}>
                <div className={styles['timeline-dot']}></div>
                <div className={styles['timeline-content']}>
                  <span className={styles['timeline-year']}>2010</span>
                  <h3>Expansion of Services</h3>
                  <p>Integrated electronic security and access control into our portfolio.</p>
                </div>
              </div>
              <div className={styles['timeline-item']}>
                <div className={styles['timeline-dot']}></div>
                <div className={styles['timeline-content']}>
                  <span className={styles['timeline-year']}>2018</span>
                  <h3>Mission Critical Infrastructure</h3>
                  <p>Launched full-scale data center setup and electrical system services.</p>
                </div>
              </div>
              <div className={styles['timeline-item']}>
                <div className={styles['timeline-dot']}></div>
                <div className={styles['timeline-content']}>
                  <span className={styles['timeline-year']}>Present</span>
                  <h3>Industry Leaders</h3>
                  <p>Recognized as a premier engineering partner with 500+ completed projects.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision (Dark Section to break up the white) */}
      <section className={`${styles.section} ${styles['section-dark']}`}>
        <div className="container">
          <div className="grid grid-2">
            <div className={styles['glass-card']}>
              <div className={styles['icon-wrapper']}>
                <Target size={32} />
              </div>
              <h3 style={{ color: 'var(--white)', fontSize: '1.5rem', marginBottom: '1rem' }}>Our Mission</h3>
              <p>
                To provide innovative, reliable, and comprehensive engineering solutions in fire safety, security, and electrical infrastructure, ensuring the total protection and continuous operation of our clients&apos; critical assets.
              </p>
            </div>
            <div className={styles['glass-card']}>
              <div className={styles['icon-wrapper']}>
                <Lightbulb size={32} />
              </div>
              <h3 style={{ color: 'var(--white)', fontSize: '1.5rem', marginBottom: '1rem' }}>Our Vision</h3>
              <p>
                To be the foremost indigenous engineering firm in West Africa, recognized globally for technical excellence, uncompromised safety standards, and sustainable technological integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className={styles.section}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h2 className="heading-lg" style={{ color: 'var(--black-bg)' }}>Core <span className="text-primary">Values</span></h2>
            <p style={{ color: 'var(--charcoal)', maxWidth: '600px', margin: '0 auto' }}>
              The principles that guide our engineering processes and client relationships.
            </p>
          </div>

          <div className="grid grid-4">
            <div className={styles.card}>
              <h3><ShieldCheck className="text-primary" size={24} /> Safety First</h3>
              <p>We never compromise on the safety of lives, property, or our workforce. It is the foundation of everything we build.</p>
            </div>
            <div className={styles.card}>
              <h3><Target className="text-primary" size={24} /> Excellence</h3>
              <p>We deliver superior quality in design, installation, and maintenance, consistently exceeding expectations.</p>
            </div>
            <div className={styles.card}>
              <h3><CheckCircle className="text-primary" size={24} /> Integrity</h3>
              <p>We conduct our business with the highest level of professional ethics, transparency, and honesty.</p>
            </div>
            <div className={styles.card}>
              <h3><Lightbulb className="text-primary" size={24} /> Innovation</h3>
              <p>We embrace modern technologies and smart integrations to solve complex engineering challenges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership / Team placeholder */}
      <section className={styles.section} style={{ background: 'rgba(0,0,0,0.02)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h2 className="heading-lg" style={{ color: 'var(--black-bg)' }}>Our <span className="text-primary">Leadership</span></h2>
            <p style={{ color: 'var(--charcoal)', maxWidth: '600px', margin: '0 auto' }}>
              Guided by experienced professionals dedicated to engineering excellence.
            </p>
          </div>

          <div className={styles['team-grid']}>
            <div className={styles['team-member']}>
              <div className={styles['team-avatar']}>
                <Users size={48} className="text-metallic" />
              </div>
              <h4>Managing Director</h4>
              <p>Executive Leadership</p>
            </div>
            <div className={styles['team-member']}>
              <div className={styles['team-avatar']}>
                <Users size={48} className="text-metallic" />
              </div>
              <h4>Technical Director</h4>
              <p>Engineering & Operations</p>
            </div>
            <div className={styles['team-member']}>
              <div className={styles['team-avatar']}>
                <Users size={48} className="text-metallic" />
              </div>
              <h4>Projects Manager</h4>
              <p>Project Execution</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.section} style={{ paddingBottom: 'var(--spacing-xxl)' }}>
        <div className="container text-center">
          <h2 className="heading-md" style={{ color: 'var(--black-bg)', marginBottom: '1rem' }}>Ready to Secure Your Operations?</h2>
          <p style={{ color: 'var(--charcoal)', marginBottom: '2rem' }}>
            Consult with our engineering experts today for a comprehensive facility audit.
          </p>
          <Link href="/contact">
            <Button>Contact Our Team <ChevronRight size={18} /></Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
