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
      pending ? t(root, "pending", "Coming with v1.0.3") : t(root, "supported", "Supported"));
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
      return;
    }

    var miss = el("div", "chk-miss");
    miss.appendChild(el("p", "chk-miss-title", t(root, "not-found")));
    miss.appendChild(el("p", null, t(root, "not-found-body")));
    var ask = el("a", "btn btn-ghost", t(root, "ask"));
    ask.href = mailtoAsk(root, raw);
    miss.appendChild(ask);
    out.appendChild(miss);
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

  applyFlags();
  initChecker();
  initVideo();
})();
