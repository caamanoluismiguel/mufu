import {modules,threads} from '../data/editorial.mjs';
import {contributors,learningConnections,sharedTrimester} from '../data/learning.mjs';

export const contributorName=person=>person.id==='cohorte'?'Los 12 estudiantes':modules.find(m=>m.id===person.modules[0]).teacher;
const original=id=>`index.html#modulo-original-${id}`;
const moduleLinks=ids=>ids.map(id=>{const m=modules.find(m=>m.id===id);return `<a href="${original(id)}">${m.title}</a>`;}).join('');

export function learningWeave(icon,{compact=false,includeConnections=!compact}={}){
  return `<section class="learning-weave${compact?' weave-compact':''}" id="trimestre-compartido" aria-labelledby="weave-title">
    <div class="content-wide">
      <div class="weave-intro"><div><p class="section-label">MUFU / El trimestre compartido</p><h2 id="weave-title">${sharedTrimester.title}</h2></div><div class="weave-purpose"><p>${sharedTrimester.statement}</p><p>${sharedTrimester.focus}</p></div></div>
      <div class="weave-hub">${icon('landmark')}<div><h3>El museo</h3><p>Tema común · autoría colectiva · diez semanas</p></div><a class="text-link" href="index.html#recorrido">El relato completo ${icon('arrow-up-right')}</a></div>
      ${compact?'':`<div class="weave-controls" data-weave-controls hidden role="group" aria-label="Cruces del trimestre"><button type="button" data-weave-filter="all" aria-pressed="true">Todos</button>${threads.map(t=>`<button type="button" data-weave-filter="${t.id}" aria-pressed="false"><i style="--thread:${t.color}" aria-hidden="true"></i>${t.name}</button>`).join('')}</div>`}
      <ul class="weave-contributors">${contributors.map(person=>{
        const themes=threads.filter(t=>person.id==='cohorte'||person.modules.some(id=>modules.find(m=>m.id===id).threads.includes(t.id)));
        return `<li data-contributor="${person.id}" data-weave-themes="${themes.map(t=>t.id).join(' ')}"><div class="weave-person"><h3>${person.area}</h3><p>${contributorName(person)}</p></div><div class="weave-contribution"><p>${person.text}</p><nav aria-label="Aportes de ${contributorName(person)}">${moduleLinks(person.modules)}</nav></div><ul class="weave-themes" aria-label="Hilos compartidos">${themes.map(t=>`<li><a href="atlas.html?hilo=${t.id}#conexiones"><i style="--thread:${t.color}" aria-hidden="true"></i>${t.name}</a></li>`).join('')}</ul></li>`;
      }).join('')}</ul>
      ${!includeConnections?`<a class="text-link" href="atlas.html#cruces-clases">Los nueve cruces entre las clases ${icon('arrow-up-right')}</a>`:`<div class="weave-crossings" id="cruces-clases"><h3>Lo que pasa de una clase a otra</h3><p class="source-note" data-weave-count aria-live="polite">9 conexiones pedagógicas</p><ol>${learningConnections.map(c=>`<li data-learning-connection="${c.id}" data-weave-themes="${c.threads.join(' ')}"><h4>${c.title}</h4><p>${c.text}</p><nav aria-label="Relatos de origen: ${c.title}">${moduleLinks(c.modules)}</nav></li>`).join('')}</ol></div>`}
      <p class="source-note">${sharedTrimester.note} <a href="archivo.html#autoria">Procedencia de esta lectura</a>.</p>
    </div>
  </section>`;
}
