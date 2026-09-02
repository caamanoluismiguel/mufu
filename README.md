# MUFU · Museo del Futuro

Sitio del museo construido durante el Trimestre Especial (Isthmus, Panamá) por la cohorte 2026.
La colección permanente está enterrada bajo la escuela y no se puede visitar hasta el
**5 de septiembre de 2047** — setenta años exactos del lanzamiento de la Voyager 1.

En vivo: **https://mufu.today**

## Estructura

```
index.html        portada, colección, recorrido, cuenta regresiva
ficha.html        PLANTILLA — no se publica como pieza, se duplica
ficha-01…12.html  una ficha por pieza (una por estudiante)
img/              fotografías de las piezas: pieza-01.jpg … pieza-12.jpg
CNAME             dominio propio (GitHub Pages)
```

## El sistema de diseño · «la sección»

La página es un corte de obra. Arriba de la línea de suelo está lo que se puede
visitar; abajo, la excavación. El tiempo se dice en profundidad: la colección
está a −2.40, y las cotas de cada sección (−0.40, −0.80, −1.20…) marcan cuánto
has bajado. Las dos últimas secciones vuelven a ± 0.00 porque hablan de lo que
sí está a la vista.

```
--papel   #E4E6E1   bond de diazo, gris verdoso frío
--papel-c #EDEEEA   el papel un paso más claro
--tinta   #1B2430   azul de plano
--tinta-t #2C3540   texto corrido
--grafito #5A6470   cotas y anotación
--tierra  #CDD0C9   la masa excavada (solo en la colección)
--linea   #B4B9B1   reglas finas
--laton   #8A6A3C   la placa, y nada más
```

Instrument Serif para los títulos · Spectral para leer · Archivo Narrow solo
para cotas y anotación.

**Cuatro reglas que no se rompen.** Si alguien vuelve a editar esto, son lo
primero que hay que respetar, porque romperlas es exactamente lo que hacía que
el sitio anterior pareciera hecho por una máquina:

1. **Cero degradados.** La profundidad se hace con línea y con trama, no con
   resplandores. Antes había trece.
2. **Cero monoespaciada.** Las cotas van en Archivo Narrow, que es estrecha, no
   mono. Antes el 69 % de la tipografía era monoespaciada.
3. **Cero mayúsculas con tracking abierto.** Ni en rótulos, ni en botones, ni en
   la navegación.
4. **El latón aparece una sola vez por página**, en la placa. Es el material del
   que está hecha la placa, no un color de acento.

La trama a 45° aparece únicamente en la sección de la colección, porque es la
única que está literalmente bajo tierra. En cualquier otro sitio es decoración.

## Proyección

El sitio se ve en proyector y en los portátiles de la clase, sin modo aparte.
Por encima de 1600 px la raíz crece (`clamp(1rem,.83vw + .17rem,1.5rem)`) y con
ella todo el diseño, incluidas las cotas pequeñas. Está en `rem`, no en `px`,
para escalar la preferencia de tamaño del lector en vez de pisarla. Hasta
1600 px el sitio no cambia.

## Cómo llenar una ficha

1. Abre `ficha-NN.html` (el número ya está puesto).
2. Reemplaza **todo lo marcado con ▢**. No muevas la estructura.
3. Pon la foto en `img/pieza-NN.jpg` y descomenta la línea del `<img>`.
4. Guarda, haz commit y sube. El sitio se actualiza solo en un par de minutos.

## Pendiente

- [ ] Las doce fichas siguen con textos ▢ de plantilla (43 marcas por ficha).
- [ ] No hay ninguna fotografía en `img/`. Sin ellas la colección son doce
      vitrinas vacías iguales.
- [ ] `PIEZAS` en `index.html` (línea ~2203) tiene títulos y autores ▢.
- [ ] `og.png` sigue siendo la sala a oscuras del diseño anterior. Al compartir
      el enlace se ve una imagen que ya no se parece al sitio.

## Publicar una ficha

Al llenar `ficha-NN.html` hay que tocar cinco sitios. Si falta uno, la ficha
queda invisible o queda a medias:

1. `ficha-NN.html`: reemplazar los ▢ y quitar la línea
   `<meta name="robots" content="noindex, follow">`.
2. `img/pieza-NN.jpg`: poner la foto y descomentar el `<img>` de la ficha.
3. `index.html`, en `PIEZAS`: el título, el autor, la ruta de la foto en `img`,
   y el color `c` de la pieza tomado de su propia fotografía.
4. `robots.txt`: quitar las dos líneas `Disallow` cuando ya estén las doce.
5. `sitemap.xml`: añadir la URL de la ficha.

## Fechas

Las dos fechas viven en una sola línea cada una, al principio del `<script>`
de `index.html`. El sitio cambia de estado solo:

| Estado | Cuándo | Qué dice |
|---|---|---|
| Sin sellar | antes del entierro | punto blanco, «Sin sellar» |
| Cerrada | desde el entierro | punto oliva, «Sellada hace N días» |
| Abierta | 05.09.2047, 07:56 | «La colección puede abrirse» |

- `ENTIERRO` = 4 de septiembre de 2026
- `APERTURA` = 5 de septiembre de 2047, 07:56 (UTC-5)
- La espera completa son 7.671 días. Un día mueve la barra 0,013 %, así que la
  cifra que de verdad se mueve es la de los días transcurridos, no la barra.

## Publicación

GitHub Pages desde la rama `main`, raíz del repositorio. El archivo `CNAME`
apunta a `mufu.today`; los registros DNS viven en Namecheap.
