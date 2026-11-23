/* Feature flags, watch checker, and privacy-friendly video facade. */
(function () {
  var cfg = window.COLDDIP_CONFIG || {};
  var pack = window.COLDDIP_DEVICES || { devices: [], legacy: [] };
  var devices = pack.devices || [];
  var legacy = pack.legacy || [];
  var MAX = 12;

  function applyFlags() {
    document.querySelectorAll("[data-flag]").forEach(function (el) {
      var key = el.getAttribute("data-flag");
      var on = !!cfg[key];
      if (key === "showVideo") on = on && !!(cfg.youtubeId);
      if (key === "showSupport") on = on && !!(cfg.supportUrl);
      el.hidden = !on;
    });

    var support = document.getElementById("support-link");
    if (support && cfg.supportUrl) {
      support.href = cfg.supportUrl;
      support.target = "_blank";
      support.rel = "noopener";
    }

    if (!cfg.instinctPending) {
      document.querySelectorAll("[data-compat-title]").forEach(function (el) {
        var live = el.getAttribute("data-compat-live");
        if (live) el.textContent = live;
      });
    }

    var facade = document.querySelector(".video-facade");
    if (facade && cfg.youtubeId) facade.setAttribute("data-youtube", cfg.youtubeId);
  }

  function norm(s) {
    return String(s || "")
      .replace(/[®™©]/g, "")
      .replace(/ē/g, "e")
      .replace(/Ē/g, "E")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function tokens(s) {
    return norm(s).split(" ").filter(Boolean);
  }

  function score(item, toks, q) {
    var hay = item.q || "";
    var n = 0;
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i];
      var at = hay.indexOf(t);
      if (at < 0) return -1;
      n += t.length * 4;
      if (at === 0 || hay.charAt(at - 1) === " ") n += 8;
    }
    if (hay === q) n += 50;
    if ((item.id || "") === q.replace(/\s+/g, "")) n += 40;
    return n;
  }

  function filterList(list, toks, q) {
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var s = score(list[i], toks, q);
      if (s >= 0) out.push({ item: list[i], score: s });
    }
    out.sort(function (a, b) { return b.score - a.score; });
    return out;
  }

  function t(root, key, fallback) {
    return root.getAttribute("data-i18n-" + key) || fallback || "";
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function badge(root, item) {
    var pending = !!(item.pending && cfg.instinctPending);
    var b = el("span", "badge-status " + (pending ? "is-pending" : "is-ok"),
      pending ? t(root, "pending", "Coming soon") : t(root, "supported", "Supported"));
    if (pending) b.title = t(root, "pending-note", "");
    return b;
  }

  function mailtoAsk(root, query) {
    var subject = t(root, "ask-subject", "Cold Dip – is this watch supported?");
    var body = "Hi Łukasz,\n\nWatch: " + (query || "") + "\n\n";
    return "mailto:lukasz.pszenny@gmail.com?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }

  function render(root) {
    var input = root.querySelector("#watch-q");
    var out = root.querySelector("#watch-results");
    if (!input || !out) return;

    var raw = input.value.trim();
    var q = norm(raw);
    var toks = tokens(raw);
    out.replaceChildren();

    if (toks.length === 0 || (toks.length === 1 && toks[0].length < 2)) {
      out.appendChild(el("p", "chk-empty", t(root, "empty")));
      return;
    }

    var hits = filterList(devices, toks, q);
    var shown = hits.slice(0, MAX);

    if (shown.length) {
      var ul = el("ul", "chk-list");
      for (var i = 0; i < shown.length; i++) {
        var li = el("li", "chk-item");
        li.appendChild(el("span", "chk-name", shown[i].item.name));
        li.appendChild(badge(root, shown[i].item));
        ul.appendChild(li);
      }
      out.appendChild(ul);
      var extra = hits.length - shown.length;
      if (extra > 0) {
        out.appendChild(el("p", "chk-more", t(root, "more").replace("{n}", String(extra))));
      }
      return;
    }

    var old = filterList(legacy, toks, q);
    if (old.length) {
      var box = el("div", "chk-miss");
      box.appendChild(el("p", "chk-miss-title", old[0].item.name));
      box.appendChild(el("p", null, t(root, "legacy")));
      var a = el("a", "btn btn-ghost", t(root, "ask"));
      a.href = mailtoAsk(root, raw);
      box.appendChild(a);
      out.appendChild(box);
      enhanceMailtos(out);
      return;
    }

    var miss = el("div", "chk-miss");
    miss.appendChild(el("p", "chk-miss-title", t(root, "not-found")));
    miss.appendChild(el("p", null, t(root, "not-found-body")));
    var ask = el("a", "btn btn-ghost", t(root, "ask"));
    ask.href = mailtoAsk(root, raw);
    miss.appendChild(ask);
    out.appendChild(miss);
    enhanceMailtos(out);
  }

  function initChecker() {
    var root = document.getElementById("watches");
    if (!root) return;
    var form = root.querySelector("form");
    var input = root.querySelector("#watch-q");
    if (!input) return;
    var run = function () { render(root); };
    input.addEventListener("input", run);
    if (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        run();
      });
    }
    run();
  }

  function initVideo() {
    var facade = document.querySelector(".video-facade");
    if (!facade) return;
    facade.addEventListener("click", function () {
      var id = (facade.getAttribute("data-youtube") || cfg.youtubeId || "").trim();
      if (!id) return;
      var iframe = document.createElement("iframe");
      iframe.setAttribute("src", "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1");
      iframe.setAttribute("title", facade.getAttribute("data-title") || "YouTube");
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      facade.replaceChildren(iframe);
      facade.classList.add("is-playing");
    });
  }

  var EMAIL = "lukasz.pszenny@gmail.com";

  function i18nMail(key, fallback) {
    var nodes = [
      document.getElementById("contact"),
      document.getElementById("watches")
    ];
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i]) {
        var v = t(nodes[i], key, "");
        if (v) return v;
      }
    }
    return fallback;
  }

  function parseMailto(href) {
    var raw = String(href || "").replace(/^mailto:/i, "");
    var q = raw.indexOf("?");
    var email = (q < 0 ? raw : raw.slice(0, q)).split(",")[0].trim();
    try { email = decodeURIComponent(email); } catch (e) {}
    var params = {};
    if (q >= 0) {
      raw.slice(q + 1).split("&").forEach(function (p) {
        var i = p.indexOf("=");
        var k = (i < 0 ? p : p.slice(0, i)).toLowerCase();
        var v = i < 0 ? "" : p.slice(i + 1);
        try { params[k] = decodeURIComponent(v.replace(/\+/g, " ")); } catch (err) { params[k] = v; }
      });
    }
    return { email: email || EMAIL, subject: params.subject || "", body: params.body || "" };
  }

  function gmailCompose(info) {
    var u = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(info.email);
    if (info.subject) u += "&su=" + encodeURIComponent(info.subject);
    if (info.body) u += "&body=" + encodeURIComponent(info.body);
    return u;
  }

  function copyText(value, btn, copiedLabel, copyLabel) {
    var done = function () {
      btn.textContent = copiedLabel;
      btn.classList.add("is-copied");
      window.setTimeout(function () {
        btn.textContent = copyLabel;
        btn.classList.remove("is-copied");
      }, 1600);
    };
    var fallback = function () {
      var ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { if (document.execCommand("copy")) done(); } catch (e) {}
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(done).catch(fallback);
    } else {
      fallback();
    }
  }

  function enhanceMailto(anchor) {
    if (!anchor || anchor.closest(".mail-alt") || anchor.parentNode && anchor.parentNode.classList.contains("mail-cluster")) {
      return;
    }
    var href = anchor.getAttribute("href") || "";
    if (!/^mailto:/i.test(href)) return;

    var info = parseMailto(href);
    var copyLabel = i18nMail("copy", "Copy");
    var copiedLabel = i18nMail("copied", "Copied");
    var gmailLabel = i18nMail("gmail", "Write via Gmail");
    var showAddr = (anchor.textContent || "").replace(/\s+/g, " ").trim().toLowerCase() !== info.email.toLowerCase();

    var cluster = el("div", "mail-cluster");
    anchor.parentNode.insertBefore(cluster, anchor);
    cluster.appendChild(anchor);

    var alt = el("div", "mail-alt");
    if (showAddr) {
      var addr = el("span", "mail-addr", info.email);
      alt.appendChild(addr);
    }
    var copyBtn = el("button", "mail-copy", copyLabel);
    copyBtn.type = "button";
    copyBtn.setAttribute("aria-label", copyLabel + " " + info.email);
    copyBtn.addEventListener("click", function () {
      copyText(info.email, copyBtn, copiedLabel, copyLabel);
    });
    var gmail = el("a", "mail-gmail", gmailLabel);
    gmail.href = gmailCompose(info);
    gmail.target = "_blank";
    gmail.rel = "noopener noreferrer";
    alt.appendChild(copyBtn);
    alt.appendChild(gmail);
    cluster.appendChild(alt);
  }

  function enhanceMailtos(root) {
    (root || document).querySelectorAll('a[href^="mailto:"]').forEach(enhanceMailto);
  }


  function applyFaceStore() {
    var url = String((cfg && cfg.faceStoreUrl) || "").trim();
    document.querySelectorAll("[data-face-store]").forEach(function (el) {
      if (url) {
        el.hidden = false;
        if (el.tagName === "A") {
          el.href = url;
          el.target = "_blank";
          el.rel = "noopener";
        }
      } else {
        el.hidden = true;
      }
    });
    document.querySelectorAll("[data-face-soon]").forEach(function (el) {
      el.hidden = !!url;
    });
  }

  function setupFaceClips() {
    var clips = document.querySelectorAll("#face video.face-clip");
    if (!clips.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      clips.forEach(function (v) {
        v.removeAttribute("autoplay");
        try { v.pause(); } catch (e) {}
      });
      return;
    }
    function play(v) {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }
    if (!("IntersectionObserver" in window)) {
      clips.forEach(function (v) {
        v.preload = "metadata";
        play(v);
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          play(v);
        } else {
          try { v.pause(); } catch (err) {}
        }
      });
    }, { rootMargin: "120px 0px", threshold: 0.2 });
    clips.forEach(function (v) {
      v.preload = "none";
      io.observe(v);
    });
  }

  applyFlags();
  applyFaceStore();
  setupFaceClips();
  initChecker();
  initVideo();
  enhanceMailtos(document);
})();
