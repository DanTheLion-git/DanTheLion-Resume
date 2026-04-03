# Reference Guide

A human-readable reference for everything you might want to tweak or extend
across both the **live resume website** and the **local 3D portfolio project**.

---

## Table of Contents

### Resume Website — `thelionsalliance.com/resume`

1. [Adding a new client project](#1-adding-a-new-client-project)
2. [Editing an existing project's config](#2-editing-an-existing-projects-config)
3. [Replacing a cube with a real 3D model](#3-replacing-a-cube-with-a-real-3d-model)
4. [Three.js camera settings](#4-threejs-camera-settings)
5. [Updating CV content (experience, skills, etc.)](#5-updating-cv-content)
6. [HDRI environment lighting](#6-hdri-environment-lighting)
7. [Theme system (light / dark / auto)](#7-theme-system)
8. [Deployment pipeline](#8-deployment-pipeline)
9. [File map — resume site](#9-file-map--resume-site)

### Local 3D Portfolio Project — `CopilotedProject`

10. [Adding a project (local scene)](#10-adding-a-project-local-scene)
11. [Camera settings (local scene)](#11-camera-settings-local-scene)
12. [Tree models](#12-tree-models)
13. [Podium rotation speed](#13-podium-rotation-speed)
14. [Project panel HTML](#14-project-panel-html)
15. [Volumetric lighting](#15-volumetric-lighting)
16. [Dev commands](#16-dev-commands)
17. [File map — local project](#17-file-map--local-project)

---

# Resume Website — `thelionsalliance.com/resume`

The resume is an **Astro** site in `Astro-Resume/`. It builds via GitHub Actions
and deploys to `thelionsalliance.com`. The Three.js podium is written as an
inline `<script is:inline type="module">` at the bottom of `resume.astro`.

All project configuration lives inside that script — there is **no separate
config file** for the resume site; you edit `resume.astro` directly.

---

## 1. Adding a new client project

### Step 1 — Drop a placeholder (or real) model in

```
Astro-Resume/public/models/projects/
  my-new-project/
    model.glb        ← your GLB model (or copy any existing placeholder)
```

If you don't have a model yet, copy any existing `model.glb` from another
project folder as a placeholder. The scene will show a coloured cube until a
model with real geometry is found.

### Step 2 — Add it to the PROJECTS array in `resume.astro`

Open `Astro-Resume/src/pages/resume.astro` and find the `// ═══ PROJECT CONFIG`
block near the top of the inline `<script>`. Add a new entry to the `PROJECTS`
array:

```js
{
  title:  'My New Project',          // displayed in the info panel
  folder: 'my-new-project',          // must match the folder name above
  meta:   'Web · Three.js',          // subtitle line in the panel
  color:  0x3b82f6,                  // fallback cube colour (hex)
  pos:    { x: 0, y: 0, z: 0 },     // position offset from default circle (metres)
  rot:    { x: 0, y: 0, z: 0 },     // rotation in degrees
  scale:  1.0,                       // uniform scale applied to the GLB
  desc:   'Short description here.', // body text shown in the panel
  links:  [                          // buttons in the panel (can be empty [])
    { label: 'Live site', href: 'https://example.com', newTab: true },
    { label: 'Video',     href: 'https://youtu.be/XYZ', newTab: true },
  ],
},
```

That's it — save and commit. The project will appear on the podium automatically.

---

## 2. Editing an existing project's config

All editable fields are in the `PROJECTS` array in `resume.astro`:

| Field | What it does |
|---|---|
| `title` | Large heading shown in the info panel |
| `folder` | Must match `Astro-Resume/public/models/projects/[folder]/` |
| `meta` | Small subtitle line below the title in the panel |
| `color` | Hex colour of the fallback cube, e.g. `0xff6600` |
| `pos.x/y/z` | Position offset from the default circle position, in metres |
| `rot.x/y/z` | Rotation in **degrees** (converted to radians internally) |
| `scale` | Uniform scale applied to the loaded GLB. `1.0` = model's natural size |
| `desc` | Description paragraph in the panel |
| `links` | Array of `{ label, href, newTab }` button objects shown in the panel |

**Project layout on the circle:**
Projects are distributed evenly around a full 360° circle with radius `ARC_R = 0.55`
(scene units, just inside the platform edge). The first project starts at angle 0
(front-centre) and the rest follow evenly. The `pos` offset is applied on top of
this default position, so `pos: { x: 0.1, y: 0, z: 0 }` nudges a cube 10 cm to
the right of its natural circle position.

---

## 3. Replacing a cube with a real 3D model

1. Export your model as **GLB** (binary GLTF) from Blender, Unity, or any DCC tool.
2. Name the file `model.glb` and drop it into
   `Astro-Resume/public/models/projects/[folder]/`, replacing the placeholder.
3. Commit and push. GitHub Actions will rebuild the site automatically.

**The scene handles it automatically:**
- On load, `GLTFLoader` tries `/models/projects/[folder]/model.glb`.
- If the file loads **and contains meshes**, the coloured cube is removed and the
  GLB is shown in its place.
- If the file is a placeholder (no meshes) or fails to load, the cube stays.

**Adjusting the model after replacing:**
Use `pos`, `rot`, and `scale` in the `PROJECTS` config to fine-tune placement
without editing the model file. Example — move up 5 cm, rotate 45° on Y, scale
down to 80%:

```js
pos:   { x: 0, y: 0.05, z: 0 },
rot:   { x: 0, y: 45, z: 0 },
scale: 0.8,
```

---

## 4. Three.js camera settings

These constants are near the top of the inline script in `resume.astro`,
just below the `PROJECTS` array:

```js
const LOOK_TARGET = new THREE.Vector3(0, 0.28, 0); // point the camera aims at
const CAM_DIST    = 3.0;   // distance from LOOK_TARGET (metres)
const CAM_ELEV    = 14;    // elevation angle in degrees (higher = more top-down)
const EASE_RATE   = 0.10;  // drag easing: 0.05 = very slow, 0.20 = snappy
```

| Constant | Effect |
|---|---|
| `LOOK_TARGET.y` | Vertical aim point. `0.28` centres the platform in the frame. Increase to look more at the top of the models. |
| `CAM_DIST` | How far away the camera sits. Decrease to zoom in, increase to zoom out. |
| `CAM_ELEV` | Camera elevation in degrees. `0` = eye-level, `30` = overhead. |
| `EASE_RATE` | Drag smoothing. `0.05` = dreamy slow, `0.20` = nearly instant. |
| `ARC_R` | Circle radius for project placement (`0.55`). Keep below `0.88` (platform edge). |

The camera orbits horizontally (full 360°) by click-and-dragging the canvas.

---

## 5. Updating CV content

All page content is plain HTML inside `Astro-Resume/src/pages/resume.astro`.

### Work experience

Find the `<section id="experience">` section. Each job is a `<li class="post-card">`:

```html
<li class="post-card">
  <h3 class="card-title">Job Title</h3>
  <p class="post-meta">Company · Month YYYY – Month YYYY</p>
  <p class="post-excerpt">Short description of the role.</p>
</li>
```

The first two jobs are always visible. Any extras go inside the `<details>` block
(the "Show more experience" dropdown).

### Currently exploring (sidebar)

Find `<ul class="hero-side-list">` in the hero section. Add or remove `<li>` items:

```html
<li>• Your new thing</li>
```

### Skills & Tools

Find `<section class="section">` with the "Skills &amp; Tools" heading.
Edit the `<p class="post-excerpt">` paragraphs under each category label.

### Social links / contact

The three buttons (YouTube, Sketchfab, Itch.io) are in the hero `<div class="hero-actions">`.
Update the `href` attributes on the `<a>` tags to change the URLs.

The contact email appears in `<p class="hero-subnote">` and in the "Get in contact" section.

---

## 6. HDRI environment lighting

Place any `.hdr` file from [Polyhaven](https://polyhaven.com/hdris) at:

```
Astro-Resume/public/hdri/scene.hdr
```

> ⚠️ The file is 26+ MB — too large for a direct GitHub API upload.
> Upload it manually via `git push` on your local machine or via the GitHub web UI.

The Three.js script tries `/hdri/scene.hdr` first. If not found, it falls back to
`studio_small_08_1k.hdr` from the Polyhaven CDN. If that also fails, a plain
`AmbientLight` is added as a last resort — the scene always renders.

---

## 7. Theme system (light / dark / auto)

### Auto-detection (default)

On first visit, the site reads `window.matchMedia('(prefers-color-scheme: dark)')`.
If the OS is in dark mode, `theme-dark` is applied; otherwise `theme-light`.

### Manual toggle

The sun/moon button in the nav saves the user's choice to `localStorage` under
the key `'lions-theme'`. Once saved, this overrides the OS setting on all future
visits. To reset to OS-auto, the user can clear `localStorage` in DevTools.

### Changing theme colours

All colours are CSS custom properties in `Astro-Resume/src/styles/global.css`:

**Dark theme** (`:root` block — the base):
```css
--bg:                #1d2327;   /* page background */
--bg-alt:            #252a2d;   /* slightly lighter surface */
--fg:                #f0f0f1;   /* main text */
--fg-muted:          #a7aaad;   /* secondary text */
--accent-green-light:#5fa8d3;   /* primary accent (blue) */
--card-bg:           #2c3338;   /* card / panel background */
--border:            #3c434a;   /* border colour */
```

**Light theme** (`html.theme-light` block, further down the file):
```css
--bg:                #f0f0f1;   /* WP admin grey */
--card-bg:           #ffffff;   /* white cards on grey bg */
--fg:                #1d2327;
--accent-green-light:#2271b1;   /* WP blue */
--border:            #c3c4c7;
```

Note: the variable names use `--accent-green*` for historical reasons but they
control the blue accent in the current theme.

---

## 8. Deployment pipeline

```
Commit → push to DanTheLion-git/DanTheLion-Resume
  → GitHub Actions: cd Astro-Resume && npm ci && npm run build
  → deploys Astro-Resume/dist/ to thelionsalliance.com
```

- `/resume` → `Astro-Resume/src/pages/resume.astro`
- `/` → `Astro-Resume/src/pages/index.astro`
- `/admin/` → `Astro-Resume/src/pages/admin/index.astro` (protected)
- `/admin/login` → `Astro-Resume/src/pages/admin/login.astro`

**Admin password** is hashed with SHA-256. To change it:
1. Run `echo -n "newpassword" | sha256sum` (or use an online SHA-256 tool)
2. Replace `ADMIN_HASH` constant in **both** `admin/login.astro` and `admin/index.astro`

---

## 9. File map — Resume site

```
Astro-Resume/
├── src/
│   ├── pages/
│   │   ├── resume.astro           ← CV page + inline Three.js script
│   │   ├── index.astro            ← public homepage (Creative Craft Tech Light)
│   │   └── admin/
│   │       ├── index.astro        ← protected home-server dashboard
│   │       └── login.astro        ← SHA-256 client-side login
│   ├── layouts/
│   │   └── ResumeLayout.astro     ← nav + theme toggle + Three.js CDN import map
│   ├── styles/
│   │   └── global.css             ← all styles + light/dark theme variables
│   └── lib/
│       ├── wp.ts                  ← WordPress REST API helper (fetches blog posts)
│       └── html.ts                ← HTML entity decoder
└── public/
    ├── hdri/
    │   └── scene.hdr              ← HDRI environment (optional, has CDN fallback)
    └── models/
        └── projects/
            ├── amsterdam-rederij/
            │   └── model.glb      ← replace placeholder with real model
            ├── martens-beton/
            ├── werken-bij-schiphol/
            ├── lucardi/
            ├── oosterschelde/
            ├── garbage-gary/
            └── meijel-museum/
```

**Three.js CDN versions** are set in `ResumeLayout.astro` via an import map:
```json
{ "three": "https://cdn.jsdelivr.net/.../three@0.167.1/..." }
```
To upgrade Three.js, update the version number in both `three` and `three/addons/` URLs.

---

---

# Local 3D Portfolio Project — `CopilotedProject`

The Vite + TypeScript + Three.js standalone scene. Runs locally only;
not currently deployed to any live URL. All configuration lives in `src/config.ts`.

---

## 10. Adding a project (local scene)

### Step 1 — Drop your model in

```
public/models/projects/my-project/model.glb
```

### Step 2 — Create a panel HTML file

```
public/panels/my-project/panel.html
```

Copy `public/panels/_template/panel.html` as a starting point.

### Step 3 — Register in `src/config.ts`

```ts
{
  folder:   'my-project',
  position: [0, 0.62, 0],   // [x, y, z] on the podium
  rotation: [0, 0, 0],      // Euler angles in radians
  scale:    1.0,
},
```

---

## 11. Camera settings (local scene)

In `src/config.ts` under the `camera` key:

```ts
camera: {
  smoothness:         0.5,   // 0 = instant snap, 1 = very slow/dreamy
  distance:           4,     // world units from podium centre
  elevationDeg:       25,    // degrees above horizontal
  horizontalRangeDeg: 120,   // total sweep: 120 = ±60° left/right
},
```

---

## 12. Tree models

In `src/config.ts` under `treeModels`:

```ts
treeModels: ['tree1.glb', 'tree2.glb'],  // files must be in public/models/
```

Missing files are silently skipped. If all are missing, procedural cone trees
are used as fallback.

---

## 13. Podium rotation speed

In `src/scenes/main-scene.ts`:

```ts
const PODIUM_SPEED = Math.PI / 90   // radians per second
```

| Value | Full rotation |
|---|---|
| `Math.PI / 30` | 60 seconds |
| `Math.PI / 90` | 3 minutes |
| `Math.PI / 180` | 6 minutes |
| `0` | stationary |

---

## 14. Project panel HTML

Panel files: `public/panels/[folder]/panel.html` — plain HTML injected as `innerHTML`.

- **YouTube embed** — wrap in `.pp-video-wrap` for responsive 16:9:
  ```html
  <div class="pp-video-wrap">
    <iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
  </div>
  ```
- **Images** — use absolute paths: `<img src="/panels/my-project/image.png">`
- **`<style>` blocks** — apply while panel is open; use specific selectors to avoid leaks.

---

## 15. Volumetric lighting

All values in `src/config.ts` under `volumetrics`:

| Key | Effect |
|---|---|
| `enabled` | `false` to skip volumetrics entirely |
| `qualityOverride` | `"high"`, `"low"`, or `null` (auto-detect) |
| `density` | Scattering thickness. `0.2` = thin haze, `0.8` = dense beam |
| `stepCount` | Ray-march samples. `30` = fast/rough, `80` = smooth |
| `shaftIntensity` | Brightness multiplier. `1.0` = neutral |
| `noiseAmount` | Noise blend. `0.0` = smooth beam, `1.0` = dusty/hazy |
| `falloff` | Distance fade speed. `1.0` = slow, `4.0` = fast |

---

## 16. Dev commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # tsc type-check + production build → dist/
npm run preview   # serve the production build locally
```

---

## 17. File map — local project

```
src/
├── config.ts                  ← all tunable values
├── main.ts                    ← entry point
├── style.css                  ← global layout
├── scenes/
│   ├── main-scene.ts          ← renderer, camera, animation loop
│   ├── environment.ts         ← HDRI loader
│   ├── trees.ts               ← instanced tree forest
│   ├── terrain.ts             ← noise-based hills
│   ├── podium.ts              ← cylindrical podium
│   ├── fairy-lights.ts        ← string lights between trees
│   ├── lanterns.ts            ← glowing lanterns
│   ├── volumetric-lights.ts   ← HQ ray-march + LQ fallback
│   └── project-objects.ts     ← loads project GLTFs, handles selection
└── pages/
    └── project-panel.ts       ← fetches and displays panel.html

src/utils/
└── detectDeviceTier.ts        ← "high" or "low" based on device

src/shaders/volumetrics/
├── common.glsl                ← noise helpers
└── raymarch.glsl              ← ray-march fragment shader

public/
├── hdri/scene.hdr             ← HDRI (optional)
├── models/
│   ├── tree1–5.glb            ← tree models
│   └── projects/[folder]/model.glb
└── panels/
    ├── _template/panel.html   ← copy this for new panels
    └── [folder]/panel.html
```
