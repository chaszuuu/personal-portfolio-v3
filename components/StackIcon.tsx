"use client";

import { useId } from "react";
import type { StackItem } from "@/lib/types";

export default function StackIcon({ item }: { item: StackItem }) {
  // Every folder can render the same icon more than once at a time (the
  // mobile carousel duplicates whole groups to have enough slides to loop,
  // while the desktop grid renders its own copy at the same time, just
  // CSS-hidden rather than removed). SVG gradient ids must be unique across
  // the whole page, so a fixed id like "css3Linear1" collides with itself
  // the moment two copies exist in the DOM together. useId() gives each
  // rendered instance its own unique suffix, so gradients never collide no
  // matter how many times this icon appears on the page.
  const uid = useId();

  if (item.paths) {
    const [vbX, vbY, vbW, vbH] = (item.viewBox ?? "0 0 24 24")
      .split(/\s+/)
      .map(Number);

    const scopedId = (id: string) => `${id}-${uid}`;
    const scopedFill = (fill: string) =>
      fill.startsWith("url(#")
        ? `url(#${scopedId(fill.slice(5, -1))})`
        : `#${fill}`;

    return (
      <svg
        viewBox={item.viewBox ?? "0 0 24 24"}
        xmlns="http://www.w3.org/2000/svg"
      >
        {item.darkBg && (
          <rect
            x={vbX + vbW * 0.08}
            y={vbY + vbH * 0.08}
            width={vbW * 0.84}
            height={vbH * 0.84}
            rx={vbW * 0.84 * 0.22}
            ry={vbH * 0.84 * 0.22}
            fill="#ffffff"
            className="hidden dark:block"
          />
        )}

        {item.gradient && (
          <defs>
            {item.gradient.map((gradient) =>
              gradient.type === "linear" ? (
                <linearGradient
                  key={gradient.id}
                  id={scopedId(gradient.id)}
                  x1={gradient.x1}
                  y1={gradient.y1}
                  x2={gradient.x2}
                  y2={gradient.y2}
                  gradientUnits={gradient.gradientUnits}
                  gradientTransform={gradient.gradientTransform}
                >
                  {gradient.stops.map((stop, i) => (
                    <stop
                      key={i}
                      offset={stop.offset}
                      stopColor={`#${stop.color}`}
                      stopOpacity={stop.opacity}
                    />
                  ))}
                </linearGradient>
              ) : (
                <radialGradient
                  key={gradient.id}
                  id={scopedId(gradient.id)}
                  cx={gradient.cx}
                  cy={gradient.cy}
                  r={gradient.r}
                  gradientUnits={gradient.gradientUnits}
                  gradientTransform={gradient.gradientTransform}
                >
                  {gradient.stops.map((stop, i) => (
                    <stop
                      key={i}
                      offset={stop.offset}
                      stopColor={`#${stop.color}`}
                      stopOpacity={stop.opacity}
                    />
                  ))}
                </radialGradient>
              )
            )}
          </defs>
        )}

        {item.circles?.map((c, i) => (
          <circle
            key={`c-${i}`}
            cx={c.cx}
            cy={c.cy}
            r={c.r}
            fill={scopedFill(c.fill)}
          />
        ))}

        {item.paths.map((p, i) => (
          <path key={i} d={p.d} fill={scopedFill(p.fill)} />
        ))}
      </svg>
    );
  }

  if (item.path) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill={`#${item.hex}`}
        xmlns="http://www.w3.org/2000/svg"
      >
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