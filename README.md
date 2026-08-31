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

- [ ] Las doce fichas siguen con textos ▢ de plantilla.
- [ ] `PIEZAS` en `index.html` (línea ~1276) tiene títulos y autores ▢ — al llenar
      cada ficha, actualizar también esa lista y la rejilla de la colección.
- [ ] Falta `og:image` en `index.html`: sin ella, el sitio se comparte sin imagen
      en WhatsApp y redes. Añadir una imagen 1200×630 y su etiqueta.

## Publicación

GitHub Pages desde la rama `main`, raíz del repositorio. El archivo `CNAME`
apunta a `mufu.today`; los registros DNS viven en Namecheap.
