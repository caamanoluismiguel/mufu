import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import {facts,nodes,edges,modules,sources,threads} from '../data/editorial.mjs';
import {remaining} from '../assets/clock.js';
const registry=JSON.parse(fs.readFileSync('data/registry.json'));
const text=($,el)=>$(el).text().replace(/\s+/g,' ').trim();
const old=file=>load(execFileSync('git',['show',`${facts.originalCommit}:${file}`],{encoding:'utf8'}));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

test('51 records, two explicitly unknown bonus entries, 12 authors',()=>{
  assert.equal(registry.records.length,51);assert.equal(registry.bonus.length,2);assert.equal(registry.people.length,12);
  assert.equal(new Set([...registry.records,...registry.bonus].map(r=>r.id)).size,53);
  for(const b of registry.bonus){assert.equal(b.status,'Sin registro');assert.equal(b.image,undefined);assert.equal(b.person,undefined);}
});
test('every original title, description, declared field and photograph is preserved',()=>{
  for(const p of registry.people){
    const $=old(p.url),now=load(fs.readFileSync(p.url,'utf8'));
    $('.pieza-l').each((_,el)=>{
      const anchor=$(el).attr('id'),r=registry.records.find(r=>r.source===`${p.url}#${anchor}`);
      assert.ok(r,`${p.url}#${anchor}`);
      assert.equal(r.title,text($,$(el).find('h2')));assert.equal(r.description,text($,$(el).find('.pieza-l__d')));
      assert.equal(r.title,text(now,now(`#${anchor} h2`)));assert.equal(r.description,text(now,now(`#${anchor} .pieza-l__d`)));
      const fields={};$(el).find('dt').each((_,dt)=>{fields[text($,dt)]=text($,$(dt).next('dd'));});
      assert.deepEqual(r.fields,fields);
      now(`#${anchor} dt`).each((_,dt)=>assert.equal(text(now,now(dt).next('dd')),fields[text(now,dt)]));
      const bytes=execFileSync('git',['show',`${facts.originalCommit}:${r.image.src}`]);
      assert.equal(hash(fs.readFileSync(r.image.src)),hash(bytes));
      assert.equal(r.box,null);assert.equal(r.curationCategory,null);
    });
  }
});
test('entire original snapshot matches its SHA-256 manifest',()=>{
  const manifest=JSON.parse(fs.readFileSync('archive/original-manifest.json'));
  assert.equal(manifest.commit,facts.originalCommit);
  for(const file of manifest.files){
    const bytes=execFileSync('unzip',['-p','archive/mufu-2026-original.zip',file.path],{maxBuffer:30*1024*1024});
    assert.equal(hash(bytes),file.sha256,file.path);
  }
});
test('all published local links, fragments, images and scripts resolve; no duplicate ids',()=>{
  const pages=['index.html','atlas.html','infografias.html','coleccion.html','archivo.html','infografia.html','404.html',...registry.people.map(p=>p.url)];
  const documents=new Map(pages.map(p=>[p,load(fs.readFileSync(p,'utf8'))]));
  for(const [page,$] of documents){
    const ids=$('[id]').map((_,el)=>$(el).attr('id')).get();assert.equal(ids.length,new Set(ids).size,`${page}: duplicate ids`);
    $('[href],[src],[poster]').each((_,el)=>{
      for(const attr of ['href','src','poster']){
        const value=$(el).attr(attr);if(!value||/^(https?:|mailto:|tel:|data:)/.test(value))continue;
        const url=new URL(value,`https://mufu.today/${page}`),file=decodeURIComponent(url.pathname.slice(1))||'index.html';
        assert.ok(fs.existsSync(file),`${page}: missing ${file}`);
        if(url.hash&&file.endsWith('.html')){
          const target=documents.get(file)||load(fs.readFileSync(file,'utf8'));
          assert.ok(target('[id]').toArray().some(el=>target(el).attr('id')===decodeURIComponent(url.hash.slice(1))),`${page}: missing ${file}${url.hash}`);
        }
      }
    });
  }
});
test('graph and eight-module routes have valid endpoints and references',()=>{
  assert.equal(modules.length,8);assert.equal(edges.length,21);
  const $=load(fs.readFileSync('index.html','utf8'));
  for(const m of modules)assert.equal($(`#modulo-original-${m.id}`).length,1);
  for(const [a,b,t] of edges){assert.ok(nodes.some(n=>n.id===a&&n.threads.includes(t)));assert.ok(nodes.some(n=>n.id===b&&n.threads.includes(t)));assert.ok(threads.some(n=>n.id===t));}
  for(const n of nodes)for(const s of n.sources)assert.ok(sources.some(x=>x.id===s));
});
test('all twenty pages share the same primary navigation and expanded index',()=>{
  const destinations=[
    ['index.html','El trimestre'],['atlas.html','Atlas'],['coleccion.html','53 objetos'],
    ['infografias.html','Infografías'],['archivo.html','Archivo'],['index.html#visita','Visita'],
  ];
  const pages=fs.readdirSync('.').filter(file=>file.endsWith('.html'));
  assert.equal(pages.length,20);
  for(const page of pages){
    const $=load(fs.readFileSync(page,'utf8'));
    assert.equal($('.museum-header').length,1,page);
    assert.equal($('.museum-header .index-toggle').length,1,page);
    assert.equal($('.bar,.top,.edition-utility,#barra').length,0,page);
    const menu=$('.museum-header nav a').toArray().map(el=>[$(el).attr('href'),text($,el)]);
    const index=$('#museum-index nav a').toArray().map(el=>[$(el).attr('href'),text($,$(el).find('b'))]);
    assert.deepEqual(menu,destinations,page);
    assert.deepEqual(index,destinations,page);
    const active=page.startsWith('ficha')?'coleccion.html':page==='infografia.html'?'infografias.html':page;
    const expected=page==='404.html'?[]:[active];
    for(const selector of ['.museum-header nav','#museum-index nav']){
      assert.deepEqual($(`${selector} a[aria-current="page"]`).map((_,el)=>$(el).attr('href')).get(),expected,page);
    }
  }
});
test('clock is correct at anniversaries, leap day, second before, and after opening',()=>{
  assert.deepEqual(remaining(new Date('2026-09-05T07:56:00-05:00')),{years:21,days:0,hours:0,minutes:0,seconds:0,due:false});
  assert.deepEqual(remaining(new Date('2047-09-05T12:55:59Z')),{years:0,days:0,hours:0,minutes:0,seconds:1,due:false});
  assert.equal(remaining(new Date(facts.opening)).due,true);
  assert.equal(remaining(new Date('2048-02-29T12:00:00Z')).due,true);
  assert.equal(remaining(new Date('2028-02-29T12:56:00Z')).days,189);
  for(const tz of ['America/Panama','Pacific/Auckland','America/Los_Angeles']){
    const output=execFileSync(process.execPath,['--input-type=module','-e',`import {remaining} from './assets/clock.js'; console.log(JSON.stringify(remaining(new Date('2047-09-05T12:55:59Z'))));`],{env:{...process.env,TZ:tz},encoding:'utf8'});
    assert.equal(JSON.parse(output).seconds,1);
  }
});
test('generated outputs are deterministic and match canonical data',()=>{
  const files=['index.html','atlas.html','infografias.html','coleccion.html','archivo.html','infografia.html','assets/data.js','assets/facts.js','data/collection.json','sitemap.xml','llms.txt'];
  const before=files.map(f=>hash(fs.readFileSync(f)));
  execFileSync(process.execPath,['scripts/build.mjs']);
  assert.deepEqual(files.map(f=>hash(fs.readFileSync(f))),before);
  const data=JSON.parse(fs.readFileSync('data/collection.json'));assert.deepEqual(data.records,registry.records);assert.deepEqual(data.facts,facts);
});
test('visual redesign preserves the written content of all twenty pages',()=>{
  execFileSync(process.execPath,['scripts/check-content.mjs']);
});
