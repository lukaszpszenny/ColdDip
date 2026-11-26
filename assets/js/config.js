/* Cold Dip site flags — flip these before you publish a change.
 *
 * All feature toggles live in this one object. Other scripts read
 * window.COLDDIP_CONFIG. Leave hidden sections off until you are ready.
 *
 * instinctPending  true  → newly added watch models that are in the
 *                          app build but not yet live in the Connect IQ
 *                          store show a “coming soon” badge, and the
 *                          heading stays at “120+”. Leave false while
 *                          the current store release (1.0.3) is live —
 *                          those models show as supported and the
 *                          heading is “130+”. Flip it back on only for
 *                          a later version that is still in review.
 *
 * showTestimonials true  → show the quotes section.
 *                          Keep false until Radosław and Jadwiga have
 *                          agreed to appear on the site by name.
 *
 * showVideo        true  → show the video section.
 * youtubeId              YouTube id only (the part after v=). The embed
 *                        uses youtube-nocookie and loads only after a click.
 *                        The section stays hidden if the id is empty.
 *
 * showPro          true  → show Pro buy/unlock UI and
 *                          watch-checker Pro badges. It is true
 *                          now that version 1.1.0 is live in the
 *                          Connect IQ Store.
 *
 * showSupport      true  → show the “buy me a coffee” block.
 * supportUrl             Full payment link (Buy Me a Coffee, PayPal, …).
 *                        The block stays hidden if the URL is empty.
 *
 * faceStoreUrl          Connect IQ store URL for the Mors – tarcza
 *                        watch face. Leave empty until the face is
 *                        published: the site then shows a localized
 *                        “Coming soon to Connect IQ Store” badge
 *                        instead of a store button. When you have
 *                        the link, paste it here and republish.
 *
 * proStoreUrl           Connect IQ store URL for the Cold Dip app
 *                        update that includes Pro (same listing as
 *                        the free app). Set to the live Connect IQ
 *                        listing when 1.1.0 is in the store, so the
 *                        Pro section shows a store button instead of
 *                        a “Coming soon” badge.
 *
 * proUnlockUrl          KiezelPay unlock page. Default is
 *                        https://kzl.io/cold-dip-pro — change only if the
 *                        product uses a different link.
 *
 * morsLevelStoreUrl     Connect IQ store URL for the Mors Level
 *                        watch face. Set to the live listing when
 *                        the face is in the store, so the section
 *                        shows a store button instead of a
 *                        “Coming soon” badge. Leave empty until then.
 *
 * morsLevelUnlockUrl    KiezelPay unlock page for Mors Level.
 *                        Default is https://kzl.io/morslevel — change
 *                        only if the product uses a different link.
 *
 * goatcounterCode       GoatCounter site code (only the part before
 *                        .goatcounter.com, e.g. "colddip"). Empty = no
 *                        counter at all. When set, every page loads
 *                        GoatCounter's cookieless counter and the
 *                        privacy note in the footer switches to the
 *                        sentence that mentions it. Fill it in only
 *                        after the account with that code exists.
 */
window.COLDDIP_CONFIG = {
  instinctPending: false,
  showTestimonials: false,
  showPro: true,
  showVideo: false,
  youtubeId: "",
  showSupport: false,
  supportUrl: "",
  faceStoreUrl: "https://apps.garmin.com/apps/fb505708-8386-4fbe-9d02-ecb85294f434",
  proStoreUrl: "https://apps.garmin.com/en-US/apps/b386c269-1eec-45a3-be73-6c3a3b51d8b0",
  proUnlockUrl: "https://kzl.io/cold-dip-pro",
  morsLevelStoreUrl: "https://apps.garmin.com/en-US/apps/fe325c7e-b38d-4a9a-b43e-f5b09780f3a8",
  morsLevelUnlockUrl: "https://kzl.io/morslevel",
  goatcounterCode: "colddip"
};
