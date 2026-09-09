const video=document.getElementById('hero-film');
const button=document.getElementById('hero-play');
function sync(){
  const playing=!video.paused;
  button.setAttribute('aria-pressed',String(playing));
  button.setAttribute('aria-label',playing?'Pausar las apariciones':'Reproducir las apariciones');
  button.title=button.getAttribute('aria-label');
}
button.addEventListener('click',async()=>{
  if(!video.paused){video.pause();return;}
  try{await video.play();}catch{button.title='No se pudo reproducir. El registro completo sigue disponible abajo.';}
});
video.addEventListener('play',sync);video.addEventListener('pause',sync);
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)video.pause();}).observe(video);
