"use strict";
// Configuración pública. No incluir contraseñas, claves ni códigos de acceso.
window.CONOMIC_CONFIG = Object.freeze({
  accessMode: "public", // "public" para todos; "beta" para validar invitaciones.
  apkUrl: "assets/downloads/conomic-release.apk",
  googlePlayAvailable: false, // Activar cuando exista un enlace real de descarga.
  googlePlayUrl: "",
  validationEndpoint: "", // Solo para beta: endpoint POST que valida el código.
  feedbackUrl: ""
});
