# WeddingCamBox — Operations Guide

This is your day-to-day guide for running WeddingCamBox. It covers everything you need to do as the business owner: handling booking requests, setting up client accounts, uploading photos, and sending galleries to guests.

For technical developer documentation, see `INSTRUCTIONS.md`. For the full change history, see `CHANGELOG.md`.

---

## Your admin login

Go to: **thelionsalliance.com/wedding/photoportal/**

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `Hondje01` |

You will land on the admin dashboard where you can see all clients and incoming booking requests.

---

## Day-to-day workflow overview

```
1. Couple fills in the booking form on the homepage
2. You see their request in the admin portal → approve it
3. You email them their login credentials
4. After the wedding, you receive the SD cards
5. You upload their photos via the admin portal
6. They log in, review and delete unwanted photos
7. You (or they) add guest email addresses
8. They send the gallery link to all guests
```

---

## Step 1 — Receiving a booking request

When a couple fills in the form on the homepage, their request is saved automatically and appears in the **Booking Requests** tab of your admin dashboard. A red badge on the tab shows how many new requests are waiting.

Each request card shows:
- Their name and email address
- Wedding date
- Package they selected (Basic / Standard / Premium)
- Approximate guest count
- Any message they left

---

## Step 2 — Approving a request

1. Log in to the admin portal
2. Click **Booking Requests** in the tab bar
3. Find the request and click **Approve**
4. A window opens with:
   - A suggested **username** (generated from their name, e.g. `emma-james`)
   - A randomly generated **password** — click the refresh button to generate a new one if you want
   - The **package** they selected (you can change it here)
5. Click **Approve & create account**

Their account is created immediately and they appear on the **Clients** tab.

> 💡 **After approving:** Copy the username and password from the success notification and email them to the couple. They will need these to log in to their gallery at `thelionsalliance.com/wedding/photoportal/`.

---

## Step 3 — Uploading photos for a client

After the wedding and you have received the SD cards back:

1. Transfer the photos from the SD cards to your computer
2. Log in to the admin portal
3. Find the couple's card on the **Clients** tab
4. Click **Upload photos**
5. Drag and drop the photo files into the window, or click **browse files**
6. Click **Add to gallery**

Photos are uploaded to **Cloudinary** (permanent cloud storage) and their URLs are saved in **Supabase**. They persist across devices and browser sessions — no more session-only uploads.

---

## Step 4 — Email delivery (already configured)

EmailJS is configured and working. When a couple clicks "Send gallery" in the portal, emails are sent directly to all guests from the website — no need for a local email client.

| Setting | Value |
|---------|-------|
| Service ID | `service_eoosuj2` |
| Template ID | `template_don7795` |
| Free tier | 200 emails/month |

If you need to change the email template or service, go to [dashboard.emailjs.com](https://dashboard.emailjs.com).

---

## Step 5 — Sending the gallery to guests

The couple does this themselves from inside their portal, but you can also do it as admin by clicking **Manage portal** on their client card.

1. In the portal, go to **Step 2 — Add Guests**
2. Add each guest's name and email address
3. Go to **Step 3 — Send Gallery**
4. Write a personal message to the guests (or use the default)
5. Click **Send to all guests**

Each guest will receive an email with the gallery link.

---

## Adding or changing client credentials manually

If you need to manually add a client without going through the booking request flow, go to the Supabase dashboard:

1. Open [Supabase Table Editor → wcb_clients](https://supabase.com/dashboard/project/zxiwsjjvigrxrgkxalet/editor)
2. Click **Insert Row**
3. Fill in: `id` (username), `password`, `name`, `wedding`, `wedding_date`, `package`
4. Email the couple their username and password

To change a password: find the client row, click on it, edit the `password` field.

---

## Replacing the camera product photo

The homepage shows your camera product photo 10 times. To update it:

1. Save your new photo as `camera.png` (400×400 to 1280×1280 px, transparent or white bg)
2. Replace `Website/public/wedding/camera.png`
3. Commit and push — deploys automatically

---

## Portal packages — what's included

| Package | Price | What the client gets |
|---------|-------|---------------------|
| Basic | €89 | Raw photo files as a download link. No portal access. |
| Standard | €119 | Online gallery portal, photo curation, shareable guest link |
| Premium | €149 | Everything in Standard + custom branding + digital photobook _(coming soon)_ |

PostNL shipping (send & return) is an optional add-on at +€15.

---

## URLs at a glance

| What | Where |
|------|-------|
| Homepage | `thelionsalliance.com/wedding/` |
| Photo portal | `thelionsalliance.com/wedding/photoportal/` |
| GitHub repo | `github.com/DanTheLion-git/TheLionsAlliance` |
| Supabase | `supabase.com/dashboard/project/zxiwsjjvigrxrgkxalet` |
| Cloudinary | `console.cloudinary.com` |
| EmailJS | `dashboard.emailjs.com` |
| Formspree | `formspree.io/forms` |

---

## Full tech stack documentation

See `STACK.md` for complete database schemas, architecture diagram, credentials, troubleshooting, and more.
