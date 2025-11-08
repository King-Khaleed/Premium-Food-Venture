'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from './ui/button';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.04,
    },
  },
};

const letter = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');
  const title = "PREMIUM FOOD VENTURE";
  const whatsappLink = "https://wa.me/2348158998166";

  return (
    <section className="relative h-screen min-h-[600px] w-full flex flex-col items-center justify-center text-center text-white overflow-hidden">
      {heroImage && (
        <motion.div
          className="absolute inset-0"
          style={{ y: 0 }}
          animate={{ y: ['0%', '10%'] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        >
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 p-4 max-w-4xl">
        <motion.h1 
          className="text-5xl md:text-8xl font-headline font-bold mb-4"
          variants={sentence}
          initial="hidden"
          animate="visible"
        >
          {title.split("").map((char, index) => (
            <motion.span key={char + "-" + index} variants={letter}>
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p 
          className="font-subheadline text-xl md:text-3xl italic mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          ...its premium services or nothing
        </motion.p>
        
        {/* Placeholder for typewriter effect */}
        <motion.p 
          className="font-ui text-lg md:text-2xl mb-12"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 2, duration: 0.5 }}
        >
          Fresh. Premium. Delivered.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <Button size="lg" className="font-ui bg-gradient-to-r from-accent to-gold-light text-primary-dark font-bold hover:opacity-90 transition-opacity" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">Order Now</a>
          </Button>
          <Button size="lg" variant="outline" className="font-ui bg-transparent border-accent text-accent hover:bg-accent hover:text-primary-dark transition-colors" asChild>
            <Link href="#products">View Products</Link>
          </Button>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-10"
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        <ArrowDown className="h-8 w-8 text-white/70" />
      </motion.div>
    </section>
  );
}
