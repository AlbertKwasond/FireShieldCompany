import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as Icons from 'lucide-react';
import { getIndustries } from '@/app/actions/industryActions';
import { Industry } from '@prisma/client';
import styles from './Industries.module.css';

export const metadata = {
  title: 'Industries We Serve | Fire Shield Company Limited',
  description: 'Fire Shield provides tailored fire safety, security, and engineering solutions across various industries including Mining, Finance, Government, and Data Centers.',
};

export const revalidate = 0; // Ensure fresh data

export default async function IndustriesPage() {
  const industries = await getIndustries();

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
          {industries.length > 0 ? (
            industries.map((industry: Industry, index: number) => {
              const IconComponent = (Icons as any)[industry.icon] || Icons.HelpCircle;

              return (
                <div 
                  key={industry.id} 
                  className={`${styles.card} animate-fade-in-up`}
                  style={{ animationDelay: `${(index % 4) * 100 + 100}ms` }}
                >
                  <div className={styles.imageBanner}>
                    {industry.imagePath ? (
                      <Image 
                        src={industry.imagePath} 
                        alt={industry.title}
                        fill
                        className={styles.cardImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <IconComponent size={32} />
                      </div>
                    )}
                    <div className={styles.imageOverlay}></div>
                    <div className={styles.iconBadge}>
                      <IconComponent size={24} />
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{industry.title}</h3>
                    <p className={styles.cardDescription}>{industry.description}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400 text-lg">New industries will be added soon.</p>
            </div>
          )}
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
