# Configuración del sitio

La página solicita acceso a la beta mediante registro manual o Google. Consulta `solicitudes-beta.md` para configurar Supabase, ejecutar el SQL y habilitar Google.

Contenido: `index.html`. Diseño: `assets/css/styles.css`. Comportamiento: `assets/js/app.js`. Configuración pública: `assets/js/config.js`.

## Estilo CONOMIC

- Amarillo: #FDDF21.
- Verde: #27AE60; botón #178247.
- Naranja: #FDA302.
- Fredoka Bold para títulos y marca; Nunito Bold para textos y formularios.
- Fuentes en assets/fonts; licencias en licenses.
- Mascota original en assets/source/mico.svg.

## Estado de la integración

La URL y clave pública están configuradas. Es necesario ejecutar supabase/beta_requests.sql y habilitar Google para verificar el registro real. La confirmación se muestra solo tras una respuesta correcta del servidor. La invitación posterior y el acceso a la app se gestionan por separado.
