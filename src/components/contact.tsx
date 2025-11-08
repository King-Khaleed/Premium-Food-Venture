
import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

export function Contact() {
  return (
    <section id="contact" className="relative w-full py-20 md:py-32 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/img/background-location-map.jpg')"}}>
      <div className="absolute inset-0 bg-[#1B4332]/80" />
      <div className="container relative z-10 text-center text-white">
        <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6">
          Visit Us or Order Now
        </h2>
        <div className="flex items-center justify-center gap-2 text-lg md:text-xl mb-12 animate-bounce">
          <MapPin className="h-6 w-6 text-accent" />
          <p>Plot 48119 Malum Sufyan Street, Dantulse Ward, Tarauni L.G.A, Kano, Nigeria</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-primary-foreground font-ui">
            <a href="tel:08158998166">
              <Phone className="mr-2 h-5 w-5" />
              Call Us
            </a>
          </Button>
          <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-ui animate-pulse">
            <a href="https://wa.me/2348034384620" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Order via WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
