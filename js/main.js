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

  // ---------- reveal on scroll ----------
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealGroups = [
    [".hero__title", ".hero__text", ".hero .btn"],
    [".projects .title", ".projects__hint"],
    [".card"],
    [".process .title", ".process__text", ".video"],
    [".about__badge", ".about__text--a", ".about__text--b", ".about__photo"],
    [".reels .title", ".reels__text", ".reel"],
    [".chat"],
    [".contact__kicker", ".contact .title", ".contact__text", ".form-wrap"]
  ];
  revealGroups.forEach(function (group) {
    var i = 0;
    group.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add("reveal");
        el.style.setProperty("--delay", (i++ % 6) * 0.12 + "s");
      });
    });
  });
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ---------- parallax for testimonials ----------
  // כל המלצה זזה למעלה במהירות קצת שונה – עדין, ולא יוצא מהמסך
  var chats = document.querySelectorAll(".chat");
  var about = document.getElementById("about");
  if (chats.length && about && !reduceMotion) {
    var speeds = [0.10, 0.16, 0.22];
    var ticking = false;
    var update = function () {
      ticking = false;
      var r = about.getBoundingClientRect();
      var vh = window.innerHeight;
      // -1 כשהסקשן מתחת למסך, 0 במרכז, 1 כשעבר למעלה
      var p = ((vh / 2) - (r.top + r.height / 2)) / vh;
      p = Math.max(-1.2, Math.min(1.2, p));
      if (document.documentElement.classList.contains("a11y-still")) p = 0; // "עצירת אנימציות" בתפריט הנגישות
      if (window.innerWidth < 768) p *= 0.35; // במובייל ההמלצות אחת מתחת לשנייה – תזוזה קטנה יותר
      chats.forEach(function (c, i) {
        c.style.setProperty("--py", (-p * speeds[i % speeds.length] * vh).toFixed(1) + "px");
      });
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("a11ychange", onScroll);
    update();
  }

  // ---------- reels carousel (פעיל רק כשהמסילה נגללת – במובייל) ----------
  var track = document.querySelector(".reels__track");
  if (track) {
    var reels = Array.prototype.slice.call(track.querySelectorAll(".reel"));
    var dotsWrap = document.querySelector(".reels__dots");
    var prevBtn = document.querySelector(".reels__btn--prev");
    var nextBtn = document.querySelector(".reels__btn--next");
    var current = 0;
    var dots = reels.map(function (r, i) {
      var d = document.createElement("button");
      d.type = "button"; d.className = "reels__dot";
      d.setAttribute("aria-label", "המלצה " + (i + 1) + " מתוך " + reels.length);
      d.addEventListener("click", function () { goTo(i); });
      dotsWrap.appendChild(d);
      return d;
    });
    var setActive = function (i) {
      current = i;
      reels.forEach(function (r, j) { r.classList.toggle("is-active", j === i); });
      dots.forEach(function (d, j) { d.setAttribute("aria-current", j === i ? "true" : "false"); });
      prevBtn.disabled = i === 0;
      nextBtn.disabled = i === reels.length - 1;
    };
    var goTo = function (i) {
      i = Math.max(0, Math.min(reels.length - 1, i));
      // ממרכזים לפי מיקום (עובד גם ב-RTL, בלי לגלול את העמוד אנכית)
      var t = track.getBoundingClientRect(), r = reels[i].getBoundingClientRect();
      track.scrollBy({ left: (r.left + r.width / 2) - (t.left + t.width / 2), behavior: reduceMotion ? "auto" : "smooth" });
      setActive(i);
    };
    prevBtn.addEventListener("click", function () { goTo(current - 1); });
    nextBtn.addEventListener("click", function () { goTo(current + 1); });
    var syncFromScroll = function () {
      var t = track.getBoundingClientRect(), mid = t.left + t.width / 2, best = 0, bestD = Infinity;
      reels.forEach(function (r, i) {
        var b = r.getBoundingClientRect(), dist = Math.abs(b.left + b.width / 2 - mid);
        if (dist < bestD) { bestD = dist; best = i; }
      });
      if (best !== current) setActive(best);
    };
    var scrollTick = false;
    track.addEventListener("scroll", function () {
      if (!scrollTick) { scrollTick = true; requestAnimationFrame(function () { scrollTick = false; syncFromScroll(); }); }
    }, { passive: true });
    setActive(0);
    track.classList.add("is-ready");

    // רק סרטון אחד מתנגן בכל פעם
    track.addEventListener("play", function (e) {
      track.querySelectorAll("video").forEach(function (v) { if (v !== e.target) v.pause(); });
    }, true);
  }

  // ---------- sticky header ----------
  var header = document.querySelector(".site-header");
  var onScrollHeader = function () {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  // ---------- instagram feed (Behold JSON) ----------
  var insta = document.getElementById("instagram");
  if (insta && window.INSTAGRAM_FEED_URL) {
    fetch(window.INSTAGRAM_FEED_URL)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var posts = (data && data.posts) || (Array.isArray(data) ? data : []);
        posts = posts.slice(0, 6);
        if (!posts.length) return;
        var grid = insta.querySelector(".insta__grid");
        posts.forEach(function (post) {
          var src = (post.sizes && post.sizes.medium && post.sizes.medium.mediaUrl) ||
                    (post.mediaType === "VIDEO" ? post.thumbnailUrl : post.mediaUrl);
          if (!src) return;
          var li = document.createElement("li");
          li.className = "insta__item";
          var a = document.createElement("a");
          a.href = post.permalink; a.target = "_blank"; a.rel = "noopener";
          var img = document.createElement("img");
          img.src = src; img.loading = "lazy"; img.width = 400; img.height = 400;
          var text = (post.altText || post.prunedCaption || post.caption || "").trim();
          img.alt = text ? "פוסט באינסטגרם: " + text.slice(0, 120) : "פוסט באינסטגרם";
          a.appendChild(img);
          if (post.mediaType === "VIDEO") {
            var badge = document.createElement("span");
            badge.className = "insta__play"; badge.setAttribute("aria-hidden", "true"); badge.textContent = "▶";
            a.appendChild(badge);
          }
          li.appendChild(a);
          grid.appendChild(li);
        });
        insta.hidden = false;
      })
      .catch(function () { /* אם הפיד לא זמין – פשוט לא מציגים את הסקשן */ });
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
    var email = form.elements.email;
    var consent = form.elements.consent;
    var errors = [];
    [name, phone, email, consent].forEach(function (el) { el.classList.remove("is-invalid"); el.removeAttribute("aria-invalid"); });
    function bad(el, msg) { el.classList.add("is-invalid"); el.setAttribute("aria-invalid", "true"); errors.push(msg); ok = false; }

    if (name.value.trim().length < 2) bad(name, "שם מלא");
    var digits = phone.value.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 13) bad(phone, "טלפון תקין");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) bad(email, "אימייל תקין");

    if (!ok) {
      setStatus("נא למלא " + errors.join(", "), true);
      form.querySelector(".is-invalid").focus();
      return false;
    }
    if (!consent.checked) {
      bad(consent, "");
      setStatus("כדי לשלוח צריך לסמן הסכמה למדיניות הפרטיות", true);
      consent.focus();
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
    data.append("email", form.elements.email.value.trim());
    data.append("consent", form.elements.consent.checked ? "כן" : "לא");
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
