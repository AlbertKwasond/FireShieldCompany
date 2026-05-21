import React from 'react';
import { 
  FileText, 
  HelpCircle, 
  FileCheck, 
  AlertTriangle, 
  Scale, 
  RefreshCw, 
  Calendar 
} from 'lucide-react';
import styles from './Terms.module.css';

export const metadata = {
  title: 'Terms of Service | Fire Shield Company Limited',
  description: 'Terms and conditions governing the use of Fire Shield Company Limited\'s website, consultations, and engineering services.',
};

export default function TermsOfService() {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <FileCheck size={22} />,
      content: (
        <>
          <p>
            Welcome to the website of Fire Shield Company Limited (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By accessing or using our website (fireshieldghana.com), requesting quotes, or scheduling technical audits, you agree to comply with and be bound by these Terms of Service.
          </p>
          <p>
            If you do not agree to these terms, you must not access or use this website. These terms govern your initial interaction with our online systems and serve as a prelude to any formal service-level agreements (SLA) executed offline for physical installations and engineering work.
          </p>
        </>
      ),
    },
    {
      id: 'scope-of-services',
      title: '1. Scope of Online Services',
      icon: <HelpCircle size={22} />,
      content: (
        <>
          <p>
            This website provides corporate information, technical descriptions, and request channels for our core services, including:
          </p>
          <ul className={styles.bulletList}>
            <li>Fire Engineering, detection, and gas suppression system design.</li>
            <li>Electronic security, CCTV, and biometric access control planning.</li>
            <li>Industrial and commercial electrical infrastructure consulting.</li>
            <li>Data center cooling, racking, and UPS infrastructure setup.</li>
          </ul>
          <p>
            Any quotes, proposals, or estimates generated through online inquiries are preliminary and subject to physical site inspections, technical auditing, and formal contracts signed by both parties.
          </p>
        </>
      ),
    },
    {
      id: 'intellectual-property',
      title: '2. Intellectual Property Rights',
      icon: <FileText size={22} />,
      content: (
        <>
          <p>
            The content on this website, including but not limited to text, graphics, logos, images, icons, and software, is the property of Fire Shield Company Limited and is protected by Ghanaian and international copyright, trademark, and intellectual property laws.
          </p>
          <p>
            You are granted a limited, non-exclusive, non-transferable license to access the site and download technical sheets or literature solely for your personal or internal business research. You may not reproduce, distribute, modify, or republish any content from this site without our prior written consent.
          </p>
        </>
      ),
    },
    {
      id: 'user-conduct',
      title: '3. Acceptable Use & Conduct',
      icon: <AlertTriangle size={22} />,
      content: (
        <>
          <p>
            When interacting with our contact forms, support ticket systems, or emergency requests, you agree not to:
          </p>
          <ul className={styles.bulletList}>
            <li>Provide false, inaccurate, or misleading contact or billing information.</li>
            <li>Transmit any spam, viruses, malware, or destructive code through our web interfaces.</li>
            <li>Attempt to gain unauthorized access to our web servers, database systems, or secure networks.</li>
            <li>Use our brand name, logo, or service descriptions to misrepresent your affiliation with us.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'liability-limits',
      title: '4. Limitation of Liability',
      icon: <Scale size={22} />,
      content: (
        <>
          <p>
            While we strive to ensure that all information on this website is accurate and up-to-date, the site is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, express or implied.
          </p>
          <p>
            Fire Shield Company Limited shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of or inability to use this website, including but not limited to reliance on informational articles, blog posts, or preliminary estimations.
          </p>
        </>
      ),
    },
    {
      id: 'governing-law',
      title: '5. Governing Law',
      icon: <Scale size={22} />,
      content: (
        <>
          <p>
            These Terms of Service, your use of this website, and any preliminary online engagements are governed by and construed in accordance with the laws of the <strong>Republic of Ghana</strong>.
          </p>
          <p>
            Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts of Ghana, with Accra as the venue for legal proceedings.
          </p>
        </>
      ),
    },
    {
      id: 'changes-to-terms',
      title: '6. Changes to Terms',
      icon: <RefreshCw size={22} />,
      content: (
        <>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms of Service at any time. Changes will take effect immediately upon being posted on this page.
          </p>
          <p>
            Your continued use of the website following the posting of any changes constitutes acceptance of the new terms. We recommend checking this page periodically to remain informed of updates.
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
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="subheading animate-fade-in-up delay-100">
            Understand the terms, guidelines, and legal framework governing your use of our website and services.
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.termsLayout}>
            
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
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Right Column: Detailed Terms Content */}
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
            </main>

          </div>
        </div>
      </section>
    </div>
  );
}
