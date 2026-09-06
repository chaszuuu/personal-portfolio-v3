"use client";

import { useState } from "react";
import { experience, projects } from "@/lib/data";
import type { ModalContent } from "@/lib/types";
import Modal from "./Modal";

export default function InteractiveSections() {
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  return (
    <>
      <section className="section">
        <div className="wrap">
          <h2>Experience</h2>
          <div className="timeline">
            {experience.map((job, i) => (
              <button
                key={job.role}
                className={`t-item ${i % 2 === 0 ? "left" : "right"}`}
                onClick={() =>
                  setModalContent({
                    eyebrow: job.when,
                    title: job.role,
                    sub: job.org,
                    bullets: job.bullets,
                  })
                }
              >
                <div className="row">
                  <span className="role">{job.role}</span>
                  <span className="when">{job.when}</span>
                </div>

                <div className="expand">view details ↗</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Projects</h2>
          <div className="gallery">
            {projects.map((p) => (
              <button
                key={p.title}
                className="g-card"
                onClick={() =>
                  setModalContent({
                    eyebrow: p.badge,
                    title: p.title,
                    sub: p.sub,
                    bullets: p.bullets,
                    link: p.link,
                    linkLabel: "View repo",
                  })
                }
              >
                <div className="g-img" style={{ background: p.gradient }}>
                  <span className="badge">{p.badge}</span>
                  <div className="num">{p.num}</div>
                  <div className="title">{p.title}</div>
                </div>
                <div className="g-caption">
                  <div className="desc">{p.desc}</div>
                  <span className="link">view details ↗</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Modal content={modalContent} onClose={() => setModalContent(null)} />
    </>
  );
}
