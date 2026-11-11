# Portafolio — David Santoyo Herrera

Sitio estático en HTML, CSS y JavaScript, compatible con GitHub Pages. No requiere compilación ni instalación de paquetes para funcionar.

## Ejecutar

Desde la raíz, con Python 3 instalado:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Abrir http://127.0.0.1:8000. También se puede abrir `index.html` directamente, aunque para comprobar persistencia del tema entre páginas se recomienda HTTP. `npm start` inicia el mismo servidor.

## Estructura y mantenimiento

- `index.html`: presentación, demo reel, tres destacados, The Way desplegable, perfil y contacto.
- `pages/*.html`: las cuatro rutas originales, con sus explicaciones técnicas y galerías ampliables.
- `css/site.css`: diseño responsive y variables de color de ambos temas.
- `scripts/theme.js`: preferencia del sistema, cambio manual y persistencia en localStorage. Se carga antes del CSS para evitar destellos.
- `scripts/site.js`: idioma, selección del CV, panel lateral y rotación de capturas al pasar el mouse.
- `scripts/translations.js`: traducciones al inglés, incluidos textos técnicos, títulos y etiquetas accesibles. El español permanece en el HTML.
- `img/optimized/`: versiones WebP de los recursos existentes. Los enlaces de las galerías conservan los originales de `img/`.
- `Videos/DemoReel.mp4` y `documents/Curriculum.pdf`: recursos originales sin cambios. El video se descarga al reproducirlo, sin autoplay.

Los archivos anteriores de Bootstrap, Sass y `scripts/sections.js` se conservan como referencia histórica, pero ninguna página los carga. El sitio ya no necesita recursos de CDN. Los encabezados y pies son HTML explícito para que la navegación funcione también sin JavaScript; al cambiarlos, actualizar las cinco páginas.

## Comprobaciones

Con Python 3 y Node.js:

```sh
npm test
```

Si npm no está disponible, ejecutar las mismas comprobaciones directamente:

```sh
python scripts/check.py
node scripts/theme.test.cjs
node scripts/site.test.cjs
```

Verifica rutas locales, fragmentos, IDs, imágenes, configuración del video y comportamiento del tema (sistema, elección manual, persistencia y almacenamiento bloqueado).

Revisión manual recomendada: tamaños de 360, 768 y 1440 px; ambos temas; navegación con Tab; reproducción del reel; apertura del PDF; expansión de The Way y ampliación de capturas. Se verificaron en navegador el cambio ES/EN, su persistencia al recargar y navegar, enlaces del CV, panel plegable, navegación entre proyectos y layout móvil sin desbordamiento horizontal. Las pruebas de JavaScript cubren también la rotación de imágenes y la preferencia de movimiento reducido.

## Idioma y CV

La primera visita usa el idioma principal del navegador: español si empieza con `es`; inglés para los demás. El botón muestra el idioma al que cambiará (EN o ES). La elección manual queda guardada en `portfolio-language` y se mantiene entre páginas. Sin JavaScript se muestra el contenido original en español.

- Español: `documents/Curriculum.pdf`.
- Inglés: **reemplazar `documents/Curriculum-en.pdf` por el PDF traducido**, manteniendo exactamente ese nombre. Por ahora es una copia del documento español, no una traducción.

Las cuatro páginas de proyecto incluyen un panel lateral nativo `details/summary`: abierto al entrar en escritorio y cerrado en móvil (hasta 650 px). El proyecto actual queda resaltado; Escape cierra el panel y devuelve el foco al control. Al cambiar de breakpoint se restablece el estado correspondiente.

Las tarjetas de inicio definen sus imágenes en `data-preview`. Cambian tras un segundo de hover y luego cada 1,6 segundos. Al salir vuelve la portada. Se desactiva en dispositivos sin hover y con `prefers-reduced-motion`; las imágenes adicionales se cargan bajo demanda.

El índice del demo reel con enlaces por minuto y la marca Burmuruk se presentaron como propuesta visual; no están implementados. Falta confirmar proyectos y tiempos del video. Se retiró el enlace redundante «Todos los proyectos» junto al título de destacados; The Way sigue accesible mediante su desplegable.

## Información pendiente

- Confirmar que el CV, el demo reel y el estado «En desarrollo» siguen vigentes.
- Precisar autoría y versiones de tecnologías donde la descripción original no las especifica (TODO en las páginas).
- Documentar hardware y condiciones de la medición de navegación de 1,000,000 de nodos en 12 segundos; se conservó el dato original.
- Añadir subtítulos o transcripción del reel si contiene voz; no se generó una transcripción ficticia.
- El enlace original de itch.io respondió. LinkedIn no pudo verificarse mediante la herramienta de consulta; se conserva la URL original. No se añadió un perfil de GitHub porque no existía un enlace de contacto verificado en el sitio.

Para publicar, conservar la configuración actual de GitHub Pages y enviar los cambios a la rama que utiliza. Este rediseño queda en el repositorio local; no se ha publicado.
