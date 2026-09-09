import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import { facts } from '../data/editorial.mjs';

const base = facts.originalCommit;
const original = path => execFileSync('git', ['show', `${base}:${path}`], { encoding:'utf8' });
const text = ($, node) => $(node).text().replace(/\s+/g,' ').trim();
fs.mkdirSync('archive', { recursive:true });
fs.mkdirSync('assets', { recursive:true });
execFileSync('git', ['archive','--format=zip','--output=archive/mufu-2026-original.zip',base]);
const files = execFileSync('git',['ls-tree','-r','--name-only',base],{encoding:'utf8'}).trim().split('\n');
const manifest = files.map(path => {
  const bytes = execFileSync('git',['show',`${base}:${path}`],{maxBuffer:20*1024*1024});
  return { path, bytes:bytes.length, sha256:createHash('sha256').update(bytes).digest('hex') };
});
fs.writeFileSync('archive/original-manifest.json',JSON.stringify({commit:base,note:'Snapshot anterior a la corrección de 53 objetos. Contiene afirmaciones históricas superadas; consultar archivo.html.',files:manifest},null,2)+'\n');

const people = [], records = [];
for(let n=1;n<=12;n++) {
  const page = `ficha-${String(n).padStart(2,'0')}.html`;
  const $ = load(original(page));
  const name = text($,'h1');
  const personId = `MUFU-P${String(n).padStart(2,'0')}`;
  people.push({id:personId,name,url:page});
  $('.pieza-l').each((i,el) => {
    const fields = {};
    $(el).find('dt').each((_,dt) => {fields[text($,dt)] = text($,$(dt).next('dd'));});
    const img = $(el).find('img');
    const id = `MUFU-${String(records.length+1).padStart(3,'0')}`;
    const fragment = $(el).attr('id');
    records.push({id,personId,person:name,title:text($,$(el).find('h2')),description:text($,$(el).find('.pieza-l__d')),fields,
      image:{src:img.attr('src'),alt:img.attr('alt'),width:Number(img.attr('width')),height:Number(img.attr('height')),caption:text($,$(el).find('figcaption'))},
      source:`${page}#${fragment}`,sourceCommit:base,status:'Documentado',box:null,curationCategory:null});
    $(el).attr('data-record',id);
    $(el).find('.pieza-l__n').text(`${id} · registro ${String(i+1).padStart(2,'0')}`);
    img.attr('alt',img.attr('alt').replace(/fotografiado antes de emparedarlo\./,'fotografía del registro de 2026.'));
    $(el).find('dl').after(`<p class="record-source">Registro de ${name}. Transcripción conservada; sus campos son declaraciones del registro.<br><a href="archivo.html#metodo">Procedencia y método</a> · <a href="coleccion.html?persona=${personId}">Ver sus objetos en el archivo</a></p>`);
  });
  const count = $('.pieza-l').length;
  $('meta[name="description"]').attr('content',`${name}: ${count} objetos registrados. Colección MUFU: 51 registros y dos bonus sin ficha, 53 objetos. Apertura prevista en 2047.`);
  $('meta[property="og:description"]').attr('content',`${count} objetos registrados por ${name}. Archivo MUFU, cohorte 2026.`);
  $('.enc .sub').text(`${count} objetos registrados en 2026. Las fotografías conservan su apariencia antes del cierre.`);
  $('.enc .num').text(`· ${count} registros · Cohorte 2026`);
  $('.enc .eyebrow').contents().filter((_,el)=>el.type==='text').each((_,el)=>{el.data=el.data.replace('Colección permanente','Archivo de la colección');});
  $('head').append('<link rel="stylesheet" href="assets/archive.css">');
  fs.writeFileSync(page,$.html());
}
fs.writeFileSync('data/registry.json',JSON.stringify({people,records,bonus:[
  {id:'MUFU-B01',title:'Objeto bonus 01',status:'Sin registro',source:'conteo'},
  {id:'MUFU-B02',title:'Objeto bonus 02',status:'Sin registro',source:'conteo'}
]},null,2)+'\n');

const $ = load(original('index.html'));
function paragraph(needle,html) {
  const matches = $('p, li, figcaption').filter((_,el)=>text($,el).includes(needle));
  if(matches.length!==1) throw new Error(`Expected one paragraph for ${needle}, found ${matches.length}`);
  matches.html(html);
}
paragraph('apuesta a una escala más pequeña', '<b>5 de septiembre de 2047, 07:56 de la mañana, hora de Panamá.</b> La cita coincide con el setenta aniversario del lanzamiento de <em>Voyager 1</em>, con precisión de minuto. Su Disco de Oro lleva un mensaje para un lector sin contexto. Bajo esta escuela, 53 objetos esperan otra lectura: 51 fueron registrados y dos entraron como bonus sin ficha. <a href="atlas.html#tiempo">Las tres escalas de la espera</a>.');
paragraph('Los dos escenarios de este trimestre imaginaron', 'Los dos escenarios de este trimestre imaginaron Panamá en 2046. La cápsula tiene su cita un año después: una oportunidad de contrastar esos mundos posibles con la realidad que exista entonces. El diseño especulativo abre preguntas; su valor no depende de acertar un pronóstico.');
paragraph('Doce personas, cuatro piezas cada una', 'Doce estudiantes declararon <b>51 objetos</b>, cada uno con su registro y fotografía. Se añadieron <b>dos objetos bonus sin ficha</b>: <b>53 objetos en total</b>, según la confirmación actualizada de Luis Miguel Caamaño. No hay un inventario público que distribuya los objetos entre las dos cajas.');
paragraph('Estas cincuenta y una fichas', 'Los originales permanecen detrás de una pared. Las 51 fichas y sus fotografías siguen disponibles como archivo. Los dos bonus están contabilizados sin inventarles una descripción. <a href="coleccion.html">Explorar los 53 objetos</a> · <a href="archivo.html#conteo">Fuente del conteo</a>.');
paragraph('Recién entonces empezaron a traer objetos', 'Recién entonces empezaron a traer objetos. La consigna propuso cuatro intenciones de selección; el resultado no fue una cuota uniforme por persona. El conteo confirmado es de 51 objetos registrados y dos bonus sin registro.');
paragraph('Una por persona, para leerse dentro de veinte años', '<b>La carta</b>Una conversación dirigida al futuro. La consigna pedía una por persona; el registro conserva los conjuntos y títulos realmente declarados.');
paragraph('Al regresar, la cápsula: cuatro cosas', 'Al regresar, la cápsula: una consigna con cuatro intenciones de selección.');
paragraph('por el tiempo. Cada persona aporta cuatro cosas', 'La selección regresa a lo personal, pero ahora está atravesada por el tiempo. La consigna propuso un objeto que represente el presente, uno que se quiera entregar al futuro, uno que se quiera recuperar y una carta dirigida a sí mismo. El ejercicio obliga a preguntarse qué representa este momento y qué cambiará de significado. El resultado final no fue de cuatro por persona: fueron 51 objetos registrados y dos bonus.');
paragraph('móviles. Y cuatro piezas por cabeza', 'Fotos apartadas del carrete. Objetos que salen de la casa. Piezas que suben a un pedestal y dejan de tocarse. Objetos que en 2046 bajan a bóvedas submarinas o se esconden en nodos móviles. Y 53 objetos que quedan emparedados bajo una escalera. Cambia la escala y cambia quién decide. El gesto de separar vuelve en cada ejercicio.');
paragraph('Lo que el público ve es un reflejo', '<b>Los Falsos Nodos exhiben copias para proteger los originales.</b> Lo que el público ve en MUFU es un reflejo; la colección física queda tras la pared.');
paragraph('permanente es una urna vacía', '<b>Museos abandonados con las vitrinas vacías.</b> En MUFU, la ausencia se vuelve permanente: una pared separa a los visitantes de los objetos.');
paragraph('Por eso la pieza permanente no es una vitrina', 'En los dos futuros alguien conserva la llave. MUFU propone renunciar al acceso hasta el 5 de septiembre de 2047 a las 07:56. La obra permanente es un vacío emparedado bajo la escalera y una placa prevista con coordenadas y fecha. El pacto está escrito; la sucesión de responsables y el protocolo de apertura todavía requieren documentación.');
paragraph('Abrir la cápsula será calificar el pronóstico', 'En 2047 podrán ponerse en relación los escenarios escritos para 2046 y el mundo de ese nuevo presente. La apertura permitirá documentar lo que cambió, lo que resistió y lo que no se había imaginado: el ejercicio retrospectivo de 2005, esta vez recorrido hacia adelante.');
paragraph('La última noche la obra cambió de estado', 'El relato de la última noche describe una transformación de la aparición en ausencia. Una versión anterior hablaba de una urna vacía, una lámpara y un punto del piso; la ubicación permanente confirmada es el vacío emparedado bajo la escalera. Se conserva esa versión en el archivo histórico, sin presentarla como un plano de lo construido. La placa de latón seguía pendiente en el último registro.');
paragraph('Antes de entrar, el público ya tocó', 'Sala a oscuras, un vidrio inclinado y la imagen de un objeto sin peso. El video conservado contiene doce apariciones, una por estudiante; no representa la totalidad de los 53 objetos. El relato del proyecto describe que el público pudo tocar objetos antes de ver su aparición.');
paragraph('Doce objetos, uno por persona, de los que entraron', 'Doce objetos, uno por persona, aparecen en el video conservado. Es una selección de la colección, no su inventario completo. El video registra las imágenes para el dispositivo; no muestra por sí solo toda la función en sala.');
$('.placa-grande em').text('Detrás de esta pared, 53 objetos dejaron de servir y empezaron a significar. 51 fueron registrados. Dos entraron como bonus sin ficha.');
$('.estado dt').filter((_,el)=>text($,el)==='Contenido').next('dd').text('51 registrados + 2 bonus · 53 objetos');
$('h4').filter((_,el)=>text($,el)==='Estado de la colección').next().text('Cerrada según el registro de 2026. 53 objetos tras la pared; originales no accesibles.');
$('h3').filter((_,el)=>text($,el)==='Texto grabado en la placa').text('Texto previsto para la placa');
$('p').filter((_,el)=>text($,el)==='Estado I · hoy, 4 de septiembre').text('Estado I · 4 de septiembre de 2026');
$('meta[property="og:description"], meta[name="twitter:description"]').attr('content','53 objetos tras una pared: 51 registrados y dos bonus. Diez semanas, dos futuros y una cita el 5 de septiembre de 2047.');
$('.escena svg').attr('aria-label','Diagrama conceptual, sin escala, de una escalera y el vacío emparedado debajo. La placa permanece pendiente según el registro de 2026.');
$('.escena').append('<p class="diagram-note">Sección conceptual · sin escala · placa pendiente según registro de 2026</p>');
$('.bar nav').html('<a href="atlas.html">Atlas</a><a href="#recorrido">El trimestre</a><a href="coleccion.html">53 objetos</a><a href="#obra">Última función</a><a href="archivo.html">Archivo</a><a href="#visita">Visita</a>');
$('.hero .eyebrow').html('Isthmus · Panamá <span class="num">· Cohorte 2026</span>');
$('.hero h1').html('MUFU<span class="l2">Museo del Futuro</span>');
$('.hero .tesis').first().before('<p class="hero-question">¿Qué es un museo?</p>');
$('.hero .entrar').attr('href','atlas.html').html('Entrar al atlas <span aria-hidden="true">↗</span>');
$('.hero .entrar').after('<a class="hero-read" href="#recorrido">Leer el relato del trimestre ↓</a>');
$('#cuenta').before('<!-- MUFU:HOME-ATLAS -->');
$('#coleccion .grid').before('<p class="archive-link"><a href="coleccion.html">Ver fotografías, buscar y cruzar los 53 objetos ↗</a></p>');
$('head').append('<link rel="stylesheet" href="assets/archive.css">');
// The new clock uses UTC-5 calendar boundaries and never infers a physical opening.
$('script:not([type])').each((_,el)=>{
  let js=$(el).html();
  const start=js.indexOf('      /* ---------- la cuenta ---------- */');
  const end=js.indexOf('      /* ---------- el mapa ---------- */');
  if(start>=0&&end>start) js=js.slice(0,start)+js.slice(end);
  js=js.replace(/cuatro piezas por persona dentro de las cajas/g,'51 registros + 2 bonus = 53 objetos');
  js=js.replace(/cuántas enterró/g,'cuántos registros publicó').replace(/nombre de quien la enterró/g,'nombre del autor');
  $(el).html(js);
});
$('body').append('<script type="module" src="assets/clock.js"></script>');
fs.writeFileSync('index.html',$.html());

const nf=load(original('404.html'));
nf('p').filter((_,el)=>text(nf,el).includes('treinta y seis objetos')).text('Los 53 objetos de MUFU están emparedados bajo la escalera del edificio 106. Su cita de apertura es en 2047. El archivo digital sí permanece abierto.');
nf('head').append('<link rel="stylesheet" href="assets/archive.css">');
fs.writeFileSync('404.html',nf.html());
console.log(`Migrated ${records.length} records; ${manifest.length} original files preserved.`);
