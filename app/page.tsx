import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import MetricsStrip from "@/components/sections/MetricsStrip";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import GitHubActivity from "@/components/sections/GitHubActivity";
import TechArsenal from "@/components/sections/TechArsenal";
import Writing from "@/components/sections/Writing";
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
        <GitHubActivity />
        <TechArsenal />
        <Writing />
        <About />
        <Contact />
      </main>
    </>
  );
}
