import Image from "next/image";
import { socials } from "@/lib/data";
import type { SocialItem } from "@/lib/types";

// "url(#id)" fills (gradients) pass through untouched; hex values get a "#"
const paint = (v: string) => (v.startsWith("url(") ? v : `#${v}`);

function SocialIcon({ item }: { item: SocialItem }) {
  return (
    <svg viewBox={item.viewBox} aria-hidden="true" focusable="false">
      {item.gradient && item.gradient.length > 0 && (
        <defs>
          {item.gradient.map((g) => {
            const stops = g.stops.map((s, i) => (
              <stop
                key={i}
                offset={s.offset}
                stopColor={`#${s.color}`}
                stopOpacity={s.opacity}
              />
            ));
            return g.type === "linear" ? (
              <linearGradient
                key={g.id}
                id={g.id}
                x1={g.x1}
                y1={g.y1}
                x2={g.x2}
                y2={g.y2}
                gradientUnits={g.gradientUnits}
                gradientTransform={g.gradientTransform}
              >
                {stops}
              </linearGradient>
            ) : (
              <radialGradient
                key={g.id}
                id={g.id}
                cx={g.cx}
                cy={g.cy}
                r={g.r}
                gradientUnits={g.gradientUnits}
                gradientTransform={g.gradientTransform}
              >
                {stops}
              </radialGradient>
            );
          })}
        </defs>
      )}
      {item.paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill={paint(p.fill)}
          className={p.darkFill ? "has-dark" : undefined}
          style={
            p.darkFill
              ? ({ "--dark-fill": `#${p.darkFill}` } as React.CSSProperties)
              : undefined
          }
        />
      ))}
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Image
              src="/branding/branding.png"
              alt="Charles Vincent Panlilio logo"
              width={1111}
              height={295}
              className="footer-logo"
            />
            <p className="footer-thanks">Thanks for stopping by.</p>
          </div>

          <nav className="footer-icons" aria-label="Social links">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="footer-icon"
                style={
                  {
                    "--brand-light": `#${item.hex}`,
                    "--brand-dark": `#${item.darkHex ?? item.hex}`,
                  } as React.CSSProperties
                }
                aria-label={item.label}
                title={item.label}
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <SocialIcon item={item} />
              </a>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© {year} Charles Vincent Panlilio</span>
          <a href="#" className="footer-top-link">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}