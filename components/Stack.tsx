"use client";

import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { stackGroups } from "@/lib/data";
import type { StackGroup, StackItem } from "@/lib/types";
import { withViewTransition } from "@/lib/view-transition";
import StackIcon from "./StackIcon";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// Embla automatically falls back to loop:false if there aren't enough
// slides to fill the viewport at least twice over. With only a handful of
// real groups, we render duplicated copies so Embla always has enough
// width to actually loop. Embla treats each duplicate as a fully real,
// independent slide — this is its intended way of handling a short list.
const MIN_SLIDES = 8;

function buildSlides(groups: StackGroup[], instance: string) {
  if (groups.length === 0) return [];
  const repeat = Math.max(1, Math.ceil(MIN_SLIDES / groups.length));
  return Array.from({ length: repeat }, (_, copy) =>
    groups.map((group) => ({ group, key: `${instance}-${group.name}-${copy}` }))
  ).flat();
}

const mobileSlides = buildSlides(stackGroups, "m");
const desktopSlides = buildSlides(stackGroups, "d");

export default function Stack() {
  const [openGroup, setOpenGroup] = useState<StackGroup | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [transitioningKey, setTransitioningKey] = useState<string | null>(null);

  // Two fully independent Embla instances, always both mounted — which one
  // is visible is decided purely by CSS media queries (see globals.css),
  // the same way your original file toggled a static grid vs. a carousel.
  // Keeping them separate (rather than one carousel whose slide width
  // changes at a breakpoint) avoids Embla having to re-measure and resettle
  // mid-transition, which was the source of the glitching.
  const [mobileEmblaRef, mobileEmblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
    watchDrag: true,
    duration: 15,
  });
  const [desktopEmblaRef, desktopEmblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
    watchDrag: true,
    duration: 15,
  });

  useEffect(() => {
    mobileEmblaApi?.scrollTo(0, true);
  }, [mobileEmblaApi]);
  useEffect(() => {
    desktopEmblaApi?.scrollTo(0, true);
  }, [desktopEmblaApi]);

  // Drives --stack-scale / --stack-opacity from Embla's own scroll-progress
  // numbers. Runs once per carousel instance, each scoped to its own DOM
  // nodes, so the two never interfere with each other.
  const makeUpdateStyles = useCallback(
    (api: EmblaCarouselType | undefined) => () => {
      if (!api) return;
      const progress = api.scrollProgress();
      const snaps = api.scrollSnapList();
      const slideNodes = api.slideNodes();

      snaps.forEach((snap, i) => {
        const slide = slideNodes[i];
        if (!slide) return;
        let diff = snap - progress;
        if (diff > 0.5) diff -= 1;
        if (diff < -0.5) diff += 1;
        const normalized = Math.min(Math.abs(diff) * snaps.length, 1);
        slide.style.setProperty("--stack-scale", String(1 - normalized * 0.15));
        slide.style.setProperty("--stack-opacity", String(1 - normalized * 0.55));
      });
    },
    []
  );

  useCarouselEffects(mobileEmblaApi, makeUpdateStyles);
  useCarouselEffects(desktopEmblaApi, makeUpdateStyles);

  const openReal = (group: StackGroup, key: string) => {
    flushSync(() => {
      setTransitioningKey(key);
    });
    withViewTransition(
      () => {
        setOpenKey(key);
        setOpenGroup(group);
      },
      () => setTransitioningKey(null)
    );
  };

  const onTapSlide = (
    api: EmblaCarouselType | undefined,
    group: StackGroup,
    key: string,
    index: number
  ) => {
    if (api) {
      const selected = api.selectedScrollSnap();
      if (selected !== index) {
        api.scrollTo(index);
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

        {/* Mobile + tablet: drag-only carousel, unchanged from before. */}
        <div className="stack-embla-viewport stack-embla-viewport-mobile" ref={mobileEmblaRef}>
          <div className="stack-embla-container">
            {mobileSlides.map(({ group, key }, index) => (
              <div className="stack-embla-slide" key={key}>
                <Folder
                  group={group}
                  isOpen={openKey === key}
                  isTransitioning={transitioningKey === key}
                  onOpen={() => onTapSlide(mobileEmblaApi, group, key, index)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: its own carousel instance, drag-only. */}
        <div className="stack-carousel-wrap stack-carousel-wrap-desktop">
          <div className="stack-embla-viewport stack-embla-viewport-desktop" ref={desktopEmblaRef}>
            <div className="stack-embla-container">
              {desktopSlides.map(({ group, key }, index) => (
                <div className="stack-embla-slide" key={key}>
                  <Folder
                    group={group}
                    isOpen={openKey === key}
                    isTransitioning={transitioningKey === key}
                    onOpen={() => onTapSlide(desktopEmblaApi, group, key, index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {openGroup && <FolderExpanded group={openGroup} onClose={closeFolder} />}
    </section>
  );
}

// Wires up the scroll/reInit/pointerDown/settle listeners for one Embla
// instance. Pulled out since we now do this twice (mobile + desktop)
// instead of once.
function useCarouselEffects(
  api: EmblaCarouselType | undefined,
  makeUpdateStyles: (api: EmblaCarouselType | undefined) => () => void
) {
  useEffect(() => {
    if (!api) return;
    const updateStyles = makeUpdateStyles(api);
    updateStyles();
    api.on("scroll", updateStyles);
    api.on("reInit", updateStyles);
    return () => {
      api.off("scroll", updateStyles);
      api.off("reInit", updateStyles);
    };
  }, [api, makeUpdateStyles]);

  useEffect(() => {
    if (!api) return;
    const root = api.rootNode();
    const onPointerDown = () => root.classList.add("stack-dragging");
    const onSettle = () => root.classList.remove("stack-dragging");
    api.on("pointerDown", onPointerDown);
    api.on("settle", onSettle);
    return () => {
      api.off("pointerDown", onPointerDown);
      api.off("settle", onSettle);
    };
  }, [api]);
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