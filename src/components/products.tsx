import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from './ui/button';
import { createSupabaseAnonClient } from '@/lib/supabase-client';

const whatsappLink = "https://wa.me/2348034384620";

export async function Products() {
  const supabase = createSupabaseAnonClient();
  let products = [];

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true); // Fetch only featured products

    if (error) {
      console.error('Error fetching featured products:', error.message);
    } else {
      products = data || [];
    }
  } catch (error) {
    console.error('Error in Supabase client operation:', error);
    products = [];
  }

  return (
    <section id="products" className="w-full py-20 md:py-32 bg-cream-dark">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-charcoal">Featured Products</h2>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {products.map((product) => {
              return (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="rounded-lg overflow-hidden group">
                      <CardContent className="relative aspect-square p-0">
                        {product.image_url && (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            // data-ai-hint={product.imageHint} // imageHint is no longer directly available from the product table
                          />
                        )}
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button asChild className="font-ui bg-accent text-primary-dark">
                             <a href={whatsappLink} target="_blank" rel="noopener noreferrer">Quick Order</a>
                          </Button>
                        </div>
                      </CardContent>
                      <div className="p-4 bg-white">
                        <h3 className="font-headline text-xl font-bold text-charcoal">{product.name}</h3>
                        <p className="font-body text-charcoal/80">{product.description}</p>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12" />
        </Carousel>
      </div>
    </section>
  );
}