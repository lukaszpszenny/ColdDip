# Cold Dip website

Static one-page site for the free Garmin Connect IQ app [Cold Dip](https://apps.garmin.com/en-US/apps/b386c269-1eec-45a3-be73-6c3a3b51d8b0).

No build step. Open `index.html` or serve the folder with any static host.

## Languages

English (default) plus Polish, German, Czech, Slovak, Finnish, Norwegian (Bokmål), Swedish, Spanish, Russian and Ukrainian. Paths: `/`, `/pl/`, `/de/`, `/cs/`, `/sk/`, `/fi/`, `/nb/`, `/sv/`, `/es/`, `/ru/`, `/uk/`.

On a first visit the English page may redirect to a matching browser language. The choice is stored only in `localStorage` (`colddip-lang`). There are no trackers or analytics.

## GitHub Pages

1. Push this folder to a GitHub repository (this directory as the repo root).
2. In the repo: Settings → Pages → Deploy from a branch → `main` / `/ (root)`.
3. Optional: add a `CNAME` file if you use a custom domain.

The `.nojekyll` file is already included so GitHub Pages will not run Jekyll.

Relative links work both at the domain root and in a project site (`username.github.io/repo/`).


## Site flags (`assets/js/config.js`)

All feature toggles live in `window.COLDDIP_CONFIG` at the top of `assets/js/config.js`. Flip a flag and reload — you do not need to rebuild the HTML.

| Flag | Default | What it does |
|---|---|---|
| `instinctPending` | `false` | When `true`, models that are in the app but not yet in the Connect IQ store get a “coming soon” badge, and the heading stays at “120+”. It is `false` now because 1.0.3 is live — those models show as “Supported” and the heading is “130+”. |
| `showTestimonials` | `false` | Shows the quotes section. Keep off until Radosław and Jadwiga have agreed to appear on the site by name. |
| `showPro` | `false` | Shows Cold Dip Pro marketing (nav, hero teaser, `#pro` band, checker badges). Keep false until 1.1.0 is live in the Connect IQ Store. |
| `showVideo` | `false` | Shows the video section. Also needs a YouTube id. |
| `youtubeId` | `""` | YouTube video id only (the part after `v=`). The player is a click-to-load facade on `youtube-nocookie.com` — nothing is requested from YouTube until someone presses play. |
| `showSupport` | `false` | Shows the “buy me a coffee” block. Also needs a payment URL. |
| `supportUrl` | `""` | Full payment link (Buy Me a Coffee, PayPal, or similar). |
| `faceStoreUrl` | `""` | Connect IQ URL for Mors – tarcza. Empty → “coming soon” badge instead of a store button. |
| `proStoreUrl` | `""` | Connect IQ URL for the Cold Dip update that includes Pro. Empty until 1.1.0 is live. |
| `proUnlockUrl` | `https://kzl.io/cold-dip-pro` | KiezelPay unlock page for Cold Dip Pro. |
| `morsLevelStoreUrl` | `""` | Connect IQ URL for Mors Level. Empty → “coming soon” badge instead of a store button. |
| `morsLevelUnlockUrl` | `https://kzl.io/morslevel` | KiezelPay unlock page for Mors Level. |

The device list used by the watch checker is generated from the Connect IQ manifest (`assets/js/devices.js`). Regenerating it is only needed when supported watches change.

Screenshot gallery: Polish pages use Polish watch screenshots where they exist; every other language uses English screenshots. Fenix and rectangular (Venu Sq / X1) shots currently have an English UI even on the Polish page, because no clean Polish sources were available for those families.


## Flags

Language-switcher flags in `assets/flags/` come from the 4×3 SVG files of the [flag-icons](https://github.com/lipis/flag-icons) project (MIT license). They are copied locally and also rasterized to small PNGs, which Windows displays reliably (emoji flags often do not).

## After you have a public URL

1. In `sitemap.xml`, replace `YOUR-DOMAIN` with the real host (for a project site that is `username.github.io/repo`, no trailing slash).
2. In `robots.txt`, uncomment the `Sitemap:` line and set the same host.
3. Open Graph and `hreflang` links are rewritten to absolute URLs in the browser from the current host, so they work on GitHub Pages or a custom domain without further edits. Social crawlers that do not run JavaScript will still see relative image paths until the page is served from its final URL and recrawled; if a preview is needed immediately, replace the `og:image` and `twitter:image` paths with the absolute URL.

The `preview_desktop.png` and `preview_mobile.png` files are design previews and are disallowed in `robots.txt`. You can delete them before publishing.

## Cold Dip Pro section

Pro marketing is stripped from the published HTML (nav, hero teaser, `#pro` band, feature strip, 1.1.0 changelog, watch-checker badges) while `showPro` is `false`. Keep it false until Cold Dip 1.1.0 is live in the Connect IQ Store. `proStoreUrl` also stays empty until then. `proUnlockUrl` defaults to `https://kzl.io/cold-dip-pro`.

`faceStoreUrl` is the Connect IQ listing for Mors – tarcza. `morsLevelStoreUrl` stays empty until Mors Level is approved in the store; the section then shows a “coming soon” badge and the KiezelPay unlock link (`morsLevelUnlockUrl`, default `https://kzl.io/morslevel`).

## Watch faces

Both faces live in a combined `#faces` band (nav label is the localized plural: Watch faces / Tarcze / Zifferblätter / …). `#face` is Mors – tarcza; `#mors-level` is Mors Level, with a “New” badge and a lightweight 5-stage level-up demo (no extra libraries; respects `prefers-reduced-motion`). Keep `morsLevelStoreUrl` empty in `assets/js/config.js` until the face is live in the Connect IQ Store, so the section shows a “coming soon” badge instead of a store button.

The Cold Dip Pro section stays gated the same way: `proStoreUrl` remains empty, and the Pro band must not go live until Cold Dip 1.1.0 is in the Connect IQ Store.
