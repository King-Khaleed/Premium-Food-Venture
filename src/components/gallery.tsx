'use client';
import Image from 'next/image';
import { useState } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const filters = ['All', 'Fish', 'Chicken', 'Dried Products'];

export function Gallery() {
  const allImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery-'));
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredImages = activeFilter === 'All' 
    ? allImages 
    : allImages.filter(image => image.category === activeFilter.toLowerCase());

  const selectedImage = allImages.find(img => img.id === selectedId);

  return (
    <section id="gallery" className="w-full py-20 md:py-24 lg:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6">
             <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter font-headline">From Our Kitchen</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        A glimpse into the freshness and quality we promise. Explore our premium products.
                    </p>
                </div>
            </div>

            <div className="flex justify-center items-center gap-2 md:gap-4 mb-12 sticky top-20 z-40 bg-secondary/30 py-4">
                {filters.map(filter => (
                    <Button 
                        key={filter}
                        variant={activeFilter === filter ? 'default' : 'outline'}
                        className={`font-ui transition-all duration-300 ${activeFilter === filter ? 'bg-accent text-primary-dark' : 'bg-transparent'}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredImages.map((image) => (
                    <motion.div
                        key={image.id}
                        layoutId={image.id}
                        onClick={() => setSelectedId(image.id)}
                        className="cursor-pointer"
                    >
                        <Card className="overflow-hidden rounded-xl shadow-sm group">
                            <CardContent className="relative flex aspect-square items-center justify-center p-0">
                                <Image
                                    src={image.imageUrl}
                                    alt={image.description}
                                    width={600}
                                    height={600}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={image.imageHint}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                                  <h3 className="text-white font-headline text-xl font-bold">{image.title}</h3>
                                  <p className="text-white/80 font-body">{image.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                      className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSelectedId(null)}
                    >
                        <motion.div 
                          className="relative max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-2xl flex flex-col"
                          layoutId={selectedImage.id}
                          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
                        >
                          <div className="relative w-full aspect-video">
                            <Image
                                src={selectedImage.imageUrl}
                                alt={selectedImage.description}
                                fill
                                className="object-contain rounded-t-lg"
                            />
                          </div>
                           <div className="p-6 text-center">
                              <h3 className="font-headline text-2xl font-bold text-charcoal">{selectedImage.title}</h3>
                              <p className="font-body text-charcoal/80 mt-2">{selectedImage.description}</p>
                              <Button asChild size="lg" className="mt-6 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-ui animate-pulse">
                                <a href="https://wa.me/2348034384620" target="_blank" rel="noopener noreferrer">
                                  Order This Product
                                </a>
                              </Button>
                           </div>
                        </motion.div>
                         <motion.button 
                            className="absolute top-4 right-4 text-white hover:text-accent transition-colors"
                            onClick={() => setSelectedId(null)}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
                        >
                            <X size={32} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </section>
  );
}
