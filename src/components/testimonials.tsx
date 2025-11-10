import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star } from 'lucide-react';
import { createSupabaseClient } from "@/lib/supabase-client";

export async function Testimonials() {
  const supabase = createSupabaseClient();
  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_approved', true); // Fetch only approved testimonials

  if (error) {
    console.error('Error fetching testimonials:', error.message);
    // You might want to return an empty array or a specific error UI here
    // For now, we'll proceed with an empty array if there's an error
    return (
      <section id="testimonials" className="w-full py-20 md:py-32 bg-cream-light">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-charcoal">What Our Customers Say</h2>
            <div className="w-24 h-1 bg-accent mx-auto mt-4" />
          </div>
          <p className="text-center text-red-500">Failed to load testimonials. Please try again later.</p>
        </div>
      </section>
    );
  }

  // Ensure testimonials is an array, even if null was returned on error
  const approvedTestimonials = testimonials || [];

  return (
    <section id="testimonials" className="w-full py-20 md:py-32 bg-cream-light">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-charcoal">What Our Customers Say</h2>
          <div className="w-24 h-1 bg-accent mx-auto mt-4" />
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-2xl mx-auto"
        >
          <CarouselContent>
            {approvedTestimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id}>
                <div className="p-1">
                  <Card className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <CardContent className="p-8 text-center">
                      {testimonial.avatar_url && (
                        <Image
                          src={testimonial.avatar_url}
                          alt={testimonial.author_name || "Testimonial author"}
                          width={80}
                          height={80}
                          className="rounded-full mx-auto mb-4 border-4 border-accent"
                        />
                      )}
                      <h3 className="font-ui font-bold text-xl text-charcoal mb-1">{testimonial.author_name}</h3>
                      <div className="flex justify-center mb-4">
                        {testimonial.rating && Array(testimonial.rating).fill(0).map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                        ))}
                      </div>
                      <p className="font-subheadline italic text-lg text-charcoal/80">"{testimonial.content}"</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12" />
        </Carousel>
      </div>
    </section>
  );
}