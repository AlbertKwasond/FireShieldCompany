import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { 
  Factory, 
  Landmark, 
  Building2, 
  Server, 
  Plane, 
  GraduationCap, 
  Hospital, 
  Shield 
} from 'lucide-react';
import styles from './Industries.module.css';

export const metadata = {
  title: 'Industries We Serve | Fire Shield Company Limited',
  description: 'Fire Shield provides tailored fire safety, security, and engineering solutions across various industries including Mining, Finance, Government, and Data Centers.',
};

export default function IndustriesPage() {
  const industries = [
    {
      title: 'Manufacturing',
      icon: <Factory size={24} />,
      image: '/images/manufacturing_fire_safety.png',
      description: 'Robust fire suppression and security systems designed for harsh industrial environments, ensuring continuous operation.',
    },
    {
      title: 'Banking & Financial',
      icon: <Landmark size={24} />,
      image: '/images/security_monitoring_room.png',
      description: 'Advanced access control, CCTV, and early-warning fire detection systems protecting sensitive assets.',
    },
    {
      title: 'Government Offices',
      icon: <Building2 size={24} />,
      image: '/images/government_access_control.jpg',
      description: 'Comprehensive life safety and security infrastructure for public sector buildings and headquarters.',
    },
    {
      title: 'Data Centers',
      icon: <Server size={24} />,
      image: '/images/data_center_servers.jpg',
      description: 'Mission-critical cooling, clean agent fire suppression, and environmental monitoring for zero-downtime environments.',
    },
    {
      title: 'Healthcare',
      icon: <Hospital size={24} />,
      image: '/images/healthcare_safety.jpg',
      description: 'Specialized safety systems and secure access controls that protect patients, staff, and medical equipment.',
    },
    {
      title: 'Education',
      icon: <GraduationCap size={24} />,
      image: '/images/fire_alarm_edu.jpg',
      description: 'Campus-wide security and fire alarm integration tailored to protect students and educational facilities.',
    },
    {
      title: 'Aviation & Transport',
      icon: <Plane size={24} />,
      image: '/images/aviation_security.jpg',
      description: 'Large-scale fire engineering and surveillance for transit hubs, airport hangars, and logistics centers.',
    },
    {
      title: 'High-Risk Facilities',
      icon: <Shield size={24} />,
      image: '/images/oil_gas_plant.png',
      description: 'Custom-engineered solutions for oil, gas, and chemical sites where absolute reliability is non-negotiable.',
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className="container">
          <h1 className={`${styles.title} animate-fade-in-up`}>Industries <span className="text-gradient">We Serve</span></h1>
          <p className={`${styles.subtitle} animate-fade-in-up delay-100`}>
            Delivering premium engineering, security, and fire safety infrastructure tailored to the rigorous demands of enterprise sectors.
          </p>
        </div>
      </div>

      <section className={styles.gridSection}>
        <div className={`container ${styles.gridContainer}`}>
          {industries.map((industry, index) => (
            <div 
              key={index} 
              className={`${styles.card} animate-fade-in-up`}
              style={{ animationDelay: `${(index % 4) * 100 + 100}ms` }}
            >
              <div className={styles.imageBanner}>
                <Image 
                  src={industry.image} 
                  alt={industry.title}
                  fill
                  className={styles.cardImage}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className={styles.imageOverlay}></div>
                <div className={styles.iconBadge}>
                  {industry.icon}
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{industry.title}</h3>
                <p className={styles.cardDescription}>{industry.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container text-center">
          <h2 className={styles.ctaTitle}>Ready to secure your facility?</h2>
          <p className={styles.ctaSubtitle}>Contact our engineering team to discuss a custom infrastructure solution for your industry.</p>
          <Link href="/contact" className={styles.glowBtn}>
            Request a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
