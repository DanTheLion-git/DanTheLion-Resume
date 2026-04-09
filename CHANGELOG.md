# Changelog

All changes are listed newest-first within each entry.
Timestamps without a known exact time are marked as the date only.

---

## [2026-04-09] — Project detail pages + Python Autorigger card

**Request:** Create individual project pages accessible by clicking project cards on the resume. Convert Oosterschelde.html, PythonAutorigger.html, and VRVoyage.html (VR Voyage = Amsterdam Rederij) to Astro pages. Add placeholder pages for the remaining projects. Add Python Autorigger to the project carousel.

**Changes (live repo — DanTheLion-git/DanTheLion-Resume):**

- `Astro-Resume/src/pages/resume/projects/` *(new directory)* — 8 project detail pages, each using `ResumeLayout`, accessible at `/resume/projects/[slug]/`:
  - `amsterdam-rederij.astro` — VR Voyage / Amsterdam Rederij page; content scaffolded from `VRVoyage.html`; placeholder sections for manual fill-in
  - `oosterschelde.astro` — content from `Oosterschelde.html`; Project Overview section populated; remaining sections placeholder
  - `python-autorigger.astro` — fully populated from `PythonAutorigger.html`; all 6 sections + 4 images from `public/images/python-autorigger/`
  - `martens-beton.astro`, `werken-bij-schiphol.astro`, `lucardi.astro`, `garbage-gary.astro`, `meijel-museum.astro` — placeholder structure with standard sections for manual fill-in
- `Astro-Resume/public/images/python-autorigger/` *(new)* — BrandingPage.png + ExplanationImage1–6.png copied from `Images/PythonAutoRigger/`
- `Astro-Resume/src/pages/resume.astro` — PROJECTS array updated:
  - Added `page` field to all 7 existing projects (path to their detail page)
  - Added Python Autorigger as an 8th project entry
  - Fixed Lucardi `link` field (was a bare string, now a proper `{ label, href }` object)
  - Card generation updated: renders a `"Learn more →"` button when `p.page` is set, plus the existing external link button; both wrapped in `.proj-card-btns` flex container
- `Astro-Resume/src/styles/global.css` — added `.proj-card-btns` flex container; added full project detail page styles: `.project-page`, `.project-back`, `.project-hero`, `.project-title`, `.project-subtitle`, `.project-tags`, `.project-tag`, `.project-video-wrap`, `.project-grid` (2-col at ≥720 px), `.project-section`, `.project-image`, `.project-section--links`

---

## [2026-04-03T18:19] — Floating 3D canvas + side panel layout

**Request:** Make the Three.js object float on the page background (no container box). When a project is clicked, show the info panel to the side on desktop and below on mobile.

**Changes (live repo — DanTheLion-git/DanTheLion-Resume):**

- `Astro-Resume/src/pages/resume.astro` — restructured the `#work` section HTML:
  - Removed the old single `#podium-wrapper` that contained both canvas and panel
  - Added `.projects-layout` flex container wrapping both `#podium-wrapper` (canvas only) and `#proj-panel` (now a flex sibling, not a child of the canvas)
  - Canvas wrapper class changed to `podium-canvas-wrap`

- `Astro-Resume/src/styles/global.css` — rewrote the podium/panel CSS block:
  - `.projects-layout` — `display: flex; align-items: flex-start; gap: 1.5rem;`
  - `.podium-canvas-wrap` — `flex: 1 1 auto; height: 500px;` — **no background, no border** so the canvas floats transparently on the page
  - `.proj-panel` — starts at `width: 0; opacity: 0`; transitions to `flex: 0 0 320px; width: 320px; opacity: 1` with cubic-bezier easing when `.open` is added
  - Mobile (`≤680px`): layout switches to `flex-direction: column`, panel expands to full width below the canvas
  - Removed `html.theme-light .podium-wrapper` background override (canvas is now always transparent)

---

## [2026-04-03T18:11] — Auto-detect OS light/dark mode preference

**Request:** Make the website automatically detect the browser/OS dark or light mode setting and apply the correct theme as default.

**Changes (live repo — DanTheLion-git/DanTheLion-Resume):**

- `Astro-Resume/src/layouts/ResumeLayout.astro` — updated the anti-FOUC inline `<script>` in `<head>`:
  - **Before:** only read `localStorage` to restore a saved choice; fell back to `theme-light` (the Astro prop default)
  - **After:** reads `localStorage` first (explicit user choice takes priority); if nothing is stored, reads `window.matchMedia('(prefers-color-scheme: dark)')` and applies `theme-dark` or `theme-light` accordingly
  - Theme toggle button still saves to `localStorage` — once the user manually switches, their choice persists across visits

---

## [2026-04-03T18:05] — WP-style grey theme pair (light + dark)

**Request:** Replace the full-white light theme with professional shades of grey similar to the WordPress admin UI. Make the dark theme a matching dark version.

**Changes (live repo — DanTheLion-git/DanTheLion-Resume):**

- `Astro-Resume/src/styles/global.css`:
  - **`:root` (dark theme)** updated to WordPress sidebar colours:
    - `--bg: #1d2327`, `--bg-alt: #252a2d`, `--fg: #f0f0f1`, `--fg-muted: #a7aaad`
    - `--accent-green-light: #5fa8d3` (lighter blue, readable on dark), `--accent-green: #2271b1`
    - `--card-bg: #2c3338`, `--border: #3c434a`
    - Body background: `#1d2327` (plain, no gradient)
  - **`html.theme-light` (light theme)** updated to WordPress admin panel greys:
    - `--bg: #f0f0f1`, `--bg-alt: #e8e8e9`, `--fg: #1d2327`, `--fg-muted: #646970`
    - `--accent-green-light: #2271b1`, `--accent-green: #135e96`
    - `--card-bg: #ffffff` (white cards on grey background), `--border: #c3c4c7`
    - Body background: `#f0f0f1`
  - Updated component overrides: `.site-header`, `.hero-side`, `.podium-wrapper`, `.pill`, `.nav a:hover` all updated to use the new grey palette

---

## [2026-04-04] — CV redesign + 7 client projects + docs to GitHub

**Request:** Redesign `/resume` as a proper Curriculum Vitae with a clean, modern, white/blue style. Update the ThreeJS component with 7 new client projects (Amsterdam Rederij, Martens Beton, Werken bij Schiphol, Lucardi, Oosterschelde, Garbage Gary, Meijel Museum). Add transform config per project. Add placeholder `.glb` files. Push CHANGELOG.md and REFERENCE.md to GitHub.

**Changes (live repo — DanTheLion-git/DanTheLion-Resume):**

- `Astro-Resume/src/pages/resume.astro` — Full CV redesign:
  - Hero retitled "CURRICULUM VITAE · CREATIVE TECHNOLOGIST"; kept "Currently Exploring" sidebar
  - Work Experience preserved with show/hide structure (2 main + 3 in `<details>`)
  - "Finished Projects" renamed "Client Projects"
  - Three.js PROJECTS array updated with 7 new entries, each with `folder`, `color`, `pos`, `rot`, `scale` config keys
  - Added `GLTFLoader` import: tries `/models/projects/[folder]/model.glb`; falls back to colored cube if load fails or model has no geometry
  - Cube layout changed from 0.80π arc (5 items) to full 360° circle (7 items), `ARC_R=0.55`, `CUBE_SIZE=0.095`
  - Added Skills & Tools section
- `Astro-Resume/src/styles/global.css` — Light theme overhauled from sage/forest to clean white/blue CV palette:
  - `--bg:#ffffff`, `--fg:#0f172a`, `--card-bg:#f8fafc`, `--border:#e2e8f0`
  - `--accent-green-light:#2563eb` (blue accent), `--accent-green:#1e40af`
  - Plain white body background (removed forest gradient)
  - Updated `.site-header`, `.hero-side`, `.podium-wrapper`, `.pill`, `.nav a:hover` overrides
- `Astro-Resume/public/models/projects/[folder]/model.glb` × 7 — Minimal valid placeholder GLBs created for all 7 projects; replace with real models when ready
- `CHANGELOG.md` — Pushed to repo root (accessible from any device)
- `REFERENCE.md` — Pushed to repo root (accessible from any device)

---

## [2026-04-03T14:28] — Homepage redesign: Creative Craft Tech Light

**Request:** Redesign homepage from Elegant Dark to Creative Craft Tech Light. Change service cards to Interactive Experiences / Customized Products / Film & Photography. Adjust hero to match. Only link to /wedding and /resume.

**Changes (live resume — DanTheLion-git/DanTheLion-Resume):**

- `Astro-Resume/src/pages/index.astro` — Full redesign. Switched from dark background to light (`--bg: #f4f1eb` warm off-white). Replaced Playfair Display with `Fraunces` variable serif for display headings. Three-color system: teal (Interactive/tech), forest green (Craft/products), rust (Film/photography). Changes include:
  - **Nav:** Logo with SVG triangle mark, only "Wedding" and "Portfolio" links
  - **Hero:** Large Fraunces italic highlighted keywords (*experiences*, *products*, *stories*) each in their accent color with underline bars. Eyebrow row with three colored dots. Right side: three stacked decorative chips (dot-grid, concentric rings, camera lens) hidden on mobile.
  - **Services:** Three cards with colored top accent bars, large faded number, matching icon, Fraunces heading. Links to /resume#work and /wedding.
  - **Tagline band:** Dark inverted section with large italic `Technology + Craft + Story` in the three muted accent tones.
  - **About:** Bio + skill tag cloud (colored tags for Interactive/Craft/Film, neutral for 3D/Mocap/WebGL). Single CTA to /resume.
  - **Footer:** Minimal — brand mark + copyright only, no email or social links.

---

## [2026-04-03T14:08] — Professional public homepage + admin login portal

**Request:** Replace the home-server dashboard at `/` with a professional public homepage
for potential clients. Protect the dashboard behind an admin login.

**Changes (live resume — DanTheLion-git/DanTheLion-Resume):**

- `Astro-Resume/src/pages/index.astro` — Completely replaced the internal dashboard with
  a professional studio landing page. Dark elegant design using Playfair Display for
  headings and gold/forest accent colours. Sections: sticky nav, hero with decorative orbs,
  3-column services grid (Wedding Cinematography, 3D Animation & VFX, Interactive
  Experiences), italic quote band, about/contact strip, footer. Links to `/wedding`,
  `/resume`, `/blog`, and `mailto:`.

- `Astro-Resume/src/pages/admin/login.astro` *(new)* — Login page at `/admin/login`.
  Centered card form with a password input. On submit, hashes the input with
  `SubtleCrypto.digest('SHA-256')` and compares against the stored hash. On success stores
  the hash in `sessionStorage` and redirects to `/admin/`. On failure shows an inline error
  and clears the input.

- `Astro-Resume/src/pages/admin/index.astro` *(new)* — Protected server dashboard at
  `/admin/`. An inline `<script is:inline>` checks `sessionStorage` for the auth token
  before paint and redirects to `/admin/login` if absent. Contains the original 4-service
  card grid (Jellyfin, Streamer, Audiobookshelf, Finance) plus a Logout button that clears
  the session and a "← Back to main site" footer link.

**To change the admin password:**
1. Compute SHA-256 of your new password (e.g. `echo -n "newpass" | sha256sum`)
2. Replace `ADMIN_HASH` in both `login.astro` and `admin/index.astro`

---

## [2026-05-30] — Light theme, dark/light toggle, styled social buttons, podium camera adjustment

**Request:** Make the light theme the default, add a dark/light mode toggle to the nav,
style the YouTube/Sketchfab/Itch.io buttons, move the podium down ~20% in the viewport,
and make the light mode colour palette "sunny forest clearing" (warm greens + light browns).

**Changes (live resume — DanTheLion-git/DanTheLion-Resume):**

- `Astro-Resume/src/styles/global.css` — rewrote `html.theme-light` block with sunny
  forest palette (`--bg: #f7f0e0`, `--card-bg: #fdf6e4`, `--border: #c9a96e`, greens
  `#4d9420`). Body background uses layered radial gradients (soft green canopy + warm
  amber). Added `.theme-toggle` button CSS (pill, border, hover). Added `.btn-social`,
  `.btn-yt`, `.btn-sf`, `.btn-itch` with brand-coloured borders/icon tints and hover
  glow. Added sun/moon icon visibility rules (`html.theme-light` flips which icon shows).

- `Astro-Resume/src/layouts/ResumeLayout.astro` — added anti-FOUC inline script in
  `<head>` (reads `localStorage.getItem('lions-theme')` and sets `className` before CSS
  paint). Added `<button id="theme-toggle" class="theme-toggle">` with inline SVG sun and
  moon icons in the `<nav>`. Added toggle JS before `</body>` (click toggles `theme-light`
  / `theme-dark` class + saves to `localStorage`).

- `Astro-Resume/src/pages/resume.astro` — replaced `.button-primary`/`.button-ghost`
  hero buttons with `.btn-social .btn-yt`, `.btn-sf`, `.btn-itch`. Raised
  `LOOK_TARGET.y` from `0.07` → `0.28` so the platform sits in the lower-centre of the
  frame. Lowered `CAM_ELEV` from `20°` → `14°` for a shallower angle. `theme="light"` is
  already the default.

- `Astro-Resume/src/pages/resume/test.astro` — repurposed as a `theme="dark"` preview at
  `/resume/test` (previously was a duplicate light page).

---

## [2026-04-03T11:37] — Full volumetric lighting system

**Request:** Add a full volumetric lighting system with ray-marched high-quality mode
and a cheap fallback mode, device-tier detection, config-driven parameters, and
adaptive FPS-based step-count reduction.

**Changes:**

- Created `src/vite-env.d.ts` — `/// <reference types="vite/client" />` to enable
  TypeScript-safe `?raw` GLSL imports.
- Created `src/utils/detectDeviceTier.ts` — returns `"high"` or `"low"` based on:
  WebGPU (`navigator.gpu`), mobile user-agent, and `deviceMemory ≤ 4 GB`.
- Created `src/shaders/volumetrics/common.glsl` — `hash()`, `vnoise()`, `fbm()`
  noise utilities shared by ray-march shaders.
- Created `src/shaders/volumetrics/raymarch.glsl` — GLSL ES 3.00 fragment shader.
  Marches rays from camera world-position to each fragment on the bounding cone
  surface; checks cone membership, accumulates beam density × distance falloff × fbm
  noise; uses dynamic loop break so `uStepCount` can be reduced at runtime.
- Rewrote `src/scenes/volumetric-lights.ts`:
  - Removed old `createVolumetricLights(scene)`.
  - Added `createHighQualityVolumetrics()` — ShaderMaterial cone (ray-march,
    GLSL3, BackSide, additive blend); `onBeforeRender` updates `uCameraPos` per
    frame; four moonbeam shafts at 40 % step count; exposes
    `group.userData.setStepCount(n)` for adaptive quality.
  - Added `createLowQualityVolumetrics()` — cheap MeshBasicMaterial additive cones
    (no shader required); SpotLight shadow map halved to 512².
- Updated `src/config.ts` — added `volumetrics` block: `enabled`, `qualityOverride`,
  `density`, `stepCount`, `shaftIntensity`, `noiseAmount`, `falloff`.
- Updated `src/scenes/main-scene.ts`:
  - Imports `detectDeviceTier` and both volumetric functions.
  - Resolves tier via `config.volumetrics.qualityOverride ?? detectDeviceTier()`.
  - Skips volumetrics entirely when `config.volumetrics.enabled = false`.
  - FPS counter in animate loop: if FPS < 55, reduces `adaptiveStepCount` by 5
    (min 20) and calls `setVolStepCount` to update shader uniforms live.

---

## [2026-04-03T08:53] — Drag-to-orbit camera

**Request:** Change camera controls from automatic mouse-follow to click-and-drag.

**Changes:**
- Updated `src/scenes/main-scene.ts` — replaced `mousemove` listener with
  `pointerdown` / `pointermove` / `pointerup` listeners; camera angle only
  updates while a pointer button is held. Drag distance is proportional to
  pixels moved (full window width = full horizontal range). Uses
  `setPointerCapture` so dragging outside the window still works.
- Updated `REFERENCE.md` — clarified that `smoothness` applies to the drag easing.

---

## [2026-04-03] — Panel template files + build fix

**Request:** Add a single `.md` reference file and a changelog `.md` file.

**Changes:**
- Created `REFERENCE.md` — developer reference covering all user-tunable
  settings (projects, camera, trees, podium speed, panel HTML, HDRI).
- Created `CHANGELOG.md` — this file; full history of all prior requests included.
- Created `public/panels/_template/panel.html` — fully commented HTML template
  for authoring project info panels (YouTube embeds, images, custom styles).
- Created `public/panels/project-1/panel.html`, `project-2/panel.html`,
  `project-3/panel.html` — starter placeholder panels.
- Fixed `src/scenes/podium-cubes.ts` — inlined `CubeConfig` type so the
  superseded file no longer breaks the TypeScript build.

---

## [2026-04-03] — Turntable camera + GLTF project models + HTML panel files

**Request:** Change camera to horizontal turntable (mouse X → orbit angle, fixed
elevation set in config). Replace placeholder cubes with actual GLTF project models
loaded from `/public/models/projects/[folder]/`. Associate a panel HTML file
per project via `/public/panels/[folder]/panel.html` so new projects can be added
by dropping files into folders and updating the config.

**Changes:**
- Rewrote `src/config.ts` — removed `orbitSmoothness` + `podiumCubes`;
  added `camera` object (`smoothness`, `distance`, `elevationDeg`,
  `horizontalRangeDeg`) and `projects[]` array (`folder`, `position`,
  `rotation`, `scale`).
- Created `src/scenes/project-objects.ts` — replaces `podium-cubes.ts`;
  loads `/models/projects/[folder]/model.glb`, bottom-normalises model,
  falls back to placeholder cube; glow ring + 10 % scale-up on selection;
  dispatches `project-selected` event; listens for `request-deselect`.
- Rewrote `src/pages/project-panel.ts` — now fetches `/panels/[folder]/panel.html`
  via `fetch()`, caches at startup, injects as `innerHTML` into `.pp-content`.
- Rewrote `src/scenes/main-scene.ts` — turntable camera (physically orbits
  podium on horizontal plane); imports `createProjectObjects`.
- Updated `src/main.ts` — uses `config.projects`.
- Updated `src/style.css` — added `.pp-content` wrapper; added utility classes
  (`.pp-video-wrap`, `.pp-content h1/p/img`) for user-authored panel HTML.
- Created directories: `public/panels/_template/`, `public/panels/project-1/`,
  `public/panels/project-2/`, `public/panels/project-3/`,
  `public/models/projects/project-1/`.

---

## [2026-04-03] — Cubes rotate with podium; no scene dimming; side panel

**Request:** Make the cubes children of the podium so they spin with it. Remove the
background dimming when a panel opens. Make the panel open to the side without
blocking the 3-D scene. Close the panel by clicking outside it.

**Changes:**
- Reduced podium rotation speed from `π/30` to `π/90` rad/s (1 rotation per
  3 minutes).
- Updated `src/scenes/podium-cubes.ts` — changed parent parameter from
  `THREE.Scene` to `THREE.Object3D`; cubes added to `podiumGroup` so they
  rotate with it.
- Updated `src/pages/project-panel.ts` — removed backdrop overlay entirely;
  `#pp-panel` always `pointer-events:none`; only `.pp-card` has
  `pointer-events:auto`; panel slides in from the right without dimming.

---

## [2026-04-03] — Rotating podium + HTML project panels

**Request:** Make the podium slowly rotate (~1 rotation per 60 s). Show a 2-D
floating panel with a YouTube embed and project description when a cube is clicked.
Panel should stay stationary while the podium turns and close on deselect.

**Changes:**
- Updated `src/scenes/podium.ts` — now returns `THREE.Group` instead of adding
  directly to scene; rotation driven by `THREE.Clock` in animate loop at
  `π/30 rad/s`.
- Expanded `src/config.ts` — added `ProjectConfig` interface with `title`,
  `youtubeUrl`, `description` per cube entry.
- Rewrote `src/pages/project-panel.ts` — full redesign; YouTube URL normaliser
  converts any `youtu.be` / `watch?v=` link to embed format; responsive 16:9
  iframe; slide-in from right animation.
- Updated `src/scenes/podium-cubes.ts` — dispatches `cube-selected`; listens
  for `request-deselect` to synchronise selection state with the panel.

---

## [2026-04-02] — First-person camera + terrain + closer podium

**Request:** Replace orbit controls with first-person mouse-follow camera (same
horizontal/vertical limits). Double the camera closeness. Add noise-based hills to
the forest floor while keeping trees grounded.

**Changes:**
- Removed OrbitControls entirely from `src/scenes/main-scene.ts`.
- Implemented first-person look: quaternion yaw (world Y) + pitch (camera right),
  mouse position mapped to `targetYaw` / `targetPitch` with easing.
- Camera moved from (0, 2.5, 8) to (0, 2.5, 4) — twice as close.
- Created `src/scenes/terrain.ts` — `terrainHeight(x,z)` using multi-frequency
  sine×cosine products, multiplied by `smoothstep` so clearing (r < 5) stays flat;
  `createGround()` builds a 128×128 displaced `PlaneGeometry`.
- Updated `src/scenes/trees.ts` — calls `terrainHeight(x,z)` to plant trees on
  the correct hill height.
- Updated `src/scenes/lanterns.ts` — calls `terrainHeight(x,z)` for per-lantern Y.

---

## [2026-04-02] — Config file + 5 random GLB tree models + selectable cubes + project panels

**Request:** Randomly scatter 5 uploaded `.glb` tree models. Add a config file to
tune camera smoothness. Put 3 clickable cubes on the podium that show project info
panels; configure their transforms through the config. Only one cube selected at a time.

**Changes:**
- Created `src/config.ts` — `orbitSmoothness`, `treeModels[]`, `podiumCubes[]`
  with per-cube position/rotation/color/project data.
- Updated `src/scenes/trees.ts` — loads all GLBs listed in `config.treeModels`;
  two seeded RNGs (seed 42 = positions, seed 137 = model assignment) for
  stable layouts; normalises each model to height = 1 unit.
- Created `src/scenes/podium-cubes.ts` — 3 `MeshStandardMaterial` cubes as
  children of podium; raycasting with `pointerdown`/`pointerup` click detection;
  dispatches `cube-selected` CustomEvent; listens for `request-deselect`.
- Created `src/pages/project-panel.ts` — fixed right-side floating panel;
  reads per-cube YouTube URL + description from config; slides in from right.

---

## [2026-04-02] — GLTF tree models + soft orbit limits

**Request:** Allow uploading a real 3-D tree model in `.gltf` and instance it.
Replace the hard orbit stop with smooth slowdown at the camera limits.

**Changes:**
- Updated `src/scenes/trees.ts` — made async; loads `/models/tree.gltf`,
  normalises height to 1 unit, falls back to procedural cone trees if file
  is absent.
- Replaced OrbitControls hard `minAzimuthAngle` / `maxAzimuthAngle` with a
  quadratic spring correction in the animate loop: `correction = excess × t × SPRING_RATE`
  where `t = min(excess / SPRING_ZONE, 1)` — gentle at boundary, stronger further out.

---

## [2026-04-01] — Initial 3-D forest scene

**Request:** Build a Three.js portfolio scene with volumetric lighting, HDRI,
a podium in a forest clearing, lanterns on trees, and a camera with OrbitControls
limited to ±20° horizontal / ±10° vertical.

**Changes:**
- Created `src/scenes/main-scene.ts` — renderer (ACESFilmic tone mapping,
  SRGBColorSpace, DPR ≤ 2), PerspectiveCamera, DirectionalLight with shadow map,
  fog, animation loop.
- Created `src/scenes/environment.ts` — `RGBELoader` + `PMREMGenerator`; falls
  back to dark sky + HemisphereLight when `public/hdri/scene.hdr` is absent.
- Created `src/scenes/trees.ts` — 50 instanced procedural trees (3 foliage
  tiers per tree) arranged in a ring around the clearing; seeded LCG RNG for
  deterministic layout.
- Created `src/scenes/podium.ts` — 3-tier `CylinderGeometry` podium.
- Created `src/scenes/fairy-lights.ts` — `CatmullRomCurve3` sagging wire
  between trees using `TubeGeometry`; `InstancedMesh` emissive bulbs.
- Created `src/scenes/volumetric-lights.ts` — `SpotLight` + additive-blended
  cone shaft mesh; moonbeam shaft meshes.
- Added OrbitControls with `minAzimuthAngle` / `maxAzimuthAngle` and
  `minPolarAngle` / `maxPolarAngle` limits.
- Created `src/style.css` — canvas fixed full-screen (z-index 0);
  `#app` overlaid on top (z-index 1).
- Created `src/main.ts` — mounts canvas, calls `createScene().catch(console.error)`.
