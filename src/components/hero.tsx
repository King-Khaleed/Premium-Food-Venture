import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center text-center">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 p-4 animate-in fade-in duration-500">
        <h1 className="text-4xl font-extrabold tracking-tighter text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl font-headline animate-in fade-in slide-in-from-bottom-12 duration-700">
          Premium Quality, Unbeatable Freshness
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-lg text-primary-foreground/80 md:text-xl animate-in fade-in slide-in-from-bottom-16 duration-900">
          From the ocean and the farm, delivered straight to your kitchen.
        </p>
      </div>
    </section>
  );
}
