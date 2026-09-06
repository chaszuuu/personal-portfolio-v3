import Hero from "@/components/Hero";
import Stack from "@/components/Stack";
import InteractiveSections from "@/components/InteractiveSections";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <div className="wrap">
        <Hero />
      </div>

      <Stack />
      <InteractiveSections />
      <Contact />

      <footer className="end">
        <div className="wrap">© 2026 Charles Vincent Panlilio</div>
      </footer>
    </>
  );
}
