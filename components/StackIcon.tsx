import type { StackItem } from "@/lib/types";

export default function StackIcon({ item }: { item: StackItem }) {
  if (item.path) {
    return (
      <svg viewBox="0 0 24 24" fill={`#${item.hex}`} xmlns="http://www.w3.org/2000/svg">
        <path d={item.path} />
      </svg>
    );
  }
  return (
    <span className="mono-badge" style={{ background: `#${item.hex}` }}>
      {item.mono}
    </span>
  );
}
