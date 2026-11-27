/* First-visit language detection. No tracking — preference stays in this browser only. */
(function () {
  var LANGS = ["en","pl","de","cs","sk","fi","nb","sv","es","ru","uk","da","fr","nl","hu","it","lt"];
  var ALIAS = { no: "nb", nn: "nb", "nb-no": "nb", "nn-no": "nb", "pt-br": "en", "nl-be": "nl", "fr-be": "fr", "fr-ca": "fr" };
  var KEY = "colddip-lang";

  function pathLang() {
    var parts = location.pathname.split("/").filter(Boolean);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i].toLowerCase();
      if (p === "index.html" && i > 0) continue;
      if (LANGS.indexOf(p) !== -1) return p;
    }
    return "en";
  }

  function detect() {
    var list = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || "en"];
    for (var i = 0; i < list.length; i++) {
      var c = String(list[i] || "").toLowerCase().replace("_", "-");
      var short = c.split("-")[0];
      if (LANGS.indexOf(c) !== -1) return c;
      if (ALIAS[c]) return ALIAS[c];
      if (LANGS.indexOf(short) !== -1) return short;
      if (ALIAS[short]) return ALIAS[short];
    }
    return "en";
  }

  function currentFile() {
    var parts = location.pathname.split("/").filter(Boolean);
    var last = parts.length ? parts[parts.length - 1] : "";
    // Only a real file name counts; "/ColdDip/" ends with the repo folder, not a file.
    if (!/\.html?$/i.test(last) || last === "index.html") return "";
    return last;
  }

  function hrefFor(lang) {
    var here = pathLang();
    if (lang === here) return null;
    var file = currentFile();
    var hash = location.hash || "";
    var search = location.search || "";
    if (here === "en") {
      return lang === "en" ? null : lang + "/" + file + search + hash;
    }
    return (lang === "en" ? "../" : "../" + lang + "/") + file + search + hash;
  }

  var here = pathLang();
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}

  try { localStorage.setItem(KEY, here); } catch (e) {}

  // Auto-redirect only on the English root, first visit, when the browser language is supported.
  if (!stored && here === "en" && location.protocol !== "file:") {
    var want = detect();
    if (want !== "en") {
      var dest = hrefFor(want);
      if (dest) {
        location.replace(dest);
        return;
      }
    }
  }

  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "Escape") return;
    document.querySelectorAll("details.lang[open]").forEach(function (el) { el.open = false; });
  });

  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest(".lang-panel a");
    if (!a) return;
    var lang = a.getAttribute("hreflang") || a.getAttribute("lang");
    if (lang && LANGS.indexOf(lang) !== -1) {
      try { localStorage.setItem(KEY, lang); } catch (e) {}
    }
  });
})();
