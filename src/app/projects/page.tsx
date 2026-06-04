import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import styles from './Projects.module.css';
import { getProjects } from '@/app/actions/projectActions';
export const metadata = {
  title: 'Our Projects | Fire Shield Company Limited',
  description: 'Explore our portfolio of successful fire safety, security, and engineering projects across Ghana.',
};

export default async function Projects() {
  const projects = await getProjects();
  return (
    <div className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className="heading-xl animate-fade-in-up">
            Our <span className="text-primary">Projects</span>
          </h1>
          <p className="subheading animate-fade-in-up delay-100" style={{ color: 'var(--charcoal)' }}>
            A showcase of our engineering excellence and commitment to safety across diverse sectors.
          </p>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className={styles.section} style={{ background: 'rgba(0,0,0,0.02)' }}>
        <div className="container">
          <div className={styles['grid-3']}>
            {projects.map((project) => (
              <div key={project.id} className={styles['project-card']}>
                <div className={styles['project-image-wrapper']}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={project.imagePath || '/images/projects/manufacturing-plant.png'} 
                    alt={project.title} 
                    className={styles['project-image']}
                  />
                </div>
                <div className={styles['project-content']}>
                  <div className={styles['project-category']}>{project.category}</div>
                  <h3 className={styles['project-title']}>{project.title}</h3>
                  <p className={styles['project-description']}>{project.description}</p>
                  
                  <div className={styles['project-stats']}>
                    <div className={styles.stat}>
                      <MapPin size={16} />
                      <span>{project.location}</span>
                    </div>
                    <div className={styles.stat} style={{ marginLeft: 'auto' }}>
                      <Calendar size={16} />
                      <span>{project.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className={`${styles.section} ${styles['section-dark']}`}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h2 className="heading-lg" style={{ color: 'var(--white)' }}>
              Our <span className="text-primary">Approach</span>
            </h2>
            <p style={{ color: 'var(--metallic)', maxWidth: '600px', margin: '0 auto' }}>
              How we ensure success and uncompromising quality in every project we undertake.
            </p>
          </div>

          <div className={styles['grid-3']}>
            <div className="text-center">
              <div style={{ background: 'rgba(230, 57, 70, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-md)', color: 'var(--fire-red)' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>01</span>
              </div>
              <h3 style={{ color: 'var(--white)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Assessment & Design</h3>
              <p style={{ color: 'var(--metallic)', fontSize: '0.95rem' }}>Thorough risk analysis and custom engineering design tailored to specific facility requirements.</p>
            </div>
            <div className="text-center">
              <div style={{ background: 'rgba(230, 57, 70, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-md)', color: 'var(--fire-red)' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>02</span>
              </div>
              <h3 style={{ color: 'var(--white)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Precision Installation</h3>
              <p style={{ color: 'var(--metallic)', fontSize: '0.95rem' }}>Expert implementation by certified technicians adhering to international safety standards.</p>
            </div>
            <div className="text-center">
              <div style={{ background: 'rgba(230, 57, 70, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-md)', color: 'var(--fire-red)' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>03</span>
              </div>
              <h3 style={{ color: 'var(--white)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Testing & Handover</h3>
              <p style={{ color: 'var(--metallic)', fontSize: '0.95rem' }}>Rigorous system testing, client training, and comprehensive documentation handover.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.section} style={{ paddingBottom: 'var(--spacing-xxl)' }}>
        <div className="container text-center">
          <h2 className="heading-md" style={{ color: 'var(--black-bg)', marginBottom: '1rem' }}>Have a Project in Mind?</h2>
          <p style={{ color: 'var(--charcoal)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Let&apos;s discuss how our engineering expertise can bring your vision to life safely and securely.
          </p>
          <Link href="/contact">
            <Button>Discuss Your Project <ArrowRight size={18} /></Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
