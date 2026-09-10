# MUFU · Museo del Futuro

Museo construido por 12 estudiantes durante diez semanas de Trimestre Especial
de Isthmus, Panamá, en 2026. Sitio público: https://mufu.today.

La colección reúne **51 objetos registrados + 2 bonus sin registro = 53 objetos**.
Se guarda en dos cajas, emparedadas bajo la escalera posterior del edificio 106,
Ciudad del Saber. El cierre se registra el 4 de septiembre de 2026, sin hora.
La cita de apertura es el **5 de septiembre de 2047, 07:56 de Panamá (UTC−5)**,
70 aniversario de Voyager 1 con precisión de minuto. Una fecha no acredita una
apertura física; esta necesita documentación propia.

## Esta edición

- `index.html`: relato completo, módulos, escenarios, preguntas, video, visita y reloj.
- `atlas.html`: 21 conexiones curatoriales, ocho módulos, tiempos, futuros y luz.
- `infografias.html`: dos láminas PNG grandes, visibles, abribles y descargables.
- `coleccion.html`: 51 registros originales y dos bonus explícitamente desconocidos.
- `archivo.html`: fuentes, niveles de evidencia, privacidad, custodia y correcciones.
- `infografia.html`: síntesis accesible e imprimible de todo el trimestre.
- `ficha-01.html` a `ficha-12.html`: páginas por autor, con 51 registros en total.
- `ficha.html`: plantilla histórica sin publicar, en `noindex`.
- `archive/`: versión original íntegra, manifiestos SHA-256 y edición descargable.

## Preservación

El punto de partida es el commit `221d43b58498aab5fa1847a80411679d2e06d0b2`.
Sus 78 archivos se conservan íntegros en `archive/mufu-2026-original.zip`;
`archive/original-manifest.json` contiene una huella SHA-256 por archivo.
La versión histórica contiene errores superados, incluidos conteos y referencias
a un entierro. El historial público explica las correcciones.

Los 51 títulos, descripciones, campos declarados y fotografías se conservan.
Los tests comparan cada registro y cada fotografía contra el commit original.
Los IDs `MUFU-001` a `MUFU-051` son identificadores editoriales estables;
`MUFU-B01` y `MUFU-B02` no atribuyen identidad, fotografía, medidas ni autoría.
Las rutas y anclas originales de las fichas permanecen disponibles.

`data/registry.json` es la transcripción pública conservada. No asignar categorías
de selección ni cajas por inferencia. `data/editorial.mjs` reúne hechos, fuentes,
módulos, conexiones, preguntas, estados y correcciones. Editar estas fuentes y
regenerar; no editar directamente las cuatro páginas nuevas ni `assets/data.js`.

## Desarrollo

Requiere Node.js 22+, npm, Git, zip y unzip. GitHub Pages sirve HTML estático;
no necesita ejecutar Node ni instalar dependencias en producción.

```sh
npm ci
npm run build
npm run package
npm test
npx playwright install chromium
npm run test:browser
npm run preview
```

Con la vista local en marcha, `npm run export:infographic` genera el PNG
descargable directamente desde la misma infografía HTML. Después, volver a
ejecutar `npm run package` para que la copia incluya la última imagen.

La vista local está en http://127.0.0.1:4177. `PORT` permite cambiar el puerto.
`build` copia las fuentes tipográficas y sus licencias para no depender de Google
Fonts. Los medios originales se sirven localmente. El contenido se lee sin
JavaScript; la búsqueda, los filtros, el diálogo y el atlas son mejoras progresivas.
La copia descargable se puede leer con archivos HTML sin conexión; un servidor
estático local habilita los módulos JavaScript y las interacciones.

`scripts/migrate.mjs` documenta la migración inicial desde el commit original.
**No es un comando habitual de desarrollo**: reconstruye las fichas y el relato
desde aquella versión y sobrescribiría ediciones posteriores. Para una nueva
corrección, actualizar el registro, su página de origen y el historial con fuente.

## Diseño y confianza

La edición visual comparte cabecera, índice, tipografía y visor de imágenes entre
el relato, el atlas, la colección y las fichas originales. Superficies blancas,
acentos rojos y bandas verdes distinguen los recorridos. Se conservan las cotas,
la sección arquitectónica y las cuatro familias de conexiones: latón (memoria),
verde azulado (representación), rojo apagado (poder) y oliva (tiempo). El color
siempre tiene un rótulo; nunca es la única forma de identificar una relación.
Instrument Serif titula, Spectral acompaña la lectura y Archivo Narrow rotula.
`assets/typography.css` fija esos tres roles, sus pesos y la escala de lectura
en todas las páginas. Las fuentes se sirven localmente; la navegación no cambia
de familia entre móvil y escritorio. No se sintetizan negritas ni cursivas.
Los diagramas conceptuales no se presentan como mediciones del lugar construido.

`scripts/visual-edition.mjs` aplica la presentación sin reescribir el contenido;
`assets/edition.css` y `assets/edition.js` contienen el sistema visual y su visor.
`scripts/navigation.mjs` define los destinos, el orden y la sección activa de
la cabecera y el índice en las 20 páginas, incluida la versión imprimible.
`node scripts/check-content.mjs` comprueba 1.306 pasajes capturados antes del
rediseño en 20 páginas. La captura de referencia no debe regenerarse durante una
revisión visual. Las pruebas de navegador cubren cuatro tamaños, accesibilidad,
filtros, navegación, diálogos, zoom, descargas y funcionamiento sin JavaScript.
El ciclo de mejora es construir, revisar capturas, corregir y volver a validar.
No hay un proceso permanente que cambie automáticamente el contenido publicado.

`data/learning.mjs` reúne la lectura del trimestre como obra compartida. El mapa
reconoce a la dirección, los cuatro docentes y los 12 estudiantes, y relaciona
los ocho módulos mediante nueve cruces pedagógicos con enlaces al relato original.
`scripts/shared-learning.mjs` lo incorpora a la portada, el atlas, las infografías
y la nota de procedencia. Los filtros no ocultan contenido en la versión impresa;
la lectura completa también funciona sin JavaScript. Las láminas originales de
imagen no se retocan: se amplía la infografía web y su exportación PNG.

El trimestre tiene ocho módulos. Las duraciones individuales no están documentadas.
Pepper es reflexión óptica; Leia es un holograma de ficción, no el primero de la
historia. Los mundos de 2046 son especulaciones estudiantiles. Las conexiones del
atlas no prueban causalidad histórica. La referencia a MoMA es de esta ampliación.

Las dos láminas de IA anteriores se conservan en `medios/` como borradores
identificados, con sus limitaciones. La infografía web corregida es la versión
de consulta. Las preguntas del archivo tienen respuestas editoriales con fuentes,
no un modelo generativo encubierto. No se envían preguntas ni registros a un
proveedor de IA; no hay analítica añadida ni credenciales en el cliente.

## Límites y trabajo humano

- Los correos personales, domicilios, valoraciones y contenidos reservados no se publican.
- No reconstruir el texto cubierto de las cartas ni crear recuerdos como si fueran pruebas.
- La placa seguía pendiente en el último registro; no se inventa una inspección posterior.
- Falta un inventario público por caja y la identificación consentida de los bonus.
- Falta confirmar cuáles fueron los dos prototipos finales de 2046.
- La sucesión de custodia, permisos, consentimiento de apertura y cambios de edificio
  necesitan responsables humanos. La plantilla JSON no equivale a un acta.
- Cualquier futura IA generativa requiere backend seguro, corpus público revisado,
  citas verificables, límites de coste, consentimiento y evaluación de respuestas.
  Cualquier reconstrucción debe separar indicio e inferencia.

## Publicación

GitHub Pages desde `main`, raíz del repositorio. `CNAME` conserva `mufu.today`.
Antes de publicar: generar, empaquetar, ejecutar las pruebas, revisar el diff y
guardar una nueva versión del manifiesto. La rama de implementación es
`codex/mufu-connected-archive`; no cambiar DNS ni proveedores para esta ampliación.
