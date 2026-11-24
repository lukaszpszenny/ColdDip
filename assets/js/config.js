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
 * showPro          true  → show the Cold Dip Pro marketing (nav,
 *                          hero teaser, #pro band, checker badges).
 *                          Keep false until version 1.1.0 is live
 *                          in the Connect IQ Store.
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
 *                        the free app). Leave empty until 1.1.0 is
 *                        published: the Pro section then shows a
 *                        localized “Coming soon” badge instead of a
 *                        store button. When 1.1.0 is live, paste the
 *                        app store URL here and republish.
 *
 * proUnlockUrl          KiezelPay unlock page. Default is
 *                        https://kzl.io/cold-dip-pro — change only if the
 *                        product uses a different link.
 *
 * morsLevelStoreUrl     Connect IQ store URL for the Mors Level
 *                        watch face. Leave empty until the face is
 *                        published: the site then shows a localized
 *                        “Coming soon to Connect IQ Store” badge
 *                        instead of a store button. When you have
 *                        the link, paste it here and republish.
 *
 * morsLevelUnlockUrl    KiezelPay unlock page for Mors Level.
 *                        Default is https://kzl.io/morslevel — change
 *                        only if the product uses a different link.
 */
window.COLDDIP_CONFIG = {
  instinctPending: false,
  showTestimonials: false,
  showPro: false,
  showVideo: false,
  youtubeId: "",
  showSupport: false,
  supportUrl: "",
  faceStoreUrl: "https://apps.garmin.com/apps/fb505708-8386-4fbe-9d02-ecb85294f434",
  proStoreUrl: "",
  proUnlockUrl: "https://kzl.io/cold-dip-pro",
  morsLevelStoreUrl: "",
  morsLevelUnlockUrl: "https://kzl.io/morslevel"
};
