export interface StackItem {
  label: string;
  hex: string;
  path?: string;
  mono?: string;
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
