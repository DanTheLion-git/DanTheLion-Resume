# WeddingCamBox — Portal Stack Overview

Everything you need to know about the tech stack behind the photo portal.

---

## Architecture Diagram

```
┌─────────────────────┐    ┌──────────────────────┐
│   Landing Page      │    │   Photo Portal        │
│   /wedding/         │    │   /wedding/photoportal │
│   (Astro static)    │    │   (plain HTML/JS)      │
└────────┬────────────┘    └───────┬───────┬───────┘
         │ booking form            │       │
         ▼                         │       │
┌────────────────┐                 │       │
│   Formspree    │ ← email to you  │       │
│   (form inbox) │                 │       │
└────────────────┘                 │       │
         │ also writes to          │       │
         ▼                         ▼       │
┌──────────────────────────────────────┐   │
│           SUPABASE                   │   │
│   ┌──────────────────────────┐       │   │
│   │ wcb_clients              │       │   │
│   │ wcb_photos               │       │   │
│   │ wcb_guests               │       │   │
│   │ wcb_booking_requests     │       │   │
│   │ wcb_client_state         │       │   │
│   └──────────────────────────┘       │   │
└──────────────────────────────────────┘   │
                                           │
         ┌─────────────────────────────────┘
         │ photo uploads
         ▼
┌────────────────┐     ┌────────────────┐
│   Cloudinary   │     │    EmailJS     │
│   (image CDN)  │     │  (email send)  │
│   URLs stored  │     │  gallery link  │
│   in Supabase  │     │  to guests     │
└────────────────┘     └────────────────┘
```

---

## Services & Credentials

### Supabase (database)

| Setting | Value |
|---------|-------|
| Project URL | `https://zxiwsjjvigrxrgkxalet.supabase.co` |
| Dashboard | `https://supabase.com/dashboard/project/zxiwsjjvigrxrgkxalet` |
| Anon Key | Stored in `portal.js` line 5 and `script.js` (booking form) |
| Free tier limits | 500 MB database, 50K monthly active users, unlimited API |

**What it stores:**
- Client accounts (login credentials, wedding dates, packages)
- Photo metadata (Cloudinary URLs, titles, deleted/active status)
- Guest email lists per client
- Booking requests from the contact form
- Client state (gallery link sent or not)

### Cloudinary (photo hosting)

| Setting | Value |
|---------|-------|
| Cloud name | `ds6l7rprf` |
| Upload preset | `WeddingCamBox_Upload` (unsigned) |
| Dashboard | `https://console.cloudinary.com` |
| Free tier limits | 25K transformations/month, 25 GB storage, 25 GB bandwidth |

**How it works:**
- Admin uploads photos through the portal → JS sends them to Cloudinary
- Cloudinary returns a permanent URL (e.g. `https://res.cloudinary.com/ds6l7rprf/image/upload/...`)
- Portal auto-generates a thumbnail URL by inserting `/w_500,q_75/` into the path
- Both URLs are stored in Supabase `wcb_photos` table
- Photos are organized in folders: `weddingcambox/{client-id}/`

### Formspree (booking form)

| Setting | Value |
|---------|-------|
| Endpoint | `https://formspree.io/f/mvzdqkap` |
| Dashboard | `https://formspree.io/forms` |
| Free tier limits | 50 submissions/month |

**How it works:**
- Visitor fills in the booking form on `/wedding/`
- Form submits to Formspree (you receive an email notification)
- Same data is also sent to Supabase `wcb_booking_requests` (appears in admin dashboard)
- Double delivery ensures you get the email even if Supabase is down, and the admin dashboard works even if Formspree is down

### EmailJS (gallery sharing)

| Setting | Value |
|---------|-------|
| Service ID | `service_eoosuj2` |
| Template ID | `template_don7795` |
| Public Key | `uMloEc253wEBd3sba` |
| Dashboard | `https://dashboard.emailjs.com` |
| Free tier limits | 200 emails/month |

**How it works:**
- Couple adds guests (emails stored in Supabase)
- Couple writes a message and clicks "Send to all guests"
- Portal sends an email to each guest via EmailJS with the gallery link
- Template variables: `{{to_email}}`, `{{to_name}}`, `{{couple_name}}`, `{{subject}}`, `{{message_html}}`, `{{gallery_link}}`

---

## Database Tables

### wcb_clients
Client accounts for the photo portal.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT (PK) | Login username, e.g. `emma-james` |
| `password` | TEXT | Plain text password (sent to client by email) |
| `name` | TEXT | Display name, e.g. `Emma & James` |
| `wedding` | TEXT | Human-readable date, e.g. `15 March 2025` |
| `wedding_date` | DATE | Sortable date, e.g. `2025-03-15` |
| `package` | TEXT | `Basic` / `Standard` / `Premium` |
| `is_admin` | BOOLEAN | `true` for the admin account only |
| `created_at` | TIMESTAMPTZ | Auto-set |

**Seed data:** `admin` (password: `Hondje01`) and `demo` (Sophie & Liam).

### wcb_photos
Photo URLs (pointing to Cloudinary).

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT (PK) | Auto-generated, e.g. `up_1714500000_3` |
| `client_id` | TEXT (FK) | References `wcb_clients.id` |
| `title` | TEXT | Filename without extension |
| `datetime` | TIMESTAMPTZ | Upload timestamp |
| `camera` | TEXT | Always `Uploaded` for now |
| `url` | TEXT | Cloudinary full-resolution URL |
| `thumb` | TEXT | Cloudinary thumbnail URL (w_500,q_75) |
| `deleted` | BOOLEAN | `false` = in gallery, `true` = in recycle bin |
| `created_at` | TIMESTAMPTZ | Auto-set |

### wcb_guests
Guest email lists per client.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT (PK) | Auto-generated, e.g. `g1714500000` |
| `client_id` | TEXT (FK) | References `wcb_clients.id` |
| `name` | TEXT | Guest name (optional) |
| `email` | TEXT | Guest email address |
| `created_at` | TIMESTAMPTZ | Auto-set |

### wcb_booking_requests
Booking form submissions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT (PK) | Auto-generated, e.g. `req_1714500000` |
| `name` | TEXT | Couple name |
| `email` | TEXT | Couple email |
| `wedding_date` | DATE | Requested wedding date |
| `guests` | TEXT | Approximate guest count |
| `package` | TEXT | Selected package |
| `message` | TEXT | Optional message |
| `status` | TEXT | `pending` / `approved` / `declined` |
| `submitted_at` | TIMESTAMPTZ | Auto-set |

### wcb_client_state
Tracks whether gallery link has been sent.

| Column | Type | Description |
|--------|------|-------------|
| `client_id` | TEXT (PK, FK) | References `wcb_clients.id` |
| `link_sent` | BOOLEAN | Has the gallery link been emailed? |
| `sent_at` | TIMESTAMPTZ | When it was sent |

---

## File Map

```
Website/
├── src/pages/wedding/
│   ├── index.astro              ← Landing page (Astro template)
│   └── photoportal/
│       └── index.astro          ← Portal page (Astro wrapper for the HTML)
│
├── public/wedding/
│   ├── styles.css               ← Landing page styles
│   ├── script.js                ← Landing page JS (form, translations, nav)
│   ├── camera.png               ← Product photo (currently placeholder)
│   ├── CHANGELOG.md
│   ├── REFERENCE.md             ← Day-to-day operations guide
│   ├── INSTRUCTIONS.md          ← Developer deployment guide
│   ├── STACK.md                 ← This file — tech stack overview
│   └── photoportal/
│       ├── portal.css           ← Portal styles
│       ├── portal.js            ← Portal JS (all logic, Supabase integration)
│       └── supabase_setup.sql   ← SQL to recreate tables (run once, done)
```

---

## Common Tasks

### Add a client manually (without the booking form)

Go to Supabase dashboard → Table Editor → `wcb_clients` → Insert Row:

```
id:           emma-james
password:     some-password
name:         Emma & James
wedding:      15 August 2026
wedding_date: 2026-08-15
package:      Standard
is_admin:     false
```

Then email the couple their username (`emma-james`) and password.

### View all data

- **Clients:** Supabase → Table Editor → `wcb_clients`
- **Photos:** Supabase → Table Editor → `wcb_photos`
- **Guests:** Supabase → Table Editor → `wcb_guests`
- **Requests:** Supabase → Table Editor → `wcb_booking_requests`
- **All photos on Cloudinary:** cloudinary.com → Media Library → `weddingcambox/` folder

### Delete a client and all their data

Delete from `wcb_clients` (CASCADE will auto-delete their photos, guests, and state):
```sql
DELETE FROM wcb_clients WHERE id = 'emma-james';
```

### Replace camera.png with real product photo

1. Save as `camera.png` (recommended: 400×400px, transparent/white background)
2. Replace `Website/public/wedding/camera.png`
3. Commit and push — GitHub Actions deploys automatically

### Check free tier usage

| Service | Where to check | Limit |
|---------|---------------|-------|
| Supabase | Dashboard → Settings → Usage | 500 MB, 50K users |
| Cloudinary | Console → Dashboard | 25K transforms, 25 GB |
| Formspree | Dashboard → Form → Usage | 50 submissions/mo |
| EmailJS | Dashboard → Usage | 200 emails/mo |

---

## Security Notes

- **Passwords are stored in plain text** in Supabase. This is acceptable for a small personal business but should be hashed if you scale beyond ~50 clients. The Supabase anon key only has access because we set open RLS policies — tighten these if needed.
- **The Supabase anon key is visible in client-side JS.** This is by design (it's a public key). The RLS policies control what it can access. Currently, policies are wide open (`USING (true)`) for simplicity.
- **To tighten security later:** Use Supabase Auth instead of plain-text passwords, and restrict RLS policies so clients can only see their own data.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Portal shows "Connection error" on login | Check Supabase is running (dashboard → project status). Check browser console for errors. |
| Photos disappear from gallery | They're in Cloudinary permanently. Check `wcb_photos` table — `deleted` might be `true` (recycle bin). |
| Booking form submits but nothing appears in admin | Check Supabase `wcb_booking_requests` table directly. Formspree sends you the email separately. |
| EmailJS fails to send | Check EmailJS dashboard for quota (200/mo). Verify the Gmail service is still connected. |
| "Upload failed" when adding photos | Check Cloudinary dashboard for quota. Verify the upload preset `WeddingCamBox_Upload` is set to "Unsigned". |

---

*Last updated: April 2025*
