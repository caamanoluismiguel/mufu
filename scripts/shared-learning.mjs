import {learningWeave,contributorName} from './learning-weave.mjs';
import {contributors,sharedTrimester} from '../data/learning.mjs';

export function applySharedLearning($,page,icon){
  $('.shared-intro,#trimestre-compartido,#autoria,.shared-context,[data-shared-link]').remove();
  if(page==='index.html'){
    $('.suelo').after(`<section class="shared-intro"><div class="wrap"><div><p class="section-label">Isthmus / Un trimestre compartido</p><h2>${sharedTrimester.title}</h2></div><div><p>${sharedTrimester.statement}</p><p class="shared-people">${contributors.map(contributorName).join(' · ')}</p><a class="text-link" href="atlas.html#trimestre-compartido">Las clases y sus conexiones ${icon('arrow-up-right')}</a></div></div></section>`);
  }
  if(page==='atlas.html'){
    $('.atlas-intro .chapter-nav').prepend('<a data-shared-link href="#trimestre-compartido">El trimestre compartido</a>');
    $('.atlas-intro').after(learningWeave(icon));
  }
  if(page==='infografias.html'){
    $('.visuals-intro .chapter-nav').append('<a data-shared-link href="#trimestre-compartido">Las clases conectadas</a>');
    $('.visuals-ending').before(learningWeave(icon,{compact:true}));
  }
  if(page==='infografia.html'){
    $('.infographic-numbers').after(learningWeave(icon,{compact:true,includeConnections:true}));
  }
  if(page==='archivo.html'){
    $('.archive-intro .chapter-nav').append('<a data-shared-link href="#autoria">Autoría colectiva</a>');
    $('#metodo').before(`<section class="content-wide method-section" id="autoria"><div class="section-head"><p class="section-label">Procedencia / El trimestre compartido</p><h2>${sharedTrimester.title}</h2><p>${sharedTrimester.statement}</p></div><blockquote class="source-statement">${sharedTrimester.confirmation}</blockquote><p>${sharedTrimester.note}</p><p><a class="text-link" href="atlas.html#trimestre-compartido">Ver las clases y sus conexiones ${icon('arrow-up-right')}</a></p><p class="source-note">Las dos láminas de imagen se conservan como fueron creadas; sus rótulos no enumeran todas las contribuciones docentes. La lectura de autoría colectiva se incorpora aquí, en el atlas y en la versión web de la infografía.</p></section>`);
  }
}
