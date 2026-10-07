# CONOMIC · Solicitud de acceso a la beta

Sitio estático adaptable a celulares, sin compilación. Permite solicitar una invitación con nombre y correo o continuar con Google mediante Supabase Auth. Muestra una bienvenida personalizada únicamente después de guardar la solicitud.

## Revisar en local

Ejecuta `node scripts/serve-local.cjs` y abre http://localhost:3000/. El inicio de sesión con Google requiere HTTP o HTTPS.

## Configurar Supabase

La URL y clave pública están en `assets/js/config.js`. Ejecuta `supabase/beta_requests.sql` en SQL Editor y configura el proveedor Google y las URLs permitidas según `docs/solicitudes-beta.md`. Estas configuraciones externas siguen pendientes de verificación; subir el sitio no las realiza automáticamente.

La tabla almacena correo, nombre, fecha, estado y usuario autenticado cuando corresponde. Las funciones permiten registrar solicitudes sin dar acceso público de lectura. Registrar una solicitud no concede acceso a la beta ni envía invitaciones automáticamente.

## Archivos

- `index.html`: contenido y formularios.
- `assets/css/styles.css`: diseño y estilos.
- `assets/js/app.js`: validación, Google, solicitudes y confirmación.
- `assets/js/config.js`: configuración pública de Supabase.
- `supabase/beta_requests.sql`: tabla, permisos y funciones.
- `assets/fonts/` y `licenses/`: fuentes locales y licencias.
- `docs/solicitudes-beta.md`: configuración y pruebas del flujo.

## Publicación

Publica index.html y assets/ en un alojamiento estático HTTPS. El dominio configurado en CNAME es conomic.app. La clave publishable es pública; nunca publiques claves secret, service_role ni el secreto OAuth de Google.

El APK anterior permanece en assets/downloads pero ya no se muestra un botón para descargarlo. Si se publica ese archivo, su URL sigue siendo pública. Para restringir su distribución se necesita almacenamiento privado o un servicio de beta con invitación.
