/* Cold Dip site flags — flip these before you publish a change.
 *
 * All feature toggles live in this one object. Other scripts read
 * window.COLDDIP_CONFIG. Leave hidden sections off until you are ready.
 *
 * instinctPending  true  → Instinct MIP models added in v1.0.3
 *                          (Instinct 2 / 2S / 2X, Instinct 3 Solar,
 *                          Instinct E, Instinct Crossover) are marked
 *                          “Coming with v1.0.3”. Set to false once
 *                          Garmin has approved 1.0.3 in the store.
 *                          The “120+” heading then switches to “130+”.
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
 * showSupport      true  → show the “buy me a coffee” block.
 * supportUrl             Full payment link (Buy Me a Coffee, PayPal, …).
 *                        The block stays hidden if the URL is empty.
 */
window.COLDDIP_CONFIG = {
  instinctPending: false,
  showTestimonials: false,
  showVideo: false,
  youtubeId: "",
  showSupport: false,
  supportUrl: ""
};
