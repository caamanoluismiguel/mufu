import facts from './facts.js';
const opening = new Date(facts.opening);
const set = (id,value) => { const el=document.getElementById(id); if(el) el.textContent=value; };
export function remaining(now) {
  if(now>=opening) return {years:0,days:0,hours:0,minutes:0,seconds:0,due:true};
  const local=new Date(now.getTime()-5*3600000);
  const anniversary=year=>Date.UTC(year,opening.getUTCMonth(),opening.getUTCDate(),opening.getUTCHours(),opening.getUTCMinutes());
  let next=anniversary(local.getUTCFullYear());
  if(next<now.getTime()) next=anniversary(local.getUTCFullYear()+1);
  let rest=next-now.getTime();
  const years=opening.getUTCFullYear()-new Date(next).getUTCFullYear();
  const days=Math.floor(rest/86400000);rest%=86400000;
  const hours=Math.floor(rest/3600000);rest%=3600000;
  const minutes=Math.floor(rest/60000);rest%=60000;
  return {years,days,hours,minutes,seconds:Math.floor(rest/1000),due:false};
}
function tick(){
  const now=new Date(), r=remaining(now), pad=n=>String(n).padStart(2,'0');
  set('b-a',r.years);set('b-d',r.days);set('b-h',pad(r.hours));set('b-m',pad(r.minutes));set('b-s',pad(r.seconds));
  set('mini',r.due?'fecha cumplida':`${r.years} años ${r.days} días`);
  set('estado-lab',r.due?'Fecha cumplida':'Cerrada');
  set('cuenta-lab',r.due?'La fecha de apertura ha llegado; falta documentar la apertura física':'La colección está cerrada');
  set('linea-desde','Cierre registrado · 04.09.2026');
  // Progress uses Panama calendar days because the hour of closure is unknown.
  const day=86400000, panamaDay=date=>Math.floor((date.getTime()-5*3600000)/day);
  const start=panamaDay(new Date(`${facts.closureDate}T00:00:00-05:00`));
  const pct=Math.max(0,Math.min(100,(panamaDay(now)-start)/(panamaDay(opening)-start)*100));
  set('linea-p',`${pct.toFixed(2)} % de la espera · aproximado`);
  const bar=document.getElementById('linea-f');if(bar)bar.style.width=`${pct}%`;
}
if(typeof document!=='undefined'){tick();setInterval(()=>{if(!document.hidden)tick();},1000);}
