# WeddingCamBox — Deployment & Setup Instructions

Practical instructions for deploying and maintaining the WeddingCamBox website.

For the full tech stack overview and database details, see `STACK.md`.
For day-to-day operations, see `REFERENCE.md`.

---

## How your website is deployed

Your site at `thelionsalliance.com` uses the following stack:

- **Astro** — static site generator, project lives in `Website/` in your repo
- **GitHub Actions** — automatically builds the Astro site and deploys it on every push to `main`
- **GitHub Pages** — hosts the built output

The workflow is: _edit files → `git push` → Actions builds → live on thelionsalliance.com_

---

## Project structure

```
Website/
├── src/pages/wedding/
│   ├── index.astro              ← Landing page
│   └── photoportal/index.astro  ← Portal page
├── public/wedding/
│   ├── styles.css               ← Landing page styles
│   ├── script.js                ← Landing page JS (form → Formspree + Supabase)
│   ├── camera.png               ← Product photo (replace with real photo)
│   ├── STACK.md                 ← Tech stack overview & database docs
│   ├── REFERENCE.md             ← Day-to-day operations guide
│   ├── INSTRUCTIONS.md          ← This file
│   ├── CHANGELOG.md             ← Change history
│   └── photoportal/
│       ├── portal.css           ← Portal styles
│       ├── portal.js            ← Portal JS (Supabase + Cloudinary + EmailJS)
│       └── supabase_setup.sql   ← Database schema (already applied)
```

---

## External services

All data is stored in external services — nothing in localStorage or hardcoded JS.

| Service | Purpose | Dashboard |
|---------|---------|-----------|
| **Supabase** | Database (clients, photos, guests, requests) | [Dashboard](https://supabase.com/dashboard/project/zxiwsjjvigrxrgkxalet) |
| **Cloudinary** | Photo upload & CDN hosting | [Console](https://console.cloudinary.com) |
| **Formspree** | Booking form email delivery | [Dashboard](https://formspree.io/forms) |
| **EmailJS** | Gallery share email sending | [Dashboard](https://dashboard.emailjs.com) |

Credentials are stored in `portal.js` (Supabase, Cloudinary, EmailJS) and `script.js` (Supabase, Formspree).

---

## Replacing camera.png with the real product photo

The homepage uses `camera.png` as the image for all 10 camera cards. To use your real product photo:

1. Save your photo as `camera.png` (recommended: 400 × 400 px, transparent or white background)
2. Replace `Website/public/wedding/camera.png` with your file
3. Commit and push — GitHub Actions deploys automatically

---

## Deploying to a custom domain (weddingcambox.nl)

**Option A — Redirect (simplest):**
1. Buy `weddingcambox.nl` (TransIP, Antagonist, or similar)
2. Set up a URL redirect from `weddingcambox.nl` → `thelionsalliance.com/wedding/`

**Option B — Cloudflare Pages (recommended for SEO):**
1. Create a Cloudflare Pages project connected to your GitHub repo
2. Set build command: `cd Website && npm run build`
3. Set output directory: `Website/dist`
4. Add custom domain `weddingcambox.nl`
5. This gives you a separate deployment with your own domain + free SSL

---

## Database setup (already done)

The Supabase tables were created using `photoportal/supabase_setup.sql`. If you ever need to recreate them (e.g. on a new Supabase project), paste that file's contents into the Supabase SQL Editor and run it.

See `STACK.md` for complete table schemas and data reference.

---

## Fonts

The site uses Google Fonts:
- **Playfair Display** — headings
- **Inter** — body text

These load from `fonts.googleapis.com` and require an internet connection.

---

*Last updated: April 2025*
