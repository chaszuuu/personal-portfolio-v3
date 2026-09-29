import Hero from "@/components/Hero";
import Stack from "@/components/Stack";
import InteractiveSections from "@/components/InteractiveSections";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="wrap">
        <Hero />
      </div>

      <Stack />
      <InteractiveSections />
      <Contact />
      <Footer />
    </>
  );
}