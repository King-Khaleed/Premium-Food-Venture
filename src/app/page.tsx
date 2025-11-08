import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { Menu } from '@/components/menu';
import { Gallery } from '@/components/gallery';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Menu />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
