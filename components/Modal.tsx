"use client";

import { useEffect, useRef } from "react";
import type { ModalContent } from "@/lib/types";

interface ModalProps {
  content: ModalContent | null;
  onClose: () => void;
}

export default function Modal({ content, onClose }: ModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const isOpen = content !== null;

  useEffect(() => {
    if (isOpen) {
      lastFocused.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      lastFocused.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`modal-backdrop${isOpen ? " open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel" role="dialog" aria-modal="true">
        <button className="modal-close" ref={closeBtnRef} aria-label="Close" onClick={onClose}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <div className="modal-eyebrow">{content?.eyebrow ?? ""}</div>
        <div className="modal-title">{content?.title ?? ""}</div>
        <div className="modal-sub">{content?.sub ?? ""}</div>
        <div className="modal-body">
          {content?.bullets.map((b, i) => (
            <div key={i}>{b}</div>
          ))}
        </div>
        {content?.link && (
          <a className="modal-link" href={content.link} target="_blank" rel="noopener">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
            {content.linkLabel || "Open"}
          </a>
        )}
      </div>
    </div>
  );
}
