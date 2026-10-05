# CONOMIC · Página de descarga

Sitio estático adaptable a celulares y computadores, sin dependencias ni compilación.

## Archivos

- index.html: contenido y estructura.
- assets/css/styles.css: diseño, estilos adaptables y fuentes incrustadas.
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
