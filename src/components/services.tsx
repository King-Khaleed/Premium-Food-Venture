'use client';
import { Fish, Drumstick, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  {
    icon: <Fish className="h-10 w-10 text-accent" />,
    title: "Fresh Fish",
    description: "High-quality, fresh fish delivered to your doorstep."
  },
  {
    icon: <Drumstick className="h-10 w-10 text-accent" />,
    title: "Premium Chicken",
    description: "Tender, juicy, and ethically raised premium chicken."
  },
  {
    icon: <Truck className="h-10 w-10 text-accent" />,
    title: "Home Delivery",
    description: "Fast and reliable delivery service across Kano."
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
    },
  }),
};

export function Services() {
  return (
    <section id="about" className="w-full py-20 md:py-32 bg-cream-light">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-charcoal">Our Services</h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold font-headline text-charcoal mb-2">{service.title}</h3>
              <p className="font-body text-charcoal/80">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
