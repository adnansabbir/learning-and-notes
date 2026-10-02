# CLAUDE.md — Learning & Notes

## What this project is

Adnan's personal technical learning journal. Started as TryHackMe's *Cyber Security 101* notes, now a general repo for whatever he's learning — each subject gets its own top-level folder. The site is his portfolio artifact — proof of the learning journey.

Deployed to GitHub Pages at the site root (`/learning-and-notes/`). TryHackMe content lives under `/tryhackme/` within that. Readable on phone. Works offline (PWA).

**File paths mirror URL paths exactly.** `tryhackme/linux/basics.md` → `/tryhackme/linux/basics/`. When adding or moving a page, its location in the repo IS its URL (minus the `.md`, directory-index pages use `index.md`). No hidden `permalink:` overrides needed except on the rare page that intentionally breaks this convention.

## Git commits

Do not add a `Co-Authored-By: Claude ...` trailer to commit messages in this repo. Just the commit message itself, nothing appended.

## Who Adnan is

- Software engineer, 7+ years. Pivoting into cybersecurity (AppSec / DevSecOps / Security Engineering).
- Has ADHD — notes must be **short, punchy, and action-first**.
- Practical learner: run the command, then explain what it means. Never pre-dump theory.

## Workflow — how to handle pasted lesson content

When Adnan pastes TryHackMe lesson content:

1. **Add it to the notes immediately** — extract the key commands, tables, and concepts; write them in the established format
2. **Do not commit** — just update the file and confirm it's added
3. **Keep accumulating** — each paste adds to the current section; don't reset between pastes
4. **Commit only when:** Adnan explicitly asks to commit, OR he signals a new topic/section is starting

---

## Note-writing rules

Every page follows this pattern — don't deviate:

1. **One-liner hook** — what it is in plain English
2. **"The fun thing"** — one concrete, exciting thing you can *do* with it immediately
3. **Commands first** — runnable bash blocks before any explanation
4. **Tables over prose** — flag references, comparisons, quick lookups
5. **Key insight** — one blockquote at the bottom that ties it together

Keep pages short enough to read on a phone in one scroll. No walls of text.

## When a page gets too long

If a page is growing and starts to feel like too much to scroll through, use one of these two approaches — Adnan's call which:

1. **Split into sub-pages** — e.g. `linux.md` → `linux-basics.md` + `linux-files.md`. Best when sections are genuinely independent topics.
2. **Collapsible sections** — wrap sections in a `<details>` block so they're hidden until tapped. Best when the page is one topic but has a lot of reference material.

```html
<details markdown="1">
<summary>Flag reference</summary>

| Flag | What it does |
|---|---|
| `-a` | Show hidden files |

</details>
```

> Default: ask Adnan which approach he wants before changing page structure.

## Adding a new page

1. Create the file **at the path matching its intended URL**, e.g. a new TryHackMe child page under Linux goes in `tryhackme/linux/<topic>.md` (→ `/tryhackme/linux/<topic>/`). Frontmatter:
   ```yaml
   ---
   layout: default
   title: Topic Name
   parent: Linux
   grand_parent: TryHackMe
   nav_order: <next number>
   ---
   ```
   (Use `parent` only, no `grand_parent`, for a page one level deep like a section's own `index.md`.)
2. Add the card to the relevant `index.md` card grid (emoji + title + one-line desc) — the section's own index, not the site root, unless it's a brand-new top-level subject.
3. Add the path to `PRECACHE` array in `sw.js` (for offline support) — full path including `/learning-and-notes/` prefix.
4. Bump the cache key in `sw.js` (`notes-v13` → `v14`, etc.)

## Tech stack

- Jekyll + `just-the-docs` remote theme, dark mode
- Service worker: stale-while-revalidate, offline fallback
- PWA: `manifest.json` + `icon.svg` + `_includes/head_custom.html`
- `claude-handoff.md` is excluded from Jekyll build — context bridge between sessions, not a note page

## Reading time (auto)

Every content page automatically shows a "⏱️ N min read" estimate under the H1. Implemented as JS in `_includes/head_custom.html`. Calculation:

- Prose words read at 200 wpm
- Code (inside `<pre>` blocks) read at 100 wpm — scanning, but absorbing
- Pages under 40 words total (parent stubs) are skipped — they don't get a reading time

**For new pages:** Do nothing. The reading time auto-updates whenever the page content changes. Just write notes normally.

## Search scoping

`just-the-docs` builds one site-wide search index (`/assets/js/search-data.json`) — there's no built-in way to scope it to a single subject (TryHackMe, future ML notes, etc.).

To stop subjects bleeding into each other's results, `_includes/head_custom.html` monkey-patches `lunr.Index.prototype.query` (the function the theme's own search box calls on every keystroke) to filter results down to the current top-level URL segment by default — e.g. browsing under `/tryhackme/` only shows matches whose `relUrl` starts with `/tryhackme/`. A small pill button ("This section only" / "All subjects") next to the search box lets you expand to the full site. No config needed when adding a new subject folder — the scoping is derived from the URL path at runtime, not a hardcoded list.

## Force refresh button

A floating ↻ button (bottom-right) lives on every page. One tap = unregister service worker + clear all caches + hard reload. Use case: PWA on iPhone showing stale content after a deploy.

Implementation: same JS file (`_includes/head_custom.html`). Safe-area aware for iOS home indicator. Don't need to do anything when adding new pages.

## Site structure (parent → children)

Repo root is the general "Learning & Notes" site. Each subject gets its own top-level folder, and **folder layout mirrors URL layout exactly** — see the note at the top of this file. Pages use `just-the-docs` 3-level parent/grand_parent nav.

```
/ (root index.md, nav 1) — hub page, cards link to each subject

tryhackme/                          → /tryhackme/
├── index.md  (title: TryHackMe, nav 2, has_children)
├── linux/                          → /tryhackme/linux/
│   ├── index.md   (parent: TryHackMe, nav 1, has_children)
│   ├── basics.md  (parent: Linux, grand_parent: TryHackMe)
│   ├── system.md  (parent: Linux, grand_parent: TryHackMe)
│   └── vim.md     (parent: Linux, grand_parent: TryHackMe)
├── windows/                        → /tryhackme/windows/
│   ├── index.md   (parent: TryHackMe, nav 2, has_children)
│   └── basics.md  (parent: Windows, grand_parent: TryHackMe)
├── networking/                     → /tryhackme/networking/
│   ├── index.md          (parent: TryHackMe, nav 3, has_children)
│   ├── basics.md         (parent: Networking, grand_parent: TryHackMe)
│   └── mac-addresses.md  (parent: Networking, grand_parent: TryHackMe)
├── recon/                          → /tryhackme/recon/
│   ├── index.md          (parent: TryHackMe, nav 4, has_children)
│   ├── nmap.md           (parent: Recon, grand_parent: TryHackMe)
│   ├── web-recon.md      (parent: Recon, grand_parent: TryHackMe)
│   └── search-skills.md  (parent: Recon, grand_parent: TryHackMe)
└── defenses.md  (parent: TryHackMe, nav 5)       → /tryhackme/defenses/

<future-subject>/                   → /<future-subject>/
└── ...                             (same pattern: own index.md, own nav_order siblings to "TryHackMe" at root)
```

**Adding a child page to an existing section** (e.g. a new Linux topic):
- Create the file at the matching path, e.g. `tryhackme/linux/<topic>.md`
- Frontmatter: `parent: Linux`, `grand_parent: TryHackMe`, `nav_order: <next number>`
- Add it to `tryhackme/linux/index.md`'s bullet list
- Add the full path to `PRECACHE` in `sw.js`, bump the cache key
- Don't add it to the root `index.md` card grid — that's subject-level only

**Adding a new top-level subject** (sibling to `tryhackme/`, e.g. `machine-learning/`):
- Create `<subject>/index.md` with `title: <Subject>`, `has_children: true`, `nav_order: <next number>` (no `parent:` — it sits at root, same level as "TryHackMe")
- Add a card for it to the root `index.md` card grid
- Children underneath follow the same `parent`/`grand_parent` pattern shown above
- Add its pages to `PRECACHE` in `sw.js`, bump the cache key
- No search config needed — scoping picks up the new URL segment automatically (see **Search scoping** below)
- Give it its own `<subject>/README.md` (GitHub-facing, not built by Jekyll) and add a row for it to the root `README.md` table
- Add `<subject>/README.md` to the `exclude:` list in `_config.yml` — otherwise Jekyll publishes it as a live page (this happened with `CLAUDE.md` and almost happened with `tryhackme/README.md`)