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
