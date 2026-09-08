# Panther Press

Static site for **Carolina Forest High School** athletics (the Panthers).
Plain HTML/CSS/JS — no build step. All data (schedules, rosters, sessions) is
seeded in `schedule-data.js` / `stats-schema.js` or stored per-browser in
`localStorage`.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — scores, schedule, season sports directory, ticket office, admin dashboard |
| `sport.html` | Per-team page (`?sport=&gender=&level=`) — schedule, roster, coach tools |
| `player.html` | Collectible player card (`?sport=&gender=&level=&id=`) with pack-opening reveal |
| `auth.html` / `admin-login.html` / `coach-login.html` | Fan / admin / coach sign-in |
| `admin-dashboard.html` / `create-game.html` | Admin tools (also embedded in `index.html`) |

Shared scripts: `app.js`, `sport.js`, `player.js`, `auth-utils.js`,
`coach-auth.js`, `schedule-data.js`, `stats-schema.js`.
Styles: `styles.css` + `styles-override.css` (home), `sport.css`, `auth.css`.

## Local preview

```bash
npm install && npm start      # http://localhost:8080  (Express static server)
# or, no dependencies:
python -m http.server 8080
```

## Deployment

Pushed to `main`, GitHub Actions (`.github/workflows/pages.yml`) publishes the
repo root to GitHub Pages. The custom domain `pantherspress.com` is set via the
`CNAME` file.

DNS (apex `pantherspress.com`) — A records:
`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
For `www`, add a CNAME to `<username>.github.io.`

In **Settings → Pages**, set the source to **GitHub Actions** and enter the
custom domain; enable *Enforce HTTPS* once the certificate is issued.
