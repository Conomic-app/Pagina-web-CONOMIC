"use strict";
const config = window.CONOMIC_CONFIG;
const signInButton = document.getElementById("google-signin");
const signOutButton = document.getElementById("google-signout");
const submitButton = document.getElementById("beta-submit");
const profile = document.getElementById("google-profile");
const status = document.getElementById("beta-status");
const manualForm = document.getElementById("manual-form");
const manualSubmit = document.getElementById("manual-submit");
const nameInput = document.getElementById("manual-name");
const emailInput = document.getElementById("manual-email");
let client;
let busy = false;
function isGmail(email) {
  return /^[^@\s]+@gmail\.com$/i.test(email || "");
}
function showStatus(message, state = "info") {
  status.textContent = message;
  status.dataset.state = state;
  status.hidden = false;
}
function setBusy(value) {
  busy = value;
  for (const button of [signInButton, signOutButton, submitButton, manualSubmit]) button.disabled = value;
  nameInput.readOnly = value;
  emailInput.readOnly = value;
  document.getElementById("google-access").setAttribute("aria-busy", String(value));
}
function renderUser(user) {
  signInButton.hidden = Boolean(user);
  profile.hidden = !user;
  submitButton.hidden = false;
  if (!user) return;
  document.getElementById("profile-name").textContent = user.user_metadata?.full_name || user.user_metadata?.name || "Tu cuenta de Google";
  document.getElementById("profile-email").textContent = user.email || "";
}
async function initialize() {
  if (!["http:", "https:"].includes(location.protocol)) {

    signInButton.disabled = true;
    return;
  }
  try {
    if (!window.supabase) throw new Error("SDK unavailable");
    client = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true }
    });
    const { data: { session }, error } = await client.auth.getSession();
    if (error) throw error;
    if (session) {
      const { data: { user }, error: userError } = await client.auth.getUser();
      if (userError) throw userError;
      renderUser(user);
    }
    const params = new URLSearchParams(location.search);
    if (params.has("error")) showStatus("No se completó el inicio de sesión. Puedes volver a intentarlo.");
    if (params.has("code") || params.has("error")) history.replaceState(null, "", location.pathname);
  } catch {
    showStatus("Puedes solicitar tu invitación con nombre y correo. Google no está disponible en este momento.");
    signInButton.disabled = true;
  }
}
signInButton.addEventListener("click", async () => {
  if (!client || busy) return;
  setBusy(true);
  showStatus("Te llevaremos a Google para elegir tu cuenta.");
  try {
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: new URL(location.pathname, location.origin).href,
        scopes: "openid email profile",
        queryParams: { prompt: "select_account" }
      }
    });
    if (error) throw error;
  } catch {
    showStatus("No pudimos continuar con Google. Inténtalo de nuevo o regístrate con tu correo.");
    setBusy(false);
  }
});
signOutButton.addEventListener("click", async () => {
  if (!client || busy) return;
  setBusy(true);
  try {
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) throw error;
    renderUser(null);
    status.hidden = true;
  } catch { showStatus("No pudimos cambiar de cuenta. Vuelve a intentarlo."); }
  finally { setBusy(false); }
});
submitButton.addEventListener("click", async () => {
  if (!client || busy) return;
  if (!isGmail(document.getElementById("profile-email").textContent)) {
    showStatus("Para solicitar la beta, usa una cuenta @gmail.com. Pulsa Cambiar cuenta para elegirla.");
    return;
  }
  setBusy(true);
  submitButton.textContent = "Guardando solicitud…";
  showStatus("Estamos guardando tu solicitud.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    // El servidor obtiene nombre y correo de la cuenta autenticada.
    const { error } = await client.rpc("request_beta_access").abortSignal(controller.signal);
    if (error) throw error;
    showSuccess(document.getElementById("profile-name").textContent);
  } catch {
    showStatus("No pudimos confirmar tu solicitud. Inténtalo de nuevo o escríbenos al correo de contacto.");
  } finally {
    clearTimeout(timeout);
    setBusy(false);
    submitButton.textContent = "Solicitar acceso a la beta";
  }
});


function showSuccess(name) {
  document.getElementById("signup-options").hidden = true;
  document.getElementById("beta-note").hidden = true;
  status.hidden = true;
  const greeting = name.trim().split(/\s+/)[0];
  document.getElementById("success-message").textContent = `${greeting}, recibimos tu solicitud para ser parte de la beta. Nos alegra que quieras acompañarnos desde el comienzo.`;
  document.getElementById("signup-success").hidden = false;
  document.getElementById("success-title").focus({ preventScroll: true });
}
for (const [input, errorId] of [[nameInput, "name-error"], [emailInput, "email-error"]]) {
  input.addEventListener("input", () => {
    input.removeAttribute("aria-invalid");
    document.getElementById(errorId).hidden = true;
    status.hidden = true;
  });
}
manualForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;
  nameInput.value = nameInput.value.trim();
  emailInput.value = emailInput.value.trim().toLowerCase();
  let firstInvalid;
  for (const [input, errorId, message] of [
    [nameInput, "name-error", "Cuéntanos tu nombre para darte la bienvenida."],
    [emailInput, "email-error", "Ingresa un correo terminado en @gmail.com. Por ejemplo: tu@gmail.com."]
  ]) {
    const invalid = !input.validity.valid;
    const error = document.getElementById(errorId);
    error.hidden = !invalid;
    if (invalid) {
      input.setAttribute("aria-invalid", "true");
      error.textContent = message;
      firstInvalid ||= input;
    } else input.removeAttribute("aria-invalid");
  }
  if (firstInvalid) { firstInvalid.focus(); return; }
  setBusy(true);
  manualSubmit.textContent = "Enviando tu solicitud…";
  showStatus("Estamos recibiendo tu solicitud.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(new URL("/rest/v1/rpc/request_beta_access_manual", config.supabaseUrl), {
      method: "POST",
      headers: { apikey: config.supabasePublishableKey, "Content-Type": "application/json" },
      credentials: "omit", cache: "no-store",
      body: JSON.stringify({ applicant_name: nameInput.value, applicant_email: emailInput.value.toLowerCase() }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error("Request unavailable");
    showSuccess(nameInput.value);
    manualForm.reset();
  } catch {
    showStatus("No pudimos confirmar tu solicitud. Inténtalo de nuevo en unos momentos o escríbenos y te ayudamos.");
  } finally {
    clearTimeout(timeout);
    setBusy(false);
    manualSubmit.textContent = "Quiero ser parte de la beta";
  }
});
initialize();
