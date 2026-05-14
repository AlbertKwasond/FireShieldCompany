'use client';

import React, { useState } from 'react';
import { Settings, Wrench, PhoneCall, ShieldAlert, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/Button';
import Link from 'next/link';
import styles from './Support.module.css';

const faqs = [
  {
    question: "Do you offer 24/7 emergency support?",
    answer: "Yes, we provide 24/7 emergency support for all our clients with active maintenance contracts. Our rapid response team is always on standby to address critical system failures."
  },
  {
    question: "What is included in a standard maintenance contract?",
    answer: "Our standard maintenance contracts include regular system inspections, preventative maintenance, priority response for emergency calls, detailed service reporting, and basic parts replacement as outlined in your agreement."
  },
  {
    question: "How often should fire suppression systems be serviced?",
    answer: "Depending on the system type and local regulations, fire suppression systems typically require servicing bi-annually or annually. We can help you establish a compliance schedule tailored to your facility."
  },
  {
    question: "Can you service equipment installed by other companies?",
    answer: "Absolutely. Our certified engineers are trained to inspect, maintain, and repair fire protection systems from all major manufacturers, regardless of who originally installed them."
  }
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className="heading-xl animate-fade-in-up">
            Support & <span className="text-primary">Maintenance</span>
          </h1>
          <p className="subheading animate-fade-in-up delay-100">
            Ensuring your critical systems perform flawlessly when you need them most. Our dedicated support team provides comprehensive maintenance and rapid response services.
          </p>
        </div>
      </section>

      {/* Support Services Grid */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid}>
            {/* Service 1 */}
            <div className={styles.card}>
              <div className={styles['card-icon']}>
                <Settings size={32} />
              </div>
              <h3>Preventative Maintenance</h3>
              <p>
                Scheduled inspections and testing to identify potential issues before they become critical failures, ensuring regulatory compliance.
              </p>
              <ul className="flex flex-col gap-sm" style={{ marginTop: '1rem' }}>
                <li className="flex gap-sm items-center"><CheckCircle2 size={16} className="text-primary" /> System Audits</li>
                <li className="flex gap-sm items-center"><CheckCircle2 size={16} className="text-primary" /> Performance Testing</li>
                <li className="flex gap-sm items-center"><CheckCircle2 size={16} className="text-primary" /> Component Cleaning</li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className={styles.card}>
              <div className={styles['card-icon']}>
                <ShieldAlert size={32} />
              </div>
              <h3>Emergency Repairs</h3>
              <p>
                Rapid response deployment for urgent system failures, minimizing downtime and restoring protection to your facility swiftly.
              </p>
              <ul className="flex flex-col gap-sm" style={{ marginTop: '1rem' }}>
                <li className="flex gap-sm items-center"><CheckCircle2 size={16} className="text-primary" /> 24/7 Availability</li>
                <li className="flex gap-sm items-center"><CheckCircle2 size={16} className="text-primary" /> Rapid Dispatch</li>
                <li className="flex gap-sm items-center"><CheckCircle2 size={16} className="text-primary" /> Root Cause Analysis</li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className={styles.card}>
              <div className={styles['card-icon']}>
                <PhoneCall size={32} />
              </div>
              <h3>Technical Consultation</h3>
              <p>
                Expert guidance on system upgrades, regulatory compliance changes, and integration of new technologies into existing setups.
              </p>
              <ul className="flex flex-col gap-sm" style={{ marginTop: '1rem' }}>
                <li className="flex gap-sm items-center"><CheckCircle2 size={16} className="text-primary" /> Compliance Review</li>
                <li className="flex gap-sm items-center"><CheckCircle2 size={16} className="text-primary" /> Upgrade Planning</li>
                <li className="flex gap-sm items-center"><CheckCircle2 size={16} className="text-primary" /> User Training</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles['section-light-gray']}>
        <div className="container">
          <h2>Frequently Asked <span className="text-primary">Questions</span></h2>
          
          <div className={styles['faq-section']}>
            <div className={styles['card-light']}>
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`${styles['faq-item']} ${openFaq === index ? styles.open : ''}`}
                >
                  <div 
                    className={styles['faq-question']} 
                    onClick={() => toggleFaq(index)}
                  >
                    <h3>{faq.question}</h3>
                    <ChevronDown size={20} className={styles['faq-icon']} />
                  </div>
                  <div className={styles['faq-answer']}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles['cta-section']}>
        <div className="container">
          <div className={styles['cta-box']}>
            <h2>Need Immediate Assistance?</h2>
            <p>
              Our engineering support team is ready to help you resolve issues, schedule maintenance, or discuss your service contract needs.
            </p>
            <div className={styles['cta-button']}>
              <Link href="/contact">
                <Button>Contact Support Team</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
