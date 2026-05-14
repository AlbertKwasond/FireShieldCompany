'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Button } from './Button';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Industries', path: '/industries' },
    { name: 'Support', path: '/support' },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles['nav-container']}`}>
        <Link href="/" className={styles.logo}>
          <Image 
            src="/logo.png" 
            alt="Fire Shield Logo" 
            width={220} 
            height={60} 
            style={{ objectFit: 'contain' }} 
            priority
            unoptimized
          />
        </Link>

        <nav className={styles['nav-links']}>
          {navLinks.map((link) => (
            <Link key={link.name} href={link.path} className={styles['nav-link']}>
              {link.name}
            </Link>
          ))}
          <Link href="/contact">
            <Button>Get a Quote</Button>
          </Link>
        </nav>

        <button 
          className={styles['mobile-menu-btn']}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className={styles['mobile-menu-dropdown']}>
          <nav className="flex flex-col gap-md">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.path} className={styles['mobile-nav-link']}>
                {link.name}
              </Link>
            ))}
            <Link href="/contact" style={{ marginTop: '0.5rem' }}>
              <Button style={{ width: '100%' }}>Get a Quote</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
