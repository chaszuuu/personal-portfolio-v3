"use client";

import { useState } from "react";
import Link from "next/link";
import { experience, projects } from "@/lib/data";
import ProjectIcon from "./ProjectIcon";

export default function InteractiveSections() {
  const [openJob, setOpenJob] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState(0);

  return (
    <>
      <section className="section">
        <div className="wrap">
          <h2>Experience</h2>
          <div className="timeline">
            {experience.map((job) => {
              const isOpen = openJob === job.role;
              return (
                <div className={`t-item ${isOpen ? "open" : ""}`} key={job.role}>
                  <button
                    type="button"
                    className="t-item-head"
                    onClick={() => setOpenJob(isOpen ? null : job.role)}
                    aria-expanded={isOpen}
                  >
                    <div className="row">
                      <span className="role">{job.role}</span>
                      <span className="when">{job.when}</span>
                    </div>
                    <div className="org">{job.org}</div>
                    <div className="expand">
                      {isOpen ? "hide details" : "view details"}
                      <span className="expand-chevron">⌄</span>
                    </div>
                  </button>

                  <div className="t-details-wrap">
                    <div className="t-details">
                      {job.bullets.map((bullet, i) => (
                        <div key={i}>{bullet}</div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>Featured Projects</h2>
            <Link href="/projects" className="section-link">
              View All Projects →
            </Link>
          </div>

          <div className="project-stack">
            {projects.map((p, i) => {
              const total = projects.length;
              const rel = (i - activeProject + total) % total;
              const isActive = rel === 0;
              const isNext = rel === 1;
              const isPrev = rel === total - 1 && total > 2;

              const posClass = isActive
                ? "active"
                : isNext
                ? "next"
                : isPrev
                ? "prev"
                : "hidden";

              const techs = p.sub.split(/\s*\u00b7\s*/).filter(Boolean);

              return (
                <div
                  key={p.title}
                  className={`project-card ${posClass}`}
                  role={isActive ? undefined : "button"}
                  tabIndex={isActive ? undefined : posClass === "hidden" ? -1 : 0}
                  aria-label={isActive ? undefined : `Show ${p.title}`}
                  onClick={isActive ? undefined : () => setActiveProject(i)}
                  onKeyDown={
                    isActive
                      ? undefined
                      : (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setActiveProject(i);
                          }
                        }
                  }
                >
                  <span className="project-card-badge">‹ {p.badge} ›</span>

                  <div className="project-card-top">
                    <ProjectIcon project={p} className="project-card-icon" />
                    <div className="project-card-title">{p.title}</div>
                  </div>

                  <div className="project-card-chips">
                    {techs.map((t) => (
                      <span className="project-card-chip" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="project-card-desc">{p.desc}</div>

                  {isActive && (
                    <div className="project-card-actions">
                      <a
                        className="project-card-cta"
                        href={p.link}
                        target="_blank"
                        rel="noopener"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.77.12 3.06.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.08.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .31.2.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                        </svg>
                        View Repo
                      </a>

                      {p.marker && (
                        <span className="project-marker">
                          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                          </svg>
                          {p.marker}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="project-dots">
            {projects.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show project ${i + 1}`}
                aria-current={i === activeProject ? "true" : undefined}
                className={`project-dot ${i === activeProject ? "active" : ""}`}
                onClick={() => setActiveProject(i)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}