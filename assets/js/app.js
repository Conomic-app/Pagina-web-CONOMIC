"use strict";

    const CONFIG = window.CONOMIC_CONFIG;

    const form = document.getElementById("access-form");
    const codeInput = document.getElementById("access-code");
    const downloadButton = document.getElementById("download-button");
    const downloadLabel = document.getElementById("download-label");
    const status = document.getElementById("download-status");
    const googlePlay = document.getElementById("google-play");
    const storesLabel = document.getElementById("stores-label");
    const storeKicker = document.getElementById("store-kicker");
    const feedback = document.getElementById("feedback-link");
    let pendingRequest = null;
    codeInput.disabled = false;
    downloadButton.disabled = false;
    if (CONFIG.googlePlayAvailable) {
      storesLabel.textContent = "Disponible para:";
      storeKicker.textContent = "DISPONIBLE EN";
      googlePlay.setAttribute("aria-label", "Descargar CONOMIC en Play Store");
    }

    function showStatus(message, state = "info") {
      status.textContent = message;
      status.dataset.state = state;
      status.hidden = false;
    }

    function httpsUrl(value) {
      try {
        const url = new URL(value);
        return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
      } catch {
        return null;
      }
    }

    function lockStores() {
      googlePlay.href = "#REEMPLAZAR_URL_GOOGLE_PLAY";
      googlePlay.setAttribute("aria-disabled", "true");
    }

    function setBusy(busy) {
      downloadButton.disabled = busy;
      codeInput.readOnly = busy;
      form.setAttribute("aria-busy", String(busy));
      downloadLabel.textContent = busy ? "Verificando tu acceso…" : "Descargar CONOMIC";
    }

    if (CONFIG.accessMode === "public") {
      document.querySelector(".code-panel").hidden = true;
      codeInput.required = false;
      codeInput.disabled = true;
      const apkSection = document.getElementById("apk-download");
      const apkLink = document.getElementById("apk-link");
      // Las rutas relativas conservan el subdirectorio del sitio (por ejemplo GitHub Pages).
      let apkUrl = null;
      try {
        const candidate = new URL(CONFIG.apkUrl, document.baseURI);
        if (CONFIG.apkUrl && !candidate.username && !candidate.password &&
            (candidate.protocol === "https:" || candidate.origin === new URL(document.baseURI).origin && ["http:", "file:"].includes(candidate.protocol))) apkUrl = candidate.href;
      } catch {}
      apkSection.hidden = !apkUrl;
      form.hidden = Boolean(apkUrl);
      document.querySelector(".stores").hidden = Boolean(apkUrl);
      storesLabel.hidden = Boolean(apkUrl);
      if (apkUrl) apkLink.href = apkUrl;
      const downloadUrl = httpsUrl(CONFIG.googlePlayUrl);
      if (CONFIG.googlePlayAvailable && downloadUrl) {
        googlePlay.href = downloadUrl;
        googlePlay.removeAttribute("aria-disabled");
        showStatus("Descarga disponible en Google Play.", "success");
      } else {
        downloadLabel.textContent = "Descarga próximamente";
        downloadButton.disabled = true;
        showStatus("Estamos preparando la descarga de CONOMIC. Pronto encontrarás aquí el enlace oficial.");
      }
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (CONFIG.googlePlayAvailable && downloadUrl) window.location.assign(downloadUrl);
      });
      googlePlay.addEventListener("click", (event) => {
        if (googlePlay.getAttribute("aria-disabled") === "true") {
          event.preventDefault();
          showStatus("La descarga todavía no está disponible. Puedes contactarnos por correo.");
        }
      });
    } else {
      document.getElementById("apk-download").hidden = true;
      form.hidden = false;
      document.querySelector(".stores").hidden = false;
      storesLabel.hidden = false;
      document.querySelector(".code-panel").hidden = false;
      document.querySelector(".download-intro").textContent = "Ingresa el código de tu invitación para acceder a la beta.";
      document.querySelector(".download-intro").hidden = false;
      downloadLabel.textContent = "Descargar CONOMIC";
    codeInput.addEventListener("input", () => {
      lockStores();
      pendingRequest?.abort();
      codeInput.removeAttribute("aria-invalid");
      status.hidden = true;
      status.textContent = "";
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (pendingRequest) return;
      lockStores();
      const code = codeInput.value.trim();
      if (!code) {
        codeInput.setAttribute("aria-invalid", "true");
        showStatus("Ingresa el código de acceso que recibiste en tu invitación.");
        codeInput.focus();
        return;
      }
      codeInput.removeAttribute("aria-invalid");
      if (!CONFIG.googlePlayAvailable) {
        showStatus("CONOMIC estará disponible próximamente en Play Store.");
        return;
      }
      if (!CONFIG.validationEndpoint) {
        showStatus("La descarga aún no está disponible. Escríbenos y te ayudamos.");
        return;
      }

      const controller = new AbortController();
      pendingRequest = controller;
      const timeout = setTimeout(() => controller.abort(), 15000);
      setBusy(true);
      showStatus("Estamos verificando tu código de acceso.");
      try {
        const response = await fetch(CONFIG.validationEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          credentials: "same-origin",
          cache: "no-store",
          body: JSON.stringify({ code }),
          signal: controller.signal
        });
        if (response.status === 401 || response.status === 403) {
          codeInput.setAttribute("aria-invalid", "true");
          showStatus("No pudimos confirmar tu código. Revísalo o escríbenos para ayudarte.");
          codeInput.focus();
          return;
        }
        if (response.status === 429) {
          showStatus("Has intentado varias veces. Espera un momento y vuelve a probar.");
          return;
        }
        if (!response.ok) throw new Error("Access service unavailable");
        const result = await response.json();
        if (result?.authorized !== true) {
          codeInput.setAttribute("aria-invalid", "true");
          showStatus("No pudimos confirmar tu código. Revísalo o escríbenos para ayudarte.");
          codeInput.focus();
          return;
        }
        if (controller.signal.aborted) return;
        const googleUrl = httpsUrl(result.stores?.googlePlay || CONFIG.googlePlayUrl);
        if (!googleUrl) throw new Error("Download link unavailable");
        googlePlay.href = googleUrl;
        googlePlay.removeAttribute("aria-disabled");
        showStatus("¡Listo! Descarga CONOMIC en Play Store.", "success");
        googlePlay.focus({ preventScroll: true });
        googlePlay.scrollIntoView({ block: "nearest", behavior: "instant" });
      } catch {
        showStatus("No pudimos conectar para habilitar la descarga. Vuelve a intentarlo o escríbenos.");
      } finally {
        clearTimeout(timeout);
        pendingRequest = null;
        setBusy(false);
      }
    });

    for (const link of [googlePlay]) {
      link.addEventListener("click", (event) => {
        if (link.getAttribute("aria-disabled") !== "true") return;
        event.preventDefault();
        if (pendingRequest) return;
        if (!CONFIG.googlePlayAvailable) {
          showStatus("CONOMIC estará disponible próximamente en Play Store.");
          return;
        }
        showStatus("Ingresa tu código y toca “Descargar CONOMIC” para habilitar Play Store.");
        codeInput.focus();
      });
    }

    }

    const feedbackUrl = httpsUrl(CONFIG.feedbackUrl);
    if (feedbackUrl) feedback.href = feedbackUrl;
    if (!feedbackUrl) feedback.href = "mailto:claudio.villagran.quiroz@conomic.app?subject=Mi%20experiencia%20con%20CONOMIC";
