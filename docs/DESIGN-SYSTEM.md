# Digital Gujarat — GIGW design system

Applies to every page. Goal: modern, professional, clean Government of India website that meets **GIGW 3.0** and **WCAG 2.1 AA**.

## Identity
- Flat and calm: white / cool-grey surfaces, no glassmorphism, no aurora gradients, no 3D tilt, no floating blobs.
- **Navy** (`--ink`, `--ink-2`, `--ink-3`) for structural bars: gov bar, page banner, footer, stats band.
- **Gujarat blue** (`--brand`, hover `--brand-2`, tint `--brand-3`, tint border `--brand-4`) for every action, link and focus ring.
- **Saffron** (`--accent`) only for small highlights: section-title rule, active nav underline, badges. As text use `--accent-ink`. Never white text on saffron.
- Tricolour strip (`--tricolour`) at the very top only.
- Type: Noto Sans + Noto Sans Gujarati (`--font-body`), headings 700. Sizes `--fs-h1/h2/h3/h4`, `--fs-lg/base/sm/xs`.
- Shape: radius `--r-sm 6 / --r-md 8 / --r-lg 12 / --r-xl 16`. Shadows `--sh-1` (rest), `--sh-2` (hover), `--sh-3` (overlays).
- Surfaces/text: `--dg-bg`, `--dg-alt`, `--dg-alt-2`, `--dg-card`, `--dg-text`, `--dg-muted`, `--dg-border`, `--dg-border-strong`, status `--dg-success(-soft)`, `--dg-warning(-soft)`, `--dg-danger(-soft)`, `--dg-info-soft`. Dark mode (`html.app-dark`) and high contrast (`html.a11y-contrast`) re-map these, so **never hard-code colours** except pure white text on navy.

## Layout primitives (src/base.scss)
- `.container` (max 1240 px + gutter), `.container.narrow` (880 px), `.section` (vertical rhythm), `.section.alt` (grey band), `.section.tight`.
- Section heading: `<div class="section-head"><p class="eyebrow"><i class="pi …"></i> Label</p><h2>Title</h2><p>Intro</p></div>` — h2 gets a saffron rule automatically. `.section-head.center` to centre. `.section-head-row` puts a heading and an action side by side.
- Buttons: `.btn` + `.btn-primary` (default) / `.btn-outline` / `.btn-ghost` / `.btn-accent` / `.btn-light` / `.btn-on-dark`; sizes `.btn-sm`, `.btn-lg`; `.btn-block`, `.btn-icon`. PrimeNG `pButton` gets the same look (`[outlined]="true"` = outline, `variant="text"` = ghost). Group with `.btn-row` (or legacy `.hero-actions`).
- Links with arrow: `.more` / `.link-arrow`. External links: add `<i class="pi pi-external-link ext" aria-hidden="true"></i><span class="sr-only"> (opens in a new tab)</span>`.

## Components (src/components.scss)
- `app-page-hero` — navy banner with breadcrumb + h1 + intro, then a "Last updated / Print" strip. Every inner page starts with it.
- `.card` (padded white card), `.card-link` (hover lift for clickable cards), PrimeNG `p-card` is skinned the same.
- `.icon-tile` (48 px blue tint square for a `pi` icon; `.accent`, `.green`, `.lg`).
- `.badge` (`.accent`, `.success`, `.new`), `.chip` (pill filter/link).
- `.notice` (info; `.warn`, `.success`) — icon + text box with left rule. `.empty` — dashed empty state.
- Slider controls: `.sl-controls`, `.sl-btn` (44 px round prev/next/pause; `.on-dark`), `.sl-dots` (buttons with `aria-current`). **Any auto-moving content must have a visible Pause button** (WCAG 2.2.2) and stop when `A11yService.motionOff()` is true.
- `.lightbox` overlay, `.field` form wrapper (`label`, `.hint`, `.error`, `.req`).
- PrimeNG skins: inputs/select/textarea, selectbutton, tabs, accordion, datatable, paginator, dialog, datepicker, carousel, tooltip, command palette.

## Rules
- One `<h1>` per page (the banner). Headings in order.
- Interactive targets ≥ 44 px tall. Visible focus is global — don't remove outlines.
- Every image has `alt` (decorative = `alt=""`). Icons are `aria-hidden="true"`.
- Use `appReveal` sparingly (one per block, no long delays). Respect reduced motion.
- Mobile first: check 375 px for zero horizontal overflow; grids collapse to 1 column.
- Keep all existing data, routes and behaviour; only change structure and styling.
