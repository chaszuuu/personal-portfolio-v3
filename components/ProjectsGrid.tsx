"use client";

import { useState } from "react";
import { projects } from "@/lib/data";
import ProjectIcon from "./ProjectIcon";

export default function ProjectsGrid() {
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  // Two independent columns (0, 2, 4… on the left; 1, 3, 5… on the right) so
  // opening a card only moves the cards beneath it in its own column.
  // On small screens the columns dissolve and `order` restores the sequence.
  const columns = [0, 1].map((c) =>
    projects.map((p, i) => ({ p, i })).filter(({ i }) => i % 2 === c)
  );

  return (
    <div className="proj-grid">
      {columns.map((col, c) => (
        <div className="proj-col" key={c}>
          {col.map(({ p, i }) => {
            const isOpen = openTitle === p.title;
            const techs = p.sub.split(/\s*\u00b7\s*/).filter(Boolean);
            const toggle = () => setOpenTitle(isOpen ? null : p.title);

            return (
              <div
                className={`proj-card ${isOpen ? "open" : ""}`}
                key={p.title}
                style={{ order: i }}
              >
                <button
                  type="button"
                  className="proj-card-head"
                  onClick={toggle}
                  aria-expanded={isOpen}
                >
                  <span className="proj-card-badge">‹ {p.badge} ›</span>

                  <div className="proj-card-top">
                    <ProjectIcon project={p} className="proj-card-icon" />
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
                </button>

                <div className="proj-details-wrap">
                  <div className="proj-details">
                    {p.bullets.map((b, bi) => (
                      <div className="bullet" key={bi}>
                        {b}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="proj-card-foot">
                  <div className="proj-card-foot-row">
                  <button
                    type="button"
                    className="proj-card-expand"
                    onClick={toggle}
                    aria-expanded={isOpen}
                  >
                    {isOpen ? "hide details" : "view details"}
                    <span className="expand-chevron">⌄</span>
                  </button>

                  <div className="proj-card-links">
{p.demo && (
  <a
    className="project-card-cta"
    href={p.demo}
    target="_blank"
    rel="noopener"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
    View Site
  </a>
)}
<a
                    className={`project-card-cta${p.demo ? " secondary" : ""}`}
                    aria-label="View repo"
                    href={p.link}
                    target="_blank"
                    rel="noopener"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.77.12 3.06.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.08.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .31.2.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                    </svg>
                    <span className="cta-label">View Repo</span>
                  </a>
</div>
</div>
{p.demo && p.demoNote && (
  <div className="project-card-note">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
    {p.demoNote}
  </div>
)}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}