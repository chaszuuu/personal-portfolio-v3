"use client";

import { useState } from "react";
import { projects } from "@/lib/data";

export default function ProjectsGrid() {
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  return (
    <div className="proj-grid">
      {projects.map((p) => {
        const isOpen = openTitle === p.title;
        const techs = p.sub.split(/\s*\u00b7\s*/).filter(Boolean);

        return (
          <div className={`proj-card ${isOpen ? "open" : ""}`} key={p.title}>
            <button
              type="button"
              className="proj-card-head"
              onClick={() => setOpenTitle(isOpen ? null : p.title)}
              aria-expanded={isOpen}
            >
              <span className="proj-card-badge">‹ {p.badge} ›</span>

              <div className="proj-card-top">
                <div className="proj-card-icon" style={{ background: p.gradient }}>
                  {p.title.charAt(0)}
                </div>
                <div className="proj-card-title">{p.title}</div>
              </div>

              <div className="proj-card-chips">
                {techs.map((t) => (
                  <span className="proj-card-chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>

              <div className="proj-card-desc">{p.desc}</div>

              <div className="proj-card-expand">
                {isOpen ? "hide details" : "view details"}
                <span className="expand-chevron">⌄</span>
              </div>
            </button>

            <div className="proj-details-wrap">
              <div className="proj-details">
                {p.bullets.map((b, i) => (
                  <div className="bullet" key={i}>
                    {b}
                  </div>
                ))}
                <a
                  className="proj-details-link"
                  href={p.link}
                  target="_blank"
                  rel="noopener"
                >
                  View repo ↗
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}