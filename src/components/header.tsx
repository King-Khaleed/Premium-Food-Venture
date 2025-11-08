'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Menu as MenuIcon, X } from 'lucide-react';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '#products' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navLinks.filter(l => l.href.startsWith('#')).map(l => l.href.substring(1));
      let current = 'Home';
      for(const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section && window.scrollY >= section.offsetTop - 100) {
          const link = navLinks.find(l => l.href === `#${sectionId}`);
          if(link) current = link.name;
        }
      }
      if(window.location.pathname === '/') {
        setActiveLink(current);
      } else if (window.location.pathname === '/gallery') {
        setActiveLink('Gallery');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled ? "bg-white/80 shadow-md backdrop-blur-sm" : "bg-transparent",
        )}
      >
        <div className="container flex h-20 max-w-screen-2xl items-center justify-between">
          <Logo isScrolled={scrolled} />
          
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}
                 className={cn(
                   "font-ui text-sm font-medium transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full",
                   activeLink === link.name ? 'text-accent' : (scrolled ? 'text-charcoal' : 'text-white'),
                   !scrolled && "hover:text-white"
                 )}
                 onClick={() => setActiveLink(link.name)}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-6">
            <a href="tel:08158998166" className={cn("flex items-center gap-2 font-ui text-sm font-medium transition-colors", scrolled ? 'text-charcoal hover:text-accent' : 'text-white hover:text-accent')}>
              <Phone className="h-4 w-4" />
              0815 8998 166
            </a>
             <a href="https://wa.me/2348158998166" target="_blank" rel="noopener noreferrer" className="relative">
              <MessageCircle className={cn("h-6 w-6 transition-colors", scrolled ? 'text-charcoal hover:text-accent' : 'text-white hover:text-accent')} />
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </a>
          </div>

          <button
            className="lg:hidden text-2xl"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon className={cn("h-7 w-7", scrolled ? 'text-charcoal' : 'text-white')} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 z-[100] bg-cream-light transform transition-transform duration-500 ease-in-out lg:hidden",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="container h-full">
          <div className="flex justify-end pt-8">
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <X className="h-8 w-8 text-charcoal" />
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center h-full -mt-16 space-y-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}
                className="font-ui text-3xl font-medium text-charcoal transition-colors hover:text-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
