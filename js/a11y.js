/* תפריט נגישות – בלי שירות חיצוני, בלי מעקב. ההגדרות נשמרות בדפדפן של הגולש. */
(function () {
  "use strict";
  var KEY = "a11y-settings";
  var root = document.documentElement;
  var state = { text: 0, contrast: false, gray: false, links: false, font: false, still: false, cursor: false };
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}

  var TOGGLES = [
    ["contrast", "ניגודיות גבוהה"],
    ["gray", "גווני אפור"],
    ["links", "הדגשת קישורים"],
    ["font", "גופן קריא"],
    ["still", "עצירת אנימציות"],
    ["cursor", "סמן עכבר גדול"]
  ];

  function apply() {
    root.style.setProperty("--ts", String(1 + state.text * 0.1));
    TOGGLES.forEach(function (t) { root.classList.toggle("a11y-" + t[0], !!state[t[0]]); });
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    if (panel) {
      panel.querySelectorAll("[data-toggle]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(!!state[b.dataset.toggle]));
      });
      panel.querySelector(".a11y__level").textContent = Math.round((1 + state.text * 0.1) * 100) + "%";
    }
    window.dispatchEvent(new Event("a11ychange"));
  }

  var panel;
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
    panel.setAttribute("aria-label", "הגדרות נגישות");
    panel.hidden = true;

    var html = '<div class="a11y__head"><p class="a11y__title">נגישות</p>' +
      '<button type="button" class="a11y__close" aria-label="סגירת תפריט הנגישות">✕</button></div>' +
      '<div class="a11y__row"><span>גודל טקסט</span><div class="a11y__stepper">' +
      '<button type="button" data-text="-1" aria-label="הקטנת טקסט">−</button>' +
      '<span class="a11y__level" aria-live="polite">100%</span>' +
      '<button type="button" data-text="1" aria-label="הגדלת טקסט">+</button></div></div>' +
      '<div class="a11y__grid">';
    TOGGLES.forEach(function (t) {
      html += '<button type="button" class="a11y__opt" data-toggle="' + t[0] + '" aria-pressed="false">' + t[1] + '</button>';
    });
    html += '</div><button type="button" class="a11y__reset">איפוס הגדרות</button>' +
      '<a class="a11y__link" href="accessibility.html">הצהרת נגישות</a>';
    panel.innerHTML = '<div class="a11y__paper">' + html + "</div>";

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    function open(v) {
      panel.hidden = !v;
      btn.setAttribute("aria-expanded", String(v));
      if (v) panel.querySelector("button").focus(); else btn.focus();
    }
    btn.addEventListener("click", function () { open(panel.hidden); });
    panel.querySelector(".a11y__close").addEventListener("click", function () { open(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) open(false); });

    panel.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.text) state.text = Math.max(0, Math.min(3, state.text + Number(b.dataset.text)));
      if (b.dataset.toggle) state[b.dataset.toggle] = !state[b.dataset.toggle];
      if (b.classList.contains("a11y__reset")) {
        state = { text: 0, contrast: false, gray: false, links: false, font: false, still: false, cursor: false };
      }
      apply();
    });
  }

  apply();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { build(); apply(); });
  else { build(); apply(); }
})();
