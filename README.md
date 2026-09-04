# Panther Press — Deployment & DNS

This repository contains the static frontend for Panther Press (CFHS Athletics).

Quick steps to publish to GitHub Pages (user/org site) using `pantherspress.com`:

1. Ensure your repository is named `username.github.io` (replace `username` with your GitHub account or org name) for a user/org site. For a project site, use the project repo and follow the project-site instructions in Pages.

2. The root of this repo already contains a `CNAME` file with the custom domain `pantherspress.com`.

3. DNS records to add at Porkbun:

   - A records (for apex/root `pantherspress.com`):
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`

     Host: `@` (or blank depending on Porkbun UI)
     TTL: 3600

   - CNAME (for `www`):
     - Host: `www`
     - Answer: `username.github.io.` (replace `username`)
     - TTL: 3600

4. In your GitHub repo: Settings → Pages. Under *Custom domain* enter `pantherspress.com`. Save and wait for GitHub to provision HTTPS. Enable *Enforce HTTPS* when available.

5. Verify DNS propagation with:

```bash
dig +short pantherspress.com A
dig +short www.pantherspress.com CNAME
```

Notes:
- If you prefer `www.pantherspress.com` to be canonical, set the Pages custom domain to `www.pantherspress.com` and use an HTTP redirect from the apex to `https://www.pantherspress.com` (Porkbun supports forwarding rules).
- Certificate issuance can take a few minutes to an hour. DNS changes may take up to 24–48 hours.

If you want, I can:
- prepare a small GitHub Actions workflow to auto-deploy (useful for non `username.github.io` project sites), or
- generate `index.html` with a simple redirect while you finish DNS.
