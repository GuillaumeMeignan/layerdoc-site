(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Burger menu (mobile) ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("site-menu");
  if (header && toggle && menu) {
    var mq = window.matchMedia("(max-width: 900px)");
    var setOpen = function (open, focusToggle) {
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open && focusToggle) toggle.focus();
    };
    toggle.hidden = false;
    header.classList.add("has-toggle");
    setOpen(false);
    toggle.addEventListener("click", function () { setOpen(!header.classList.contains("is-open")); });
    // Un clic sur un lien ou un bouton du menu le referme (la navigation se fait dans la page).
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("is-open")) setOpen(false, true);
    });
    document.addEventListener("click", function (e) {
      if (header.classList.contains("is-open") && !header.contains(e.target)) setOpen(false);
    });
    var onResize = function () { if (!mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener("change", onResize); else mq.addListener(onResize);
  }

  /* ---------- Comportements propres au mobile (≤ 720 px) ---------- */
  var mobile = window.matchMedia("(max-width: 720px)");
  function onMobileChange(fn) {
    if (mobile.addEventListener) mobile.addEventListener("change", fn); else mobile.addListener(fn);
  }

  /* Miniatures : la mise en page desktop est rendue à largeur fixe puis réduite à la largeur disponible.
     Illustration seule sur mobile : pas d'interaction (inert). */
  var thumbs = Array.prototype.slice.call(document.querySelectorAll("[data-thumb]"));
  var THUMB_MAX_HEIGHT = 420;
  function fitThumb(stage) {
    var box = stage.firstElementChild;
    if (!mobile.matches) {
      ["--scale", "--thumb-h", "--thumb-w"].forEach(function (v) { stage.style.removeProperty(v); });
      stage.classList.remove("is-cropped");
      stage.inert = false;
      return;
    }
    var width = Number(stage.getAttribute("data-thumb-width")) || 640;
    var scale = Math.min(1, stage.clientWidth / width);
    var natural = box.offsetHeight * scale;
    stage.style.setProperty("--thumb-w", width + "px");
    stage.style.setProperty("--scale", scale.toFixed(4));
    stage.style.setProperty("--thumb-h", Math.round(Math.min(natural, THUMB_MAX_HEIGHT)) + "px");
    stage.classList.toggle("is-cropped", natural > THUMB_MAX_HEIGHT);
    stage.inert = true;
  }
  function fitThumbs() { thumbs.forEach(fitThumb); }
  if (thumbs.length) {
    fitThumbs();
    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(fitThumbs);
      thumbs.forEach(function (t) { ro.observe(t); });
    } else {
      window.addEventListener("resize", fitThumbs);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitThumbs);
    onMobileChange(fitThumbs);
  }

  /* Carrousel « Pour qui » : focusable et annoncé uniquement quand il défile (mobile) */
  document.querySelectorAll("[data-carousel]").forEach(function (el) {
    var sync = function () {
      if (mobile.matches) {
        el.setAttribute("tabindex", "0");
        el.setAttribute("role", "group");
        el.setAttribute("aria-label", el.getAttribute("data-carousel-label") || "");
      } else {
        el.removeAttribute("tabindex");
        el.removeAttribute("role");
        el.removeAttribute("aria-label");
      }
    };
    sync();
    onMobileChange(sync);
  });

  /* Comparatif des offres : replié sur mobile, toujours déployé sur desktop (le résumé y est masqué) */
  var compare = document.querySelector(".compare-details");
  if (compare) {
    var syncCompare = function () { compare.open = !mobile.matches; };
    syncCompare();
    onMobileChange(syncCompare);
  }

  /* Barre d'action collante (mobile) : visible une fois le hero passé,
     masquée sur le formulaire ou quand le menu burger est ouvert. */
  var sticky = document.getElementById("sticky-cta");
  var heroCta = document.querySelector(".hero__cta");
  var formSection = document.getElementById("formulaire");
  if (sticky && heroCta && formSection && "IntersectionObserver" in window) {
    var heroGone = false, formVisible = false;
    var stickyLink = sticky.querySelector("a");
    var refreshSticky = function () {
      var menuOpen = header && header.classList.contains("is-open");
      var show = mobile.matches && heroGone && !formVisible && !menuOpen;
      sticky.classList.toggle("is-visible", show);
      sticky.setAttribute("aria-hidden", show ? "false" : "true");
      stickyLink.tabIndex = show ? 0 : -1;
      document.body.classList.toggle("has-sticky-cta", mobile.matches);
    };
    new IntersectionObserver(function (entries) {
      var e = entries[entries.length - 1];
      heroGone = !e.isIntersecting && e.boundingClientRect.top < 0;
      refreshSticky();
    }).observe(heroCta);
    new IntersectionObserver(function (entries) {
      formVisible = entries[entries.length - 1].isIntersecting;
      refreshSticky();
    }).observe(formSection);
    if (header) new MutationObserver(refreshSticky).observe(header, { attributes: true, attributeFilter: ["class"] });
    onMobileChange(refreshSticky);
    refreshSticky();
  }

  /* ---------- Onglets de sites (aperçu du hero) ---------- */
  var tablist = document.querySelector("[data-tabs]");
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") n = tabs[0];
        else if (e.key === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  }

  /* ---------- Sélecteur de couleur de marque (marque blanche) ---------- */
  var swatchGroup = document.querySelector("[data-swatches]");
  var brandMock = document.querySelector("[data-brand-mock]");
  if (swatchGroup && brandMock) {
    var swatches = swatchGroup.querySelectorAll(".swatch");
    swatches.forEach(function (s) {
      s.addEventListener("click", function () {
        swatches.forEach(function (o) { o.setAttribute("aria-pressed", o === s ? "true" : "false"); });
        brandMock.style.setProperty("--brand", s.getAttribute("data-color"));
      });
    });
  }

  /* ---------- Boutons d'action : mène au formulaire, préremplit, place le focus ---------- */
  var form = document.getElementById("contact-form");
  // Chaque bouton présélectionne le besoin (open-source ou demo) et préremplit le message.
  var PREFILL = {
    waitlist: { need: "open-source", text: "Bonjour, je souhaite m'inscrire sur la liste d'attente de la version gratuite de Layerdoc." },
    demo: { need: "demo", text: "Bonjour, je souhaite une démonstration et un devis pour Layerdoc Enterprise." },
    project: { need: "demo", text: "Bonjour, je souhaite que vous documentiez mon tracking de A à Z. Voici mon contexte : " }
  };
  var NEED_TEXT = { "open-source": PREFILL.waitlist.text, demo: PREFILL.demo.text };
  var NEED_LABEL = { "open-source": "Open source (liste d'attente)", demo: "Démo Enterprise" };
  function setNeed(value) {
    var radio = form && form.querySelector('input[name="besoin"][value="' + value + '"]');
    if (radio) radio.checked = true;
  }
  var thanks = document.getElementById("form-thanks");
  var message = document.getElementById("message");
  var section = document.getElementById("formulaire");

  document.querySelectorAll("[data-prefill]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var preset = PREFILL[el.getAttribute("data-prefill")];
      if (!preset || !message || !section) return;
      var text = preset.text;
      e.preventDefault();
      // Si le formulaire a déjà été envoyé, on le réaffiche pour une nouvelle demande.
      if (form.hidden) { form.hidden = false; thanks.hidden = true; }
      setNeed(preset.need);
      message.value = text;
      section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", "#formulaire");
      message.focus({ preventScroll: true });
      message.setSelectionRange(message.value.length, message.value.length);
    });
  });

  // Changer de besoin adapte le message tant que l'utilisateur ne l'a pas réécrit.
  if (form) {
    form.querySelectorAll('input[name="besoin"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
        var current = message.value.trim();
        var untouched = !current || Object.keys(PREFILL).some(function (k) { return PREFILL[k].text.trim() === current; });
        if (untouched) message.value = NEED_TEXT[radio.value] || "";
      });
    });
  }

  /* ---------- Formulaire Web3Forms ---------- */
  if (!form) return;
  var errorBox = document.getElementById("form-error");
  var submit = form.querySelector('button[type="submit"]');
  var submitLabel = submit.textContent;

  function showError(text) { errorBox.textContent = text; errorBox.hidden = false; }
  function clearError() { errorBox.hidden = true; errorBox.textContent = ""; }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearError();

    // Validation native (champs obligatoires), avec message clair.
    var invalid = form.querySelectorAll(":invalid");
    form.querySelectorAll("[aria-invalid]").forEach(function (f) { f.removeAttribute("aria-invalid"); });
    if (invalid.length) {
      invalid.forEach(function (f) { f.setAttribute("aria-invalid", "true"); });
      showError("Merci de remplir les champs obligatoires\u00a0: nom, e-mail, et la case de consentement.");
      invalid[0].focus();
      return;
    }

    if (!WEB3FORMS_ACCESS_KEY) {
      showError("Le formulaire n'est pas encore activé. Votre message n'a pas été envoyé.");
      return;
    }

    var fd = new FormData(form);
    var need = NEED_LABEL[fd.get("besoin")] || "";
    var payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: "Layerdoc : nouvelle demande" + (need ? " \u2013 " + (fd.get("besoin") === "demo" ? "Démo Enterprise" : "Open source") : "") + " (landing page)",
      from_name: "Landing page Layerdoc",
      name: fd.get("nom"),
      email: fd.get("email"),
      telephone: (fd.get("telephone") || "").trim(),
      besoin: need,
      message: fd.get("message") || "",
      consentement: "Oui",
      botcheck: form.elements.botcheck.checked ? "1" : ""
    };

    submit.disabled = true;
    submit.textContent = "Envoi en cours…";

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (r) {
        // Le remerciement ne s'affiche qu'après une réponse positive de l'API.
        if (r.ok && r.data && r.data.success === true) {
          form.reset();
          form.hidden = true;
          thanks.hidden = false;
          thanks.focus();
        } else {
          throw new Error("api");
        }
      })
      .catch(function () {
        showError("L'envoi a échoué. Vos données sont conservées\u00a0: réessayez dans un instant, ou écrivez-nous directement.");
      })
      .then(function () {
        submit.disabled = false;
        submit.textContent = submitLabel;
      });
  });
})();
