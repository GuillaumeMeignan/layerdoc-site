(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  var PREFILL = {
    waitlist: "Bonjour, je souhaite m'inscrire sur la liste d'attente de la version gratuite de Layerdoc.",
    demo: "Bonjour, je souhaite une démonstration et un devis pour Layerdoc Enterprise.",
    project: "Bonjour, je souhaite que vous documentiez mon tracking de A à Z. Voici mon contexte : "
  };
  var form = document.getElementById("contact-form");
  var thanks = document.getElementById("form-thanks");
  var message = document.getElementById("message");
  var section = document.getElementById("formulaire");

  document.querySelectorAll("[data-prefill]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var text = PREFILL[el.getAttribute("data-prefill")];
      if (!text || !message || !section) return;
      e.preventDefault();
      // Si le formulaire a déjà été envoyé, on le réaffiche pour une nouvelle demande.
      if (form.hidden) { form.hidden = false; thanks.hidden = true; }
      message.value = text;
      section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", "#formulaire");
      message.focus({ preventScroll: true });
      message.setSelectionRange(message.value.length, message.value.length);
    });
  });

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
      showError("Merci de remplir les champs obligatoires : nom, e-mail, et la case de consentement.");
      invalid[0].focus();
      return;
    }

    if (!WEB3FORMS_ACCESS_KEY) {
      showError("Le formulaire n'est pas encore activé. Votre message n'a pas été envoyé.");
      return;
    }

    var fd = new FormData(form);
    var payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: "Layerdoc : nouvelle demande depuis la landing page",
      from_name: "Landing page Layerdoc",
      name: fd.get("nom"),
      email: fd.get("email"),
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
        showError("L'envoi a échoué. Vos données sont conservées : réessayez dans un instant, ou écrivez-nous directement.");
      })
      .then(function () {
        submit.disabled = false;
        submit.textContent = submitLabel;
      });
  });
})();
