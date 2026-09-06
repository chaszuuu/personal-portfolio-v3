export interface GradientStop {
  offset: string;
  color: string;
  opacity?: number;
}

export interface IconGradient {
  id: string;
  cx?: string | number;
  cy?: string | number;
  r?: string | number;
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
  }[];
  circles?: {
    cx: number;
    cy: number;
    r: number;
    fill: string;
  }[];
  viewBox?: string;
  gradient?: IconGradient[];
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
  desc: string;
  sub: string;
  link: string;
  bullets: string[];
}

export interface ModalContent {
  eyebrow?: string;
  title: string;
  sub?: string;
  bullets: string[];
  link?: string;
  linkLabel?: string;
}