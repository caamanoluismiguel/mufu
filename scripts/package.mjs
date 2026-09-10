import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {facts} from '../data/editorial.mjs';

const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const rootFiles=fs.readdirSync('.').filter(f=>/\.(html|txt|svg|xml)$/.test(f)||['README.md','CNAME','package.json','package-lock.json'].includes(f));
const files=[...rootFiles,'playwright.config.js',...['assets','data','img','medios','scripts','tests'].flatMap(walk),'archive/mufu-2026-original.zip','archive/original-manifest.json','archive/condition-report-template.json','archive/implementation-plan.md'].sort();
const manifest=files.map(file=>{const data=fs.readFileSync(file);return {path:file,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')};});
fs.writeFileSync('archive/edition-manifest.json',JSON.stringify({edition:facts.revision,note:'Huellas de esta edición. No certifican la verdad del contenido.',files:manifest},null,2)+'\n');
// Stage a new zip so old entries cannot survive when a file is removed.
const temporary='archive/edition-building.zip';
if(fs.existsSync(temporary))fs.unlinkSync(temporary);
execFileSync('zip',['-q',temporary,...files,'archive/edition-manifest.json']);
fs.renameSync(temporary,'archive/mufu-2026-expanded.zip');
console.log(`Packaged ${files.length+1} files, ${(fs.statSync('archive/mufu-2026-expanded.zip').size/1048576).toFixed(1)} MiB.`);
