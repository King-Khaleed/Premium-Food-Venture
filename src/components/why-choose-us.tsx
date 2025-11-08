'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

const stats = [
  { value: '500+', label: 'Happy Customers' },
  { value: '100%', label: 'Fresh Products' },
  { value: '24hr', label: 'Delivery' }
];

export function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="w-full py-20 md:py-32 bg-cream-light">
      <div className="container grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-charcoal">Why Choose Us?</h2>
          <div className="space-y-6">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex items-end gap-4"
              >
                <span className="text-5xl md:text-7xl font-bold font-headline text-accent">{stat.value}</span>
                <span className="text-xl font-ui text-charcoal/80 pb-2">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="relative h-[300px] md:h-[500px]">
          <motion.div 
            className="absolute top-0 left-0 w-2/3 h-2/3 z-10"
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
            transition={{ duration: 0.3 }}
            initial={{rotate: -8}}
          >
            <Image src="https://picsum.photos/seed/collage1/400/400" alt="Collage image 1" layout="fill" className="object-cover rounded-lg shadow-xl border-4 border-white" />
          </motion.div>
           <motion.div 
            className="absolute bottom-0 right-0 w-3/5 h-3/5 z-10"
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
            transition={{ duration: 0.3 }}
             initial={{rotate: 5}}
          >
            <Image src="https://picsum.photos/seed/collage2/300/300" alt="Collage image 2" layout="fill" className="object-cover rounded-lg shadow-xl border-4 border-white" />
          </motion.div>
           <motion.div 
            className="absolute top-1/4 right-1/4 w-1/2 h-1/2 z-0"
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
            transition={{ duration: 0.3 }}
             initial={{rotate: 12}}
          >
            <Image src="https://picsum.photos/seed/collage3/350/350" alt="Collage image 3" layout="fill" className="object-cover rounded-lg shadow-xl border-4 border-white" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
