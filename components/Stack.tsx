// Stack.tsx
"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { stackGroups } from "@/lib/data";
import type { StackGroup, StackItem } from "@/lib/types";
import { withViewTransition } from "@/lib/view-transition";
import StackIcon from "./StackIcon";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function Stack() {
  const [openGroup, setOpenGroup] = useState<StackGroup | null>(null);
  // Tracks which folder (by name) is actively mid view-transition.
  // Only THIS folder should get a viewTransitionName — not every closed folder.
  const [transitioningName, setTransitioningName] = useState<string | null>(null);

  const openFolder = (group: StackGroup) => {
    // Commit this BEFORE starting the transition, synchronously, so the
    // folder button actually has viewTransitionName painted into the "old"
    // snapshot the browser captures the instant startViewTransition runs.
    // A plain setState here is too late — React batches it and it wouldn't
    // land until after the old snapshot was already taken.
    flushSync(() => setTransitioningName(group.name));
    withViewTransition(
      () => setOpenGroup(group),
      () => setTransitioningName(null)
    );
  };

  const closeFolder = () => {
    if (openGroup) {
      flushSync(() => setTransitioningName(openGroup.name));
    }
    withViewTransition(
      () => setOpenGroup(null),
      () => setTransitioningName(null)
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

        <div className="stack-carousel-track">
          {stackGroups.map((group) => (
            <Folder
              key={group.name}
              group={group}
              isOpen={openGroup?.name === group.name}
              isTransitioning={transitioningName === group.name}
              onOpen={openFolder}
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
  onOpen: (group: StackGroup) => void;
}) {
  return (
    <button
      type="button"
      className="library-folder-btn"
      onClick={() => onOpen(group)}
      aria-label={`Open ${group.name} folder`}
    >
      <span
        className="library-folder"
        style={{
          // Only the folder actively transitioning gets a viewTransitionName.
          // Previously every CLOSED folder got one (isOpen ? undefined : name),
          // which hoisted all of them into their own top-layer snapshot groups —
          // pulling them out from behind the backdrop's blur/dim entirely.
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

  // Always render a full 3x3 grid, even with fewer than 9 items. Empty
  // slots get a visible placeholder tile (not just blank space) so the
  // 3x3 shape is obvious at a glance, not just structurally true.
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
  // Pad out to a full 9 slots when there are fewer items, so the grid
  // always resolves to exactly 3 rows (a 3x3 shape) instead of shrinking
  // to however few rows the item count needs. With 10+ items the grid
  // just naturally grows past 3 rows, which is fine and expected.
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