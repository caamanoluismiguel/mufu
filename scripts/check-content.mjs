import fs from 'node:fs';
import {load} from 'cheerio';
import assert from 'node:assert/strict';

const normalize=text=>text.replace(/\s+/g,' ').trim();
const snapshot='tests/fixtures/written-content.json';
if(process.argv.includes('--record')){
  const files=fs.readdirSync('.').filter(name=>name.endsWith('.html'));
  const pages=Object.fromEntries(files.map(file=>{
    const $=load(fs.readFileSync(file,'utf8'));
    const blocks=$('h1,h2,h3,h4,h5,h6,p,li,dt,dd,summary,figcaption,caption,blockquote').map((_,el)=>normalize($(el).text())).get().filter(Boolean);
    return [file,[...new Set(blocks)]];
  }));
  fs.mkdirSync('tests/fixtures',{recursive:true});
  fs.writeFileSync(snapshot,JSON.stringify(pages,null,2)+'\n');
}
const pages=JSON.parse(fs.readFileSync(snapshot,'utf8'));
let count=0;
for(const [file,blocks] of Object.entries(pages)){
  const $=load(fs.readFileSync(file,'utf8'));
  $('script,style').remove();
  const current=normalize($('body').text());
  for(const block of blocks){assert.ok(current.includes(block),`${file}: missing written content: ${block.slice(0,130)}`);count++;}
}
console.log(`Preserved ${count} written passages across ${Object.keys(pages).length} pages.`);
