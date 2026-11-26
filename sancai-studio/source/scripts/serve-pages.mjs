import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('../dist/',import.meta.url))),prefix='/sancai-studio/';
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(url.pathname==='/sancai-studio'){res.writeHead(302,{Location:prefix});res.end();return;}if(!url.pathname.startsWith(prefix))throw Error();const relative=decodeURIComponent(url.pathname.slice(prefix.length))||'index.html';const target=path.resolve(root,relative);if(!target.startsWith(root+path.sep)&&target!==path.join(root,'index.html'))throw Error();const body=await readFile(target);res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'});res.end(body);}catch{res.writeHead(404);res.end('Not found');}}).listen(4175,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4175/sancai-studio/'));
