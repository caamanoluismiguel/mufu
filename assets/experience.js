import data from './data.js';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const normalize=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const findSource=id=>data.sources.find(s=>s.id===id);
const refs=ids=>`<div class="refs">${ids.map(id=>{const s=findSource(id);return `<a href="${s.url}">${escape(s.title)} ↗</a>`;}).join('')}</div>`;
document.querySelectorAll('[data-print]').forEach(b=>b.addEventListener('click',()=>window.print()));

if($('.network-board')){
  let activeNode='carrete', activeThread='all';
  const params=new URLSearchParams(location.search);
  if(data.threads.some(t=>t.id===params.get('hilo')))activeThread=params.get('hilo');
  const hash=location.hash.replace('#n-','');
  if(data.nodes.some(n=>n.id===hash))activeNode=hash;
  if(activeThread!=='all'&&!data.nodes.find(n=>n.id===activeNode).threads.includes(activeThread))activeNode=data.nodes.find(n=>n.threads.includes(activeThread)).id;
  const svg=$('.network-lines');
  function draw(){
    const board=$('.network-board').getBoundingClientRect();
    svg.setAttribute('viewBox',`0 0 ${board.width} ${board.height}`);
    svg.replaceChildren();
    data.edges.forEach(([a,b,t],i)=>{
      if(activeThread!=='all'&&t!==activeThread)return;
      const x=$(`[data-node="${a}"]`).getBoundingClientRect(),y=$(`[data-node="${b}"]`).getBoundingClientRect();
      const x1=x.left+x.width/2-board.left,y1=x.top+x.height/2-board.top,x2=y.left+y.width/2-board.left,y2=y.top+y.height/2-board.top;
      const path=document.createElementNS('http://www.w3.org/2000/svg','path');
      const bend=((i%3)-1)*20;
      path.setAttribute('d',`M${x1},${y1} C${x1+bend},${(y1+y2)/2} ${x2-bend},${(y1+y2)/2} ${x2},${y2}`);
      path.setAttribute('stroke',data.threads.find(k=>k.id===t).color);
      path.setAttribute('class',a===activeNode||b===activeNode?'active-path':'unrelated-path');
      svg.append(path);
    });
  }
  function update(){
    const n=data.nodes.find(n=>n.id===activeNode);
    $$('[data-thread]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.thread===activeThread)));
    $$('[data-node]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.node===activeNode));b.classList.toggle('not-in-thread',activeThread!=='all'&&!data.nodes.find(n=>n.id===b.dataset.node).threads.includes(activeThread));});
    $('#node-title').textContent=n.title;$('#node-date').textContent=n.date;$('#node-text').textContent=n.text;$('#node-refs').innerHTML=refs(n.sources);
    const links=data.edges.filter(([a,b,t])=>(a===activeNode||b===activeNode)&&(activeThread==='all'||t===activeThread));
    $('#node-links').innerHTML=links.map(([a,b,t,why])=>{const other=data.nodes.find(n=>n.id===(a===activeNode?b:a));return `<li><button type="button" data-go-node="${other.id}">${escape(other.title)} ↗</button><p>${escape(why)}</p></li>`;}).join('');
    const t=data.threads.find(t=>t.id===activeThread);
    $('#thread-description').textContent=t?`${t.question} ${t.detail}`:'Memoria, representación, poder y tiempo atraviesan el mismo objeto.';
    draw();
  }
  function select(id){
    activeNode=id;
    const params=new URLSearchParams(location.search);
    if(activeThread!=='all'&&!data.nodes.find(n=>n.id===id).threads.includes(activeThread)){activeThread='all';params.delete('hilo');}
    history.replaceState(null,'',`${location.pathname}${params.size?'?'+params:''}#n-${id}`);update();
  }
  $$('[data-node]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.node)));
  $('#node-links').addEventListener('click',e=>{const b=e.target.closest('[data-go-node]');if(b){select(b.dataset.goNode);$(`[data-node="${b.dataset.goNode}"]`).focus({preventScroll:true});}});
  $$('[data-thread]').forEach(b=>b.addEventListener('click',()=>{activeThread=b.dataset.thread;
    if(activeThread!=='all'&&!data.nodes.find(n=>n.id===activeNode).threads.includes(activeThread))activeNode=data.nodes.find(n=>n.threads.includes(activeThread)).id;
    const p=new URLSearchParams(location.search);if(activeThread==='all')p.delete('hilo');else p.set('hilo',activeThread);
    history.replaceState(null,'',`${location.pathname}${p.size?'?'+p:''}#n-${activeNode}`);update();
  }));
  new ResizeObserver(draw).observe($('.network-board'));
  document.fonts.ready.then(draw);update();
  addEventListener('hashchange',()=>{const id=location.hash.replace('#n-','');if(data.nodes.some(n=>n.id===id)){activeNode=id;update();}});
}

if($('#light')){
  $('#light').addEventListener('input',()=>{
    const value=Number($('#light').value);$('#light-image').style.opacity=value/100;$('#light-value').textContent=`${value} %`;
    $('#light-description').textContent=value===0?'La aparición desaparece. El objeto de origen permanece.':value<30?'La aparición apenas es visible.':'La aparición es visible.';
  });
}

if($('#collection-filters')){
  const form=$('#collection-filters'), params=new URLSearchParams(location.search);
  const search=$('#search'),person=$('#person'),status=$('#record-status');
  search.value=params.get('q')||'';person.value=params.get('persona')||'';status.value=params.get('estado')||'';
  const indexed=new Map(data.records.map(r=>[r.id,normalize([r.id,r.title,r.person,r.description,...Object.values(r.fields)].join(' '))]));
  data.bonus.forEach(b=>indexed.set(b.id,normalize(`${b.title} bonus sin registro ${b.id}`)));
  function filter(){
    const words=normalize(search.value).trim().split(/\s+/).filter(Boolean);let count=0,registered=0;
    $$('.object-card').forEach(card=>{
      const id=card.dataset.id,r=data.records.find(r=>r.id===id),isBonus=!r;
      const visible=words.every(w=>indexed.get(id).includes(w))&&(!person.value||r?.personId===person.value)&&(!status.value||(status.value==='bonus')===isBonus);
      card.hidden=!visible;if(visible){count++;if(!isBonus)registered++;}
    });
    $('#result-count').textContent=`${count} de ${data.facts.total} objetos · ${registered} con ficha${count-registered?` · ${count-registered} bonus`:''}`;
    $('#empty-results').hidden=count>0;
    const p=new URLSearchParams();if(search.value)p.set('q',search.value);if(person.value)p.set('persona',person.value);if(status.value)p.set('estado',status.value);
    history.replaceState(null,'',`${location.pathname}${p.size?'?'+p:''}${location.hash}`);
  }
  form.addEventListener('submit',e=>e.preventDefault());
  form.addEventListener('input',filter);form.addEventListener('change',filter);
  form.addEventListener('reset',()=>{search.value='';person.value='';status.value='';queueMicrotask(filter);});
  $$('[data-reset]').forEach(b=>b.addEventListener('click',()=>form.reset()));filter();
  const dialog=$('#record-dialog');let trigger=null;
  document.addEventListener('click',e=>{
    const button=e.target.closest('[data-inspect]');if(!button)return;
    const r=data.records.find(r=>r.id===button.dataset.inspect);if(!r)return;trigger=button;
    $('#dialog-content').innerHTML=`<div class="dialog-grid"><figure><img src="${r.image.src}" alt="${escape(r.title)} · fotografía de registro" width="${r.image.width}" height="${r.image.height}"><figcaption>${escape(r.image.caption)}</figcaption></figure><div><p class="section-label">${r.id} · ${escape(r.person)}</p><h2 id="dialog-title">${escape(r.title)}</h2><p>${escape(r.description)}</p><dl>${Object.entries(r.fields).map(([k,v])=>`<dt>${escape(k)}</dt><dd>${escape(v)}</dd>`).join('')}</dl><p class="record-unknown">Fuente: ficha de registro de 2026. Los campos se conservan tal como fueron declarados.<br>Caja y categoría de selección: no documentadas en el archivo público.</p><a class="text-link" href="${r.source}">Abrir ficha completa ↗</a> · <a href="archivo.html#metodo">Método</a></div></div>`;
    dialog.showModal();document.body.style.overflow='hidden';
  });
  $('.close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{document.body.style.overflow='';trigger?.focus({preventScroll:true});});
}

if($('#question-query')){
  $('.question-search').addEventListener('submit',e=>e.preventDefault());
  $('#question-query').addEventListener('input',()=>{
    const words=normalize($('#question-query').value).trim().split(/\s+/).filter(Boolean);let count=0;
    $$('[data-question]').forEach(el=>{const q=data.questions[Number(el.dataset.question)],text=normalize(`${q.q} ${q.answer} ${q.keywords}`);el.hidden=!words.every(w=>text.includes(w));if(!el.hidden)count++;});
    $('#question-count').textContent=`${count} respuesta${count===1?'':'s'} en el archivo`;$('#question-empty').hidden=count>0;
  });
}
