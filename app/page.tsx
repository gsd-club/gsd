import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyAI from "@/components/WhyAI";
import Process from "@/components/Process";
import Work from "@/components/Work";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HeroScrollExit from "@/components/HeroScrollExit";
import ScrollBlock from "@/components/ScrollBlock";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main>
        {/* Hero pins and shrinks/blurs as you scroll past */}
        <HeroScrollExit>
          <Hero />
        </HeroScrollExit>

        {/* Each section opens like Igloo — compact block expands to full viewport */}
        <ScrollBlock bg="#060611">
          <Services />
        </ScrollBlock>

        <ScrollBlock bg="#0a0a0a">
          <WhyAI />
        </ScrollBlock>

        <ScrollBlock bg="#0a0a0a">
          <Process />
        </ScrollBlock>

        {/* Work uses GSAP horizontal scroll — no ScrollBlock wrapper */}
        <Work />

        <ScrollBlock bg="#060611">
          <Pricing />
        </ScrollBlock>

        <ScrollBlock bg="#0a0a0a" scrollDistance={100}>
          <Contact />
        </ScrollBlock>
      </main>
      <Footer />
    </>
  );
}
