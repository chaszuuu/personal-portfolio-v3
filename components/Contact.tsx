"use client";

import { useState } from "react";

const EMAIL = "panliliocharlesvincent@gmail.com";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked (e.g. insecure context) — the mailto link still works
    }
  };

  return (
    <section className="section" id="contact">
      <div className="wrap">
        <h2 className="contact-headline">Let's build something</h2>
        <p className="contact-subtext">
          Got an idea in mind? I'd love to hear about it.
        </p>
        <div className="contact-email-row">
          <a href={`mailto:${EMAIL}`} className="contact-email">
            {EMAIL}
          </a>
          <button
            type="button"
            className="contact-copy-btn"
            onClick={handleCopy}
            aria-label="Copy email address"
            title="Copy email address"
          >
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12.5 9.5 18 20 6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="9" y="9" width="12" height="12" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
          {copied && <span className="contact-copied-note">Copied</span>}
        </div>
      </div>
    </section>
  );
}