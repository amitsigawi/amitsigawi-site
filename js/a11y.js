/* תפריט נגישות – בלי שירות חיצוני, בלי מעקב. ההגדרות נשמרות בדפדפן של הגולש.
   כל אפשרות היא כפתור; לחלק מהאפשרויות יש כמה רמות (לחיצה חוזרת עוברת לרמה הבאה). */
(function () {
  "use strict";
  var KEY = "a11y-settings-v2";
  var root = document.documentElement;
  // הקישור להצהרת הנגישות – יחסי למיקום הסקריפט (עובד גם מתוך projects/)
  var me = document.currentScript && document.currentScript.src;
  var BASE = me ? me.replace(/js\/a11y\.js.*$/, "") : "";

  var ICONS = {
    contrast: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
    links: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    text: '<path d="M3 7V5h9v2M7.5 5v14M6 19h3M13 11v-1.5h8V11M17 9.5V19M15.5 19h3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    spacing: '<path d="M6 9l-3 3 3 3M18 9l3 3-3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 12h16" stroke="currentColor" stroke-width="2" stroke-dasharray="2 2.2"/>',
    still: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="2 2.6"/><path d="M10 9v6M14 9v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    noimg: '<rect x="3" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m3 16 5-5 4 4 2-2 5 5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M17 3l5 5M22 3l-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    font: '<text x="2" y="18" font-size="15" font-weight="700" font-family="Georgia,serif" fill="currentColor">Df</text>',
    cursor: '<path d="M5 3l14 8-6 1.6 3.6 7-2.6 1.4-3.6-7L5 17z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    tips: '<path d="M4 4h16v12h-9l-4 4v-4H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 8v.1M12 10.5v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    lineh: '<path d="M10 6h11M10 12h11M10 18h11M5 4v16M3 6l2-2 2 2M3 18l2 2 2-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    align: '<path d="M4 6h16M8 10h12M4 14h16M8 18h12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    sat: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" fill="currentColor"/>'
  };

  // [מפתח, תווית, מספר רמות (1 = מתג), תוויות לרמות]
  var OPTIONS = [
    ["contrast", "ניגודיות +", 2, ["ניגודיות גבוהה", "מצב כהה"]],
    ["links", "הדגשת קישורים", 1],
    ["text", "טקסט גדול", 3, ["110%", "120%", "130%"]],
    ["spacing", "ריווח טקסט", 3, ["רמה 1", "רמה 2", "רמה 3"]],
    ["still", "ביטול הבהובים", 1],
    ["noimg", "הסתרת תמונות", 1],
    ["font", "תמיכה בדיסלקציה", 1],
    ["cursor", "סמן", 1],
    ["tips", "תיאורים", 1],
    ["lineh", "גובה שורה", 3, ["1.6", "1.9", "2.2"]],
    ["align", "יישור טקסט", 3, ["לימין", "למרכז", "לשמאל"]],
    ["sat", "רוויה", 3, ["רוויה נמוכה", "רוויה גבוהה", "שחור-לבן"]]
  ];

  function blank() {
    var s = { big: false };
    OPTIONS.forEach(function (o) { s[o[0]] = 0; });
    return s;
  }
  var state = blank();
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}

  function apply() {
    var textScale = [1, 1.1, 1.2, 1.3][state.text] || 1;
    root.style.setProperty("--ts", String(textScale));

    var f = [];
    if (state.contrast === 1) f.push("contrast(1.45)");
    if (state.sat === 1) f.push("saturate(.4)");
    if (state.sat === 2) f.push("saturate(2)");
    if (state.sat === 3) f.push("grayscale(1)");
    root.style.setProperty("--a11y-filter", f.length ? f.join(" ") : "none");

    OPTIONS.forEach(function (o) {
      var k = o[0], lv = state[k] || 0;
      if (o[2] === 1) root.classList.toggle("a11y-" + k, !!lv);
      else for (var i = 1; i <= o[2]; i++) root.classList.toggle("a11y-" + k + "-" + i, lv === i);
    });
    root.classList.toggle("a11y-filtered", f.length > 0);
    root.classList.toggle("a11y-dark", state.contrast === 2);
    root.classList.toggle("a11y-bigwidget", !!state.big);

    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    if (panel) render();
    window.dispatchEvent(new Event("a11ychange"));
  }

  var panel, tip;
  function render() {
    panel.querySelectorAll("[data-opt]").forEach(function (b) {
      var o = OPTIONS.filter(function (x) { return x[0] === b.dataset.opt; })[0];
      var lv = state[o[0]] || 0;
      b.setAttribute("aria-pressed", String(lv > 0));
      var sub = b.querySelector(".a11y__sub");
      if (sub) sub.textContent = lv && o[3] ? o[3][lv - 1] : "";
      b.querySelectorAll(".a11y__dot").forEach(function (d, i) { d.classList.toggle("is-on", i < lv); });
    });
    var big = panel.querySelector(".a11y__switch");
    big.setAttribute("aria-checked", String(!!state.big));
  }

  function build() {
    var btn = document.createElement("button");
    btn.className = "a11y__toggle";
    btn.type = "button";
    btn.setAttribute("aria-label", "תפריט נגישות");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "a11y-panel");
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4.2" r="2.2" fill="currentColor"/><path d="M4 8.2c2.6.8 5.3 1.2 8 1.2s5.4-.4 8-1.2M12 9.4v4.8m0 0-3.2 7.3M12 14.2l3.2 7.3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    panel = document.createElement("div");
    panel.className = "a11y__panel";
    panel.id = "a11y-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "תפריט נגישות");
    panel.hidden = true;

    var html = '<div class="a11y__head"><p class="a11y__title">תפריט נגישות</p>' +
      '<button type="button" class="a11y__close" aria-label="סגירת תפריט הנגישות">✕</button></div>' +
      '<div class="a11y__row"><span id="a11y-big-l">יישומון גדול</span>' +
      '<button type="button" class="a11y__switch" role="switch" aria-checked="false" aria-labelledby="a11y-big-l"><span></span></button></div>' +
      '<div class="a11y__grid">';
    OPTIONS.forEach(function (o) {
      var dots = "";
      if (o[2] > 1) { dots = '<span class="a11y__dots" aria-hidden="true">'; for (var i = 0; i < o[2]; i++) dots += '<span class="a11y__dot"></span>'; dots += "</span>"; }
      html += '<button type="button" class="a11y__opt" data-opt="' + o[0] + '" aria-pressed="false">' +
        '<svg class="a11y__icon" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[o[0]] + "</svg>" +
        '<span class="a11y__label">' + o[1] + "</span>" +
        (o[3] ? '<span class="a11y__sub" aria-live="polite"></span>' : "") + dots + "</button>";
    });
    html += '</div><button type="button" class="a11y__reset">איפוס הגדרות</button>' +
      '<a class="a11y__link" href="' + BASE + 'accessibility.html">הצהרת נגישות</a>';
    panel.innerHTML = '<div class="a11y__paper">' + html + "</div>";

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    function open(v) {
      panel.hidden = !v;
      btn.setAttribute("aria-expanded", String(v));
      if (v) panel.querySelector(".a11y__close").focus(); else btn.focus();
    }
    btn.addEventListener("click", function () { open(panel.hidden); });
    panel.querySelector(".a11y__close").addEventListener("click", function () { open(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) open(false); });

    panel.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.opt) {
        var o = OPTIONS.filter(function (x) { return x[0] === b.dataset.opt; })[0];
        state[o[0]] = ((state[o[0]] || 0) + 1) % (o[2] + 1);
      }
      if (b.classList.contains("a11y__switch")) state.big = !state.big;
      if (b.classList.contains("a11y__reset")) state = blank();
      apply();
    });

    // "תיאורים": מציג את התיאור (alt / aria-label / title) של מה שמתחת לעכבר או בפוקוס
    tip = document.createElement("div");
    tip.className = "a11y__tip";
    tip.setAttribute("aria-hidden", "true");
    tip.hidden = true;
    document.body.appendChild(tip);
    function describe(el) {
      var t = el && el.closest && el.closest("[alt], [aria-label], [title]");
      if (!t || panel.contains(t)) return "";
      return (t.getAttribute("alt") || t.getAttribute("aria-label") || t.getAttribute("title") || "").trim();
    }
    function showTip(e, el) {
      if (!state.tips) { tip.hidden = true; return; }
      var txt = describe(el);
      if (!txt) { tip.hidden = true; return; }
      tip.textContent = txt;
      tip.hidden = false;
      var r = el.getBoundingClientRect();
      var x = e && e.clientX != null ? e.clientX : r.left + r.width / 2;
      var y = e && e.clientY != null ? e.clientY : r.bottom;
      tip.style.left = Math.min(window.innerWidth - tip.offsetWidth - 8, Math.max(8, x - tip.offsetWidth / 2)) + "px";
      tip.style.top = Math.min(window.innerHeight - tip.offsetHeight - 8, y + 18) + "px";
    }
    document.addEventListener("mousemove", function (e) { showTip(e, e.target); }, { passive: true });
    document.addEventListener("focusin", function (e) { showTip(null, e.target); });
    document.addEventListener("scroll", function () { tip.hidden = true; }, { passive: true });
  }

  apply();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { build(); apply(); });
  else { build(); apply(); }
})();
