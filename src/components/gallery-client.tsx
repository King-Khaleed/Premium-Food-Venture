'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export type GalleryImage = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string; // Changed from imageUrl to image_url to match Supabase schema
  category: string | null;
  imageHint?: string | null; // Optional, might be removed if not stored in DB
};

const filters = ['All', 'Fish', 'Chicken', 'Dried Products'];

interface GalleryClientProps {
  initialImages: GalleryImage[];
}

export function GalleryClient({ initialImages }: GalleryClientProps) {
  // Map initialImages to match the structure expected by the component if needed,
  // or adjust the component to directly use image_url and category.
  // Assuming initialImages already has image_url and category.
  const allImages = initialImages.filter(img => img.image_url); // Ensure images have a URL

  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredImages = activeFilter === 'All'
    ? allImages
    : allImages.filter(image => image.category?.toLowerCase() === activeFilter.toLowerCase());

  const selectedImage = allImages.find(img => img.id === selectedId);

  return (
    <>
      <div className="flex justify-center items-center gap-2 md:gap-4 mb-12 bg-secondary/30 py-4">
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
                  src={image.image_url} // Use image_url from Supabase
                  alt={image.description || image.title || "Gallery image"}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  // data-ai-hint={image.imageHint} // imageHint might not be in Supabase
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
                  src={selectedImage.image_url} // Use image_url
                  alt={selectedImage.description || selectedImage.title || "Selected gallery image"}
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
    </>
  );
}
