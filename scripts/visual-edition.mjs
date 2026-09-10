import {destinations,activeDestination,siteHeader} from './navigation.mjs';

export function visualEdition($,page,icon){
  $('link[href="assets/edition.css"],script[src="assets/edition.js"],#museum-index,#image-viewer,.index-toggle,.reading-progress,#home-visuals,.edition-utility').remove();
  $('head').append('<link rel="stylesheet" href="assets/edition.css">');
  $('link[href="assets/typography.css"],link[href="assets/learning.css"],script[src="assets/learning.js"]').remove();
  if($('.learning-weave,.shared-intro').length)$('head').append('<link rel="stylesheet" href="assets/learning.css">');
  $('head').append('<link rel="stylesheet" href="assets/typography.css">');
  if($('[data-weave-controls]').length)$('body').append('<script type="module" src="assets/learning.js"></script>');
  if(page==='404.html'&&!$('base').length)$('head').prepend('<base href="/">');
  $('body').addClass('mufu-edition').attr('data-surface',page==='index.html'?'home':/^ficha(?:-\d+)?\.html$/.test(page)?'record':'archive');
  const links=destinations.map(([href,label],i)=>[href,label,String(i+1).padStart(2,'0')]);
  const active=activeDestination(page);
  const previous=$('body>.site-header,body>.bar,body>.top').first();
  if(previous.length)previous.replaceWith(siteHeader(page,icon));
  else $('body').prepend(siteHeader(page,icon));
  const toggle=`<button class="index-toggle" type="button" aria-label="Abrir índice del museo" title="Índice del museo" aria-haspopup="dialog" aria-controls="museum-index">${icon('menu')}</button>`;
  const header=$('.museum-header');
  header.append(toggle);
  $('body').append(`<div class="reading-progress" aria-hidden="true"></div><dialog id="museum-index" class="museum-index" aria-labelledby="index-title"><div class="index-head"><span id="index-title">MUFU · Museo del Futuro</span><button type="button" class="edition-icon" data-close-index aria-label="Cerrar índice" title="Cerrar índice">${icon('x')}</button></div><div class="index-layout"><nav aria-label="Índice del museo">${links.map(([href,label,n])=>`<a href="${href}" ${page===href?'aria-current="page"':''}><span>${n}</span><b>${label}</b>${icon('arrow-up-right')}</a>`).join('')}</nav><div class="index-image"><img src="medios/mufuhero.png" alt="" width="1672" height="940" loading="lazy"><p>Isthmus · Panamá · Cohorte 2026</p><a href="index.html#cuenta">05.09.2047 · 07:56 ${icon('arrow-up-right')}</a></div></div></dialog><dialog id="image-viewer" class="image-viewer" aria-labelledby="viewer-title"><div class="viewer-toolbar"><p id="viewer-title"></p><div><button type="button" class="edition-icon" data-zoom="out" aria-label="Alejar imagen" title="Alejar">${icon('minus')}</button><output id="viewer-scale" aria-live="polite">100 %</output><button type="button" class="edition-icon" data-zoom="in" aria-label="Acercar imagen" title="Acercar">${icon('plus')}</button><button type="button" class="edition-icon" data-zoom="fit" aria-label="Ajustar imagen" title="Ajustar imagen">${icon('scan')}</button><a class="edition-icon" id="viewer-download" download aria-label="Descargar imagen" title="Descargar imagen">${icon('download')}</a><button type="button" class="edition-icon" data-close-viewer aria-label="Cerrar imagen" title="Cerrar imagen">${icon('x')}</button></div></div><div class="viewer-scroll" tabindex="0" role="region" aria-label="Imagen ampliada"><div class="viewer-canvas"><img id="viewer-image" alt=""></div></div></dialog><script type="module" src="assets/edition.js"></script>`);
  $('#viewer-image').attr({src:'medios/mufuhero.png',loading:'lazy'});
  $('#museum-index nav a').removeAttr('aria-current').filter((_,el)=>$(el).attr('href')===active).attr('aria-current','page');
  $('.pieza-l .vitrina--foto').each((_,el)=>{
    const photo=$(el),src=photo.find('img').attr('src');
    if(src&&!photo.parent().is('[data-enlarge]'))photo.wrap($('<a class="record-enlarge" data-enlarge></a>').attr('href',src));
  });
  $('.visual-poster figure a,.poster-grid figure a,.pieza-l__foto a').attr('data-enlarge','');
  if(page==='index.html'){
    $('.hero-overlay').each((_,el)=>{
      const overlay=$(el);
      overlay.find('.entrar,.hero-read').wrapAll('<div class="hero-actions"></div>');
    });
    $('.hero-caption').append(`<a class="hero-next" href="#home-atlas" aria-label="Continuar el recorrido" title="Continuar el recorrido">${icon('arrow-down')}</a>`);
    $('#home-atlas').after(`<section id="home-visuals" class="home-visuals"><div class="wrap"><div class="section-head"><p class="section-label">Infografías visuales</p><h2>Ver el museo.<br><em>De un vistazo.</em></h2><p>Dos láminas para mirar, compartir o guardar: el recorrido de diez semanas y el mapa que une memoria, representación, poder y tiempo.</p></div><div class="visual-portals"><a href="infografias.html#trimestre"><div><span>01 / El trimestre</span><h3>Diez semanas para construir un museo.</h3>${icon('arrow-up-right')}</div><img src="medios/infografia-trimestre-borrador.png" alt="Infografía del trimestre MUFU" width="1122" height="1402" loading="lazy"></a><a href="infografias.html#conexiones"><div><span>02 / El hilo</span><h3>El hilo que une todo.</h3>${icon('arrow-up-right')}</div><img src="medios/infografia-conexiones-borrador.png" alt="Mapa de conexiones MUFU" width="1122" height="1402" loading="lazy"></a></div></div></section>`);
  }
}
