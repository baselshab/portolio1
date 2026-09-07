import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import Marquee from "@/components/Marquee/Marquee";
import Projects from "@/components/Projects/Projects";
import About from "@/components/About/About";
import Services from "@/components/Services/Services";
import Stack from "@/components/Stack/Stack";
import Contact from "@/components/Contact/Contact";
import { getProjects } from "@/lib/api/projects";

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Projects initialProjects={projects} />
        <About />
        <Services />
        <Stack />
        <Contact />
      </main>
    </>
  );
}
