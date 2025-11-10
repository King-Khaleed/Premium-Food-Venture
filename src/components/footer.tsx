'use client';

import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Logo } from './logo';

const Wave = () => (
  <div className="bg-cream-dark">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="fill-current text-[#1B4332]">
      <path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,96C960,107,1056,117,1152,106.7C1248,96,1344,64,1392,48L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
    </svg>
  </div>
);

export function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const getHref = (href: string) => {
    if (href.startsWith('#') && !isHomePage) {
      return `/${href}`;
    }
    return href;
  };

  return (
    <footer className="bg-[#1B4332] text-white pt-1">
      <Wave />
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <Logo isFooter={true} />
            <p className="mt-4 font-subheadline text-cream-light/80">...its premium services or nothing</p>
          </div>
          <div>
            <h3 className="font-ui font-bold text-lg mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href={getHref('/')} className="hover:text-accent transition-colors">Home</a></li>
              <li><a href={getHref('#products')} className="hover:text-accent transition-colors">Products</a></li>
              <li><a href="/gallery" className="hover:text-accent transition-colors">Gallery</a></li>
              <li><a href={getHref('#about')} className="hover:text-accent transition-colors">About</a></li>
              <li><a href={getHref('#contact')} className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-ui font-bold text-lg mb-4 text-accent">Products</h3>
            <ul className="space-y-2">
              <li><a href={getHref('#products')} className="hover:text-accent transition-colors">Fresh Fish</a></li>
              <li><a href={getHref('#products')} className="hover:text-accent transition-colors">Premium Chicken</a></li>
              <li><a href={getHref('#products')} className="hover:text-accent transition-colors">Dried Products</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-ui font-bold text-lg mb-4 text-accent">Contact</h3>
            <div className="space-y-2">
              <p><a href="tel:08158998166" className="hover:text-accent transition-colors">0815 8998 166</a></p>
              <p><a href="tel:08034304820" className="hover:text-accent transition-colors">0803 4304 820</a></p>
            </div>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <a href="#" aria-label="Facebook" className="hover:text-accent transition-colors"><Facebook /></a>
              <a href="#" aria-label="Instagram" className="hover:text-accent transition-colors"><Instagram /></a>
              <a href="#" aria-label="Twitter" className="hover:text-accent transition-colors"><Twitter /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-primary mt-8 pt-6 text-center text-cream-light/70">
          <p>&copy; {new Date().getFullYear()} Premium Food Venture. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
