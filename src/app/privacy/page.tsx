import React from 'react';
import { 
  Shield, 
  Eye, 
  Users, 
  Lock, 
  Clock, 
  FileText, 
  Info, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar 
} from 'lucide-react';
import styles from './Privacy.module.css';

export const metadata = {
  title: 'Privacy Policy | Fire Shield Company Limited',
  description: 'Our commitment to protecting your privacy and personal data. Learn about how we collect, use, and safeguard information at Fire Shield Company Limited.',
};

export default function PrivacyPolicy() {
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: <Info size={22} />,
      content: (
        <>
          <p>
            Fire Shield Company Limited (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is a premier, 100% Ghanaian-owned engineering company. We are committed to protecting your privacy and ensuring that your personal data is handled in a safe, transparent, and responsible manner.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (fireshieldghana.com), request a consultation, utilize our services, or interact with our team. By using our website or services, you consent to the data practices described in this policy.
          </p>
        </>
      ),
    },
    {
      id: 'information-collection',
      title: '1. Information We Collect',
      icon: <Eye size={22} />,
      content: (
        <>
          <p>
            We may collect several types of information from and about users of our website and services, including:
          </p>
          <ul className={styles.bulletList}>
            <li>
              <strong>Personal Identifiers:</strong> Name, job title, company name, email address, telephone number, and physical office address.
            </li>
            <li>
              <strong>Project Details:</strong> Information regarding your facility, security requirements, electrical systems, or fire safety needs that you share when requesting audits or quotes.
            </li>
            <li>
              <strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, operating system, and information about how you navigate and interact with our website.
            </li>
            <li>
              <strong>Communication Records:</strong> Copies of your emails, support inquiries, or feedback submitted through our contact forms.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'information-usage',
      title: '2. How We Use Your Information',
      icon: <FileText size={22} />,
      content: (
        <>
          <p>
            We use the information we collect to operate our business and deliver the engineering solutions you request. Specifically, your data is used to:
          </p>
          <ul className={styles.bulletList}>
            <li>Provide, design, install, and maintain our fire engineering, electronic security, electrical, and data center systems.</li>
            <li>Respond to your requests, questions, or concerns, and schedule facility audits or consultations.</li>
            <li>Manage our contractual relationship with you, including invoicing, billing, and technical support.</li>
            <li>Improve our website, services, and client experience by analyzing usage patterns and technical performance.</li>
            <li>Comply with applicable Ghanaian laws, safety codes, and regulatory obligations.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'information-sharing',
      title: '3. Sharing Your Information',
      icon: <Users size={22} />,
      content: (
        <>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may disclose your information under the following limited circumstances:
          </p>
          <ul className={styles.bulletList}>
            <li>
              <strong>With Subcontractors and Partners:</strong> We may share necessary details with trusted engineering partners or certified subcontractors who assist us in executing specific technical tasks, subject to strict confidentiality agreements.
            </li>
            <li>
              <strong>For Legal Compliance:</strong> We may disclose information if required to do so by law, court order, or governmental authorities, particularly in compliance with the Ghana Data Protection Act, 2012 (Act 843).
            </li>
            <li>
              <strong>Protection of Rights:</strong> To protect and defend the rights, safety, or property of Fire Shield Company Limited, our clients, or the public.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'data-security',
      title: '4. Data Security',
      icon: <Lock size={22} />,
      content: (
        <>
          <p>
            The security of your information is a top priority. We implement appropriate physical, electronic, and managerial procedures to safeguard and secure the data we collect.
          </p>
          <p>
            Access to your personal and project information is restricted to authorized employees and subcontractors who need to know that information to perform their duties. However, please be aware that no method of transmission over the internet or physical storage is completely secure, and we cannot guarantee absolute security.
          </p>
        </>
      ),
    },
    {
      id: 'data-retention',
      title: '5. Data Retention',
      icon: <Clock size={22} />,
      content: (
        <>
          <p>
            We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy, or as required by law (such as for tax, audit, or legal reporting obligations in Ghana).
          </p>
          <p>
            When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it.
          </p>
        </>
      ),
    },
    {
      id: 'your-rights',
      title: '6. Your Data Rights',
      icon: <Shield size={22} />,
      content: (
        <>
          <p>
            In accordance with the <strong>Ghana Data Protection Act, 2012 (Act 843)</strong>, you have specific rights regarding your personal information, including:
          </p>
          <ul className={styles.bulletList}>
            <li>The right to request access to the personal data we hold about you.</li>
            <li>The right to request correction of any inaccurate or incomplete personal data.</li>
            <li>The right to request deletion of your personal data when it is no longer necessary for the purposes collected.</li>
            <li>The right to object to or restrict the processing of your personal data under certain conditions.</li>
          </ul>
          <p>
            To exercise any of these rights, please contact our Data Protection Officer using the contact details provided below.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className="heading-xl animate-fade-in-up">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="subheading animate-fade-in-up delay-100">
            We value your trust. Read our policy to understand how we protect, handle, and secure your personal and project data.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.privacyLayout}>
            
            {/* Left Column: Table of Contents */}
            <aside className={styles.tocColumn}>
              <div className={styles.tocSticky}>
                <h3 className={styles.tocTitle}>Table of Contents</h3>
                <nav>
                  <ul className={styles.tocList}>
                    {sections.map((sec) => (
                      <li key={sec.id} className={styles.tocItem}>
                        <a href={`#${sec.id}`} className={styles.tocLink}>
                          {sec.title}
                        </a>
                      </li>
                    ))}
                    <li className={styles.tocItem}>
                      <a href="#contact-us" className={styles.tocLink}>
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Right Column: Detailed Policy Content */}
            <main className={styles.contentColumn}>
              <span className={styles.lastUpdated}>
                <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                Last Updated: May 2026
              </span>

              {sections.map((sec) => (
                <div key={sec.id} id={sec.id} className={styles.policyCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.iconWrapper}>{sec.icon}</div>
                    <h2>{sec.title}</h2>
                  </div>
                  {sec.content}
                </div>
              ))}

              {/* Contact Us Card */}
              <div id="contact-us" className={styles.policyCard} style={{ scrollMarginTop: '100px' }}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    <Shield size={22} />
                  </div>
                  <h2>Inquiries & Contact</h2>
                </div>
                <p>
                  If you have any questions about this Privacy Policy, your data protection rights, or our security practices, please do not hesitate to contact our team:
                </p>

                <div className={styles.contactCard}>
                  <h3>Fire Shield Company Limited</h3>
                  <div className={styles.contactInfoGrid}>
                    <div className={styles.contactInfoItem}>
                      <MapPin size={20} className="text-primary" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <h4>Our Office</h4>
                        <p>54 Faanofa Road, Kokomlemle<br />Accra, Ghana</p>
                      </div>
                    </div>
                    <div className={styles.contactInfoItem}>
                      <Phone size={20} className="text-primary" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <h4>Phone Numbers</h4>
                        <p>+233 544015490<br />+233 501676271</p>
                      </div>
                    </div>
                    <div className={styles.contactInfoItem}>
                      <Mail size={20} className="text-primary" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <h4>Email Addresses</h4>
                        <p>info@fireshieldghana.com<br />support@fireshieldghana.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </main>

          </div>
        </div>
      </section>
    </div>
  );
}
