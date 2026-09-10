const weave=document.querySelector('.learning-weave');
if(weave){
  const controls=weave.querySelector('[data-weave-controls]');
  if(controls){
    controls.hidden=false;
    controls.addEventListener('click',event=>{
      const button=event.target.closest('[data-weave-filter]');
      if(!button)return;
      const theme=button.dataset.weaveFilter;
      controls.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
      weave.querySelectorAll('[data-weave-themes]').forEach(el=>{
        el.hidden=theme!=='all'&&!el.dataset.weaveThemes.split(' ').includes(theme);
      });
      const count=weave.querySelectorAll('[data-learning-connection]:not([hidden])').length;
      weave.querySelector('[data-weave-count]').textContent=`${count} conexiones pedagógicas${theme==='all'?'':` · ${button.textContent.trim()}`}`;
    });
  }
}
