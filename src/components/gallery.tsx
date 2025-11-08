import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export function Gallery() {
  const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery-'));
  return (
    <section id="gallery" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6">
             <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">From Our Kitchen</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        A glimpse into the freshness and quality we promise.
                    </p>
                </div>
            </div>
            <Carousel className="w-full max-w-4xl mx-auto" opts={{ loop: true }}>
                <CarouselContent>
                    {galleryImages.map((image) => (
                        <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <Card className="overflow-hidden rounded-xl shadow-sm">
                                    <CardContent className="flex aspect-square items-center justify-center p-0">
                                        <Image
                                            src={image.imageUrl}
                                            alt={image.description}
                                            width={800}
                                            height={600}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            data-ai-hint={image.imageHint}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12 sm:ml-4" />
                <CarouselNext className="mr-12 sm:mr-4" />
            </Carousel>
        </div>
    </section>
  );
}
