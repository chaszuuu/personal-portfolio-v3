import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap error-page">
      <div className="error-code" aria-hidden="true">
        4<span className="error-zero">0</span>4
      </div>

      <h1 className="error-title">Page not found</h1>
      <p className="error-text">
        The page you&apos;re looking for doesn&apos;t exist, or it moved somewhere else.
      </p>

      <div className="error-actions">
        <Link href="/" className="project-card-cta">
          Back home
        </Link>
        <Link href="/projects" className="project-card-cta secondary">
          View projects
        </Link>
      </div>
    </main>
  );
}