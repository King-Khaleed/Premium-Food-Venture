
'use client';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Aisha Mohammed",
    avatar: "/img/female-headshot.jpg",
    rating: 5,
    text: "The best quality chicken I've ever bought! Fresh, tender, and delivered right on time."
  },
  {
    id: 2,
    name: "Ibrahim Yusuf",
    avatar: "/img/male-headshot.jpg",
    rating: 5,
    text: "Their fish is always fresh and the delivery service is exceptional. Highly recommend!"
  },
  {
    id: 3,
    name: "Fatima Abdullahi",
    avatar: "/img/female-headshot.jpg",
    rating: 5,
    text: "Premium quality at reasonable prices. The dried fish is my favorite!"
  }
];

export function Testimonials() {
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
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id}>
                <div className="p-1">
                  <Card className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <CardContent className="p-8 text-center">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        className="rounded-full mx-auto mb-4 border-4 border-accent"
                      />
                      <h3 className="font-ui font-bold text-xl text-charcoal mb-1">{testimonial.name}</h3>
                      <div className="flex justify-center mb-4">
                        {Array(testimonial.rating).fill(0).map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                        ))}
                      </div>
                      <p className="font-subheadline italic text-lg text-charcoal/80">"{testimonial.text}"</p>
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
