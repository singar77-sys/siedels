import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Team } from '@/components/Team';
import { Services } from '@/components/Services';
import { TheShop } from '@/components/TheShop';
import { Visit } from '@/components/Visit';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Team />
        <Services />
        <TheShop />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
