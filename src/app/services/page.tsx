import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { 
  Flame, 
  Cctv, 
  Zap, 
  Server, 
  CheckCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import styles from './Services.module.css';

export default function Services() {
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
      <section className={styles.section}>
        <div className="container">
          
          {/* Fire Engineering & Safety */}
          <div id="fire-safety" className={styles['service-block']}>
            <div className={styles['service-content']}>
              <h2 style={{ color: 'var(--black-bg)' }}>
                <Flame className="text-primary" size={32} /> 
                Fire Engineering & Safety
              </h2>
              <p>
                As pioneers in fire engineering, we design, install, and maintain state-of-the-art fire detection and suppression systems that comply strictly with international safety standards. Our solutions ensure maximum protection for lives and property.
              </p>
              <ul className={styles['feature-list']}>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Advanced Fire Detection and Alarm Systems</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Automated Fire Suppression (FM200, Novec 1230)</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Sprinkler and Hydrant Network Installations</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Portable Fire Extinguishers and Maintenance</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Fire Safety Audits and Consultancy</li>
              </ul>
            </div>
            <div className={styles['service-image-wrapper']}>
              <Image 
                src="/images/services/fire-safety.png" 
                alt="Professional industrial fire suppression system"
                fill
                className={styles['service-image']}
              />
            </div>
          </div>

        </div>
      </section>

      <section className={`${styles.section} ${styles['section-dark']}`}>
        <div className="container">
          
          {/* CCTV & Access Control */}
          <div id="cctv" className={`${styles['service-block']} ${styles.reverse}`}>
            <div className={styles['service-content']}>
              <h2>
                <Cctv className="text-primary" size={32} /> 
                CCTV & Access Control
              </h2>
              <p>
                We provide enterprise-grade electronic security systems designed to monitor, detect, and control access to your facilities. From high-definition surveillance to biometric access points, we offer integrated security solutions tailored to your operational needs.
              </p>
              <ul className={styles['feature-list']}>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> IP & High-Definition CCTV Surveillance Systems</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Biometric and Card-based Access Control</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Intruder Alarm and Perimeter Detection</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Integrated Security Management Software</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> 24/7 Remote Monitoring Solutions</li>
              </ul>
            </div>
            <div className={styles['service-image-wrapper']}>
              <Image 
                src="/images/services/cctv-access.png" 
                alt="Professional enterprise CCTV installation"
                fill
                className={styles['service-image']}
              />
            </div>
          </div>

        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          
          {/* Electrical Systems */}
          <div id="electrical" className={styles['service-block']}>
            <div className={styles['service-content']}>
              <h2 style={{ color: 'var(--black-bg)' }}>
                <Zap className="text-primary" size={32} /> 
                Electrical Systems
              </h2>
              <p>
                Our electrical engineering division specializes in designing and implementing robust power distribution and backup systems. We guarantee continuous power supply to support your critical operations, minimizing downtime and maximizing efficiency.
              </p>
              <ul className={styles['feature-list']}>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Industrial & Commercial Electrical Installations</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> High and Low Voltage Power Distribution</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Uninterruptible Power Supply (UPS) Systems</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Backup Generator Integration</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Structured Cabling and Network Infrastructure</li>
              </ul>
            </div>
            <div className={styles['service-image-wrapper']}>
              <Image 
                src="https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=1200&auto=format&fit=crop" 
                alt="Industrial electrical panels and power systems"
                fill
                className={styles['service-image']}
              />
            </div>
          </div>

        </div>
      </section>

      <section className={`${styles.section} ${styles['section-dark']}`}>
        <div className="container">

          {/* Data Center Setup */}
          <div id="data-center" className={`${styles['service-block']} ${styles.reverse}`}>
            <div className={styles['service-content']}>
              <h2>
                <Server className="text-primary" size={32} /> 
                Data Center Infrastructure
              </h2>
              <p>
                Building mission-critical IT infrastructure requires absolute precision. We deliver turnkey data center setups, encompassing everything from precision cooling to server rack integration, ensuring a resilient, secure, and highly available environment for your data.
              </p>
              <ul className={styles['feature-list']}>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Comprehensive Data Center Design & Build</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Precision Cooling & Environmental Control</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Server Rack & Containment Solutions</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Raised Flooring and Cable Management</li>
                <li><CheckCircle className={styles['feature-icon']} size={20} /> Data Center Environmental Monitoring</li>
              </ul>
            </div>
            <div className={styles['service-image-wrapper']}>
              <Image 
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop" 
                alt="Enterprise data center infrastructure"
                fill
                className={styles['service-image']}
              />
            </div>
          </div>

        </div>
      </section>

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
