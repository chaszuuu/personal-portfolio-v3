// Stack.tsx
"use client";

import { useEffect, useState } from "react";
import { stackGroups } from "@/lib/data";
import type { StackGroup, StackItem } from "@/lib/types";
import { withViewTransition } from "@/lib/view-transition";
import StackIcon from "./StackIcon";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function Stack() {
  const [openGroup, setOpenGroup] = useState<StackGroup | null>(null);

  const openFolder = (group: StackGroup) =>
    withViewTransition(() => setOpenGroup(group));
  const closeFolder = () => withViewTransition(() => setOpenGroup(null));

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
  onOpen,
}: {
  group: StackGroup;
  isOpen: boolean;
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
          viewTransitionName: isOpen ? undefined : `folder-${slug(group.name)}`,
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

  if (total <= 4) {
    return (
      <span className={`folder-preview count-${total}`}>
        {items.map((item, i) => (
          <span className="folder-preview-cell" key={`${item.label}-${i}`}>
            <StackIcon item={item} />
          </span>
        ))}
      </span>
    );
  }

  const showOverflow = total > 9;
  const gridItems = showOverflow ? items.slice(0, 8) : items.slice(0, 9);
  const overflowItems = showOverflow ? items.slice(8) : [];

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
        </div>
      </div>
    </div>
  );
}