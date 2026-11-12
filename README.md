# Portafolio — David Santoyo Herrera

Sitio estático en HTML, CSS y JavaScript, compatible con GitHub Pages. No requiere compilación ni instalación de paquetes para funcionar.

## Ejecutar

Desde la raíz, con Python 3 instalado:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Abrir http://127.0.0.1:8000. También se puede abrir `index.html` directamente, aunque para comprobar persistencia del tema entre páginas se recomienda HTTP. `npm start` inicia el mismo servidor.

## Estructura y mantenimiento

- `index.html`: presentación, demo reel, índice expandible, tres destacados, navegación a todos los proyectos, perfil y contacto.
- `pages/*.html`: las cuatro rutas originales, con sus explicaciones técnicas y galerías ampliables.
- `css/site.css`: diseño responsive y variables de color de ambos temas.
- `scripts/theme.js`: preferencia del sistema, cambio manual y persistencia en localStorage. Se carga antes del CSS para evitar destellos.
- `scripts/site.js`: idioma, selección del CV, panel lateral y rotación de capturas al pasar el mouse.
- `scripts/portfolio-config.js`: capítulos, tiempos y enlace del repositorio RPG.
- `scripts/chapters.js`: fichas de capítulos y saltos temporales en el reproductor HTML5 existente.
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
node scripts/chapters.test.cjs
```

Verifica rutas locales, fragmentos, IDs, imágenes, configuración del video y comportamiento del tema (sistema, elección manual, persistencia y almacenamiento bloqueado).

Se revisaron en navegador escritorio (1440 px) y móvil (390 px): ES/EN, ambos temas, expansión de capítulos, navegación entre proyectos y panel superpuesto móvil sin desbordamiento horizontal. Al cerrar el panel en escritorio el contenido recupera todo el ancho; en móvil abrirlo no desplaza el contenido. Las pruebas de JavaScript cubren persistencia, rotación de imágenes, movimiento reducido y saltos temporales con un reproductor simulado (carga pendiente, segundo cero, clics repetidos, límites y reproducción rechazada). Los tiempos reales todavía no están configurados.

## Idioma y CV

La primera visita usa el idioma principal del navegador: español si empieza con `es`; inglés para los demás. El botón muestra el idioma al que cambiará (EN o ES). La elección manual queda guardada en `portfolio-language` y se mantiene entre páginas. Sin JavaScript se muestra el contenido original en español.

- Español: `documents/Curriculum.pdf`.
- Inglés: **reemplazar `documents/Curriculum-en.pdf` por el PDF traducido**, manteniendo exactamente ese nombre. Por ahora es una copia del documento español, no una traducción.

Las cuatro páginas incluyen un panel lateral nativo `details/summary`, alineado con el encabezado del proyecto: abierto al entrar en escritorio y cerrado en móvil (hasta 650 px). En móvil se superpone al contenido y se cierra al pulsar fuera o elegir un enlace. Escape lo cierra y devuelve el foco al control. Al cambiar de breakpoint se restablece el estado correspondiente.

Las tarjetas de inicio definen sus imágenes en `data-preview`. Cambian tras un segundo de hover y luego cada 1,6 segundos. Al salir vuelve la portada. Se desactiva en dispositivos sin hover y con `prefers-reduced-motion`; las imágenes adicionales se cargan bajo demanda.

## Configurar el índice del demo reel y el repositorio RPG

Editar **`scripts/portfolio-config.js`**:

1. En `chapters`, confirmar cuáles proyectos aparecen en el video. Eliminar de esta lista los que no aparezcan (sus páginas y navegación se conservan). Cada entrada contiene `id`, `title.es`, `title.en`, `image`, `startSeconds` y `href`.
2. Cambiar `startSeconds: null` por el segundo real de inicio. `null` muestra «Tiempo pendiente» y desactiva «Ver momento»; `0` significa el inicio real del video. No se utilizan los tiempos ilustrativos de la imagen de referencia.
3. Cambiar `reelSelectionConfirmed` a `true` después de verificar la selección. Mientras sea `false`, se muestra «Selección y tiempos por confirmar».
4. `initialChapterCount` determina cuántas fichas aparecen antes de pulsar «Ver todos». No se muestra ese botón si no hay capítulos adicionales. En móvil se permite desplazamiento horizontal táctil, sin capturar la rueda vertical.
5. Asignar a **`rpgRepositoryUrl`** la URL HTTPS real. Por ahora es `null` porque no había un enlace verificado. Al configurarla aparece «Repositorio y documentación» en RPG Starter Template.

Los saltos ya están conectados al único `<video>` existente: esperan metadatos si hace falta, ajustan `currentTime`, enfocan el reproductor y llaman a `play()`. No navegan ni recargan la página. Si el navegador rechaza la reproducción, se ofrece un mensaje para usar el control del video. No hace falta conectar otro reproductor.

Se utiliza BURMURUK. en los encabezados y David Santoyo Herrera en la presentación y datos profesionales. «Descargar CV» es la acción principal del hero, junto a LinkedIn e itch.io. Solo hay tres tarjetas destacadas; el directorio compacto y los paneles laterales conservan el acceso a The Way independientemente del índice del reel.

## Información pendiente

- Confirmar que el CV, el demo reel y el estado «En desarrollo» siguen vigentes.
- Precisar autoría y versiones de tecnologías donde la descripción original no las especifica (TODO en las páginas).
- Documentar hardware y condiciones de la medición de navegación de 1,000,000 de nodos en 12 segundos; se conservó el dato original.
- Añadir subtítulos o transcripción del reel si contiene voz; no se generó una transcripción ficticia.
- El enlace original de itch.io respondió. LinkedIn no pudo verificarse mediante la herramienta de consulta; se conserva la URL original. No se añadió un perfil de GitHub porque no existía un enlace de contacto verificado en el sitio.

GitHub Pages publica desde `Publish`. Esta actualización queda localmente en `main`, sin push ni publicación automática.
