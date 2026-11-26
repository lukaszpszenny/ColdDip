/* Cold Dip site extras: copy-to-clipboard for the club text, and
   pause the short dip loop for people who prefer reduced motion.
   No network requests, no tracking. */
(function () {
  "use strict";
  var contact = document.getElementById("contact");
  function label(key, fallback) {
    var v = contact && contact.getAttribute("data-i18n-" + key);
    return v || fallback;
  }
  document.querySelectorAll("[data-copy-target]").forEach(function (btn) {
    var original = btn.textContent;
    btn.addEventListener("click", function () {
      var src = document.getElementById(btn.getAttribute("data-copy-target"));
      if (!src) return;
      var value = src.value || src.textContent || "";
      function done() {
        btn.textContent = label("copied", "Copied") + " ✓";
        setTimeout(function () { btn.textContent = original; }, 1800);
      }
      function fallback() {
        src.focus();
        src.select();
        try { if (document.execCommand("copy")) done(); } catch (e) {}
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(fallback);
      } else {
        fallback();
      }
    });
  });
  // Notify buttons: one compact row instead of four copy/Gmail clusters.
  document.querySelectorAll("#notify .mail-cluster").forEach(function (c) {
    var a = c.querySelector("a[href^='mailto:']");
    if (a) c.parentNode.insertBefore(a, c);
    c.parentNode.removeChild(c);
  });
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("video.loop-video").forEach(function (v) {
    if (reduce) {
      v.removeAttribute("autoplay");
      v.pause();
      v.setAttribute("controls", "");
    }
  });
})();
