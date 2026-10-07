# Acceso a la beta con Google (solo trabajo local)

El usuario pulsa Continuar con Google, autoriza nombre y correo y vuelve al sitio. Se muestra su cuenta y debe pulsar Solicitar acceso a la beta. La confirmación solo aparece si Supabase guarda la solicitud. El registro no concede acceso a la app ni envía correos automáticamente. No se solicitan permisos para leer Gmail.

## Configuración externa pendiente

1. Ejecutar supabase/beta_requests.sql en Supabase > SQL Editor. Funciona también si ya se creó la tabla anterior. Añade full_name y user_id y reemplaza la inserción pública por una función exclusiva de usuarios autenticados con Google. No da acceso público a los correos. Las solicitudes repetidas conservan fecha y estado.
2. En Google Cloud, configurar Google Auth Platform (consentimiento) y crear un cliente OAuth de tipo Web application. Origen local: http://localhost:3000. URI de redirección autorizada: https://ygvikhitjeepnqjtmlns.supabase.co/auth/v1/callback. Si está en modo Testing, añadir las cuentas de prueba.
3. En Supabase > Authentication > Providers > Google, habilitar Google y colocar Client ID y Client Secret del cliente OAuth. El Client Secret se guarda en Supabase, nunca en el repositorio ni en el chat.
4. En Supabase > Authentication > URL Configuration, añadir http://localhost:3000/ a Redirect URLs. Para una publicación posterior, configurar Site URL y Redirect URLs con la dirección real. No se ha publicado este cambio.
5. Ejecutar node scripts/serve-local.cjs y abrir http://localhost:3000/. Las rutas file:// no permiten este flujo OAuth.
6. Probar con tu propia cuenta: autorizar Google, comprobar nombre/correo, solicitar acceso y verificar Table Editor > beta_requests. Repetir la solicitud no debe duplicar filas. También revisar cancelar Google y cambiar de cuenta.

La URL y clave pública están configuradas en assets/js/config.js. La librería Supabase se carga desde CDN: requiere conexión a Internet. La configuración OAuth y el guardado real siguen pendientes de verificación.

El APK sigue en assets/downloads: quitar el botón no protege un archivo que se publique. Si la beta debe tener acceso restringido, habrá que distribuir el APK mediante almacenamiento privado o Play Store con invitación.

Documentación: https://supabase.com/docs/guides/auth/social-login/auth-google y https://supabase.com/docs/guides/auth/redirect-urls

## Registro manual y bienvenida

Solo se aceptan correos terminados en `@gmail.com`, tanto en el formulario manual como al solicitar acceso con Google. Debe usarse la cuenta con la que se entrará a la beta en Google Play. Para activar esta validación en el servidor, vuelve a ejecutar `supabase/beta_requests.sql` en Supabase > SQL Editor. Las solicitudes existentes se conservan.

La página también ofrece nombre y correo sin iniciar sesión. Ejecutar el SQL actualizado crea request_beta_access_manual: valida campos y permite registrar solicitudes, pero no leer ni modificar las existentes. Un correo manual no está verificado; no debe usarse como prueba de identidad ni para otorgar permisos. La bienvenida aparece solo después de guardar, tanto con Google como con el formulario manual. Antes de publicar ampliamente, añadir protección contra automatización al registro público.
