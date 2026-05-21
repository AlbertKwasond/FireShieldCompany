import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, Globe } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container`}>
        <div className={styles['footer-top']}>
          
          {/* Brand Column */}
          <div className={styles['footer-brand']}>
            <Link href="/" className={styles['footer-logo']} style={{ marginBottom: '0.5rem' }}>
              <Image 
                src="/logo.png" 
                alt="Fire Shield Logo" 
                width={260} 
                height={70} 
                style={{ objectFit: 'contain' }} 
                unoptimized
              />
            </Link>
            <p className={styles['footer-desc']}>
              Premier 100% Ghanaian-owned engineering company specializing in fire safety, electronic security, electrical systems, and mission-critical infrastructure solutions since 2003.
            </p>
            <div className={styles['social-icons']}>
              <a href="#" className={styles['social-icon']} aria-label="Website"><Globe size={18} /></a>
              <a href="#" className={styles['social-icon']} aria-label="Social">Fb</a>
              <a href="#" className={styles['social-icon']} aria-label="Social">In</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={styles['footer-title']}>Quick Links</h4>
            <ul className={styles['footer-links']}>
              <li><Link href="/about" className={styles['footer-link']}>About Us</Link></li>
              <li><Link href="/projects" className={styles['footer-link']}>Projects & Clients</Link></li>
              <li><Link href="/industries" className={styles['footer-link']}>Industries Served</Link></li>
              <li><Link href="/support" className={styles['footer-link']}>Maintenance & Support</Link></li>
              <li><Link href="/contact" className={styles['footer-link']}>Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className={styles['footer-title']}>Our Services</h4>
            <ul className={styles['footer-links']}>
              <li><Link href="/services#fire-safety" className={styles['footer-link']}>Fire Engineering & Safety</Link></li>
              <li><Link href="/services#cctv" className={styles['footer-link']}>CCTV & Access Control</Link></li>
              <li><Link href="/services#electrical" className={styles['footer-link']}>Electrical Systems</Link></li>
              <li><Link href="/services#data-center" className={styles['footer-link']}>Data Center Solutions</Link></li>
              <li><Link href="/services#consultancy" className={styles['footer-link']}>Engineering Consultancy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={styles['footer-title']}>Contact Us</h4>
            <div className={styles['contact-info']}>
              <div className={styles['contact-item']}>
                <MapPin size={20} className={styles['contact-icon']} />
                <span>54 Faanofa Road, Kokomlemle<br/>Accra, Ghana</span>
              </div>
              <div className={styles['contact-item']}>
                <Phone size={20} className={styles['contact-icon']} />
                <span>+233 544015490<br/>+233 501676271</span>
              </div>
              <div className={styles['contact-item']}>
                <Mail size={20} className={styles['contact-icon']} />
                <span>info@fireshieldghana.com<br/>support@fireshieldghana.com</span>
              </div>
            </div>
          </div>

        </div>

        <div className={styles['footer-bottom']}>
          <p>&copy; {currentYear} Fire Shield Company Limited. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/privacy" className={styles['footer-link']}>Privacy Policy</Link>
            <Link href="/terms" className={styles['footer-link']}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
