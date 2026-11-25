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
| `showPro` | `true` | Shows Pro buy/unlock UI and watch-checker Pro badges. On now that 1.1.0 is live in the Connect IQ Store. |
| `showVideo` | `false` | Shows the video section. Also needs a YouTube id. |
| `youtubeId` | `""` | YouTube video id only (the part after `v=`). The player is a click-to-load facade on `youtube-nocookie.com` — nothing is requested from YouTube until someone presses play. |
| `showSupport` | `false` | Shows the “buy me a coffee” block. Also needs a payment URL. |
| `supportUrl` | `""` | Full payment link (Buy Me a Coffee, PayPal, or similar). |
| `faceStoreUrl` | Connect IQ listing for Mors – tarcza | Empty → “coming soon” badge instead of a store button. |
| `proStoreUrl` | Cold Dip Connect IQ listing | Store button for the update that includes Pro. Empty → “coming soon” badge instead of a store button. |
| `proUnlockUrl` | `https://kzl.io/cold-dip-pro` | KiezelPay unlock page for Cold Dip Pro. |
| `morsLevelStoreUrl` | Mors Level Connect IQ listing | Store button for Mors Level. Empty → “coming soon” badge instead of a store button. |
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

Cold Dip 1.1.0 is live, so the Pro nav tab and `#pro` band include a store button and a KiezelPay unlock link (`https://kzl.io/cold-dip-pro`). The price is a one-time $4.99 with a 7-day free trial. Everything from 1.0.3 stays free. `showPro` is true and `proStoreUrl` points at the Cold Dip Connect IQ listing. `proUnlockUrl` is `https://kzl.io/cold-dip-pro`.

`faceStoreUrl` is the Connect IQ listing for Mors – tarcza. Unlock instructions for that face use `kzl.io/code`. `morsLevelStoreUrl` is the live Mors Level listing; the section shows a store button and the KiezelPay unlock link (`morsLevelUnlockUrl`, default `https://kzl.io/morslevel`).

## Platforms

A slim `#platforms` band sits under the hero. Garmin is marked “available now” and links to the live Cold Dip Connect IQ listing. Amazfit, Huawei and Wear OS (Samsung Galaxy Watch, Pixel Watch) are marked “coming soon”, with no dates or prices. Apple is not listed.

## Watch faces

Both faces live in a combined `#faces` band (nav label is the localized plural: Watch faces / Tarcze / Zifferblätter / …). `#face` is Mors – tarcza, with the real AMOLED frost wake clip (the walrus moves when you raise your wrist; never in always-on mode). `#mors-level` is Mors Level, with the real wake clip (bounce and bar fill on wrist raise, AMOLED only) and a lightweight 5-stage level-up demo (no extra libraries; respects `prefers-reduced-motion`). `morsLevelStoreUrl` is the live Mors Level listing, so the section shows a store button.

`proStoreUrl` is the live Cold Dip listing, so the Pro section shows a store button. `morsLevelStoreUrl` is the live Mors Level listing.

## How-to video

`assets/video/howto-pl.mp4` (Polish watch UI, used on `/pl/`) and `assets/video/howto-en.mp4` (English watch UI, all other pages), with `.jpg` posters.
Recorded in the Connect IQ simulator (Venu 2 Plus) from the live 1.0.3 app, time sped up, no audio. Self-hosted, so the page still makes no third-party requests.
The step list next to the video is localized in each page (`<!-- howto-video:start -->` … `<!-- howto-video:end -->`).
