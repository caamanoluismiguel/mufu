import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const port=Number(process.env.PORT||4177);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.mp4':'video/mp4','.woff2':'font/woff2','.zip':'application/zip','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
  let file;
  try{file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));}catch{res.writeHead(400).end();return;}
  if((file!==root&&!file.startsWith(root+path.sep))||file.includes('/.git/')){res.writeHead(403).end();return;}
  if(file.endsWith(path.sep))file+='index.html';
  if(file===root)file=path.join(root,'index.html');
  try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
    const data=fs.readFileSync(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(data);
  }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'}).end(fs.readFileSync('404.html'));}
}).listen(port,'127.0.0.1',()=>console.log(`MUFU preview http://127.0.0.1:${port}`));
