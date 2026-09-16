/* Comprobador de coherencia del MUFU.
   Cada fallo que se cuela una vez se convierte aquí en una comprobación
   permanente. La lista crece; nunca se recorta. */
import fs from 'node:fs';
import path from 'node:path';
import {load} from 'cheerio';

const norm = t => t.replace(/\s+/g, ' ').trim();
const paginas = fs.readdirSync('.').filter(f => f.endsWith('.html')).sort();
const registry = JSON.parse(fs.readFileSync('data/registry.json', 'utf8'));
const fallos = [];   // rompen la construcción
const dudas  = [];   // hay que resolverlas con una persona, no bloquean
const aviso = (grupo, msg) => fallos.push(`${grupo}: ${msg}`);
const duda  = (grupo, msg) => dudas.push(`${grupo}: ${msg}`);

const texto = f => {
  const $ = load(fs.readFileSync(f, 'utf8'));
  $('script,style').remove();
  return {$, t: norm($('body').text())};
};

/* ── 1 · anclas internas ───────────────────────────────────────────── */
for (const f of paginas) {
  const $ = load(fs.readFileSync(f, 'utf8'));
  const ids = new Set($('[id]').map((_, e) => $(e).attr('id')).get());
  $('a[href^="#"]').each((_, a) => {
    const h = $(a).attr('href').slice(1);
    if (h && !ids.has(h)) aviso('ancla rota', `${f} → #${h}`);
  });
  $('a[href*=".html#"]').each((_, a) => {
    const [pag, frag] = $(a).attr('href').split('#');
    if (!fs.existsSync(pag)) return;
    const o = load(fs.readFileSync(pag, 'utf8'));
    if (!o(`[id="${frag}"]`).length)
      aviso('ancla rota entre páginas', `${f} → ${pag}#${frag}`);
  });
  const vistos = new Set(), dup = new Set();
  $('[id]').each((_, e) => { const i = $(e).attr('id'); if (vistos.has(i)) dup.add(i); vistos.add(i); });
  for (const d of dup) aviso('id duplicado', `${f} → #${d}`);
}

/* ── 2 · párrafos duplicados en las páginas editoriales ────────────── */
/* las fichas repiten una línea por pieza a propósito: no se revisan */
const editoriales = paginas.filter(f => !/^ficha/.test(f) && f !== '404.html');
for (const f of editoriales) {
  const {$} = texto(f);
  /* solo prosa editorial: los componentes que se repiten por elemento
     (tarjetas, fichas, entradas de lista) repiten su plantilla a propósito */
  const ps = $('p').not('article p, li p, [data-id] p, .object-card p, .pieza-l p')
    .map((_, e) => norm($(e).text())).get().filter(x => x.length > 90);
  const cuenta = new Map();
  for (const p of ps) cuenta.set(p, (cuenta.get(p) || 0) + 1);
  for (const [p, n] of cuenta) if (n > 1) aviso('párrafo repetido', `${f} ×${n} · "${p.slice(0, 70)}…"`);
  /* casi duplicados: mismo arranque largo */
  const inicios = new Map();
  for (const p of ps) {
    const k = p.slice(0, 45);
    if (inicios.has(k) && inicios.get(k) !== p)
      aviso('párrafos casi idénticos', `${f} · "${k}…" aparece con dos finales distintos`);
    inicios.set(k, p);
  }
}

/* ── 2b · frases casi iguales entre secciones ──────────────────────── */
/* la repetición literal la caza el bloque anterior; esta busca la otra,
   la de decir lo mismo con otras palabras en dos sitios distintos */
const vocab = f => new Set((f.toLowerCase().match(/\b[a-záéíóúñ]{5,}\b/g) || []));
for (const f of editoriales) {
  const {$} = texto(f);
  /* fuera: citas destacadas, pies de figura y el texto de la placa, que
     repiten a propósito lo que ya dice su contexto */
  const frases = $('p').not('.mom__lead, figcaption p, .placa-grande p, blockquote p, .object-card p, .pieza-l p, [data-id] p, li p')
    .map((_, e) => norm($(e).text())).get()
    /* fuera las líneas de datos: una dirección repite los nombres del sitio
       sin estar diciendo lo mismo que la prosa que lo describe */
    .filter(x => x.length > 80 && !/°\s*[NSEW]/.test(x));
  for (let a = 0; a < frases.length; a++) for (let b = a + 1; b < frases.length; b++) {
    const va = vocab(frases[a]), vb = vocab(frases[b]);
    if (va.size < 6 || vb.size < 6) continue;
    let comunes = 0; for (const w of va) if (vb.has(w)) comunes++;
    const sim = comunes / Math.min(va.size, vb.size);
    if (sim >= 0.6) aviso('dos párrafos dicen casi lo mismo',
      `${f} · "${frases[a].slice(0, 60)}…" / "${frases[b].slice(0, 60)}…"`);
  }
}

/* ── 3 · cifras declaradas contra la realidad ──────────────────────── */
const home = texto('index.html');
const reales = {
  registros: registry.records.length,
  bonus: registry.bonus.length,
  personas: registry.people.length,
  modulos: load(fs.readFileSync('index.html', 'utf8'))('#recorrido .mom').length,
  preguntas: load(fs.readFileSync('index.html', 'utf8'))('.pq').length,
};
const esperado = [
  ['51 registros', reales.registros === 51],
  ['53 objetos', reales.registros + reales.bonus === 53],
  ['12 estudiantes', reales.personas === 12],
  ['ocho módulos', reales.modulos === 8],
  ['las nueve preguntas del trimestre', reales.preguntas === 9],
  ['las diez preguntas', reales.preguntas === 10],
  ['diez puntos', reales.preguntas === 10],
];
for (const [frase, ok] of esperado) {
  if (home.t.includes(frase) && !ok) aviso('cifra que no cuadra', `el sitio dice "${frase}" y los datos dicen otra cosa`);
}

/* ── 3b · las preguntas abiertas: el texto contra los puntos ───────── */
/* el mapa afirma cuántas siguen abiertas y la entrega final las enciende.
   Si alguien cambia una cosa y no la otra, nadie se entera. */
{
  const crudo = fs.readFileSync('index.html', 'utf8');
  const fin = crudo.split('est--fin').pop() || '';
  const abiertas = (fin.slice(0, 2000).match(/class="h on"/g) || []).length;
  const nombres = ['cero','una','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez'];
  const total = load(crudo)('.pq').length;
  const cerradas = total - abiertas;
  const homeBajo = home.t.toLowerCase();
  if (abiertas && !homeBajo.includes(`${nombres[abiertas]} siguen abiertas`))
    aviso('el mapa no cuadra', `la entrega final enciende ${abiertas} preguntas y el texto no dice «${nombres[abiertas]} siguen abiertas»`);
  if (cerradas > 0 && !homeBajo.includes(`${nombres[cerradas]} de las ${nombres[total]} encontraron respuesta`))
    aviso('el mapa no cuadra', `quedan ${cerradas} cerradas de ${total} y el texto no lo dice así`);
}

/* ── 4 · contradicciones declaradas ────────────────────────────────── */
/* cada par: si las dos frases aparecen en la misma página, algo va mal */
const incompatibles = [
  ['no se lo dieron', 'sigue sin respuesta', 'el permiso no puede estar denegado y pendiente a la vez'],
  ['seis decimales', '8.9994°', 'la prosa describe una precisión y la placa muestra otra'],
  ['sin docente en el aula', 'sin docente</span>', 'el módulo 07 tuvo a Karla a distancia'],
];
for (const f of paginas) {
  const {t} = texto(f);
  const crudo = fs.readFileSync(f, 'utf8');
  for (const [a, b, porque] of incompatibles)
    if ((t.includes(a) || crudo.includes(a)) && (t.includes(b) || crudo.includes(b)))
      aviso('contradicción', `${f} · ${porque}`);
}

/* ── 5 · reglas de voz y de estilo del proyecto ────────────────────── */
const voseo = /\b(ten[eé]s|sab[eé]s|pod[eé]s|quer[eé]s|dej[aá]s|vos)\b/i;
for (const f of paginas) {
  const {t} = texto(f);
  if (voseo.test(t)) aviso('voseo', `${f} · ${t.match(voseo)[0]}`);
}
/* la raya larga es regla de la prosa del sitio, no de los títulos declarados
   por los estudiantes, que el archivo conserva tal cual */
const declarado = new Set(registry.records.flatMap(r => [r.title, r.description]));
const declaradoTxt = [...declarado].join(' ');
for (const f of editoriales) {
  const {$} = texto(f);
  $('p').each((_, e) => {
    const p = norm($(e).text());
    if (!p.includes('—')) return;
    if (declaradoTxt.includes(p.slice(0, 40))) return;
    aviso('raya larga en prosa', `${f} · "${p.slice(0, 80)}…"`);
  });
}
const css = fs.readdirSync('assets').filter(f => f.endsWith('.css')).map(f => fs.readFileSync('assets/' + f, 'utf8')).join('');
if (/monospace/.test(css)) aviso('regla de diseño', 'aparece una tipografía monoespaciada');
if (/text-transform:\s*uppercase/.test(css)) aviso('regla de diseño', 'aparecen mayúsculas forzadas');

/* ── 6 · registros idénticos en el archivo ─────────────────────────── */
const firma = new Map();
for (const r of registry.records) {
  const k = `${r.person}|${r.title}|${r.description}`;
  /* dudas ya documentadas en archivo.html: se cuentan, pero no vuelven a gritar */
  const documentadas = new Set(['Tamara Cos|Moneda 25 centavos de peso argentino']);
  if (firma.has(k) && documentadas.has(`${r.person}|${r.title}`)) { continue; }
  if (firma.has(k)) duda('registros idénticos', `${r.person} declara dos veces "${r.title.slice(0, 50)}" · ¿son dos piezas o una repetida?`);
  firma.set(k, r.id);
}

/* ── 6b · las diez paradas se llaman igual en los tres sitios ──────────
   El rótulo («8 de 10 · Las preguntas»), la entrada del índice desplegable
   y el orden tienen que coincidir. El 2026-09-13 la parada 8 quedó con dos
   nombres al cambiarle el título, y la 2 no tenía ninguno. */
{
  const $ = load(fs.readFileSync('index.html', 'utf8'));
  const indice = $('#museum-index .index-paradas a').toArray().map(a => ({
    href: $(a).attr('href'),
    n: norm($(a).find('span').text()),
    nombre: norm($(a).clone().children('span').remove().end().text()),
  }));
  if (indice.length !== 10) aviso('paradas', `el índice lista ${indice.length} paradas, no diez`);
  indice.forEach((parada, i) => {
    const id = (parada.href || '').replace('#', '');
    const seccion = $(`#${id}`);
    if (!seccion.length) return aviso('paradas', `el índice apunta a #${id} y esa sección no existe`);
    if (parada.n !== String(i + 1)) aviso('paradas', `#${id} va en el puesto ${i + 1} y su número dice ${parada.n}`);
    if (id === 'portada') return;               // la portada no lleva rótulo: es el hero
    const rotulo = norm(seccion.find('.eyebrow').first().text());
    const esperado = `${i + 1} de 10 · ${parada.nombre}`;
    if (rotulo !== esperado) aviso('paradas', `#${id}: el rótulo dice "${rotulo}" y el índice la llama "${parada.nombre}" · deberían decir "${esperado}"`);
  });
}

/* ── 6c · no prometer una fotografía que no está en la página ───────────
   El 2026-09-16 los prototipos se presentaron y las fotos llegaban después.
   La frase preparada decía que estaban más abajo. Si alguna vez la prosa
   afirma que las fotografías ya están, #futuros tiene que tener imágenes. */
{
  const $ = load(fs.readFileSync('index.html', 'utf8'));
  const dice = norm($('#recorrido').text());
  const promete = ['sus fotografías están más abajo', 'sus fotografías entran en esta página ese mismo día']
    .find(f => dice.toLowerCase().includes(f));
  const fotos = $('#futuros article.estado img').length;
  if (promete && !fotos)
    aviso('foto prometida', `el recorrido dice «${promete}» y #futuros no tiene ninguna imagen`);
}

/* ── 7 · resultado ─────────────────────────────────────────────────── */
if (dudas.length) {
  console.log(`\n  ${dudas.length} pregunta(s) para una persona, no bloquean:\n`);
  for (const d of dudas) console.log('   ?', d);
}
if (fallos.length) {
  console.error(`\n  ${fallos.length} problema(s) de coherencia:\n`);
  for (const f of fallos) console.error('   ·', f);
  console.error('');
  process.exit(1);
}
console.log(`\nCoherencia: ${paginas.length} páginas revisadas, sin contradicciones ni duplicados.`);
