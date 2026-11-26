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

  // Click events for GoatCounter (only sent when the counter is on).
  var LANG = (document.documentElement.getAttribute("lang") || "en").slice(0, 2).toLowerCase();
  function gcEvent(name, where) {
    if (!window.goatcounter || typeof window.goatcounter.count !== "function") return;
    try { window.goatcounter.count({ path: name, title: location.pathname + (where ? " " + where : ""), event: true }); } catch (e) {}
  }
  function slug(v) {
    return String(v || "").toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "inny";
  }
  function mailEvent(href) {
    var subject = "";
    var m = /[?&]subject=([^&]*)/i.exec(href || "");
    if (m) { try { subject = decodeURIComponent(m[1].replace(/\+/g, " ")); } catch (e) { subject = m[1]; } }
    var n = /notify me:\s*(.+)$/i.exec(subject);
    if (n) return "klik-dajznac-" + slug(n[1]);
    n = /I want\s+(.+)$/i.exec(subject);
    if (n) return "klik-chce-" + slug(n[1]);
    if (/club/i.test(subject)) return "klik-klub-kontakt";
    if (/notify me$/i.test(subject)) return "klik-mail-powiadom";
    return "klik-mail-kontakt";
  }
  function clickEvent(el) {
    if (el.closest(".mail-copy")) return "klik-kopiuj-mail";
    if (el.closest("[data-copy-target]")) return "klik-kopiuj-tekst-klub";
    if (el.closest(".mfold-btn")) return null;
    var tagged = el.closest("[data-gc-event]");
    if (tagged) return tagged.getAttribute("data-gc-event");
    var a = el.closest("a[href]");
    if (!a) return null;
    var href = a.getAttribute("href") || "";
    var guide = !!a.closest(".guide-cta, .guide-page .header-cta");
    if (/apps\.garmin\.com/i.test(href)) {
      if (/b386c269/i.test(href)) return (guide ? "klik-poradnik-garmin-colddip-" : "klik-garmin-colddip-") + LANG;
      if (/fb505708/i.test(href)) return "klik-twarz-mors";
      if (/fe325c7e/i.test(href)) return "klik-twarz-mors-level";
      if (a.closest(".faces-card-goals, #dip-goals")) return "klik-twarz-dip-goals";
      if (a.closest(".faces-card-afterdrop, #afterdrop")) return "klik-twarz-afterdrop";
      return "klik-garmin-inne";
    }
    if (/kzl\.io\/cold-dip-pro/i.test(href)) return "klik-pro";
    if (/kzl\.io\/morslevel/i.test(href)) return "klik-morslevel-odblokuj";
    if (/kzl\.io\/code/i.test(href)) return "klik-kiezelpay-kod";
    if (a.classList.contains("js-zepp-store") || /zepp\.com/i.test(href)) return "klik-zepp-store";
    if (/^mailto:/i.test(href)) {
      if (a.closest("#watch-results")) return "klik-mail-zegarek";
      return mailEvent(href);
    }
    if (a.classList.contains("mail-gmail")) {
      var cl = a.closest(".mail-cluster");
      var orig = cl && cl.querySelector("a[href^='mailto:']");
      return (orig ? mailEvent(orig.getAttribute("href")) : "klik-mail-kontakt") + "-gmail";
    }
    if (/(^|\/)amazfit\.html/i.test(href) && !a.closest(".lang-panel")) return "klik-amazfit";
    if (a.hasAttribute("download")) return "klik-pobierz-grafike";
    return null;
  }
  document.addEventListener("click", function (ev) {
    var name = ev.target && ev.target.closest ? clickEvent(ev.target) : null;
    if (!name || !window.goatcounter || typeof window.goatcounter.count !== "function") return;
    var sec = ev.target.closest("section[id], header, footer, aside");
    gcEvent(name, sec ? (sec.id ? "#" + sec.id : sec.tagName.toLowerCase()) : "");
  }, true);

  // "Notify me" and club forms: one row into the insert-only table, no account needed.
  var UTM_KEY = "colddip-utm";
  (function keepUtm() {
    var q = location.search.replace(/^\?/, "").split("&").filter(function (p) { return /^utm_[a-z]+=/i.test(p); }).join("&");
    try { if (q) sessionStorage.setItem(UTM_KEY, q); } catch (e) {}
  })();
  function utm() {
    try { return sessionStorage.getItem(UTM_KEY) || ""; } catch (e) { return ""; }
  }
  document.querySelectorAll("[data-notify-platform]").forEach(function (a) {
    a.addEventListener("click", function () {
      var v = a.getAttribute("data-notify-platform");
      var r = document.querySelector('.notify-form input[name="platform"][value="' + v + '"]');
      if (r) r.checked = true;
      var sec = document.getElementById("notify");
      if (sec && sec.classList.contains("mfold-on")) sec.classList.remove("mfold-on");
      setTimeout(function () {
        var em = document.querySelector('.notify-form input[name="email"]');
        if (em) { try { em.focus({ preventScroll: true }); } catch (e) { em.focus(); } }
      }, 350);
    });
  });
  document.querySelectorAll("form[data-cd-form]").forEach(function (form) {
    var status = form.querySelector(".nf-status");
    var btn = form.querySelector(".nf-submit");
    var kind = form.getAttribute("data-cd-form");
    function say(msg, ok) {
      status.textContent = msg;
      status.classList.toggle("is-ok", !!ok);
      status.classList.toggle("is-err", !ok);
    }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var cfg = window.COLDDIP_CONFIG || {};
      var email = (form.email.value || "").trim();
      var pick = form.querySelector('input[name="platform"]:checked') || form.querySelector('input[name="platform"][type="hidden"]');
      if (!pick) { say(form.getAttribute("data-msg-pick"), false); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) {
        say(form.getAttribute("data-msg-email"), false); form.email.focus(); return;
      }
      var platform = pick.value;
      var label = pick.getAttribute("data-label") || platform;
      var okMsg = (form.getAttribute("data-msg-ok") || "").replace("{p}", label);
      if (form.website && form.website.value) { say(okMsg, true); form.reset(); return; } // bots
      if (!cfg.notifyUrl || !cfg.notifyKey || !window.fetch) { say(form.getAttribute("data-msg-err"), false); return; }
      var body = {
        email: email,
        platform: platform,
        model: form.model && form.model.value.trim() ? form.model.value.trim().slice(0, 120) : null,
        message: form.message && form.message.value.trim() ? form.message.value.trim().slice(0, 2000) : null,
        lang: LANG,
        utm: utm().slice(0, 300) || null,
        page: location.pathname.slice(0, 200)
      };
      btn.disabled = true;
      say(form.getAttribute("data-msg-sending"), true);
      fetch(cfg.notifyUrl, {
        method: "POST",
        headers: { "apikey": cfg.notifyKey, "Content-Type": "application/json", "Prefer": "return=minimal" },
        body: JSON.stringify(body)
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        say(okMsg, true);
        form.reset();
        gcEvent(kind === "klub" ? "klik-klub-kontakt" : "klik-powiadom-" + platform, kind === "klub" ? "#clubs form" : "#notify form");
      }).catch(function () {
        say(form.getAttribute("data-msg-err"), false);
      }).then(function () { btn.disabled = false; });
    });
  });
})();

