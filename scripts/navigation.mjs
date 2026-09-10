export const destinations=[
  ['index.html','El trimestre'],
  ['atlas.html','Atlas'],
  ['coleccion.html','53 objetos'],
  ['infografias.html','Infografías'],
  ['archivo.html','Archivo'],
  ['index.html#visita','Visita'],
];

export function activeDestination(page){
  if(/^ficha(?:-\d+)?\.html$/.test(page))return 'coleccion.html';
  if(page==='infografia.html')return 'infografias.html';
  return page;
}

export function siteHeader(page,icon){
  const active=activeDestination(page);
  return `<header class="site-header museum-header"${page==='index.html'?' id="bar"':''}><a class="site-brand" href="index.html">MU<span>FU</span><small>Museo del Futuro</small></a><nav aria-label="Principal">${destinations.map(([href,label])=>`<a href="${href}"${href===active?' aria-current="page"':''}>${label}</a>`).join('')}</nav><a class="site-date" href="index.html#cuenta">${icon('calendar-clock')}<span>05.09.2047 <b>07:56 · Panamá</b></span></a></header>`;
}
