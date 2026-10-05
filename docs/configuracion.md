# Configuración de la página

La estructura está en `index.html`, el diseño en `assets/css/styles.css` y el comportamiento en `assets/js/app.js`. Edita las opciones públicas en `assets/js/config.js`. No guardes secretos en estos archivos.

## Descarga pública

El modo predeterminado es `accessMode: "public"`: no solicita códigos. Configura `googlePlayUrl` con el enlace HTTPS oficial y activa `googlePlayAvailable`. Hasta entonces se muestra «Descarga próximamente». Para conservar las invitaciones, cambia a `accessMode: "beta"` y configura el servidor descrito abajo.

## Estado actual

| Opción | Valor actual | Uso |
| --- | --- | --- |
| `googlePlayAvailable` | `false` | Muestra «Próximamente» y mantiene la descarga bloqueada. |
| `validationEndpoint` | `""` | Endpoint que valida el código en un servidor. |
| `googlePlayUrl` | `""` | Enlace de Play Store si se usa una URL fija. |
| `feedbackUrl` | `""` | Formulario «Cuéntanos tu experiencia». |

Mientras `googlePlayAvailable` sea `false`, ingresar un código o pulsar Play Store muestra el aviso de próxima disponibilidad. No se envía el código al servidor ni se habilita la descarga.

## Habilitar Play Store en modalidad beta

Cuando la descarga esté disponible:

1. Implementa la validación en un servidor real.
2. Configura `validationEndpoint` con su URL.
3. Configura `googlePlayUrl` o entrega el enlace en la respuesta del servidor.
4. Cambia `googlePlayAvailable` a `true`.

La interfaz actualizará «Próximamente» a «Disponible para». El enlace seguirá bloqueado hasta que el servidor autorice el código. Solo se aceptan enlaces de descarga con HTTPS.

## Contrato del servidor

El navegador envía una solicitud `POST` al endpoint configurado:

```http
Content-Type: application/json
Accept: application/json
```

```json
{
  "code": "CODIGO_RECIBIDO_EN_LA_INVITACION"
}
```

El código de este ejemplo describe el formato de la solicitud; no constituye un código válido de prueba.

Para una autorización correcta, responde con HTTP `200`:

```json
{
  "authorized": true,
  "stores": {
    "googlePlay": "https://ENLACE_REAL_DE_PLAY_STORE"
  }
}
```

Si se utiliza una URL fija en `googlePlayUrl`, el servidor puede responder únicamente con `{ "authorized": true }`. La página exige `authorized` con el valor booleano `true`, además de una URL de descarga válida.

| Respuesta | Comportamiento |
| --- | --- |
| `401` o `403` | Mantiene el enlace bloqueado e invita a revisar el código. |
| `429` | Pide esperar antes de volver a intentar. |
| `200` sin `authorized: true` | Mantiene el enlace bloqueado. |
| Error de red, respuesta inválida u otro error HTTP | Mantiene el enlace bloqueado e indica que se intente nuevamente. |

El servidor debe validar los códigos, limitar los intentos, usar `Cache-Control: no-store` y proteger el acceso real a la beta. El bloqueo del enlace en el navegador es una medida de interfaz; la autorización y el acceso deben controlarse en el servidor.

Un alojamiento de archivos estáticos sirve el HTML, pero no implementa ese endpoint. Si el servidor tiene otro origen, deberá permitir esta página mediante su configuración CORS. La solicitud actual usa `credentials: "same-origin"`.

## Formulario y correo

Reemplaza `feedbackUrl` por la URL HTTPS del formulario real. Mientras esté vacío, el botón abre el correo de soporte para compartir comentarios.

El texto del correo y su enlace `mailto:` se encuentran en el bloque de ayuda:

```text
claudio.villagran.quiroz@conomic.app
```

## Diseño y recursos

- Amarillo de marca: `#FDDF21`.
- Verde de marca: `#27AE60`.
- Naranja de marca: `#FDA302`.
- Los gradientes y fondos suaves se derivan de esos colores; el texto y los fondos también utilizan neutros.
- Fredoka Bold y Nunito Bold están incrustadas como WOFF2, junto con sus licencias.
- `assets/source/mico.svg` conserva la mascota original. El SVG que muestra la página está incrustado en el HTML.
- CSS y JavaScript se editan en sus archivos dentro de `assets/`.

## Descarga directa de APK

La modalidad pública utiliza apkUrl: "assets/downloads/conomic-release.apk". El enlace está también en index.html para funcionar sin JavaScript. El formulario de códigos y Play Store quedan ocultos mientras exista un APK configurado. El archivo debe publicarse junto con el sitio; el repositorio local no es todavía una web pública. No se ha comprobado la instalación ni la firma en un dispositivo Android.
