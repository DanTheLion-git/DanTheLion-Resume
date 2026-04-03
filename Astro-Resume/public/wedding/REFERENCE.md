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

> ⚠️ **Important limitation right now:** Photos uploaded this way are only visible during your current browser session — they will disappear when you close or refresh the page. This is a known limitation while the project doesn't have a proper backend yet. Until that is set up, the recommended workaround is to host the photos somewhere (e.g. Google Drive with public sharing, or any image hosting service) and manually update the photo URLs in `photoportal/portal.js`. See `INSTRUCTIONS.md → Replacing placeholder photos` for details.

---

## Step 4 — Setting up EmailJS (one-time setup)

Right now, when a couple clicks "Send gallery" in the portal, it opens their own email app instead of sending directly from the website. To make it send automatically from the site you need to set up a free EmailJS account. This is a one-time setup.

### 4a — Create your EmailJS account

1. Go to [emailjs.com](https://www.emailjs.com) and sign up for a free account
   - Free plan: 200 emails per month (enough for starting out)

### 4b — Connect your email address

1. In the EmailJS dashboard, go to **Email Services** → **Add New Service**
2. Choose **Gmail** (or whichever email you want to send from)
3. Follow the steps to connect it
4. Once connected, you will see a **Service ID** — copy it (looks like `service_abc1234`)

### 4c — Create an email template

1. Go to **Email Templates** → **Create New Template**
2. Set the **Subject** field to: `{{subject}}`
3. In the **Body**, paste this and style it however you like:

```
{{message_html}}

---
View the gallery: {{gallery_link}}
```

4. In **To Email** put: `{{to_email}}`
5. In **Reply To** put your own email address
6. Save the template — copy the **Template ID** (looks like `template_xyz7890`)

### 4d — Get your Public Key

1. In EmailJS, click your profile icon → **Account**
2. Copy your **Public Key** (looks like `AbCdEfGh1234567`)

### 4e — Add the keys to the portal

Open the file `C:\Users\DanielvanLeeuwen\Documents\WeddingCamBox\photoportal\portal.js` in any text editor (Notepad is fine).

Find these lines near the very top of the file:

```js
const EMAILJS_CONFIG = {
  serviceId:  'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID',
  publicKey:  'YOUR_PUBLIC_KEY',
};
```

Replace the placeholder values with your real ones:

```js
const EMAILJS_CONFIG = {
  serviceId:  'service_abc1234',
  templateId: 'template_xyz7890',
  publicKey:  'AbCdEfGh1234567',
};
```

Save the file. Then ask Copilot to push the change to GitHub, or do it manually (see `INSTRUCTIONS.md → Deploying`).

Once this is done, the yellow warning banner in the admin dashboard will disappear and emails will be sent directly from the portal.

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

## Receiving booking enquiries by email (optional setup)

Right now when someone fills in the booking form, you only see it in the admin portal. You do not receive an email notification. To get an email in your inbox every time someone submits the form:

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form — Formspree gives you a URL like `https://formspree.io/f/abcdefgh`
3. Ask Copilot to connect the booking form to that Formspree URL

From then on, every booking request will also be emailed directly to you.

---

## Adding or changing client credentials manually

If you ever need to manually add a client or change a password without going through the booking request flow:

Open `photoportal/portal.js` and find the `USERS` object near the top:

```js
let USERS = {
  'admin':     { password: 'Hondje01',    name: 'Admin', isAdmin: true },
  'bob-linda': { password: 'bobwed25',    name: 'Bob & Linda', wedding: '15 March 2025' },
  ...
};
```

Add a new entry:

```js
'emma-james': {
  password: 'yourChosenPassword',
  name: 'Emma & James',
  wedding: '5 July 2026',
},
```

Also add an entry to `CUSTOMERS` (just below `USERS`):

```js
'emma-james': {
  name: 'Emma & James',
  weddingDate: '2026-07-05',
  package: 'Standard',
},
```

Then ask Copilot to push the update to GitHub.

---

## Replacing the camera product photo

The homepage shows your camera product photo 10 times. To update it:

1. Save your new photo as `camera.png`
2. Replace `C:\Users\DanielvanLeeuwen\Documents\WeddingCamBox\camera.png` with the new file
3. Ask Copilot to push it — or do it manually

Recommended size: 400×400 to 1280×1280 pixels, ideally with a transparent or white background.

---

## Portal packages — what's included

| Package | Price | What the client gets |
|---------|-------|---------------------|
| Basic | €89 | Raw photo files on SD card or download. No portal access. |
| Standard | €119 | Online gallery portal, ability to curate photos, shareable guest link |
| Premium | €149 | Everything in Standard + custom-branded portal + digital photobook _(not yet available)_ |

Shipping (PostNL) is included in all packages — you send the camera box out and the couple sends it back.

---

## URLs at a glance

| What | Where |
|------|-------|
| Homepage | `https://thelionsalliance.com/wedding/` |
| Photo portal | `https://thelionsalliance.com/wedding/photoportal/` |
| GitHub repo | `https://github.com/DanTheLion-git/DanTheLion-Resume` |
| EmailJS | `https://www.emailjs.com` |
| Formspree | `https://formspree.io` |

---

## Getting help from Copilot

Open GitHub Copilot CLI and start with:

> "I'm continuing work on WeddingCamBox — please read `copilot_handoff.md` in my project folder first."

The handoff file at `C:\Users\DanielvanLeeuwen\Documents\WeddingCamBox\copilot_handoff.md` contains everything Copilot needs to pick up where we left off.
