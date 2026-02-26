import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import MetricsStrip from "@/components/sections/MetricsStrip";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import TechArsenal from "@/components/sections/TechArsenal";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <MetricsStrip />
        <Experience />
        <Projects />
        <TechArsenal />
        <About />
        <Contact />
      </main>
    </>
  );
}
