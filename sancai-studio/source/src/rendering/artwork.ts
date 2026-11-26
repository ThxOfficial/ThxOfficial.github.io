import { detailPathsFor, getTemplate } from '../domain/templates';
import { GLAZE_HEX } from '../domain/palettes';
import type { ArtworkRenderResult, ArtworkStage, DesignSnapshot, FiringStyle, PatternSpec, SancaiProject, SancaiTemplate } from '../domain/types';
import { canvas, blobFromCanvas } from './common';
import { readArtifact, writeArtifact } from '../persistence/database';

function hash(x: number, y: number, seed: number) {
  let n = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(seed, 1274126177);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
function noise(x: number, y: number, seed: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  let fx = x - ix, fy = y - iy; fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy, seed) * (1 - fx) + hash(ix + 1, iy, seed) * fx;
  const b = hash(ix, iy + 1, seed) * (1 - fx) + hash(ix + 1, iy + 1, seed) * fx;
  return a * (1 - fy) + b * fy;
}

function yieldToBrowser():Promise<void>{
  // Message tasks let input/rendering run without relying on background-tab
  // timer scheduling for each high-resolution image chunk.
  return new Promise(resolve=>{const channel=new MessageChannel();channel.port1.onmessage=()=>{channel.port1.close();channel.port2.close();resolve();};channel.port2.postMessage(null);});
}

export type PatternPainter = Pick<CanvasRenderingContext2D,
  'save' | 'restore' | 'translate' | 'rotate' | 'beginPath' | 'closePath' |
  'moveTo' | 'lineTo' | 'bezierCurveTo' | 'fill' | 'stroke' |
  'fillStyle' | 'strokeStyle' | 'lineWidth' | 'lineCap'>;

export function drawPattern(ctx: PatternPainter, pattern: PatternSpec, coverage: boolean) {
  const size = Math.max(14, Math.min(180, pattern.size));
  const density = Math.max(.05, Math.min(1, pattern.density));
  const colors = pattern.colors.length ? pattern.colors : ['cream' as const];
  const color = (i: number) => coverage ? '#ffffff' : GLAZE_HEX[colors[i % colors.length]];
  ctx.save(); ctx.translate(512, 512); ctx.rotate(pattern.rotation * Math.PI / 180); ctx.translate(-512, -512);
  if (pattern.kind === 'dots') {
    const step = size * 2.1;
    for (let y = -512, row = 0; y < 1536; y += step, row++) for (let x = -512, col = 0; x < 1536; x += step, col++) {
      if (hash(col, row, pattern.seed) > density) continue;
      const px = x + (hash(col, row, pattern.seed + 5) - .5) * step * .75;
      const py = y + (hash(col, row, pattern.seed + 9) - .5) * step * .75;
      const r = size * (.26 + hash(col, row, pattern.seed + 11) * .3);
      ctx.fillStyle = color(Math.floor(hash(col, row, pattern.seed + 13) * colors.length));
      ctx.beginPath();
      for (let k = 0; k <= 10; k++) {
        const angle = k / 10 * Math.PI * 2, radius = r * (.82 + hash(col * 13 + k, row, pattern.seed + 17) * .25);
        const tx = px + Math.cos(angle) * radius, ty = py + Math.sin(angle) * radius * 1.13;
        if (k === 0) ctx.moveTo(tx, ty); else ctx.lineTo(tx, ty);
      }
      ctx.closePath(); ctx.fill();
    }
  } else if (pattern.kind === 'diamonds') {
    const step = size * 1.25;
    const min = Math.floor(-1024 / step), max = Math.ceil(3072 / step);
    for (let row = min; row < max; row++) for (let col = Math.floor(min / 2); col < Math.ceil(max / 2); col++) {
      const x = col * step + (row % 2) * step / 2, y = row * step / 2;
      ctx.fillStyle = color(Math.abs(col + row));
      const r = step * (.35 + density * .12);
      ctx.beginPath(); ctx.moveTo(x, y - r / 2); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r / 2); ctx.lineTo(x - r, y); ctx.closePath(); ctx.fill();
    }
  } else {
    const step = size * (2.7 - density);
    ctx.lineWidth = size * .45; ctx.lineCap = 'round';
    for (let x = -512, i = 0; x < 1536; x += step, i++) {
      ctx.strokeStyle = color(i); ctx.beginPath(); ctx.moveTo(x, -512);
      ctx.bezierCurveTo(x + size * .65, 100, x - size * .9, 650, x + size * .2, 1536); ctx.stroke();
    }
  }
  ctx.restore();
}

interface PaintLayers { paint: HTMLCanvasElement; coverage: HTMLCanvasElement; regions: HTMLCanvasElement }
function paintDesign(design: DesignSnapshot, template: SancaiTemplate, size: number, bisque: boolean): PaintLayers {
  const paint = canvas(size), coverage = canvas(size), regions = canvas(size);
  const p = paint.getContext('2d')!, g = coverage.getContext('2d')!, ids = regions.getContext('2d')!;
  const scale = size / 1024;
  for (const ctx of [p, g, ids]) { ctx.scale(scale, scale); ctx.clip(new Path2D(template.silhouette), template.silhouetteFillRule); }
  p.fillStyle = '#eee4cf'; p.fillRect(0, 0, 1024, 1024);
  const ordered = [...template.regions].sort((a, b) => a.zIndex - b.zIndex);
  ordered.forEach((region, index) => {
    const path = new Path2D(region.path), config = design.regions[region.id];
    const base = !bisque && region.allowGlaze && config && config.baseGlaze !== 'unglazed' ? GLAZE_HEX[config.baseGlaze] : '#eee4cf';
    const hasBase = !bisque && region.allowGlaze && config && config.baseGlaze !== 'unglazed';
    p.fillStyle = base; p.fill(path);
    ids.fillStyle = `rgb(${index + 1},0,0)`; ids.fill(path);
    g.fillStyle = '#000000'; g.fill(path); // Occluding parts also occlude glaze below.
    if (hasBase) { g.fillStyle = '#ffffff'; g.fill(path); }
    if (bisque || !region.allowGlaze) return;
    for (const ctx of [p, g]) {
      ctx.save(); ctx.clip(path);
      if (config?.pattern) drawPattern(ctx, config.pattern, ctx === g);
      for (const stroke of design.strokes) {
        if (stroke.regionId !== region.id || !stroke.points.length) continue;
        ctx.strokeStyle = ctx === g ? '#ffffff' : GLAZE_HEX[stroke.glaze];
        ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = stroke.radius * 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath();
        stroke.points.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
        if (stroke.points.length === 1) { ctx.arc(stroke.points[0][0], stroke.points[0][1], stroke.radius, 0, Math.PI * 2); ctx.fill(); }
        else ctx.stroke();
      }
      ctx.restore();
    }
  });
  return { paint, coverage, regions };
}

const cache = new Map<string, Promise<ArtworkRenderResult>>();
const cachePixels = new Map<string, number>();
export const artifactCacheActivity = { memoryHits: 0, diskHits: 0, computed: 0 };
const templateKeys=new WeakMap<SancaiTemplate,string>();
function keyFor(project: SancaiProject, size: number, stage: ArtworkStage, background: string) {
  const design=stage==='fired'?project.firing?.design:project.design;
  const template=design?getTemplate(design.templateId,design.templateVersion):undefined;
  if(template&&!templateKeys.has(template))templateKeys.set(template,JSON.stringify(template));
  const geometry=template?templateKeys.get(template):null;
  if (stage === 'fired') {
    const firing = project.firing;
    // queued → ready and title/product changes do not change any image inputs.
    return JSON.stringify([stage, size, background, firing?.design, firing?.style, firing?.seed, firing?.rendererVersion, project.rendererVersion,geometry]);
  }
  if (stage === 'bisque') return JSON.stringify([stage, size, background, project.design.templateId, project.design.templateVersion, project.design.seed, project.rendererVersion,geometry]);
  return JSON.stringify([stage, size, background, project.design, project.rendererVersion,geometry]);
}

function pathControlBounds(path: string) {
  // Shipped paths use absolute M/L/Q/C/Z commands. Including Bézier controls
  // gives a conservative region box and keeps lighting in template coordinates.
  const values = (path.match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi) || []).map(Number);
  let left = 1024, top = 1024, right = 0, bottom = 0;
  for (let i = 0; i + 1 < values.length; i += 2) { left = Math.min(left, values[i]); top = Math.min(top, values[i + 1]); right = Math.max(right, values[i]); bottom = Math.max(bottom, values[i + 1]); }
  return { left, top, width: Math.max(1, right - left), height: Math.max(1, bottom - top) };
}

async function render(project: SancaiProject, size: number, options: { stage: ArtworkStage; background: 'transparent' | 'paper' }): Promise<ArtworkRenderResult> {
  if (!Number.isInteger(size) || size < 64 || size > 4096) throw new Error('图片尺寸不受支持');
  const fired = options.stage === 'fired';
  if (project.rendererVersion !== '1') throw new Error('此作品使用了尚不支持的渲染版本');
  if (fired && (!project.firing || project.firing.rendererVersion !== '1')) throw new Error('请先完成烧制，再查看成品');
  const design = fired ? project.firing!.design : project.design;
  const template = getTemplate(design.templateId,design.templateVersion);
  if (template.version !== design.templateVersion) throw new Error('此作品的素坯版本暂不可用');
  const seed = fired ? project.firing!.seed : design.seed;
  const style: FiringStyle = fired ? project.firing!.style : 'defined';
  const layers = paintDesign(design, template, size, options.stage === 'bisque');
  const source = layers.paint.getContext('2d')!.getImageData(0, 0, size, size);
  const glaze = layers.coverage.getContext('2d')!.getImageData(0, 0, size, size).data;
  const regionIds = layers.regions.getContext('2d')!.getImageData(0, 0, size, size).data;
  for (const temporary of [layers.paint, layers.coverage, layers.regions]) { temporary.width = 1; temporary.height = 1; }
  const output = new ImageData(size, size), scale = size / 1024;
  const flow = fired ? ({ defined: 0, soft: 4, flowing: 10 }[style]) : 0;
  const ordered = [...template.regions].sort((a, b) => a.zIndex - b.zIndex);
  const directions = ordered.map(region => region.flowDirection);
  const amounts = ordered.map(region => ({ thin: .6, medium: 1, thick: 1.35 }[design.regions[region.id]?.amount || 'medium']));
  const boxes = ordered.map(region => pathControlBounds(region.path));
  for (let y = 0; y < size; y++) {
    const uy = y / scale;
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      if (!source.data[i + 3]) continue;
      const ux = x / scale, region = regionIds[i] - 1;
      const broad = noise(ux / 43, uy / 51, seed), fine = noise(ux / 5.5, uy / 6, seed + 7);
      let j = i, blend = 0;
      if (flow && region >= 0) {
        const amount = amounts[region] || 1, direction = directions[region] || [0, 1];
        const distance = flow * (.22 + broad * .78) * amount;
        const sx = Math.round(x - direction[0] * distance * scale), sy = Math.round(y - direction[1] * distance * scale);
        if (sx >= 0 && sx < size && sy >= 0 && sy < size) {
          const candidate = (sy * size + sx) * 4;
          if (regionIds[candidate] === regionIds[i] && source.data[candidate + 3] > 240) { j = candidate; blend = style === 'flowing' ? .42 : .25; }
        }
      }
      const cover = (glaze[i] * (1 - blend) + glaze[j] * blend) / 255;
      const bodyShade = .955 + (1 - uy / 1024) * .044 + (broad - .5) * .025;
      const grain = options.stage === 'bisque' || cover < .05 ? (fine - .5) * 4 : (fine - .5) * (fired ? 1.4 : 3);
      const box = boxes[region];
      const nx = box ? (ux - box.left) / box.width : .5, ny = box ? (uy - box.top) / box.height : .5;
      // A small soft highlight and a narrower glint suggest a glazed surface.
      // Both are confined to actual glaze, leaving exposed clay matte.
      const softLight = Math.exp(-(((nx - .28) / .21) ** 2 + ((ny - .28) / .32) ** 2));
      const glint = Math.exp(-(((nx - .24) / .045) ** 2 + ((ny - .30) / .20) ** 2));
      const sheen = fired ? cover * (.018 + softLight * .09 + glint * .20) : 0;
      const pooling = fired ? cover * (amounts[region] || 1) * (.012 * broad + .035 * Math.max(0, Math.min(1, (ny - .72) / .28))) : 0;
      const chalk = options.stage === 'glazed' ? cover * .065 : 0;
      for (let channel = 0; channel < 3; channel++) {
        const color = source.data[i + channel] * (1 - blend) + source.data[j + channel] * blend;
        const matteColor = color * (1 - chalk) + 245 * chalk;
        const shaded = matteColor * (bodyShade - pooling) + grain;
        output.data[i + channel] = Math.min(255, shaded * (1 - sheen) + 255 * sheen);
      }
      output.data[i + 3] = source.data[i + 3];
    }
    if (size > 1024 && y % 128 === 127) await yieldToBrowser();
  }
  const art = canvas(size), a = art.getContext('2d')!; a.putImageData(output, 0, 0);
  a.save(); a.scale(scale, scale); a.clip(new Path2D(template.silhouette), template.silhouetteFillRule);
  a.lineCap = 'round'; a.lineJoin = 'round';
  for (const detail of detailPathsFor(template, options.stage==='bisque' ? undefined : design.expression)) {
    a.globalAlpha = detail.opacity;
    if (detail.stroke) { a.strokeStyle = detail.color; a.lineWidth = detail.width || 3; a.stroke(new Path2D(detail.path)); }
    else { a.fillStyle = detail.color; a.fill(new Path2D(detail.path)); }
  }
  a.globalAlpha = 1; a.strokeStyle = template.outlineColor || '#604631'; a.lineWidth = template.outlineWidth ?? 3.5;
  for (const path of template.outlinePaths) a.stroke(new Path2D(path));
  a.restore();
  let result = art;
  if (options.background === 'paper') {
    result = canvas(size); const r = result.getContext('2d')!;
    r.fillStyle = '#f7f2e8'; r.fillRect(0, 0, size, size); r.drawImage(art, 0, 0);
  }
  const b = template.anchorBounds;
  return { canvas: result, bounds: { x: b.x * scale, y: b.y * scale, width: b.width * scale, height: b.height * scale }, revisionKey: keyFor(project, size, options.stage, options.background), source:'rendered' };
}

export function renderArtworkImage(project: SancaiProject, size = 768, options: { stage: ArtworkStage; background: 'transparent' | 'paper' } = { stage: 'glazed', background: 'transparent' }): Promise<ArtworkRenderResult> {
  const key = keyFor(project, size, options.stage, options.background);
  const existing = cache.get(key); if (existing) { artifactCacheActivity.memoryHits++; return existing; }
  const task = renderWithDiskCache(project,size,options,key).catch(error => { cache.delete(key); cachePixels.delete(key); throw error; });
  cache.set(key, task); cachePixels.set(key, size * size);
  // Keep a handful of resolutions/stages, not every historical brush stroke.
  while (cache.size > 8 || [...cachePixels.values()].reduce((sum, pixels) => sum + pixels, 0) > 12_000_000) {
    const oldest = cache.keys().next().value!; cache.delete(oldest); cachePixels.delete(oldest);
  }
  return task;
}

async function renderWithDiskCache(project:SancaiProject,size:number,options:{stage:ArtworkStage;background:'transparent'|'paper'},key:string):Promise<ArtworkRenderResult>{
  // Editing remains lightweight. Only immutable fired images and their gallery
  // thumbnails are persisted. Cache errors must never block an artwork/export.
  if(options.stage!=='fired'||!project.firing){artifactCacheActivity.computed++;return render(project,size,options);}
  const design=project.firing.design,template=getTemplate(design.templateId,design.templateVersion);
  if(project.rendererVersion!=='1'||project.firing.rendererVersion!=='1')throw new Error('此作品的渲染版本暂不可用');
  let diskKey:string|undefined;
  try{
    const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(key));
    diskKey='fired-v1:'+Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
    const blob=await readArtifact(diskKey);
    if(blob){const bitmap=await createImageBitmap(blob);try{if(bitmap.width===size&&bitmap.height===size){const output=canvas(size);output.getContext('2d')!.drawImage(bitmap,0,0);const s=size/1024,b=template.anchorBounds;artifactCacheActivity.diskHits++;return{canvas:output,bounds:{x:b.x*s,y:b.y*s,width:b.width*s,height:b.height*s},revisionKey:key,source:'disk-cache'};}}finally{bitmap.close();}}
  }catch{/* Optional cache unavailable, corrupt or storage denied: rebuild. */}
  artifactCacheActivity.computed++;
  const result=await render(project,size,options);
  if(diskKey)void blobFromCanvas(result.canvas).then(blob=>writeArtifact(diskKey!,blob)).catch(()=>undefined);
  return result;
}

export function ensureFiredArtifact(project: SancaiProject, size = 768) {
  if (!project.firing) return Promise.reject(new Error('这件作品还没有烧制记录'));
  return renderArtworkImage(project, size, { stage: 'fired', background: 'transparent' });
}
