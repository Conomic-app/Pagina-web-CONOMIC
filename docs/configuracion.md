# Configuración de la página

La página sigue siendo un único archivo `index.html`. Todas las opciones de integración están en el objeto `CONFIG`, al comienzo del JavaScript incluido en ese archivo.

## Estado actual

| Opción | Valor actual | Uso |
| --- | --- | --- |
| `googlePlayAvailable` | `false` | Muestra «Próximamente» y mantiene la descarga bloqueada. |
| `validationEndpoint` | `""` | Endpoint que valida el código en un servidor. |
| `googlePlayUrl` | `"REEMPLAZAR_URL_GOOGLE_PLAY"` | Enlace de Play Store si se usa una URL fija. |
| `feedbackUrl` | `"REEMPLAZAR_URL_FORMULARIO"` | Formulario «Cuéntanos tu experiencia». |

Mientras `googlePlayAvailable` sea `false`, ingresar un código o pulsar Play Store muestra el aviso de próxima disponibilidad. No se envía el código al servidor ni se habilita la descarga.

## Habilitar Play Store

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

Reemplaza `feedbackUrl` por la URL HTTPS del formulario real. Mientras conserve su marcador, la página informa que el formulario aún no está disponible y ofrece el correo como alternativa.

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
- CSS y JavaScript se editan directamente en `index.html`.
