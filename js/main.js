/* ============================================================
   Rajan & Associates — main.js
   Hero entrance · nav · counters · reveal · FAQ · form · year
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Hero entrance ---------- */
  var hero = document.querySelector(".hero");
  if (hero) {
    window.addEventListener("load", function () {
      setTimeout(function () { hero.classList.add("loaded"); }, 60);
    }, { once: true });
    setTimeout(function () { hero.classList.add("loaded"); }, 400);
  }

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById("siteHeader");
  if (header) {
    window.addEventListener("scroll", function () {
      header.style.boxShadow = window.scrollY > 8 ? "0 1px 14px rgba(17,17,17,0.08)" : "none";
    }, { passive: true });
  }

  /* ---------- Counters ---------- */
  function animateCounter(el) {
    if (reduceMotion) {
      el.textContent = parseInt(el.getAttribute("data-count"), 10).toLocaleString("en-IN");
      return;
    }
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var duration = 1200;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-IN");
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* ---------- Reveal on scroll ---------- */
  document.querySelectorAll(".section, .strip, .stats, .hero-meta").forEach(function (el) {
    el.classList.add("reveal");
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll("[data-count]").forEach(animateCounter);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.18 });

  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var answer = item.querySelector(".faq-a");

    btn.addEventListener("click", function () {
      var open = item.classList.contains("open");

      faqItems.forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        other.querySelector(".faq-a").style.maxHeight = null;
      });

      if (!open) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  function setInvalid(field, invalid) {
    field.classList.toggle("invalid", invalid);
  }

  function validate() {
    var ok = true;
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var message = document.getElementById("message");

    var nameOk = name.value.trim().length >= 2;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    var msgOk = message.value.trim().length >= 10;

    setInvalid(name, !nameOk);
    setInvalid(email, !emailOk);
    setInvalid(message, !msgOk);

    if (!nameOk) { ok = false; status.textContent = "Enter your full name."; }
    else if (!emailOk) { ok = false; status.textContent = "Enter a valid email address."; }
    else if (!msgOk) { ok = false; status.textContent = "Describe your requirement in at least 10 characters."; }
    else { status.textContent = ""; }

    return ok;
  }

  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        status.className = "form-status err";
        return;
      }

      var btn = form.querySelector("button[type=submit]");
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Opening your email\u2026";

      setTimeout(function () {
        var data = Object.fromEntries(new FormData(form).entries());
        var subject = encodeURIComponent(
          "Enquiry from " + (data.name || "website")
        );
        var body = encodeURIComponent(
          "Name: " + (data.name || "") + "\n" +
          "Business: " + (data.business || "") + "\n" +
          "Email: " + (data.email || "") + "\n" +
          "Phone: " + (data.phone || "") + "\n" +
          "Entity type: " + (data.entity || "") + "\n" +
          "Service needed: " + (data.service || "") + "\n" +
          "Timeline: " + (data.deadline || "") + "\n\n" +
          "Requirement:\n" + (data.message || "")
        );
        window.location.href =
          "mailto:casanjeebrajpathak1993@gmail.com?subject=" + subject + "&body=" + body;

        status.className = "form-status ok";
        status.textContent =
          "Your email app has opened with the enquiry pre-filled. A named person will confirm receipt within one business day.";
        form.reset();
        btn.disabled = false;
        btn.textContent = original;

        setTimeout(function () {
          status.textContent = "";
          status.className = "form-status";
        }, 9000);
      }, 900);
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();