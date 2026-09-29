import type { Metadata } from "next";
import Link from "next/link";
import ProjectsGrid from "@/components/ProjectsGrid";

export const metadata: Metadata = {
  title: "All Projects — Charles Vincent Panlilio",
  description:
    "Every project by Charles Vincent Panlilio, full-stack & mobile developer.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="section">
        <div className="wrap">
          <Link href="/" className="proj-back">
            ← Back
          </Link>
          <div className="kicker" style={{ marginTop: 16 }}>
            All Projects
          </div>
          <ProjectsGrid />
        </div>
      </section>

      <footer className="end">
        <div className="wrap">© 2026 Charles Vincent Panlilio</div>
      </footer>
    </>
  );
}