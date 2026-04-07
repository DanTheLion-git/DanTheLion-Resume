# Party Games — Changelog

All notable changes to the games section of **The Lions Alliance** are documented here.
Format: [Semantic Versioning](https://semver.org/).

---

## [1.2.0] — 2026-04-07

### Added — Charades
- New **Charades** game at `/games/charades/`
- Language selection: 🇬🇧 English, 🇳🇱 Dutch, or both simultaneously
- Six prompt categories: Movies 🎬, Books 📚, Artists 🎤, Songs 🎵, Places 🌍, Sayings 💬
- ~200 hand-curated prompts per language with `easy` / `medium` / `hard` difficulty tiers
- Configurable difficulty filter (Easy only → All included)
- Configurable round timer: 30 / 60 / 90 / 120 seconds
- Configurable rounds per team
- Team management: 2–6 teams with custom names
- Custom words/phrases field (comma-separated, added to the prompt pool)
- "Pass the phone" team-ready transition screen (hides next prompt until tapped)
- Accurate timer using `Date.now()` delta (doesn't drift on tab switch)
- Timer turns red and pulses during final 10 seconds
- Per-round score display + cumulative team scores
- Final rankings screen with winner announcement
- "Play Again" resets scores but keeps settings

---

## [1.1.0] — 2026-04-07

### Added — Hitster Admin Card Generator
- New admin dashboard at `/games/hitster/admin/`
- Paste any Spotify playlist URL or URI to load all tracks (handles pagination for playlists with 100+ songs)
- Track list with per-track checkboxes, **Select All / Deselect All**
- Generates QR codes client-side via `qrcode` npm package (no server, no external request)
- Printable card sheet:
  - **Page 1** — QR code fronts (3 × 3 grid, A4 portrait, `HITSTER` label + card number)
  - **Page 2** — Song info backs (year · song title · artist), columns mirrored for double-sided printing
  - Correct alignment when printing **double-sided, flip on long edge**
- Screen preview before printing
- "🃏 Cards" button added to Hitster header (visible when authenticated)

---

## [1.0.0] — 2026-04-07

### Added — Hitster (initial release)
- Games hub at `/games/` with tile grid for all games
- **Hitster** game at `/games/hitster/`
  - Spotify PKCE OAuth (no backend / no client secret, tokens in `localStorage`)
  - Spotify Web Playback SDK — plays music directly in the browser, no app switching
  - Requires Spotify Premium; supported on Chrome, Firefox, Edge (not iOS Safari)
  - Camera-based QR code scanning via `html5-qrcode`
  - QR codes encode `spotify:track:XXXX` URIs
  - Track metadata (name / artist / year / album art) fetched live from Spotify API on "Reveal"
  - Full game flow: **Scan → Play → Guess the year → Reveal → Next card**
  - Pause / Resume / Restart controls
  - Automatic token refresh (60 s before expiry)
- Spotify OAuth callback handler at `/games/hitster/callback`
- `src/lib/spotify.ts` — reusable PKCE auth + playback helpers
- `src/lib/hitster.ts` — QR parsing + Spotify track-info fetch
- `src/styles/games.css` — mobile-first dark theme shared across all games
- `astro.config.mjs` updated: `site` set to `https://thelionsalliance.com`

---

## Roadmap

- `[1.3.0]` Party&Co game
- `[future]` Hitster PDF card generator improvements (bleed marks, duplex guide)
- `[future]` Charades: animated timer, haptic feedback on phones that support it
- `[future]` Shared leaderboard (would require a small backend or Supabase)
