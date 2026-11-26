import { detailPathsFor, getTemplate } from '../domain/templates';
import { GLAZE_HEX } from '../domain/palettes';
import type { BrushStroke, PatternSpec, SancaiProject } from '../domain/types';
import { drawPattern, type PatternPainter } from './artwork';

const n = (value:number) => Number(value.toFixed(2));
const point = (x:number,y:number) => `${n(x)} ${n(y)}`;

function vectorPattern(pattern:PatternSpec) {
  let commands: string[] = [];
  const elements: string[] = [];
  const painter: PatternPainter = {
    fillStyle: '', strokeStyle:'', lineWidth:1, lineCap:'round',
    save(){}, restore(){}, translate(){}, rotate(){},
    beginPath(){ commands=[]; },
    closePath(){ commands.push('Z'); },
    moveTo(x,y){ commands.push(`M${point(x,y)}`); },
    lineTo(x,y){ commands.push(`L${point(x,y)}`); },
    bezierCurveTo(x1,y1,x2,y2,x3,y3){ commands.push(`C${point(x1,y1)} ${point(x2,y2)} ${point(x3,y3)}`); },
    fill(){ elements.push(`<path d="${commands.join(' ')}" fill="${this.fillStyle}"/>`); },
    stroke(){ elements.push(`<path d="${commands.join(' ')}" fill="none" stroke="${this.strokeStyle}" stroke-width="${n(this.lineWidth)}" stroke-linecap="round"/>`); },
  };
  drawPattern(painter, pattern, false);
  return `<g transform="rotate(${pattern.rotation} 512 512)">${elements.join('')}</g>`;
}

function vectorStroke(stroke:BrushStroke) {
  const [first,...rest] = stroke.points;
  const color = GLAZE_HEX[stroke.glaze];
  if (!rest.length) return `<circle cx="${n(first[0])}" cy="${n(first[1])}" r="${n(stroke.radius)}" fill="${color}"/>`;
  const path = `M${point(...first)} ${rest.map(p=>`L${point(...p)}`).join(' ')}`;
  return `<path d="${path}" fill="none" stroke="${color}" stroke-width="${n(stroke.radius*2)}"/>`;
}

export function vectorDesign(project:SancaiProject) {
  const d = project.firing?.design ?? project.design;
  const template = getTemplate(d.templateId, d.templateVersion);
  const regions = [...template.regions].sort((a,b)=>a.zIndex-b.zIndex);
  const defs = [`<clipPath id="outline"><path d="${template.silhouette}" clip-rule="${template.silhouetteFillRule}"/></clipPath>`];
  const shapes = ['<rect width="1024" height="1024" fill="#eee4cf"/>'];
  for (const region of regions) {
    const r = d.regions[region.id];
    const color = region.allowGlaze && r?.baseGlaze && r.baseGlaze!=='unglazed' ? GLAZE_HEX[r.baseGlaze] : '#eee4cf';
    shapes.push(`<path d="${region.path}" fill="${color}"/>`);
    if (!region.allowGlaze) continue;
    const decoration = d.strokes.filter(s=>s.regionId===region.id).map(vectorStroke);
    if (r?.pattern) decoration.unshift(vectorPattern(r.pattern));
    if (!decoration.length) continue;
    defs.push(`<clipPath id="part-${region.zIndex}"><path d="${region.path}"/></clipPath>`);
    shapes.push(`<g clip-path="url(#part-${region.zIndex})">${decoration.join('')}</g>`);
  }
  for (const detail of detailPathsFor(template,d.expression)) {
    const paint = detail.stroke ? `fill="none" stroke="${detail.color}" stroke-width="${detail.width ?? 3}"` : `fill="${detail.color}"`;
    shapes.push(`<path d="${detail.path}" ${paint} opacity="${detail.opacity}"/>`);
  }
  shapes.push(`<g fill="none" stroke="${template.outlineColor ?? '#604631'}" stroke-width="${template.outlineWidth ?? 3.5}">${template.outlinePaths.map(path=>`<path d="${path}"/>`).join('')}</g>`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><defs>${defs.join('')}</defs><g clip-path="url(#outline)" stroke-linecap="round" stroke-linejoin="round">${shapes.join('')}</g></svg>`;
  return new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
}
