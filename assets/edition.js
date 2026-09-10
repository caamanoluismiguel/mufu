const $=selector=>document.querySelector(selector);
const index=$('#museum-index');
const viewer=$('#image-viewer');
let returnFocus=null;
function open(dialog,trigger){returnFocus=trigger;dialog.showModal();document.body.classList.add('dialog-open');}
function close(dialog){dialog.close();}
for(const dialog of [index,viewer]){
  if(!dialog)continue;
  dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');returnFocus?.focus({preventScroll:true});});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close(dialog);}});
}
$('.index-toggle')?.addEventListener('click',event=>open(index,event.currentTarget));
$('[data-close-index]')?.addEventListener('click',()=>close(index));
index?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>close(index)));

if(document.body.dataset.surface==='home'){
  const updateNavigation=()=>{
    const active=location.hash==='#visita'?'index.html#visita':'index.html';
    document.querySelectorAll('.museum-header nav a,#museum-index nav a').forEach(link=>{
      if(link.getAttribute('href')===active)link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
  };
  addEventListener('hashchange',updateNavigation);updateNavigation();
}

let scale=1;
let baseWidth=0;
const viewport=$('.viewer-scroll'),canvas=$('.viewer-canvas'),image=$('#viewer-image');
function zoom(value){
  scale=Math.min(4,Math.max(1,value));
  image.style.width=`${baseWidth*scale}px`;
  $('#viewer-scale').textContent=`${Math.round(scale*100)} %`;
  $('[data-zoom="out"]').disabled=scale===1;
  $('[data-zoom="in"]').disabled=scale===4;
  canvas.classList.toggle('is-zoomed',scale>1);
}
function fit(){
  baseWidth=Math.max(1,Math.min(viewport.clientWidth-40,(viewport.clientHeight-40)*image.naturalWidth/image.naturalHeight,image.naturalWidth));
  zoom(1);viewport.scrollTo(0,0);
}
document.addEventListener('click',event=>{
  const link=event.target.closest('[data-enlarge]');
  if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const preview=link.querySelector('img');if(!preview)return;
  event.preventDefault();
  $('#viewer-title').textContent=preview.closest('.pieza-l')?.querySelector('h2')?.textContent||preview.closest('figure')?.querySelector('figcaption')?.textContent||preview.alt;
  image.alt=preview.alt;image.onload=fit;image.src=link.href;
  $('#viewer-download').href=link.href;
  open(viewer,link);if(image.complete&&image.naturalWidth)fit();
});
$('[data-close-viewer]')?.addEventListener('click',()=>close(viewer));
document.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>button.dataset.zoom==='fit'?fit():zoom(scale+(button.dataset.zoom==='in'?.5:-.5))));
image?.addEventListener('dblclick',()=>scale>1?fit():zoom(2));
let drag=null;
viewport?.addEventListener('pointerdown',event=>{
  if(scale===1||event.pointerType!=='mouse'||event.button!==0)return;
  event.preventDefault();drag={x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};viewport.setPointerCapture(event.pointerId);
});
viewport?.addEventListener('pointermove',event=>{if(drag){viewport.scrollLeft=drag.left+drag.x-event.clientX;viewport.scrollTop=drag.top+drag.y-event.clientY;}});
viewport?.addEventListener('pointerup',()=>{drag=null;});
viewport?.addEventListener('pointercancel',()=>{drag=null;});
addEventListener('resize',()=>{if(viewer?.open&&image.naturalWidth)fit();});

let scheduled=false;
function progress(){
  const total=document.documentElement.scrollHeight-innerHeight;
  $('.reading-progress')?.style.setProperty('transform',`scaleX(${total>0?Math.min(1,scrollY/total):0})`);
  scheduled=false;
}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(progress);}},{passive:true});progress();
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.animate([{transform:'translateY(18px)',opacity:.65},{transform:'translateY(0)',opacity:1}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'});observer.unobserve(entry.target);}
  }),{threshold:.12});
  document.querySelectorAll('.section-head,.visual-portals,.learning-route>li,.mom,.object-story-grid,.count-ledger').forEach(el=>observer.observe(el));
}
