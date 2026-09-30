"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="wrap error-page">
      <span className="error-badge">‹ ERROR · 500 ›</span>

      <div className="error-code" aria-hidden="true">
        5<span className="error-zero">0</span>0
      </div>

      <h1 className="error-title">Something went wrong</h1>
      <p className="error-text">
        An unexpected error broke this page. Try again, or head back home.
      </p>
      {error.digest && <p className="error-digest">ref: {error.digest}</p>}

      <div className="error-actions">
        <button type="button" className="project-card-cta" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="project-card-cta secondary">
          Back home
        </Link>
      </div>
    </main>
  );
}