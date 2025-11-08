'use client';
import { motion } from 'framer-motion';

const steps = [
  {
    number: 1,
    title: "Place Your Order",
    description: "Browse our products and place your order online or via WhatsApp."
  },
  {
    number: 2,
    title: "We Prepare Your Package",
    description: "We carefully select and prepare your premium products."
  },
  {
    number: 3,
    title: "Fast Delivery",
    description: "Your order is delivered to your doorstep within 24 hours."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-20 md:py-32 bg-cream-dark">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-charcoal">How It Works</h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4" />
        </div>
        <div className="relative">
          {/* Timeline */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-accent/30 -translate-x-1/2 hidden md:block"></div>
          
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="md:flex items-center md:justify-center">
                  <motion.div 
                    className={`md:w-5/12 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:order-2 md:text-left'}`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <h3 className="text-2xl font-bold font-headline text-charcoal mb-2">{step.title}</h3>
                      <p className="font-body text-charcoal/80">{step.description}</p>
                    </div>
                  </motion.div>
                  
                  {/* Badge */}
                  <motion.div 
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-accent rounded-full flex items-center justify-center font-bold text-white text-xl z-10 hidden md:flex"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    {step.number}
                  </motion.div>
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center font-bold text-white text-xl z-10 md:hidden my-4 mx-auto">
                    {step.number}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
