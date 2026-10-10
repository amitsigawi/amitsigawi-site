(function () {
  "use strict";

  // ---------- mobile menu ----------
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "סגירת תפריט" : "פתיחת תפריט");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "פתיחת תפריט");
      }
    });
  }

  // ---------- project links ----------
  var links = window.PROJECT_LINKS || {};
  document.querySelectorAll(".card__link").forEach(function (a) {
    var url = links[a.dataset.project];
    if (url) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      a.removeAttribute("href");
    }
  });

  var fb = document.querySelector('[data-todo="facebook"]');
  if (fb) {
    if (window.FACEBOOK_URL) fb.href = window.FACEBOOK_URL;
    else { fb.removeAttribute("href"); fb.removeAttribute("target"); }
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ---------- lead form ----------
  var form = document.getElementById("lead-form");
  if (!form) return;
  var status = form.querySelector(".lead-form__status");
  var submit = form.querySelector(".lead-form__submit");

  function setStatus(msg, isError) {
    status.textContent = msg;
    status.classList.toggle("is-error", !!isError);
  }

  function validate() {
    var ok = true;
    var name = form.elements.name;
    var phone = form.elements.phone;
    [name, phone].forEach(function (el) { el.classList.remove("is-invalid"); el.removeAttribute("aria-invalid"); });

    if (name.value.trim().length < 2) {
      name.classList.add("is-invalid"); name.setAttribute("aria-invalid", "true"); ok = false;
    }
    var digits = phone.value.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 13) {
      phone.classList.add("is-invalid"); phone.setAttribute("aria-invalid", "true"); ok = false;
    }
    if (!ok) {
      setStatus("נא למלא שם מלא ומספר טלפון תקין", true);
      form.querySelector(".is-invalid").focus();
    }
    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.elements.website.value) return; // honeypot
    if (!validate()) return;

    if (!window.LEAD_ENDPOINT) {
      setStatus("הטופס עוד לא מחובר – צריך להגדיר LEAD_ENDPOINT בקובץ js/config.js", true);
      return;
    }

    var data = new URLSearchParams();
    data.append("name", form.elements.name.value.trim());
    data.append("phone", form.elements.phone.value.trim());
    data.append("message", form.elements.message.value.trim());
    data.append("page", location.href);

    submit.disabled = true;
    setStatus("שולחת...");

    // Apps Script לא מחזיר כותרות CORS, לכן no-cors: הבקשה נשלחת אבל אי אפשר לקרוא את התשובה
    fetch(window.LEAD_ENDPOINT, { method: "POST", mode: "no-cors", body: data })
      .then(function () {
        form.classList.add("is-sent");
        setStatus("תודה! הפרטים התקבלו ואחזור אליכם עד 2 ימי עסקים 💛");
        form.reset();
      })
      .catch(function () {
        setStatus("משהו השתבש בשליחה. אפשר לנסות שוב או לפנות אליי באינסטגרם", true);
      })
      .finally(function () { submit.disabled = false; });
  });
})();
