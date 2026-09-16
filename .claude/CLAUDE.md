# MUFU · cómo trabajar en este repositorio

Sitio del Museo del Futuro, Trimestre Especial de Isthmus, cohorte 2026.
Publicado en https://mufu.today con GitHub Pages desde `main`, raíz del repo.

## Aquí trabaja más de un agente

Codex y Claude editan este repositorio. **Haz `git fetch` antes de tocar nada**, y
comprueba las dos direcciones:

```
git rev-list --count origin/main..HEAD   # lo que falta subir
git rev-list --count HEAD..origin/main   # lo que falta bajar  ← la que se olvida
```

`git status` limpio no significa estar al día: solo describe el clon local. Si el sitio
está publicado, contrástalo también contra la URL en vivo. Nunca uses `push --force`
para saltarte un rechazo: ese rechazo es lo único que protege el trabajo del otro.

## El sitio se construye. Casi nada se edita a mano

`npm run build` genera estos archivos. Editarlos directamente no sirve de nada, porque
la siguiente construcción los pisa:

```
atlas.html  coleccion.html  archivo.html  infografia.html  infografias.html
llms.txt  sitemap.xml  assets/data.js  assets/facts.js  assets/fonts.css
data/collection.json  archive/edition-manifest.json
```

Las fuentes de verdad son:

```
data/registry.json    los 51 registros + 2 bonus
data/editorial.mjs    módulos del trimestre, hechos, nodos, hilos, fuentes, preguntas
data/learning.mjs     docentes y cruces entre clases
index.html            la prosa de la portada y del recorrido
```

**`index.html` es fuente y salida a la vez.** `build.mjs` lo lee, lo pasa por cheerio y
lo vuelve a escribir. Después de editarlo hay que correr el build y commitear el
resultado, no el archivo escrito a mano.

## Ciclo obligatorio antes de cada commit

```
npm ci
npm run build
npm run package
npm test              # 11 comprobaciones de contenido y datos
npm run test:browser  # 17 de navegador, accesibilidad y desbordamiento
```

Es el mismo orden que corre el CI en `.github/workflows/verify.yml`. Saltarse `package`
deja el ZIP y el manifiesto de edición desfasados, y este repo los regenera en cada
commit.

## El comprobador de coherencia · `npm run check`

`scripts/check-coherencia.mjs` corre dentro de `npm test` y en el CI. Revisa las 20
páginas y busca:

- **anclas rotas**, dentro de una página y entre páginas, e ids duplicados
- **párrafos repetidos** en prosa editorial (los componentes que repiten plantilla por
  elemento, como las fichas o las tarjetas de bonus, quedan fuera a propósito)
- **cifras que no cuadran**: si el texto dice «51 registros» u «ocho módulos», lo
  contrasta con `registry.json` y con el DOM
- **contradicciones declaradas**: pares de frases que no pueden convivir. Hoy hay tres,
  y la lista solo crece
- **reglas de voz**: voseo, y rayas largas en prosa del sitio (los títulos declarados por
  los estudiantes quedan fuera: son dato, no redacción)
- **reglas de diseño**: monoespaciadas y mayúsculas forzadas en el CSS
- **registros idénticos** en el archivo
- **las diez paradas**: el rótulo de cada sección (`8 de 10 · Las preguntas`), su número
  y la entrada del índice desplegable tienen que decir lo mismo. El rótulo es el nombre
  corto y el `<h2>` es el titular: pueden sonar distinto, pero **tienen que hablar de lo
  mismo**. Si le cambias el título a una sección, cámbiale también el rótulo y la entrada
  de `paradas` en `scripts/visual-edition.mjs`

Separa dos cosas: **fallos**, que rompen la construcción, y **dudas**, que se imprimen y
no bloquean porque las tiene que resolver una persona. Hoy hay una duda abierta: Tamara
Cos declara dos veces la misma moneda de 25 centavos, y nadie sabe si son dos piezas o
un registro repetido.

**La regla de uso es una sola: cada error que se cuela una vez se convierte aquí en una
comprobación.** La lista de contradicciones no se recorta nunca. Lo que ya está dentro
son fallos reales cometidos el 2026-09-12: cambiar las coordenadas y dejar la prosa que
describía la precisión anterior, dejar dos versiones del mismo párrafo una detrás de
otra, y rotular como «sin docente» un módulo que tuvo a Karla a distancia.

Lo que **no** puede cazar: errores de razonamiento nuevos, datos inventados y
regresiones visuales. Para eso están la comparación contra capturas de línea base y
leer con cuidado.

## Quién dio qué, y cuánto duró (2026-09-16)

El sitio declaraba una sola duración, «3 días» en el módulo 03, y era la de Luis Miguel.
Eso hacía que el bloque docente más largo del trimestre se leyera como el más corto.
Lo que confirmó él ese día, y que ahora está en la fuente `duraciones`:

| Módulo | Docente | Duración |
|---|---|---|
| 00, 01 | Erika y Alejandro, Román | **no se registró**, y no se estima |
| 02 | Viridiana Zavala | 10 sesiones, dato de su programa |
| 03 | Luis Miguel Caamaño | 3 días, **intervención aparte** |
| 04 | Karla Paniagua | 10 días |
| 05 y 06 | Luis Miguel Caamaño | **una sola clase de 10 días, en dos mitades** |

**El 05 y el 06 son la misma clase, «El objeto como mensaje».** El badge de 10 días va
solo en el 05 y el 06 lo ancla con una frase, para que nadie sume veinte. Los dos llevan
el nombre de la clase en la firma.

**Ese nombre es una decisión editorial, no un dato.** El del módulo 02 sale del programa
de la docente; este lo eligió Luis Miguel el 2026-09-16. La fuente `duraciones` lo dice
con todas las letras y esa distinción no se puede borrar: es la diferencia entre
documentar y bautizar.

Luis Miguel tiene **dos fichas** en el mapa docente, una por clase, porque dio dos. Antes
tenía una para tres módulos mientras cada docente tenía la suya.

## Dos trampas del tejido docente (2026-09-16)

1. **`contributorName` devuelve el `teacher` del primer módulo de la ficha**, así que si
   ese campo lleva el nombre de la clase detrás de un punto medio, la lista de personas
   de la portada imprime a la misma persona dos veces y parte el nombre de la clase como
   si fuera otro docente. Para eso está `contributorPerson`, que corta en el punto medio
   y va con un `Set`. Pasó al separar las fichas de Luis Miguel.

2. **Los conteos de conexiones y de fichas estaban escritos a mano en cuatro sitios:**
   `learning-weave.mjs` (el rótulo «9 conexiones pedagógicas» y «Los nueve cruces»),
   `tests/archive.test.mjs` y `tests/browser/experience.spec.js` (dos veces). Ahora los
   cuatro salen de `contributors.length` y `learningConnections.length`. Si añades una
   conexión, no hay nada que actualizar a mano.

## Cinco trampas que rompen el trabajo

1. **El hash de `index.html` está congelado.** El test «generated outputs are
   deterministic» calcula su hash, corre el build y exige que no cambie. Si commiteas
   HTML escrito a mano sin construir, el CI se cae.

2. **La prosa está congelada.** `tests/fixtures/written-content.json` guarda cada pasaje
   escrito de las veinte páginas y `check-content.mjs` falla si alguno desaparece. Al
   cambiar un texto, **edita solo las entradas afectadas**. No lo regrabes entero con
   `--record`: el fixture va por detrás del sitio y regrabarlo mete cientos de entradas
   ajenas a tu cambio, borrando la línea base de todo el proyecto.

3. **Los títulos de los módulos viven en dos sitios:** el `<h3 class="mom__t">` de
   `index.html` y `modules[]` de `data/editorial.mjs`. Cambiar uno solo hace que el
   recorrido y el atlas llamen dos cosas distintas al mismo módulo. Pasó con el 04.

4. **La escalera de cotas está llena.** ±0.00 portada, −0.40 la cuenta, −0.80 el
   recorrido, −1.20 Panamá 2046, −1.60 el hilo, −2.00 el mapa, −2.40 la colección. Una
   sección nueva entre medias obliga a renumerar hasta el −2.40, que es el ancla del
   concepto entero. Antes de añadir una sección, mira si el contenido cabe dentro de una
   que ya existe.

5. **El manifiesto de edición tiene que cuadrar** con los archivos del repo.
   Comprobación rápida: los `sha256` de `archive/edition-manifest.json` contra el disco.

## Reglas de diseño y de voz

Están en **`README.md`, sección «El sistema de color y sus reglas»**, y no se
negocian: cero monoespaciada, cero mayúsculas con tracking abierto, los dos metales sin
mezclar (latón a ±0.00, oliva bajo la línea de suelo), y degradados **solo** como
sombras de legibilidad sobre fotografía o vídeo, nunca decorativos.

Dos avisos que ahorran tiempo:

- **La paleta que se ve es la de `assets/edition.css`.** `archive.css` define otra que
  no se aplica nunca, porque las 20 páginas llevan la clase `mufu-edition`. Cambiar un
  color en `archive.css` no cambia nada en pantalla.
- **No renombres la clase `.mom`.** `edition.css` la restila en quince reglas y tres
  breakpoints, y una manda `.mom__d` y `.mom__c` a `grid-column:2`. Se intentó el
  2026-09-12 para los testimonios y la sección creció 422 px en móvil. El `<div>` vacío
  con `aria-hidden` de cada testimonio no sobra: ocupa la columna del número.

La voz es español de LATAM con tuteo. Nunca voseo. Sin rayas largas y sin cadencia de
máquina: nada de frases simétricas, tríadas ni aforismos de relleno.

## Fuera del sitio a propósito

Los correos personales, las direcciones de los propietarios, el valor en dólares de cada
pieza y el contenido de las cartas. El sitio publica las coordenadas del entierro y
`robots.txt` invita a los rastreadores de IA, así que esos datos no salen. Los nombres
sí: son la autoría.

**Las fechas del módulo 02 quedan fuera a propósito (2026-09-16).** El programa de
Viridiana Zavala sí trae calendario, pero se contradice solo: el encabezado dice «27 de
agosto al 7 de agosto» y la tabla pasa de «31 AGO» a «3 AGO». Hay dos lecturas posibles,
27 jul al 7 ago (dos semanas de lunes a viernes) o 27 ago al 7 sep (dos bloques de jueves
a lunes, que además chocan con el emparedado del 4 de septiembre). No se ha podido
verificar con la docente. El sitio publica lo que sí es firme, las diez sesiones
numeradas y su contenido, y no publica ninguna fecha de ese módulo. Si alguna vez se
confirma, entra en `index.html` y en la fuente `programa-02` de `data/editorial.mjs`.

**Las coordenadas tienen dos precisiones a propósito (2026-09-12).** La portada, su
JSON-LD y la tarjeta social redondean a cuatro decimales, unos once metros: dicen el
edificio sin señalar el punto de la pared. Los 51 registros de `data/registry.json` y
las 13 fichas conservan los seis decimales **porque son dato declarado por los
estudiantes, no texto del sitio**. Hay un test que compara cada registro con su ficha
original y falla si se tocan: cambiarlos sería falsificar el archivo.

## Cómo añadir un testimonio de estudiante

Van en `#testimonios` de `index.html`, a cota ±0.00, entre «Última función» y «La
visita». Faltan textos por llegar: se añaden pegando un bloque, sin rehacer nada.

Copia un `<article class="mom" id="testimonio-nombre-apellido">` existente y cambia:

1. El `id`, en minúsculas y con guiones. No puede repetirse: hay un test que falla
   con ids duplicados.
2. `mom__t` con el nombre completo, y `mom__q` con el enlace a su ficha.
3. `mom__lead` con **una frase del propio texto**, entre comillas angulares. No la
   escribas tú: la persona ya dijo lo que quería decir.
4. El texto completo, en varios `<p class="mom__d">` dentro del `<details>`.

Reglas de edición: corrige puntuación y parte los bloques largos, pero **no uniformes
el registro**. Cada quien escribe distinto y esa diferencia es la autoría. Tampoco
suavices lo incómodo: un testimonio donde todo salió bien no lo lee nadie.

Después: `npm run build`, añade los pasajes nuevos al fixture de contenido congelado
(solo los tuyos, ver la trampa 2), `npm run package`, y las dos baterías de tests.

## Pendiente: las fotos de los dos prototipos

La sesión 10 del taller de Karla Paniagua ya ocurrió: los dos prototipos, uno por grupo,
se presentaron el **16 de septiembre de 2026**. Las dos frases que estaban en presente ya
pasaron a pasado ese día, en `index.html` (cierre del módulo 04) y en el módulo 07 de
`data/editorial.mjs`.

Falta lo único que no depende de nosotros: **las fotografías, que se toman después de la
entrega**. Cuando lleguen:

1. Van **dentro de cada `<article class="estado">` de `#futuros`**, junto al equipo que
   las hizo. No en una sección nueva (ver la trampa 4).
2. En `index.html`, cierre del módulo 04, sustituir:

   > Las fotografías se toman después de la entrega y entran en esta página en cuanto
   > lleguen, cada una dentro del mundo del que salió.

   por:

   > Sus fotografías están más abajo, cada una dentro del mundo del que salió.

   Ese cambio sin las imágenes lo caza `check-coherencia` (comprobación 6c): si la prosa
   dice que las fotos ya están y `#futuros` no tiene ninguna `<img>`, el build se cae.

Después: `npm run build`, actualizar los pasajes tocados en el fixture, `npm run package`,
y las dos baterías.
