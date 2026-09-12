const video=document.getElementById('hero-film');
const button=document.getElementById('hero-play');
if(video&&button){
  const quieto=matchMedia('(prefers-reduced-motion: reduce)');
  let pausadoAMano=false;
  const sync=()=>{
    const activo=!video.paused;
    button.setAttribute('aria-pressed',String(activo));
    button.setAttribute('aria-label',activo?'Pausar el timelapse':'Reproducir el timelapse');
    button.title=button.getAttribute('aria-label');
  };
  const red=navigator.connection;
  // 780 KB no se le imponen a quien navega con ahorro de datos o fuera de 4G.
  // El póster pesa 30 KB y el botón sigue permitiendo verlo a quien quiera.
  const ahorrando=()=>!!(red&&(red.saveData||(red.effectiveType&&red.effectiveType!=='4g')));
  const intentar=()=>{ if(quieto.matches||pausadoAMano||ahorrando())return; video.play().catch(()=>{}); };
  button.addEventListener('click',async()=>{
    if(!video.paused){pausadoAMano=true;video.pause();return;}
    pausadoAMano=false;
    try{await video.play();}catch{button.title='No se pudo reproducir. La imagen fija sigue a la vista.';}
  });
  video.addEventListener('play',sync);
  video.addEventListener('pause',sync);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else intentar();});
  new IntersectionObserver(([e])=>{e.isIntersecting?intentar():video.pause();}).observe(video);
  quieto.addEventListener('change',e=>{if(e.matches)video.pause();else intentar();});
  sync();
}
