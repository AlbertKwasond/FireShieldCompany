import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { 
  ShieldCheck, 
  Flame, 
  Cctv, 
  Zap, 
  Server, 
  ChevronRight, 
  Building2, 
  Factory, 
  Landmark, 
  Globe2, 
  Briefcase
} from 'lucide-react';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles['hero-content']}>
            <h1 className={`${styles['hero-headline']} animate-fade-in-up`}>
              Protecting Assets,<br/>
              Securing Futures <span className="text-primary">Since 2003.</span>
            </h1>
            <p className={`${styles['hero-subhead']} animate-fade-in-up delay-100`} style={{ marginLeft: 0 }}>
              Fire Shield Company Limited is a premier 100% Ghanaian-owned engineering company specializing in fire safety, electronic security, electrical systems, and mission-critical infrastructure solutions.
            </p>
            <div className={`${styles['hero-actions']} animate-fade-in-up delay-200`}>
              <Link href="/contact">
                <Button>Request a Consultation</Button>
              </Link>
              <Link href="/services">
                <Button variant="outline">Explore Our Services</Button>
              </Link>
            </div>
          </div>

          <div className={styles['floating-stats']}>
            <div className={styles['stat-card']}>
              <div className={styles['stat-icon']}><Briefcase size={24} /></div>
              <div className={styles['stat-info']}>
                <h4>500+</h4>
                <p>Projects Completed</p>
              </div>
            </div>
            <div className={styles['stat-card']}>
              <div className={styles['stat-icon']}><ShieldCheck size={24} /></div>
              <div className={styles['stat-info']}>
                <h4>20+ Years</h4>
                <p>Of Excellence</p>
              </div>
            </div>
            <div className={styles['stat-card']}>
              <div className={styles['stat-icon']}><Globe2 size={24} /></div>
              <div className={styles['stat-info']}>
                <h4>Nationwide</h4>
                <p>Support Coverage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <div className={styles['trust-bar']}>
        <div className={`container ${styles['trust-items']}`}>
          <div className={styles['trust-item']}><ShieldCheck size={20} className="text-primary"/> 100% Ghanaian-Owned</div>
          <div className={styles['trust-item']}><ShieldCheck size={20} className="text-primary"/> Certified Technical Team</div>
          <div className={styles['trust-item']}><ShieldCheck size={20} className="text-primary"/> Trusted by Corporate Institutions</div>
          <div className={styles['trust-item']}><ShieldCheck size={20} className="text-primary"/> Turnkey Engineering Solutions</div>
        </div>
      </div>

      {/* Core Services Section */}
      <section className={`section ${styles['services-section']}`}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h2 className="heading-lg">Our <span className="text-gradient">Core Services</span></h2>
            <p className="subheading">
              We deliver complete end-to-end engineering solutions tailored to secure and empower your operations.
            </p>
          </div>

          <div className="grid grid-4">
            <div className="glass-panel flex-col">
              <div className={styles['service-icon-wrapper']}>
                <Flame size={32} />
              </div>
              <h3>Fire Engineering & Safety</h3>
              <p className="text-metallic" style={{ marginBottom: 'var(--spacing-md)', fontSize: '0.95rem' }}>
                Advanced fire detection, alarm, and suppression systems. Includes clean agent systems and hydrants.
              </p>
              <Link href="/services#fire-safety" className="text-primary flex items-center gap-sm mt-auto" style={{ fontWeight: 600 }}>
                Learn more <ChevronRight size={16} />
              </Link>
            </div>

            <div className="glass-panel flex-col">
              <div className={styles['service-icon-wrapper']}>
                <Cctv size={32} />
              </div>
              <h3>CCTV & Access Control</h3>
              <p className="text-metallic" style={{ marginBottom: 'var(--spacing-md)', fontSize: '0.95rem' }}>
                Enterprise surveillance, biometric access, and smart security integration for complete facility control.
              </p>
              <Link href="/services#cctv" className="text-primary flex items-center gap-sm mt-auto" style={{ fontWeight: 600 }}>
                Learn more <ChevronRight size={16} />
              </Link>
            </div>

            <div className="glass-panel flex-col">
              <div className={styles['service-icon-wrapper']}>
                <Zap size={32} />
              </div>
              <h3>Electrical Systems</h3>
              <p className="text-metallic" style={{ marginBottom: 'var(--spacing-md)', fontSize: '0.95rem' }}>
                Industrial electrical installations, power distribution, backup solutions, and structured cabling.
              </p>
              <Link href="/services#electrical" className="text-primary flex items-center gap-sm mt-auto" style={{ fontWeight: 600 }}>
                Learn more <ChevronRight size={16} />
              </Link>
            </div>

            <div className="glass-panel flex-col">
              <div className={styles['service-icon-wrapper']}>
                <Server size={32} />
              </div>
              <h3>Data Center Setup</h3>
              <p className="text-metallic" style={{ marginBottom: 'var(--spacing-md)', fontSize: '0.95rem' }}>
                Design, cooling, server rack installation, and UPS systems for mission-critical IT infrastructure.
              </p>
              <Link href="/services#data-center" className="text-primary flex items-center gap-sm mt-auto" style={{ fontWeight: 600 }}>
                Learn more <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Fire Shield Advantage - Timeline */}
      <section className="section section-dark">
        <div className="container">
          <h2 className="heading-lg text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
            The Fire Shield <span className="text-gradient">Advantage</span>
          </h2>
          
          <div className={styles.timeline}>
            <div className={styles['timeline-step']}>
              <div className={styles['step-dot']}></div>
              <div className={styles['step-num']}>01</div>
              <h4>Consultancy</h4>
              <p className="text-metallic" style={{ fontSize: '0.9rem' }}>Comprehensive site analysis and technical audits tailored to international standards.</p>
            </div>
            <div className={styles['timeline-step']}>
              <div className={styles['step-dot']}></div>
              <div className={styles['step-num']}>02</div>
              <h4>System Design</h4>
              <p className="text-metallic" style={{ fontSize: '0.9rem' }}>Precision engineering blueprints prioritizing compliance, safety, and operational efficiency.</p>
            </div>
            <div className={styles['timeline-step']}>
              <div className={styles['step-dot']}></div>
              <div className={styles['step-num']}>03</div>
              <h4>Installation</h4>
              <p className="text-metallic" style={{ fontSize: '0.9rem' }}>Execution by certified engineers ensuring seamless integration and minimal disruption.</p>
            </div>
            <div className={styles['timeline-step']}>
              <div className={styles['step-dot']}></div>
              <div className={styles['step-num']}>04</div>
              <h4>Testing & Commissioning</h4>
              <p className="text-metallic" style={{ fontSize: '0.9rem' }}>Rigorous performance testing validating that all systems meet exact specifications.</p>
            </div>
            <div className={styles['timeline-step']}>
              <div className={styles['step-dot']}></div>
              <div className={styles['step-num']}>05</div>
              <h4>Maintenance</h4>
              <p className="text-metallic" style={{ fontSize: '0.9rem' }}>24/7 technical support and scheduled maintenance for long-term reliability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className={`section ${styles['industries-section']}`}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h2 className="heading-lg">Industries We <span className="text-gradient">Serve</span></h2>
          </div>

          <div className="grid grid-4 text-center">
            <div className="glass-panel flex-col items-center justify-center gap-sm">
              <Factory size={40} className="text-primary" />
              <h4>Mining & Manufacturing</h4>
            </div>
            <div className="glass-panel flex-col items-center justify-center gap-sm">
              <Landmark size={40} className="text-primary" />
              <h4>Banks & Financial</h4>
            </div>
            <div className="glass-panel flex-col items-center justify-center gap-sm">
              <Building2 size={40} className="text-primary" />
              <h4>Government & Offices</h4>
            </div>
            <div className="glass-panel flex-col items-center justify-center gap-sm">
              <Server size={40} className="text-primary" />
              <h4>Data Centers</h4>
            </div>
          </div>
          <div className="text-center mt-8" style={{ marginTop: 'var(--spacing-lg)' }}>
             <Link href="/industries">
                <Button variant="outline">View All Industries</Button>
              </Link>
          </div>
        </div>
      </section>

      {/* Emergency Support CTA */}
      <section className={styles['cta-section']}>
        <div className="container text-center" style={{ position: 'relative', zIndex: 2 }}>
          <h2 className="heading-xl">Need Immediate Assistance?</h2>
          <p className="subheading" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Our rapid response engineering team is available 24/7 for emergency repairs and technical support.
          </p>
          <div className="flex justify-center gap-md">
            <Button icon={<Flame size={18} />}>Emergency Hotline</Button>
            <Link href="/contact"><Button variant="outline">Schedule Inspection</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
