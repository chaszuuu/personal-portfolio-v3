"use client";

import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import { stackGroups } from "@/lib/data";
import type { StackGroup, StackItem } from "@/lib/types";
import { withViewTransition } from "@/lib/view-transition";
import StackIcon from "./StackIcon";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

const MOBILE_QUERY = "(max-width: 460px)";

// Embla automatically falls back to loop:false if there aren't enough
// slides to fill the viewport at least twice over — it's protecting itself
// from an impossible-looking loop, not a bug. With only a handful of real
// groups (e.g. 3), we render duplicated copies just for the mobile Embla
// instance so it always has enough width to actually loop. Embla treats
// each duplicate as a fully real, independent slide — this is its intended
// way of handling a short list, not a hack on top of it.
const MIN_MOBILE_SLIDES = 8;

function buildMobileSlides(groups: StackGroup[]) {
  if (groups.length === 0) return [];
  const repeat = Math.max(1, Math.ceil(MIN_MOBILE_SLIDES / groups.length));
  return Array.from({ length: repeat }, (_, copy) =>
    groups.map((group) => ({ group, key: `${group.name}-${copy}` }))
  ).flat();
}

export default function Stack() {
  const [openGroup, setOpenGroup] = useState<StackGroup | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [transitioningKey, setTransitioningKey] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const mobileSlides = buildMobileSlides(stackGroups);

  // Embla owns the loop/drag/swipe mechanics entirely — this replaces every
  // hand-rolled scroll/rotation/window approach from before. loop:true is a
  // first-class supported mode here, not a workaround.
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
    watchDrag: isMobile, // desktop/tablet render a separate plain grid below; only the mobile instance drags
    duration: 15, // faster snap animation (Embla default is 25, which read as sluggish)
  });

  // Guarantees the carousel always starts on the first real slide. Without
  // this, a re-measurement (e.g. from a CSS change affecting slide width —
  // padding vs. gap, a font loading late, etc.) can cause Embla to settle
  // on a different resting index than slide 0 after its internal reInit,
  // which looks like "the first item disappeared" when it's actually just
  // scrolled one position to the side.
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(0, true); // true = jump instantly, no animation
  }, [emblaApi]);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Drives your existing --stack-scale / --stack-opacity CSS vars from
  // Embla's own scroll-progress numbers, replacing the old manual
  // getBoundingClientRect distance math with Embla's built-in tracking.
  const updateStyles = useCallback(() => {
    if (!emblaApi) return;
    const progress = emblaApi.scrollProgress();
    const snaps = emblaApi.scrollSnapList();
    const slides = emblaApi.slideNodes();

    snaps.forEach((snap, i) => {
      const slide = slides[i];
      if (!slide) return;
      let diff = snap - progress;
      // scrollProgress wraps 0..1 with loop enabled; take the shortest
      // distance around the wrap instead of the raw linear difference.
      if (diff > 0.5) diff -= 1;
      if (diff < -0.5) diff += 1;
      const normalized = Math.min(Math.abs(diff) * snaps.length, 1);
      slide.style.setProperty("--stack-scale", String(1 - normalized * 0.15));
      slide.style.setProperty("--stack-opacity", String(1 - normalized * 0.55));
    });
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateStyles();
    emblaApi.on("scroll", updateStyles);
    emblaApi.on("reInit", updateStyles);
    return () => {
      emblaApi.off("scroll", updateStyles);
      emblaApi.off("reInit", updateStyles);
    };
  }, [emblaApi, updateStyles]);

  // Fixes the flicker during swipe: --stack-scale/--stack-opacity update on
  // every scroll event (many times per second while dragging), and each
  // update was restarting the .2s CSS transition before the previous one
  // finished — the browser was constantly interrupting one half-played
  // animation with another. While a finger is actually down, styles should
  // track the drag instantly (no transition); the smooth transition only
  // makes sense for the single settle at the end of the gesture.
  useEffect(() => {
    if (!emblaApi) return;
    const root = emblaApi.rootNode();

    const onPointerDown = () => root.classList.add("stack-dragging");
    const onSettle = () => root.classList.remove("stack-dragging");

    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("settle", onSettle);
    return () => {
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("settle", onSettle);
    };
  }, [emblaApi]);

  const openReal = (group: StackGroup, key: string) => {
    flushSync(() => {
      setOpenKey(key);
      setTransitioningKey(key);
    });
    withViewTransition(
      () => setOpenGroup(group),
      () => setTransitioningKey(null)
    );
  };

  // Tap a non-centered slide → Embla scrolls it to center (its own smooth,
  // loop-aware scrollTo, no custom geometry needed). Tap the centered one →
  // opens the folder, same as before.
  const onTapSlide = (group: StackGroup, key: string, index: number) => {
    if (isMobile && emblaApi) {
      const selected = emblaApi.selectedScrollSnap();
      if (selected !== index) {
        emblaApi.scrollTo(index);
        return;
      }
    }
    openReal(group, key);
  };

  const closeFolder = () => {
    if (openKey) {
      flushSync(() => setTransitioningKey(openKey));
    }
    withViewTransition(
      () => {
        setOpenGroup(null);
        setOpenKey(null);
      },
      () => setTransitioningKey(null)
    );
  };

  useEffect(() => {
    if (!openGroup) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFolder();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openGroup]);

  return (
    <section className="section">
      <div className="wrap">
        <h2>Stack</h2>

        {/* Mobile: Embla-driven infinite loop carousel. Slides are
            duplicated (see buildMobileSlides) so Embla always has enough
            content to loop, even with only a few real groups. */}
        <div className="stack-embla-viewport" ref={emblaRef}>
          <div className="stack-embla-container">
            {mobileSlides.map(({ group, key }, index) => (
              <div className="stack-embla-slide" key={key}>
                <Folder
                  group={group}
                  isOpen={openKey === key}
                  isTransitioning={transitioningKey === key}
                  onOpen={() => onTapSlide(group, key, index)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop/tablet: plain static row, unchanged from before, no Embla involved */}
        <div className="stack-carousel-track stack-carousel-track-desktop">
          {stackGroups.map((group) => (
            <Folder
              key={group.name}
              group={group}
              isOpen={openKey === group.name}
              isTransitioning={transitioningKey === group.name}
              onOpen={() => openReal(group, group.name)}
            />
          ))}
        </div>
      </div>

      {openGroup && <FolderExpanded group={openGroup} onClose={closeFolder} />}
    </section>
  );
}

function Folder({
  group,
  isOpen,
  isTransitioning,
  onOpen,
}: {
  group: StackGroup;
  isOpen: boolean;
  isTransitioning: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className="library-folder-btn"
      onClick={onOpen}
      aria-label={`Open ${group.name} folder`}
    >
      <span
        className="library-folder"
        style={{
          viewTransitionName:
            !isOpen && isTransitioning ? `folder-${slug(group.name)}` : undefined,
        }}
      >
        <FolderPreview items={group.items} />
      </span>
      <span className="library-folder-label">{group.name}</span>
    </button>
  );
}

function FolderPreview({ items }: { items: StackItem[] }) {
  const total = items.length;
  const showOverflow = total > 9;
  const gridItems = showOverflow ? items.slice(0, 8) : items.slice(0, 9);
  const overflowItems = showOverflow ? items.slice(8) : [];
  const filledCount = gridItems.length + (showOverflow ? 1 : 0);
  const emptyCount = 9 - filledCount;

  return (
    <span className="folder-preview grid-3x3">
      {gridItems.map((item, i) => (
        <span className="folder-preview-cell" key={`${item.label}-${i}`}>
          <StackIcon item={item} />
        </span>
      ))}
      {showOverflow && (
        <span className="folder-preview-cell overflow-cell">
          <OverflowCluster items={overflowItems} />
        </span>
      )}
      {Array.from({ length: emptyCount }).map((_, i) => (
        <span
          className="folder-preview-cell folder-preview-cell-empty"
          key={`empty-${i}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function OverflowCluster({ items }: { items: StackItem[] }) {
  const MAX_MINI = 4;
  const shown = items.length <= MAX_MINI ? items : items.slice(0, MAX_MINI - 1);
  const remaining = items.length - shown.length;

  return (
    <span className="overflow-cluster">
      {shown.map((item, i) => (
        <span className="overflow-mini" key={`${item.label}-${i}`}>
          <StackIcon item={item} />
        </span>
      ))}
      {remaining > 0 && (
        <span className="overflow-mini overflow-more">+{remaining}</span>
      )}
    </span>
  );
}

function FolderExpanded({
  group,
  onClose,
}: {
  group: StackGroup;
  onClose: () => void;
}) {
  const emptyCount = group.items.length < 9 ? 9 - group.items.length : 0;

  return (
    <div
      className="library-backdrop open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="library-panel"
        style={{ viewTransitionName: `folder-${slug(group.name)}` }}
      >
        <div className="library-panel-title">{group.name}</div>
        <div className="library-panel-grid">
          {group.items.map((item, i) => (
            <div className="library-app" key={`${item.label}-${i}`}>
              <span className="library-app-icon">
                <StackIcon item={item} />
              </span>
              <span className="library-app-label">{item.label}</span>
            </div>
          ))}
          {Array.from({ length: emptyCount }).map((_, i) => (
            <div className="library-app library-app-empty" key={`empty-${i}`} aria-hidden="true">
              <span className="library-app-icon library-app-icon-empty" />
              <span className="library-app-label">&nbsp;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}