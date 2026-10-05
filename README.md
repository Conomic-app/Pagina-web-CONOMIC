# CONOMIC · Beta cerrada

Página de bienvenida y descarga de la beta cerrada de CONOMIC, pensada para abrirse desde el celular.

La página está contenida en **`index.html`**: incluye el CSS, JavaScript, las fuentes Fredoka Bold y Nunito Bold, y la mascota SVG. Se puede abrir sin instalar dependencias ni ejecutar un proceso de compilación.

## Estructura

```text
.
├── index.html                  # Página completa
├── README.md                   # Guía del proyecto
├── .gitignore                  # Exclusiones de Git
├── .gitattributes              # Finales de línea compatibles
├── assets/
│   └── source/
│       └── mico.svg            # SVG original de la mascota
├── docs/
│   └── configuracion.md        # Enlaces, disponibilidad y servidor
└── licenses/
    ├── fredoka-ofl.txt         # Licencia de Fredoka
    └── nunito-ofl.txt          # Licencia de Nunito
```

## Abrir y editar

Abre `index.html` en el navegador para revisar el diseño. Edita ese mismo archivo para modificar la página.

Si tienes Python instalado, puedes servir la carpeta localmente:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Luego abre `http://127.0.0.1:4173`. Detén el servidor con `Ctrl+C`.

El SVG de `assets/source/mico.svg` conserva el archivo original. La página usa una copia incrustada: modificar el original no cambia automáticamente la mascota que se muestra en `index.html`.

## Configuración antes de habilitar la descarga

En el bloque **`CONFIG`** de `index.html` se configuran:

- La disponibilidad de Play Store, actualmente marcada como **Próximamente**.
- El endpoint real de validación del código de acceso.
- El enlace de Play Store y el formulario de experiencia.

Consulta [la guía de configuración](docs/configuracion.md) para el contrato del servidor y los valores que debes reemplazar. El correo de soporte es `claudio.villagran.quiroz@conomic.app`.

## Repositorio en GitHub

El proyecto utiliza el repositorio privado [Conomic-app/Pagina-web-CONOMIC](https://github.com/Conomic-app/Pagina-web-CONOMIC), con la rama `main` y el remoto `origin` asociado a esa dirección.

Para subir futuras actualizaciones, ejecuta estos comandos desde esta carpeta:

```sh
git add .
git commit -m "Actualizar página de CONOMIC"
git push
```

Si Git solicita tu identidad para el primer commit, configura tu nombre y correo en este repositorio:

```sh
git config user.name "TU NOMBRE"
git config user.email "TU CORREO DE GITHUB"
```

Después vuelve a ejecutar el comando de commit. Revisa `git status` antes de subir cambios. En la primera subida, utiliza `git push -u origin main` para asociar la rama local con la de GitHub.

## Tipografías

Fredoka y Nunito se distribuyen bajo SIL Open Font License 1.1. Sus licencias completas se conservan en `licenses/` y dentro de `index.html` para acompañar también al HTML cuando se distribuye por separado.
