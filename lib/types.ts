export interface GradientStop {
  offset: string;
  color: string;
  opacity?: number;
}

export interface IconGradient {
  id: string;
  type?: "radial" | "linear";
  cx?: string | number;
  cy?: string | number;
  r?: string | number;
  x1?: string | number;
  y1?: string | number;
  x2?: string | number;
  y2?: string | number;
  gradientUnits?: "userSpaceOnUse" | "objectBoundingBox";
  gradientTransform?: string;
  stops: GradientStop[];
}

export interface StackItem {
  label: string;
  hex: string;
  path?: string;
  mono?: string;
  paths?: {
    d: string;
    fill: string;
    /** Gaussian blur amount (stdDeviation) applied to just this path */
    blur?: number;
    /** Fill used when the .dark class is active (omit if it stays the same) */
    darkFill?: string;
  }[];
  circles?: {
    cx: number;
    cy: number;
    r: number;
    fill: string;
  }[];
  viewBox?: string;
  gradient?: IconGradient[];
  darkBg?: boolean;
  /** Path (in the same viewBox) used as an alpha mask — anything outside
   *  this shape is clipped, even if a blurred path bleeds past it.
   *  Used by Gemini's soft-blur star effect. */
  mask?: string;
}

export interface StackGroup {
  name: string;
  items: StackItem[];
}

export interface ExperienceEntry {
  role: string;
  org: string;
  when: string;
  bullets: string[];
}

export interface ProjectEntry {
  num: string;
  badge: string;
  title: string;
  gradient: string;
  logo?: string;
  desc: string;
  sub: string;
  link: string;
  bullets: string[];
  marker?: string;
  demo?: string;
  demoNote?: string;
}

export interface ModalContent {
  eyebrow?: string;
  title: string;
  sub?: string;
  bullets: string[];
  link?: string;
  linkLabel?: string;
}
 
export interface SocialPath {
  d: string;
  fill: string;
  /** Fill used when the .dark class is active (omit if it stays the same) */
  darkFill?: string;
}
 
export interface SocialItem {
  label: string;
  href: string;
  external: boolean;
  hex: string;
  /** Hover border/tint color in dark mode (omit if it stays the same) */
  darkHex?: string;
  viewBox: string;
  gradient?: IconGradient[];
  paths: SocialPath[];
}