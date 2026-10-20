# CLAUDE.md — Learning & Notes

## What this project is

Adnan's personal technical learning journal. Started as TryHackMe's *Cyber Security 101* notes, now a general repo for whatever he's learning — each subject gets its own top-level folder. The site is his portfolio artifact — proof of the learning journey.

Deployed to GitHub Pages at the site root (`/learning-and-notes/`). TryHackMe content lives under `/tryhackme/` within that. Readable on phone. Works offline (PWA).

**File paths mirror URL paths exactly.** `tryhackme/linux/basics.md` → `/tryhackme/linux/basics/`. When adding or moving a page, its location in the repo IS its URL (minus the `.md`, directory-index pages use `index.md`). No hidden `permalink:` overrides needed except on the rare page that intentionally breaks this convention.

## Git commits

Do not add a `Co-Authored-By: Claude ...` trailer to commit messages in this repo. Just the commit message itself, nothing appended.

Commit messages track **which notes were added**, e.g. `Add anomaly detection and dimensionality reduction notes`. Keep it to one short line. Don't mention the moves, index links, `sw.js` or doc updates that come with adding a note. Only describe structure or config changes when that's all the commit contains.

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

1. Create the file **at the path matching its intended URL**, e.g. `<subject>/<section>/<topic>.md` (→ `/<subject>/<section>/<topic>/`). Frontmatter:
   ```yaml
   ---
   layout: default
   title: Topic Name
   parent: <Section title>
   grand_parent: <Subject title>
   nav_order: <next number>
   ---
   ```
   (Use `parent` only, no `grand_parent`, for a page one level deep like a section's own `index.md`.)
2. Add the card to the relevant `index.md` card grid (emoji + title + one-line desc) — the section's own index, not the site root, unless it's a brand-new top-level subject.
3. Add the path to `PRECACHE` array in `sw.js` (for offline support) — full path including `/learning-and-notes/` prefix.
4. Bump the cache key in `sw.js` (`notes-vN` → `notes-vN+1`)

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

Repo root is the general "Learning & Notes" site. Each subject gets its own top-level folder, and **folder layout mirrors URL layout exactly** (see the note at the top of this file). Pages use `just-the-docs` 3-level nav: subject → section → page.

Don't keep a list of pages here. The repo is the source of truth: run `find . -name "*.md" -not -path "./_site/*"` or look at the folders. The generic shape is:

```
<subject>/                    → /<subject>/
├── index.md                  title: <Subject>, nav_order: N, has_children: true   (no parent)
├── <page>.md                 parent: <Subject>
└── <section>/                → /<subject>/<section>/
    ├── index.md              parent: <Subject>, has_children: true   (short intro + bullet list of its pages)
    ├── <page>.md             parent: <Section title>, grand_parent: <Subject title>
    └── fig-N-<topic>.png     images live next to the page that uses them
```

- `parent` / `grand_parent` must match the **`title:`** of the parent pages exactly, not the folder name.
- Embed images with the full path: `![alt]({{ "/<subject>/<section>/fig-1-x.png" | relative_url }})`.
- Inline `<script>` in a page: use `/* */` comments, never `//` (the theme's HTML compression puts it all on one line).
- Math (MathJax, loaded automatically only on pages that have math): write `$$x^{(i)}$$` for both inline and display math (display = `$$` on its own lines with blank lines around). Never `\(x\)`: Markdown eats the backslashes.
- Diagrams: ```` ```mermaid ```` code blocks render (enabled in `_config.yml`). They use Mermaid's dark theme (`_includes/mermaid_config.js`), because the default theme draws dark arrows that disappear on the dark site background.

**Adding a child page to an existing section:**
- Create the file at the matching path, e.g. `<subject>/<section>/<topic>.md`
- Frontmatter: `parent: <Section title>`, `grand_parent: <Subject title>`, `nav_order: <next number>`
- Add it to that section's `index.md` bullet list (and the subject's `index.md` if it lists sections' pages)
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

## Notebooks (machine-learning)

`.ipynb` notebooks live in `machine-learning/notebooks/` and are run in **Google Colab**, opened straight from GitHub. Excluded from the Jekyll build — the site only links to them.

**Colab link format:**
```
https://colab.research.google.com/github/adnansabbir/learning-and-notes/blob/main/machine-learning/notebooks/<file>.ipynb
```

**Workflow:**
1. Create/edit the notebook (Colab or local Jupyter), commit it to `machine-learning/notebooks/`
2. Link it from the relevant note page with the Colab URL above
3. Colab does not auto-save back to the repo — use *File → Save a copy in GitHub*, or download and commit

Prefer committing notebooks **with outputs** so they read as finished notes on GitHub without re-running.

> A full in-browser JupyterLite lab was tried and removed (20MB build, clunky on phone, browser-stored edits vs. repo files was confusing). Don't reintroduce it. Use runnable blocks instead (below).

## Runnable Python blocks

A ```` ```python ```` block followed on the next line by `{: .runnable}` gets a **▶ Run** button; output and matplotlib plots appear under it. Runs in the browser via Pyodide (`assets/js/pyrun.js`), downloaded (~25MB) only on the first tap, and works on phone. numpy/pandas/matplotlib/scikit-learn work; PyTorch/TensorFlow don't. All blocks on one page share variables like notebook cells.

## Example note (template)

`machine-learning/example-note.md` (→ `/machine-learning/example-note/`, hidden from sidebar and search) shows every feature: image, table, math, Mermaid, runnable Python, collapsible section. Its HTML comments explain the syntax. Copy it when starting a new note.
