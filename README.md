# Charles Vincent Panlilio — Portfolio (Next.js + TypeScript)

Converted from the original single-file static HTML site. Visual design,
copy, animations (marquees, timeline, modal), and responsive behavior are
unchanged — only the implementation moved from vanilla JS/DOM manipulation
to typed React components on Next.js App Router.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/
  layout.tsx        # <head> metadata, favicon, Google Fonts via next/font
  page.tsx           # Assembles all sections
  globals.css         # Ported 1:1 from the original <style> block
components/
  Hero.tsx            # Intro, links, snapshot card
  Statline.tsx         # Quick stats row
  Stack.tsx            # Categorized infinite-scroll marquees
  StackIcon.tsx        # Renders a brand SVG path or a mono-badge
  InteractiveSections.tsx  # Experience timeline + Projects gallery (owns modal state)
  Modal.tsx            # Accessible modal (focus trap, Escape to close, backdrop click)
  Contact.tsx
lib/
  types.ts             # StackItem, ExperienceEntry, ProjectEntry, ModalContent
  data.ts               # All content: stack groups, experience, projects
```

## Notes on the conversion

- The original inline `<script>` built the marquee rows, timeline, and
  gallery by string-templating HTML into the DOM, then wired up a manual
  modal open/close with `document.activeElement` focus restore. That's now
  a `useState<ModalContent | null>` in `InteractiveSections.tsx`, passed to
  `Modal.tsx`, which handles focus restore and Escape-to-close with
  `useEffect`.
- All SVG icon paths and hex colors were extracted directly from the source
  file's data (not retyped) to avoid any transcription drift.
- Class names are unchanged from the original CSS, so `globals.css` is a
  near-verbatim port — the only edits are swapping the three
  `font-family:'X'` declarations for the `next/font` CSS variables set in
  `layout.tsx` (Instrument Sans, Inter, JetBrains Mono), replacing the
  `<link>`-based Google Fonts loading.
- Add your actual `resume.pdf` to `public/resume.pdf` — the Resume button
  in `Hero.tsx` links to `/resume.pdf`.
- No CSS framework is used (the original didn't use one either) — this is
  plain CSS with custom properties, same as the source.

## Deploying

Works out of the box on Vercel, or any Node host:

```bash
npm run build
npm run start
```
