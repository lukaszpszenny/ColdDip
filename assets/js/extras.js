/* Cold Dip site extras: copy-to-clipboard for the club text, and
   pause the short dip loop for people who prefer reduced motion,
   fold long sections on small screens, and the optional cookieless
   GoatCounter counter (off unless goatcounterCode is set in config.js). */
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

  // Small screens: show the first part of long sections, rest behind a button.
  var small = window.matchMedia && window.matchMedia("(max-width: 599px)").matches;
  var folds = [];
  function fold(section, items, after) {
    if (!section || !items.length || !after) return;
    var label = section.getAttribute("data-mfold");
    if (!label) return;
    items.forEach(function (el) { el.classList.add("mfold-item"); });
    section.classList.add("mfold-on");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost mfold-btn";
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = label + " ▾";
    btn.addEventListener("click", function () { open(section); });
    after.parentNode.insertBefore(btn, after.nextSibling);
    section._mfoldBtn = btn;
    folds.push(section);
  }
  function open(section) {
    section.classList.remove("mfold-on");
    if (section._mfoldBtn) section._mfoldBtn.parentNode.removeChild(section._mfoldBtn);
    section._mfoldBtn = null;
  }
  function q(root, sel) { return root ? Array.prototype.slice.call(root.querySelectorAll(sel)) : []; }
  if (small) {
    var pro = document.getElementById("pro");
    var cmp = pro && pro.querySelector(".cmp-wrap");
    fold(pro, q(pro, ".pro-features > .card:nth-child(n+5)").concat(cmp ? [cmp] : []), cmp);
    ["face", "mors-level"].forEach(function (id) {
      var sec = document.getElementById(id);
      var grid = sec && sec.querySelector(".face-grid");
      if (!grid) return;
      var rest = [], n = grid.nextElementSibling;
      while (n) { rest.push(n); n = n.nextElementSibling; }
      fold(sec, rest, rest[rest.length - 1]);
    });
    var howto = document.getElementById("howto");
    var ol = howto && howto.querySelector(".howto-steps ol");
    fold(howto, ol ? [ol] : [], ol);
    var safety = document.getElementById("safety");
    var sItems = q(safety, ".safety-item:nth-child(n+4)");
    fold(safety, sItems, sItems.length ? sItems[sItems.length - 1].parentNode : null);
    var chl = document.getElementById("changelog");
    var cl = chl && chl.querySelector(".changelog");
    fold(chl, q(chl, ".changelog > li:nth-child(n+3)"), cl);
    function openForHash() {
      var id = location.hash.slice(1);
      if (!id) return;
      var t = document.getElementById(id);
      folds.forEach(function (sec) { if (t && sec !== t && sec.contains(t)) open(sec); });
    }
    window.addEventListener("hashchange", openForHash);
    openForHash();
  }

  // Optional cookieless visit counter (GoatCounter). Off while the code is empty.
  var cfg = window.COLDDIP_CONFIG || {};
  var code = String(cfg.goatcounterCode || "").trim().toLowerCase();
  if (/^[a-z0-9-]+$/.test(code)) {
    var gc = document.createElement("script");
    gc.async = true;
    gc.src = "//gc.zgo.at/count.js";
    gc.setAttribute("data-goatcounter", "https://" + code + ".goatcounter.com/count");
    document.body.appendChild(gc);
    document.querySelectorAll("[data-counter-text]").forEach(function (p) {
      var span = p.querySelector("[data-privacy-site]");
      if (span) span.textContent = p.getAttribute("data-counter-text");
    });
  }
})();
