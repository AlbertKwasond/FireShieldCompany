import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { 
  CheckCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import styles from './Services.module.css';
import { getServices } from '@/app/actions/serviceActions';

export default async function Services() {
  const services = await getServices();

  return (
    <div className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className="heading-xl animate-fade-in-up">
            Our Engineering <span className="text-primary">Services</span>
          </h1>
          <p className="subheading animate-fade-in-up delay-100" style={{ color: 'var(--charcoal)' }}>
            Comprehensive, turnkey solutions designed to protect your critical assets, secure your premises, and power your future operations.
          </p>
        </div>
      </section>

      {/* Services Details */}
      {services.length === 0 && (
        <section className={styles.section}>
          <div className="container text-center">
            <p style={{ color: 'var(--charcoal)' }}>No services available yet. Please add them in the admin dashboard.</p>
          </div>
        </section>
      )}

      {services.map((service, index) => {
        const isDark = index % 2 !== 0; // Alternate dark and light sections
        const reverseClass = isDark ? styles.reverse : '';
        const sectionClass = `${styles.section} ${isDark ? styles['section-dark'] : ''}`;
        
        // Dynamically grab the Lucide icon
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Layers;

        // Parse features
        let featuresList: string[] = [];
        try {
          featuresList = JSON.parse(service.features);
        } catch {
          console.error('Failed to parse features for service', service.id);
        }

        return (
          <section key={service.id} className={sectionClass}>
            <div className="container">
              <div id={`service-${service.id}`} className={`${styles['service-block']} ${reverseClass}`}>
                <div className={styles['service-content']}>
                  <h2 style={{ color: isDark ? '#ffffff' : 'var(--black-bg)' }}>
                    <IconComponent className="text-primary" size={32} /> 
                    {service.title}
                  </h2>
                  <p>
                    {service.description}
                  </p>
                  <ul className={styles['feature-list']}>
                    {featuresList.map((feature, fIndex) => (
                      <li key={fIndex}>
                        <CheckCircle className={styles['feature-icon']} size={20} /> 
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles['service-image-wrapper']}>
                  <Image 
                    src={service.imagePath || '/images/placeholder.jpg'} 
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles['service-image']}
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className={styles.section} style={{ paddingBottom: 'var(--spacing-xxl)' }}>
        <div className="container text-center">
          <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(0,0,0,0.02)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <ShieldCheck size={48} className="text-primary" style={{ margin: '0 auto var(--spacing-md)' }} />
            <h2 className="heading-md" style={{ color: 'var(--black-bg)', marginBottom: '1rem' }}>Require Custom Engineering Solutions?</h2>
            <p style={{ color: 'var(--charcoal)', marginBottom: '2rem' }}>
              Our certified engineering team is ready to conduct a thorough technical audit of your facilities and propose tailored systems.
            </p>
            <Link href="/contact">
              <Button>Schedule a Consultation <ChevronRight size={18} /></Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
