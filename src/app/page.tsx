import { Hero } from '@/components/hero';
import { Products } from '@/components/products';
import { Gallery } from '@/components/gallery';
import { Services } from '@/components/services';
import { WhyChooseUs } from '@/components/why-choose-us';
import { Testimonials } from '@/components/testimonials';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';

export const revalidate = 0;

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <WhyChooseUs />
      <Products />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
