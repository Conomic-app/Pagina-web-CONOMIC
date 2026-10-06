# CONOMIC · Página de descarga

Sitio estático diseñado para celulares, sin dependencias ni compilación.

## Archivos

- index.html: contenido y estructura.
- assets/css/styles.css: diseño y estilos adaptables.
- assets/fonts/: fuentes WOFF2 locales, con licencias en licenses/.
- assets/js/config.js: enlaces y modalidad de acceso.
- assets/js/app.js: descarga, disponibilidad y validación de beta.
- assets/source/mico.svg: mascota original.
- licenses/: licencias de las fuentes.

## Configurar la descarga

Edita assets/js/config.js. El modo public permite descargar sin código. Configura googlePlayUrl con el enlace HTTPS oficial y cambia googlePlayAvailable a true cuando la aplicación esté disponible. Sin enlace válido, la descarga permanece deshabilitada.

Para una beta con invitación, usa accessMode: "beta" y configura un servidor de validación. Consulta docs/configuracion.md.

## Revisar y publicar

Abre index.html en un navegador para revisar la página. Para que cualquier persona pueda acceder, publica toda la carpeta del sitio en un alojamiento estático con HTTPS, por ejemplo GitHub Pages. Hacer público el repositorio no publica automáticamente la página.

En GitHub Pages, configura Settings > Pages > Deploy from a branch > main > /(root). La dirección esperada será https://conomic-app.github.io/Pagina-web-CONOMIC/ una vez habilitado el servicio. No se ha configurado ni verificado la publicación desde este proyecto.

Conserva las rutas relativas y publica también assets/. No necesitas un servidor para la descarga pública desde Google Play; la modalidad beta sí requiere un backend.

## APK de Android

La descarga actual utiliza assets/downloads/conomic-release.apk (80,5 MB). El botón es un enlace directo y funciona sin JavaScript. Publica también esta carpeta. Para actualizar la app, reemplaza el APK, comprueba su tamaño y actualiza el texto de index.html. apkUrl en assets/js/config.js debe coincidir con el enlace del HTML.

La versión 1.0.0 y el requisito mínimo Android 7.0 (API 24) se verificaron en el manifiesto del APK. Actualiza también estos datos al reemplazarlo. No se publica una fecha de lanzamiento sin confirmar.

## Diseño responsive

La página está orientada a celulares y conserva una sola columna, con un ancho máximo de 440 px, incluso si se abre en una pantalla más amplia. No bloquea el acceso desde computadores. Mantiene el amarillo de marca; los botones utilizan un verde más oscuro para mejorar el contraste del texto blanco. La tipografía utiliza exclusivamente Fredoka Bold (700) para títulos, marca y la etiqueta «Beta cerrada», y Nunito Bold (700) para textos, botones y etiquetas. Ambas fuentes se cargan desde archivos locales. Incluye foco visible, un enlace para saltar a la descarga y controles de al menos 44 px de alto.

La etiqueta «Beta cerrada» describe la etapa de la app y no restringe el archivo. El APK sigue siendo accesible mediante su enlace directo. Un acceso exclusivo requiere validación y entrega del archivo desde un servidor protegido; cambiar la etiqueta o esconder el botón no lo implementa.

El fondo utiliza tonos crema y amarillo con un patrón decorativo más visible. El contenido aparece suavemente, Mico hace dos movimientos de bienvenida y los botones responden al toque. Las animaciones respetan `prefers-reduced-motion`, no cambian la distribución y no requieren JavaScript adicional.
