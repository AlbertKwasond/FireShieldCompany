import React from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/Button';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <div className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className="heading-xl animate-fade-in-up">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="subheading animate-fade-in-up delay-100">
            Reach out to our engineering experts for consultations, inquiries, or support. We are ready to secure your operations.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles['contact-grid']}>
            
            {/* Contact Information */}
            <div className={styles['info-card']}>
              <h2 className="heading-lg" style={{ marginBottom: '2rem' }}>Contact <span className="text-primary">Information</span></h2>
              
              <div className={styles['info-item']}>
                <div className={styles['icon-wrapper']}>
                  <MapPin size={24} />
                </div>
                <div className={styles['info-content']}>
                  <h3>Our Office</h3>
                  <p>54 Faanofa Road, Kokomlemle<br />Accra, Ghana</p>
                </div>
              </div>

              <div className={styles['info-item']}>
                <div className={styles['icon-wrapper']}>
                  <Phone size={24} />
                </div>
                <div className={styles['info-content']}>
                  <h3>Phone</h3>
                  <p>+233 544015490<br />+233 501676271</p>
                </div>
              </div>

              <div className={styles['info-item']}>
                <div className={styles['icon-wrapper']}>
                  <Mail size={24} />
                </div>
                <div className={styles['info-content']}>
                  <h3>Email</h3>
                  <p>info@fireshieldghana.com<br />support@fireshieldghana.com</p>
                </div>
              </div>

              <div className={styles['info-item']}>
                <div className={styles['icon-wrapper']}>
                  <Clock size={24} />
                </div>
                <div className={styles['info-content']}>
                  <h3>Business Hours</h3>
                  <p>Monday - Friday: 8:00 AM - 5:00 PM<br />Saturday & Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles['form-card']}>
              <h2 className="heading-lg" style={{ marginBottom: '2rem' }}>Send a <span className="text-primary">Message</span></h2>
              
              <form>
                <div className={styles['form-row']}>
                  <div className={styles['form-group']}>
                    <label htmlFor="firstName" className={styles['form-label']}>First Name</label>
                    <input type="text" id="firstName" className={styles['form-input']} placeholder="John" required />
                  </div>
                  <div className={styles['form-group']}>
                    <label htmlFor="lastName" className={styles['form-label']}>Last Name</label>
                    <input type="text" id="lastName" className={styles['form-input']} placeholder="Doe" required />
                  </div>
                </div>

                <div className={styles['form-group']}>
                  <label htmlFor="email" className={styles['form-label']}>Email Address</label>
                  <input type="email" id="email" className={styles['form-input']} placeholder="john@example.com" required />
                </div>

                <div className={styles['form-group']}>
                  <label htmlFor="subject" className={styles['form-label']}>Subject</label>
                  <input type="text" id="subject" className={styles['form-input']} placeholder="How can we help?" required />
                </div>

                <div className={styles['form-group']}>
                  <label htmlFor="message" className={styles['form-label']}>Message</label>
                  <textarea id="message" className={styles['form-textarea']} placeholder="Your message..." required></textarea>
                </div>

                <Button type="submit" className={styles['submit-btn']} icon={<Send size={18} />}>
                  Send Message
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
